import { AfterViewInit, Component, signal, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ShowcaseService } from '../../../core/services/showcase.service';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/product.model';

type Side = 'left' | 'right';

interface FeatureMetric {
  label: string;
  value: number;
  icon: string;
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
  features: FeatureMetric[];
}

const DEFAULT_COLORS = {
  left: { gradient: 'from-blue-600 to-indigo-900', glow: 'bg-blue-500', ring: 'border-l-blue-500/50' },
  right: { gradient: 'from-emerald-600 to-teal-900', glow: 'bg-emerald-500', ring: 'border-r-emerald-500/50' },
};

const DEFAULT_FEATURES: Record<Side, FeatureMetric[]> = {
  left: [
    { label: 'Latency', value: 12, icon: 'zap' },
    { label: 'Sync Rate', value: 98, icon: 'wifi' },
  ],
  right: [
    { label: 'Bitrate', value: 94, icon: 'bluetooth' },
    { label: 'Clarifier', value: 88, icon: 'music' },
  ],
};

@Component({
  selector: 'app-earbud-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earbud-showcase.html',
  styleUrl: './earbud-showcase.css',
  animations: [
    // Équivalent de ANIMATIONS.container + ANIMATIONS.item (stagger + spring approx)
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

    // Équivalent de ANIMATIONS.image(isLeft) — direction dynamique via params
    trigger('imageAnim', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: '{{ fromTransform }}',
          filter: 'blur(15px)',
        }),
        animate(
          '0.9s cubic-bezier(0.34, 1.56, 0.64, 1)', // overshoot ≈ spring stiffness:260 damping:20
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

  protected activeSide = signal<Side>('left');
  protected product = signal<Product | null>(null);

  // Empêche l'animation de jouer pendant le warm-up silencieux au chargement
  protected skipAnimation = signal(true);

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
          features: DEFAULT_FEATURES.left,
        },
        right: {
          id: 'right', label: 'Right', title: 'Vocal Clarity',
          description: 'Optimized for high-frequency detail and voice pickup. Contains the beamforming microphone array for crystal clear calls.',
          image: 'https://ik.imagekit.io/kqmrslzuq/SOUND/right-earbud.png',
          ...DEFAULT_COLORS.right,
          connectionStatus: 'Connected', batteryLevel: 74,
          features: DEFAULT_FEATURES.right,
        },
      };
    }

    const images = (p as any).images as string[] | undefined;
    const img0 = images?.[0] ?? p.imageUrl ?? '';
    const img1 = images?.[1] ?? images?.[0] ?? p.imageUrl ?? '';
    const description = (p as any).description ?? `${p.brand ?? ''} ${p.name}`.trim();

    return {
      left: {
        id: 'left', label: 'Front',
        title: p.name,
        description,
        image: img0,
        ...DEFAULT_COLORS.left,
        connectionStatus: 'Connected', batteryLevel: 82,
        features: DEFAULT_FEATURES.left,
      },
      right: {
        id: 'right', label: 'Details',
        title: `${p.name} — Details`,
        description,
        image: img1,
        ...DEFAULT_COLORS.right,
        connectionStatus: 'Connected', batteryLevel: 74,
        features: DEFAULT_FEATURES.right,
      },
    };
  });

  protected current = computed(() => this.sides()[this.activeSide()]);
  protected isLeft = computed(() => this.activeSide() === 'left');
  protected price = computed(() => this.product()?.price ?? null);

  // Params passés au trigger imageAnim selon le côté actif
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
    if (inMemory) {
      this.product.set(inMemory);
      return;
    }

    const slug = this.route.snapshot.queryParamMap.get('slug');
    if (slug) {
      this.productsService.getById(slug).subscribe({
        next: (p) => this.product.set(p),
        error: () => this.product.set(null),
      });
    }
  }

    ngAfterViewInit(): void {
    // requestAnimationFrame n'existe pas côté serveur (SSR) — on skip le warm-up
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
  platformId(platformId: any) {
    throw new Error('Method not implemented.');
  }

  setSide(id: Side) {
    this.activeSide.set(id);
  }

}