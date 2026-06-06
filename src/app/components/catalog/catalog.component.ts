import { Component, AfterViewInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NgClass],
  template: `
    <section class="catalog-section" id="catalogo">
      <div class="section-inner">

        <!-- Left: copy -->
        <div class="copy animate-on-scroll">
          <div class="badge">
            <span class="material-symbols-outlined badge-icon">style</span>
            Catálogo Digital
          </div>

          <h2>Un escaparate premium para tus fragancias</h2>

          <p class="lead">
            Ofrece una experiencia de navegación inmersiva. Tus clientes podrán
            explorar tu colección filtrando por notas de salida, corazón y fondo,
            o descubriendo opciones según la ocasión.
          </p>

          <ul class="feature-list">
            <li>
              <span class="material-symbols-outlined feat-icon">science</span>
              <div>
                <strong>Gestión de Decants Integrada</strong>
                <span>Muestra opciones de 5ml, 10ml o botella completa con actualización de precios dinámica.</span>
              </div>
            </li>
            <li>
              <span class="material-symbols-outlined feat-icon icon-tertiary">loyalty</span>
              <div>
                <strong>Esencia Rewards</strong>
                <span>Sistema de puntos visual integrado directamente en cada producto del catálogo.</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Right: catalog mockup -->
        <div class="mockup-wrap animate-on-scroll delay-200">
          <div class="catalog-card">

            <!-- Filter chips -->
            <div class="filters">
              <span class="chip" [class.chip-active]="activeFilter==='todo'" (click)="setFilter('todo')">Ver Todo</span>
              <span class="chip" [class.chip-active]="activeFilter==='verano'" (click)="setFilter('verano')">Verano ☀️</span>
              <span class="chip" [class.chip-active]="activeFilter==='noche'" (click)="setFilter('noche')">Cita Nocturna 🌙</span>
              <span class="chip" [class.chip-active]="activeFilter==='nicho'" (click)="setFilter('nicho')">Nicho</span>
            </div>

            <!-- Product grid -->
            <div class="product-grid">

              <!-- Product 1 -->
              <div class="product-card">
                <div class="product-img">
                  <span class="material-symbols-outlined product-icon">local_florist</span>
                  <div class="pts-badge">
                    <span class="material-symbols-outlined pts-star">stars</span> +50 pts
                  </div>
                </div>
                <h5 class="product-name">Santal Volcánico</h5>
                <p class="product-family">Amaderado · Especiado</p>
                <div class="product-footer">
                  <span class="product-price">$18.500</span>
                  <span class="product-size">10ml</span>
                </div>
              </div>

              <!-- Product 2 -->
              <div class="product-card">
                <div class="product-img product-img-blue">
                  <span class="material-symbols-outlined product-icon icon-blue">water_drop</span>
                </div>
                <h5 class="product-name">Aqua de Vita</h5>
                <p class="product-family">Acuático · Cítrico</p>
                <div class="product-footer">
                  <span class="product-price">$12.000</span>
                  <span class="product-size">5ml</span>
                </div>
              </div>

              <!-- Product 3 -->
              <div class="product-card">
                <div class="product-img product-img-amber">
                  <span class="material-symbols-outlined product-icon icon-amber">spa</span>
                </div>
                <h5 class="product-name">Oud Dorado</h5>
                <p class="product-family">Oriental · Amaderado</p>
                <div class="product-footer">
                  <span class="product-price">$24.900</span>
                  <span class="product-size">10ml</span>
                </div>
              </div>

              <!-- Product 4 -->
              <div class="product-card">
                <div class="product-img product-img-rose">
                  <span class="material-symbols-outlined product-icon icon-rose">favorite</span>
                  <div class="pts-badge">
                    <span class="material-symbols-outlined pts-star">stars</span> +30 pts
                  </div>
                </div>
                <h5 class="product-name">Rose Eternelle</h5>
                <p class="product-family">Floral · Cítrico</p>
                <div class="product-footer">
                  <span class="product-price">$9.800</span>
                  <span class="product-size">5ml</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .catalog-section {
      padding: 6rem 1.5rem;
      overflow: hidden;
      position: relative;
    }

    .section-inner {
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
      .section-inner { flex-direction: row; }
    }

    /* copy */
    .copy { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: rgba(240,236,228,0.8);
      color: var(--color-primary);
      font-weight: 700;
      font-size: 0.875rem;
      width: fit-content;
    }
    .badge-icon { font-size: 1rem; }
    h2 {
      font-family: var(--font-headline);
      font-size: clamp(2rem, 5vw, 3.25rem);
      font-weight: 700;
      color: var(--color-on-background);
      line-height: 1.2;
    }
    .lead { font-size: 1.1rem; color: var(--color-on-surface-variant); line-height: 1.7; }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0 0;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .feature-list li { display: flex; gap: 0.75rem; align-items: flex-start; }
    .feat-icon { color: var(--color-primary); margin-top: 2px; flex-shrink: 0; }
    .icon-tertiary { color: var(--color-tertiary); }
    .feature-list strong {
      display: block;
      color: var(--color-on-background);
      font-weight: 700;
      margin-bottom: 0.15rem;
    }
    .feature-list span { font-size: 0.875rem; color: var(--color-on-surface-variant); }

    /* mockup */
    .mockup-wrap { flex: 1; width: 100%; }
    .catalog-card {
      background: var(--color-surface-container-lowest);
      border: 1px solid var(--color-surface-container-highest);
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(46,50,48,0.08);
      padding: 1.5rem;
    }

    /* filters */
    .filters {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-surface-container);
      scrollbar-width: none;
    }
    .chip {
      padding: 0.375rem 0.875rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      background: var(--color-surface-container);
      color: var(--color-on-surface-variant);
      cursor: pointer;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .chip:hover { background: var(--color-surface-container-high); }
    .chip-active {
      background: var(--color-primary);
      color: var(--color-on-primary);
      font-weight: 700;
    }
    .chip-active:hover { background: var(--color-on-primary-fixed-variant); }

    /* product grid */
    .product-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .product-card {
      background: var(--color-surface);
      border: 1px solid var(--color-surface-container-highest);
      border-radius: 1rem;
      padding: 0.75rem;
      transition: box-shadow 0.2s;
    }
    .product-card:hover { box-shadow: 0 4px 16px rgba(46,50,48,0.1); }

    .product-img {
      aspect-ratio: 1;
      background: var(--color-surface-container-high);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      position: relative;
      overflow: hidden;
    }
    .product-img-blue  { background: rgba(200,232,208,0.2); }
    .product-img-amber { background: rgba(248,224,168,0.2); }
    .product-img-rose  { background: rgba(240,232,219,0.5); }

    .product-icon { font-size: 2.5rem; color: rgba(74,124,89,0.4); }
    .icon-blue  { color: rgba(74,124,89,0.5); }
    .icon-amber { color: rgba(112,92,48,0.5); }
    .icon-rose  { color: rgba(107,99,88,0.4); }

    .pts-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--color-surface);
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-size: 0.625rem;
      font-weight: 700;
      color: var(--color-primary);
      display: flex;
      align-items: center;
      gap: 0.125rem;
    }
    .pts-star { font-size: 0.625rem; }

    .product-name {
      font-family: var(--font-headline);
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--color-on-background);
      margin-bottom: 0.125rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .product-family { font-size: 0.625rem; color: var(--color-on-surface-variant); margin-bottom: 0.5rem; }
    .product-footer { display: flex; align-items: center; justify-content: space-between; }
    .product-price { font-weight: 700; color: var(--color-primary); font-size: 0.9rem; }
    .product-size {
      font-size: 0.625rem;
      background: var(--color-secondary-container);
      color: var(--color-on-secondary-container);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-weight: 700;
    }
  `]
})
export class CatalogComponent implements AfterViewInit {
  activeFilter = 'todo';
  toastVisible = false;
  private toastTimer: any;

  constructor(private scrollReveal: ScrollRevealService) {}
  ngAfterViewInit(): void { this.scrollReveal.observeElements(); }

  setFilter(f: string): void {
    this.activeFilter = f;
  }
}
