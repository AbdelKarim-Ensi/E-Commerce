import { AfterViewInit, Component, signal, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ShowcaseService } from '../../../core/services/showcase.service';
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { ProductReviews } from '../../../shared/product-reviews/product-reviews';
type Side = 'left' | 'right';

interface SpecCard {
  label: string;
  value: string;
}

interface ProductColor {
  name: string;
  hex: string;
}

interface SideData {
  id: Side;
  label: string;
  title: string;
  description: string;
  image: string;
  gradient: string;
  glow: string;
  ring: string;
  connectionStatus: string;
  batteryLevel: number;
  specs: SpecCard[];
}

const DEFAULT_COLORS = {
  left: { gradient: 'from-blue-600 to-indigo-900', glow: 'bg-blue-500', ring: 'border-l-blue-500/50' },
  right: { gradient: 'from-emerald-600 to-teal-900', glow: 'bg-emerald-500', ring: 'border-r-emerald-500/50' },
};

/** Specs affichées uniquement sur la page démo (aucun produit réel chargé). */
const DEFAULT_SPECS: SpecCard[] = [
  { label: 'Latency', value: '12 ms' },
  { label: 'Sync Rate', value: '98%' },
];

/**
 * Convertit les specDetails admin (Record<string,string>) en cartes
 * affichables telles quelles — aucune tentative d'interprétation en
 * pourcentage : on affiche exactement ce que l'admin a saisi.
 */
function buildSpecCards(specDetails: Record<string, string> | undefined | null): SpecCard[] {
  if (!specDetails) return [];
  return Object.entries(specDetails)
    .filter(([key, value]) => key?.trim() && value?.trim())
    .map(([key, value]) => ({ label: key, value }));
}

@Component({
  selector: 'app-earbud-showcase',
  standalone: true,
  imports: [CommonModule, ProductReviews],
  templateUrl: './earbud-showcase.html',
  styleUrl: './earbud-showcase.css',
  animations: [
    trigger('detailsAnim', [
      transition(':enter', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(20px)', filter: 'blur(10px)' }),
          stagger(100, [
            animate(
              '0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              style({ opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' })
            ),
          ]),
        ], { optional: true }),
      ], { delay: '100ms' }),
      transition(':leave', [
        query('.stagger-item', [
          animate(
            '0.2s ease-in',
            style({ opacity: 0, transform: 'translateY(-10px)', filter: 'blur(5px)' })
          ),
        ], { optional: true }),
      ]),
    ]),

    trigger('imageAnim', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: '{{ fromTransform }}',
          filter: 'blur(15px)',
        }),
        animate(
          '0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({ opacity: 1, transform: 'scale(1) rotate(0) translateX(0)', filter: 'blur(0)' })
        ),
      ], { params: { fromTransform: 'scale(1.5) rotate(-30deg) translateX(-80px)' } }),
      transition(':leave', [
        animate(
          '0.25s ease-in',
          style({ opacity: 0, transform: 'scale(0.6)', filter: 'blur(20px)' })
        ),
      ]),
    ]),
  ],
})
export class EarbudShowcase implements OnInit, AfterViewInit {

  private route = inject(ActivatedRoute);
  private showcaseService = inject(ShowcaseService);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private platformId = inject(PLATFORM_ID);

  protected activeSide = signal<Side>('left');
  protected product = signal<Product | null>(null);

  protected skipAnimation = signal(true);

  /** Feedback visuel bref sur le bouton après l'ajout au panier. */
  protected justAdded = signal(false);

  /** Couleurs telles que saisies par l'admin (form "Couleurs disponibles"). */
  protected colors = computed<ProductColor[]>(() => {
    const raw = (this.product() as any)?.colors as ProductColor[] | undefined;
    return (raw ?? []).filter((c) => c?.name?.trim() && c?.hex?.trim());
  });

  protected sides = computed<Record<Side, SideData>>(() => {
    const p = this.product();

    if (!p) {
      return {
        left: {
          id: 'left', label: 'Left', title: 'Spatial Anchor',
          description: 'The primary node for binaural synchronization. Handles low-latency transmission and anchors the spatial audio soundstage.',
          image: 'https://ik.imagekit.io/kqmrslzuq/SOUND/left-earbud.png',
          ...DEFAULT_COLORS.left,
          connectionStatus: 'Connected', batteryLevel: 82,
          specs: DEFAULT_SPECS,
        },
        right: {
          id: 'right', label: 'Right', title: 'Vocal Clarity',
          description: 'Optimized for high-frequency detail and voice pickup. Contains the beamforming microphone array for crystal clear calls.',
          image: 'https://ik.imagekit.io/kqmrslzuq/SOUND/right-earbud.png',
          ...DEFAULT_COLORS.right,
          connectionStatus: 'Connected', batteryLevel: 74,
          specs: DEFAULT_SPECS,
        },
      };
    }

    const images = (p as any).images as string[] | undefined;
    const img0 = images?.[0] ?? p.imageUrl ?? '';
    const img1 = images?.[1] ?? images?.[0] ?? p.imageUrl ?? '';
    const description = (p as any).description ?? `${p.brand ?? ''} ${p.name}`.trim();

    // Les specs proviennent exclusivement du produit réel — jamais de
    // valeurs par défaut inventées dès qu'un produit est chargé.
    const specs = buildSpecCards((p as any).specDetails);

    return {
      left: {
        id: 'left', label: 'Front',
        title: p.name,
        description,
        image: img0,
        ...DEFAULT_COLORS.left,
        connectionStatus: 'Connected', batteryLevel: 82,
        specs,
      },
      right: {
        id: 'right', label: 'Details',
        title: `${p.name} — Details`,
        description,
        image: img1,
        ...DEFAULT_COLORS.right,
        connectionStatus: 'Connected', batteryLevel: 74,
        specs,
      },
    };
  });

  protected current = computed(() => this.sides()[this.activeSide()]);
  protected isLeft = computed(() => this.activeSide() === 'left');
  protected price = computed(() => this.product()?.price ?? null);

  protected imageAnimParams = computed(() => ({
    value: this.activeSide(),
    params: {
      fromTransform: this.isLeft()
        ? 'scale(1.5) rotate(-30deg) translateX(-80px)'
        : 'scale(1.5) rotate(30deg) translateX(80px)',
    },
  }));

  ngOnInit(): void {
    const inMemory = this.showcaseService.product();
    const routeId = this.route.snapshot.paramMap.get('id');

    // Cache mémoire valide seulement s'il correspond au produit demandé dans l'URL
    if (inMemory && inMemory.id === routeId) {
      this.product.set(inMemory);
      return;
    }

    // Fallback API : couvre le refresh, le lien partagé direct, et permet le SSR
    if (routeId) {
      this.productsService.getById(routeId).subscribe({
        next: (p) => this.product.set(p),
        error: () => this.product.set(null),
      });
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.skipAnimation.set(false);
      return;
    }

    const original = this.activeSide();
    requestAnimationFrame(() => {
      this.activeSide.set(original === 'left' ? 'right' : 'left');
      requestAnimationFrame(() => {
        this.activeSide.set(original);
        setTimeout(() => this.skipAnimation.set(false), 50);
      });
    });
  }

  setSide(id: Side) {
    this.activeSide.set(id);
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartService.addItem(p)
    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 1800);
  }
}