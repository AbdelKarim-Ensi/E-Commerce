import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const BUCKET_NAME = 'product-images';

export interface UploadedImageUrls {
  imageUrl: string;
  thumbnailUrl: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly supabase: ReturnType<typeof createClient>;
  private readonly supabaseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.supabaseUrl = this.config.get<string>('SUPABASE_URL')!;
    this.supabase = createClient(
      this.supabaseUrl,
      this.config.get<string>('SUPABASE_SECRET_KEY')!,
    );
  }

  /**
   * Valide, optimise et uploade une image produit.
   * Retourne les URLs publiques de l'image optimisée et de sa miniature.
   */
  async uploadProductImage(
    file: Express.Multer.File,
    productId: string,
  ): Promise<UploadedImageUrls> {
    this.validateFileSize(file);
    await this.validateMagicBytes(file.buffer);

    const optimizedBuffer = await this.optimizeImage(file.buffer, 1200);
    const thumbnailBuffer = await this.optimizeImage(file.buffer, 300);

    const baseFileName = `${productId}/${randomUUID()}`;
    const imagePath = `${baseFileName}.webp`;
    const thumbnailPath = `${baseFileName}-thumb.webp`;

    await this.uploadBuffer(imagePath, optimizedBuffer);
    await this.uploadBuffer(thumbnailPath, thumbnailBuffer);

    return {
      imageUrl: this.getPublicUrl(imagePath),
      thumbnailUrl: this.getPublicUrl(thumbnailPath),
    };
  }

  private validateFileSize(file: Express.Multer.File): void {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Fichier vide ou manquant');
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `Fichier trop volumineux (max ${MAX_FILE_SIZE_BYTES / 1024 / 1024} Mo)`,
      );
    }
  }

  /**
   * Vérifie le VRAI type du fichier en lisant ses magic bytes (les premiers
   * octets qui identifient le format réel), plutôt que de se fier à l'extension
   * ou au Content-Type déclaré par le client — tous deux falsifiables.
   */
  private async validateMagicBytes(buffer: Buffer): Promise<void> {
    const { fileTypeFromBuffer } = await import('file-type');
    const detected = await fileTypeFromBuffer(buffer);

    if (!detected) {
      throw new BadRequestException(
        'Impossible de déterminer le type réel du fichier — fichier corrompu ou non supporté',
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(detected.mime)) {
      throw new BadRequestException(
        `Type de fichier non autorisé (détecté: ${detected.mime}). Formats acceptés: JPEG, PNG, WEBP`,
      );
    }
  }

  /**
   * Redimensionne et compresse l'image en WEBP — format moderne, bonne
   * compression, largement supporté. withoutEnlargement évite d'agrandir
   * une image déjà plus petite que la cible.
   */
  private async optimizeImage(
    buffer: Buffer,
    maxWidth: number,
  ): Promise<Buffer> {
    return sharp(buffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  }

  private async uploadBuffer(path: string, buffer: Buffer): Promise<void> {
    const { error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .upload(path, buffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) {
      this.logger.error(`Échec upload Supabase Storage: ${error.message}`);
      throw new BadRequestException("Échec de l'upload de l'image");
    }
  }

  private getPublicUrl(path: string): string {
    const { data } = this.supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Supprime les fichiers existants d'un produit (utile lors du remplacement
   * d'image, pour ne pas accumuler des fichiers orphelins dans le bucket).
   */
  async deleteProductImages(productId: string): Promise<void> {
    const { data: files, error: listError } = await this.supabase.storage
      .from(BUCKET_NAME)
      .list(productId);

    if (listError || !files || files.length === 0) return;

    const pathsToDelete = files.map((f) => `${productId}/${f.name}`);
    const { error: deleteError } = await this.supabase.storage
      .from(BUCKET_NAME)
      .remove(pathsToDelete);

    if (deleteError) {
      this.logger.warn(
        `Échec suppression anciennes images: ${deleteError.message}`,
      );
    }
  }
}
