import { Component, AfterViewInit } from '@angular/core';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="hero">
      <!-- Decorative blobs -->
      <div class="blob blob-top-right"></div>
      <div class="blob blob-bottom-left"></div>

      <div class="hero-inner">
        <!-- Text column -->
        <div class="hero-text">
          <div class="badge animate-on-scroll">
            <span class="material-symbols-outlined">auto_awesome</span>
            SaaS Especializado en Perfumería
          </div>

          <h1 class="animate-on-scroll delay-100">
            Más que una tienda, la
            <span class="text-primary">inteligencia</span>
            detrás de tu perfumería
          </h1>

          <p class="lead animate-on-scroll delay-200">
            Optimiza tu inventario, fideliza a tus clientes con un CRM olfativo único
            y dispara tus ventas con nuestro asistente de IA diseñado para el mundo
            de las fragancias.
          </p>

          <div class="cta-group animate-on-scroll delay-300">
            <button class="btn-cta-primary btn-shimmer active-scale" (click)="scrollTo('precios')">
              Comenzar Prueba Gratis
            </button>
            <button class="btn-cta-secondary active-scale" (click)="scrollTo('app-showcase')">
              Ver Demostración
            </button>
          </div>
        </div>

        <!-- Image column -->
        <div class="hero-image animate-float">
          <div class="img-glow"></div>
          <div class="img-card">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZDLYG4PxWn9xUyJOVJqiAxCbVR_nDLNvGLWu41SNrx0sudyKL0TaXTP3Y-4gqMIOsKr-r1moB6NOC6qvWFwf-j28MWOY94yjED6yj2zaomGf2bfvIicRW6HH5CgoFTJvaK2Yo-WzPXcOnXx98K3mTb3_b8Gu-5ZZVx8-8Usc571Xcmc-aCvb_6IaVCzNZYfbwk5jbZ3xa7IPoSwR-unKXOaXSm9_nBJ3acjamTJOLLNtw57rx3jW8oSVGZKN3DRqujhY2nfJ6rkM"
              alt="Frasco de perfume de lujo sobre piedra natural"
            />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      padding: 6rem 1.5rem 8rem;
      overflow: hidden;
    }
    .blob {
      position: absolute;
      border-radius: var(--radius-full);
      filter: blur(80px);
      pointer-events: none;
      z-index: -1;
    }
    .blob-top-right {
      top: -16rem; right: -16rem;
      width: 50rem; height: 50rem;
      background: rgba(74,124,89,0.05);
    }
    .blob-bottom-left {
      bottom: -10rem; left: -10rem;
      width: 38rem; height: 38rem;
      background: rgba(112,92,48,0.05);
    }
    .hero-inner {
      max-width: 80rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4rem;
      position: relative;
      z-index: 1;
    }
    @media (min-width: 1024px) {
      .hero-inner { flex-direction: row; }
    }
    .hero-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      text-align: center;
    }
    @media (min-width: 1024px) { .hero-text { text-align: left; } }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      background: rgba(234,230,222,0.8);
      backdrop-filter: blur(4px);
      color: var(--color-tertiary);
      font-weight: 700;
      font-size: 0.875rem;
      width: fit-content;
      margin: 0 auto;
    }
    @media (min-width: 1024px) { .badge { margin: 0; } }

    h1 {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 700;
      color: var(--color-on-background);
      line-height: 1.1;
    }
    .text-primary { color: var(--color-primary); }

    .lead {
      font-size: 1.2rem;
      color: var(--color-on-surface-variant);
      max-width: 36rem;
      margin: 0 auto;
    }
    @media (min-width: 1024px) { .lead { margin: 0; } }

    .cta-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      padding-top: 1rem;
    }
    @media (min-width: 640px) {
      .cta-group { flex-direction: row; justify-content: center; }
    }
    @media (min-width: 1024px) {
      .cta-group { justify-content: flex-start; }
    }
    .btn-cta-primary {
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 1rem 2rem;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 1.1rem;
      transition: background 0.15s, transform 0.15s;
      box-shadow: 0 4px 20px rgba(46,50,48,0.06);
      width: 100%;
    }
    @media (min-width: 640px) { .btn-cta-primary { width: auto; } }
    .btn-cta-primary:hover { background: var(--color-on-primary-fixed-variant); }

    .btn-cta-secondary {
      background: rgba(250,246,240,0.8);
      backdrop-filter: blur(4px);
      border: 2px solid var(--color-outline-variant);
      color: var(--color-primary);
      padding: 1rem 2rem;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 1.1rem;
      transition: background 0.15s, transform 0.15s;
      width: 100%;
    }
    @media (min-width: 640px) { .btn-cta-secondary { width: auto; } }
    .btn-cta-secondary:hover { background: var(--color-secondary-container); }

    /* Hero image */
    .hero-image {
      flex: 1;
      position: relative;
      width: 100%;
      max-width: 32rem;
      aspect-ratio: 1;
    }
    .img-glow {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top right, rgba(200,232,208,0.4), rgba(196,166,106,0.3));
      border-radius: 2.5rem;
      transform: rotate(3deg);
      filter: blur(4px);
    }
    .img-card {
      position: absolute;
      inset: 0;
      background: rgba(250,246,240,0.8);
      backdrop-filter: blur(20px);
      border-radius: 2.5rem;
      border: 1px solid var(--color-surface-container-highest);
      box-shadow: 0 8px 30px rgba(46,50,48,0.08);
      overflow: hidden;
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .img-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1rem;
    }
  `]
})
export class HeroComponent implements AfterViewInit {
  constructor(private scrollReveal: ScrollRevealService) {}
  ngAfterViewInit(): void { this.scrollReveal.observeElements(); }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
