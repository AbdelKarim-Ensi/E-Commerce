import {
  Component,
  ElementRef,
  input,
  viewChild,
  effect,
  OnDestroy,
  AfterViewInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  LineController,
  BarController,
  DoughnutController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  Filler,
} from 'chart.js';

// Enregistrement explicite (pas d'import 'chart.js/auto') pour ne charger
// que ce dont on a besoin sur les 3 types de graphiques du dashboard.
Chart.register(
  LineController,
  BarController,
  DoughnutController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  Filler,
);

/**
 * Wrapper Chart.js générique, standalone, piloté par signals.
 *
 * Usage :
 *   <app-chart-canvas
 *     [type]="'line'"
 *     [data]="chartData()"
 *     [options]="chartOptions"
 *   />
 *
 * `data` et `options` suivent directement la config native Chart.js
 * (ChartData / ChartOptions) — aucune transformation cachée, ce qui
 * garde le composant réutilisable pour n'importe quel graphique futur.
 */
@Component({
  selector: 'app-chart-canvas',
  standalone: true,
  template: `<canvas #canvasRef></canvas>`,
})
export class ChartCanvas implements AfterViewInit, OnDestroy {
  type = input.required<ChartType>();
  data = input.required<ChartConfiguration['data']>();
  options = input<ChartConfiguration['options']>();

  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasRef');
  private chart: Chart | null = null;
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    // Recrée le graphique à chaque changement de `data`/`options`/`type`.
    // Chart.js n'aime pas toujours les mutations partielles in-place quand
    // la forme des données change (ex. nombre de jours différent après un
    // changement de période) — recréer est plus sûr que .update() ici.
    //
    // Chart.js appelle canvas.getContext('2d'), qui n'existe pas côté SSR
    // (Node) — sans ce garde, le rendu serveur plante avec
    // "NotYetImplemented". Le graphique n'est donc créé qu'après
    // hydration, côté navigateur uniquement.
    effect(() => {
      if (!this.isBrowser) return;

      const type = this.type();
      const data = this.data();
      const options = this.options();

      if (!this.canvasRef()) return;

      this.chart?.destroy();
      this.chart = new Chart(this.canvasRef().nativeElement, {
        type,
        data,
        options: options ?? {},
      });
    });
  }

  ngAfterViewInit(): void {
    // Le premier rendu est déjà géré par l'effect() ci-dessus dès que le
    // canvas est disponible ; rien à faire ici, mais on garde le hook pour
    // clarifier le cycle de vie et faciliter un futur ajustement.
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}