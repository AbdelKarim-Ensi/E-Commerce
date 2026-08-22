import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app!: App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const rawPrivateKey = this.configService.get<string>(
      'FIREBASE_PRIVATE_KEY',
    );

    if (!projectId || !clientEmail || !rawPrivateKey) {
      throw new Error(
        'Firebase Admin SDK: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY sont requis dans .env',
      );
    }

    // Le \n littéral stocké dans .env doit être converti en vrai retour à la ligne
    // pour que la clé PEM soit valide.
    const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

    const existingApps = getApps();
    this.app =
      existingApps.length > 0
        ? existingApps[0]
        : initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          });

    this.logger.log('Firebase Admin SDK initialisé');
  }

  /**
   * Vérifie un ID token Google/Firebase envoyé par le frontend.
   * Lève une erreur si le token est invalide, expiré, ou mal signé.
   */
  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    return getAuth(this.app).verifyIdToken(idToken);
  }
}
