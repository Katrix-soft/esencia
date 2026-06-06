import { Component, AfterViewInit } from '@angular/core';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

interface BentoCard {
  icon: string;
  title: string;
  description: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
  featured?: boolean;
  accent?: boolean;
  wide?: boolean;
}

@Component({
  selector: 'app-bento',
  standalone: true,
  template: `
    <section class="bento-section" id="soluciones">
      <div class="section-inner">

        <!-- Heading -->
        <div class="section-header animate-on-scroll">
          <h2>12 Módulos Diseñados para Escalar</h2>
          <p>Todo lo que necesitas para gestionar, vender y fidelizar, integrado en una sola plataforma intuitiva y orgánica.</p>
        </div>

        <!-- Grid -->
        <div class="bento-grid">

          <!-- CRM Olfativo — featured (large) -->
          <div class="bento-card featured animate-on-scroll">
            <div class="card-accent-blob"></div>
            <div class="card-body">
              <span class="material-symbols-outlined card-icon">hub</span>
              <h3>CRM Olfativo</h3>
              <p>Perfila a tus clientes según sus familias olfativas favoritas. Recomienda fragancias basadas en su historial de compras y notas preferidas (amaderadas, cítricas, florales).</p>
            </div>
            <div class="card-tags">
              <span class="tag">Fidelización</span>
              <span class="tag">Recomendaciones</span>
            </div>
          </div>

          <!-- AI Assistant — accent bg -->
          <div class="bento-card card-ai animate-on-scroll delay-100">
            <span class="material-symbols-outlined card-icon icon-ai">robot_2</span>
            <h3 class="title-ai">Asistente IA</h3>
            <p class="desc-ai">Respuestas automáticas para consultas de perfumes, equivalencias y disponibilidad.</p>
          </div>

          <!-- Stock Alarms -->
          <div class="bento-card animate-on-scroll delay-200">
            <span class="material-symbols-outlined card-icon icon-tertiary">inventory_2</span>
            <h3>Alarmas de Stock</h3>
            <p>Notificaciones predictivas antes de quedarte sin tus best-sellers o decants más pedidos.</p>
          </div>

          <!-- Catálogo — wide -->
          <div class="bento-card wide animate-on-scroll delay-100">
            <div class="wide-body">
              <div>
                <span class="material-symbols-outlined card-icon">menu_book</span>
                <h3>Catálogo Visual y Notas</h3>
                <p>Muestra tus productos destacando notas de salida, corazón y fondo. Filtros avanzados por temporada y ocasión.</p>
              </div>
              <div class="wide-image">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2BfMNpMT9oWLbpqYp_qWGsv8lCneIupCLG8RM5j-bW6UDAldG0VJiTL_B-b0-QmY1JKSAshLo3ZjacqTjNy5ht_qFWYiPmVjvQ7dEGUJz0ZDoeXPpy9YuT8pYNqOn3xoc7mxqv1jgj6k0Gjz8AQuxbOYuc2Apq8l1CzFGkohWzx9B1WEwsar6xdIxnanW6S8z3m9AJ3R3zQBF9ViZG71WEWgFIZIoKbFIv6s0GzU_eXKHX0m3nLw6LsV42hmGBWFD-DnAnLe9YqU"
                  alt="Ingredientes de perfume"
                />
              </div>
            </div>
          </div>

          <!-- Decants -->
          <div class="bento-card animate-on-scroll delay-200">
            <span class="material-symbols-outlined card-icon">science</span>
            <h3>Gestión Decants</h3>
            <p>Calculadora de costos por mililitro y control de mermas de fraccionamiento.</p>
          </div>

          <!-- Marketing -->
          <div class="bento-card animate-on-scroll delay-100">
            <span class="material-symbols-outlined card-icon icon-tertiary">campaign</span>
            <h3>Marketing Auto</h3>
            <p>Campañas de email basadas en compras anteriores ("Es hora de reponer tu perfume favorito").</p>
          </div>

          <!-- Analytics -->
          <div class="bento-card animate-on-scroll delay-200">
            <span class="material-symbols-outlined card-icon">trending_up</span>
            <h3>Analítica Olfativa</h3>
            <p>Descubre qué familias olfativas son tendencia este mes en tu negocio.</p>
          </div>

        </div>

        <!-- See more -->
        <div class="see-more animate-on-scroll delay-300">
          <button class="btn-text">
            Ver todos los 12 módulos
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .bento-section {
      padding: 6rem 1.5rem;
      background: rgba(245,241,234,0.5);
      backdrop-filter: blur(4px);
    }
    .section-inner { max-width: 80rem; margin: 0 auto; }

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
    .bento-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      auto-rows: auto;
    }
    @media (min-width: 768px) {
      .bento-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .bento-grid {
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: 240px;
      }
    }

    /* ---- Base card ---- */
    .bento-card {
      background: rgba(250,246,240,0.9);
      backdrop-filter: blur(4px);
      border: 1px solid var(--color-surface-container-highest);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
      position: relative;
    }
    .bento-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(46,50,48,0.12);
    }

    /* ---- Featured card ---- */
    .bento-card.featured {
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 768px) { .bento-card.featured { grid-column: span 2; } }
    @media (min-width: 1024px) {
      .bento-card.featured {
        grid-column: span 2;
        grid-row: span 2;
      }
    }
    .card-accent-blob {
      position: absolute;
      top: 0; right: 0;
      width: 16rem; height: 16rem;
      background: rgba(200,232,208,0.2);
      border-bottom-left-radius: 100%;
      transition: transform 0.3s;
    }
    .bento-card.featured:hover .card-accent-blob { transform: scale(1.1); }
    .card-body { position: relative; z-index: 1; flex: 1; }
    .card-body h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-on-background);
      margin-bottom: 0.75rem;
    }
    .card-body p { color: var(--color-on-surface-variant); font-size: 1rem; }
    .card-tags {
      position: relative;
      z-index: 1;
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    .tag {
      padding: 0.25rem 0.75rem;
      background: var(--color-surface-container-high);
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      color: var(--color-secondary);
      font-weight: 600;
    }

    /* ---- AI card ---- */
    .card-ai {
      background: rgba(120,168,134,0.9);
      border-color: var(--color-primary-fixed-dim);
    }
    .title-ai {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-on-primary-fixed);
      margin: 0.5rem 0 0.5rem;
    }
    .desc-ai { color: var(--color-on-primary-fixed-variant); font-size: 0.875rem; }

    /* ---- Wide card ---- */
    @media (min-width: 768px) { .bento-card.wide { grid-column: span 2; } }
    .wide-body {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      height: 100%;
      width: 100%;
    }
    .wide-body > div:first-child { flex: 1; }
    .wide-body h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-on-background);
      margin: 0.75rem 0 0.5rem;
    }
    .wide-body p { color: var(--color-on-surface-variant); font-size: 0.875rem; }
    .wide-image {
      width: 8rem;
      height: 8rem;
      border-radius: var(--radius-sm);
      background: var(--color-surface-container-highest);
      overflow: hidden;
      flex-shrink: 0;
      display: none;
    }
    @media (min-width: 640px) { .wide-image { display: block; } }
    .wide-image img { width: 100%; height: 100%; object-fit: cover; }

    /* ---- Icon colours ---- */
    .card-icon {
      font-size: 2rem;
      color: var(--color-primary);
      margin-bottom: 0.75rem;
      display: block;
    }
    .icon-tertiary { color: var(--color-tertiary); }
    .icon-ai { color: var(--color-on-primary-container); }

    /* ---- Non-featured card headings ---- */
    .bento-card:not(.featured):not(.wide) h3,
    .bento-card.wide .wide-body h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-on-background);
      margin-bottom: 0.5rem;
    }
    .bento-card:not(.featured):not(.card-ai) p {
      color: var(--color-on-surface-variant);
      font-size: 0.875rem;
    }

    /* ---- See more ---- */
    .see-more { text-align: center; margin-top: 3rem; }
    .btn-text {
      color: var(--color-primary);
      font-weight: 700;
      font-size: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s;
    }
    .btn-text:hover { color: var(--color-on-primary-fixed-variant); }
  `]
})
export class BentoComponent implements AfterViewInit {
  constructor(private scrollReveal: ScrollRevealService) {}
  ngAfterViewInit(): void { this.scrollReveal.observeElements(); }
}
