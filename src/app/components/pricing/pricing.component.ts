import { Component, AfterViewInit } from '@angular/core';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  template: `
    <section class="pricing-section" id="precios">
      <div class="dots-bg"></div>
      <div class="section-inner">

        <!-- Header -->
        <div class="section-header animate-on-scroll">
          <h2>Inversión que Crece Contigo</h2>
          <p>Planes transparentes, sin costos ocultos. Diseñados para perfumerías de todos los tamaños.</p>
        </div>

        <!-- Cards -->
        <div class="pricing-grid">

          <!-- Semilla -->
          <div class="pricing-card animate-on-scroll">
            <div class="card-header">
              <h3>Semilla</h3>
              <p>Para emprendedores y perfumerías boutique iniciando su camino.</p>
            </div>
            <div class="price">
              <span class="amount">$5.500</span>
              <span class="period">/mes</span>
            </div>
            <ul class="features">
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Catálogo Básico (hasta 100 productos)
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Gestión de Stock Simple
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                CRM Estándar
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Datos seguros
              </li>
            </ul>
            <button class="btn-outline active-scale">Elegir Semilla</button>
          </div>

          <!-- Flor (featured) -->
          <div class="pricing-card featured animate-on-scroll delay-100">
            <div class="popular-badge">MÁS POPULAR</div>
            <div class="card-header">
              <h3 class="featured-title">Flor</h3>
              <p class="featured-sub">Para perfumerías establecidas buscando optimizar y escalar.</p>
            </div>
            <div class="price">
              <span class="amount featured-amount">$11.500</span>
              <span class="period featured-period">/mes</span>
            </div>
            <ul class="features">
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">Catálogo Ilimitado</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">CRM Olfativo Avanzado</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">Gestión de Decants Pro</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">Alarmas Predictivas de Stock</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">Datos seguros</span>
              </li>
            </ul>
            <button class="btn-solid btn-shimmer active-scale">Comenzar con Flor</button>
          </div>

          <!-- Extracto -->
          <div class="pricing-card animate-on-scroll delay-200">
            <div class="card-header">
              <h3>Extracto</h3>
              <p>La solución definitiva con Inteligencia Artificial para líderes del mercado.</p>
            </div>
            <div class="price">
              <span class="amount">$21.900</span>
              <span class="period">/mes</span>
            </div>
            <ul class="features">
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Todo lo del plan Flor
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Asistente de IA Integrado
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Analítica de Tendencias
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Marketing Automatizado
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Datos seguros
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Soporte 24/7
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Actualizaciones gratis
              </li>
            </ul>
            <button class="btn-outline active-scale">Elegir Extracto</button>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .pricing-section {
      position: relative;
      padding: 6rem 1.5rem;
    }
    .dots-bg {
      position: absolute;
      inset: 0;
      opacity: 0.03;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234a7c59' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
    }
    .section-inner {
      max-width: 80rem;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
    .section-header {
      text-align: center;
      max-width: 48rem;
      margin: 0 auto 4rem;
    }
    .section-header h2 {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 700;
      color: var(--color-on-background);
      margin-bottom: 1rem;
    }
    .section-header p {
      font-size: 1.1rem;
      color: var(--color-on-surface-variant);
    }

    /* ---- Grid ---- */
    .pricing-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: center;
    }
    @media (min-width: 768px) {
      .pricing-grid { grid-template-columns: repeat(3, 1fr); }
    }

    /* ---- Base card ---- */
    .pricing-card {
      background: rgba(250,246,240,0.9);
      backdrop-filter: blur(4px);
      border: 1px solid var(--color-surface-container-highest);
      border-radius: 1.5rem;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0 4px 20px rgba(46,50,48,0.04);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }
    .pricing-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(46,50,48,0.12);
    }

    /* ---- Featured card ---- */
    .pricing-card.featured {
      background: rgba(120,168,134,0.95);
      border: 2px solid var(--color-primary);
      box-shadow: 0 10px 30px rgba(74,124,89,0.15);
      transform: translateY(-1rem);
    }
    .pricing-card.featured:hover { transform: translateY(calc(-1rem - 8px)); }
    .popular-badge {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 0.25rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    /* ---- Card content ---- */
    .card-header { margin-bottom: 2rem; }
    .card-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-on-background);
      margin-bottom: 0.5rem;
    }
    .card-header p { font-size: 0.875rem; color: var(--color-on-surface-variant); }
    .featured-title { color: var(--color-on-primary-fixed) !important; }
    .featured-sub { color: var(--color-on-primary-fixed-variant) !important; }

    .price {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .amount { font-size: 2.5rem; font-weight: 700; color: var(--color-on-background); }
    .period { color: var(--color-on-surface-variant); }
    .featured-amount { font-size: 3rem; color: var(--color-on-primary-fixed) !important; }
    .featured-period { color: var(--color-on-primary-fixed-variant) !important; }

    .features {
      list-style: none;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .features li {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      color: var(--color-on-background);
      font-size: 0.95rem;
    }
    .check {
      color: var(--color-primary);
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    .featured-li { color: var(--color-on-primary-fixed); }

    /* ---- Buttons ---- */
    .btn-outline {
      width: 100%;
      border: 2px solid var(--color-outline-variant);
      background: var(--color-surface);
      color: var(--color-primary);
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-sm);
      font-weight: 700;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-outline:hover { background: var(--color-secondary-container); }

    .btn-solid {
      width: 100%;
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 1rem 1.5rem;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 1.05rem;
      transition: background 0.15s, transform 0.15s;
      box-shadow: 0 2px 8px rgba(46,50,48,0.1);
    }
    .btn-solid:hover { background: var(--color-on-primary-fixed-variant); }
  `]
})
export class PricingComponent implements AfterViewInit {
  constructor(private scrollReveal: ScrollRevealService) {}
  ngAfterViewInit(): void { this.scrollReveal.observeElements(); }
}
