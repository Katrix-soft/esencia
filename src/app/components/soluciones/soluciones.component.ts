import { Component, AfterViewInit } from '@angular/core';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

@Component({
  selector: 'app-soluciones',
  standalone: true,
  template: `
    <section class="soluciones-section" id="soluciones">
      <div class="section-inner">

        <!-- Header -->
        <div class="section-header animate-on-scroll">
          <div class="badge">
            <span class="material-symbols-outlined">apps</span>
            Todo en un Solo Lugar
          </div>
          <h2>Una plataforma diseñada <span class="accent">para perfumerías</span></h2>
          <p class="subtitle">
            Cada herramienta construida específicamente para el mundo de las fragancias.
            Sin adaptaciones genéricas, sin compromisos.
          </p>
        </div>

        <!-- Feature grid -->
        <div class="features-grid">

          <div class="feat-card animate-on-scroll">
            <div class="feat-icon-wrap icon-green">
              <span class="material-symbols-outlined">dashboard</span>
            </div>
            <h3>Dashboard Inteligente</h3>
            <p>Visualiza el pulso de tu negocio en tiempo real. KPIs, tendencias y alertas en una sola pantalla.</p>
            <a href="#dashboard" class="feat-link">
              Ver Dashboard
              <span class="material-symbols-outlined arrow">arrow_forward</span>
            </a>
          </div>

          <div class="feat-card animate-on-scroll delay-100">
            <div class="feat-icon-wrap icon-amber">
              <span class="material-symbols-outlined">hub</span>
            </div>
            <h3>CRM Olfativo</h3>
            <p>El único CRM del mundo que construye perfiles olfativos automáticos para cada cliente.</p>
            <a href="#crm" class="feat-link">
              Ver CRM
              <span class="material-symbols-outlined arrow">arrow_forward</span>
            </a>
          </div>

          <div class="feat-card animate-on-scroll delay-200">
            <div class="feat-icon-wrap icon-green">
              <span class="material-symbols-outlined">style</span>
            </div>
            <h3>Catálogo Digital</h3>
            <p>Un escaparate premium con gestión de decants, filtros por notas y sistema de puntos integrado.</p>
            <a href="#catalogo" class="feat-link">
              Ver Catálogo
              <span class="material-symbols-outlined arrow">arrow_forward</span>
            </a>
          </div>

          <div class="feat-card animate-on-scroll delay-100">
            <div class="feat-icon-wrap icon-amber">
              <span class="material-symbols-outlined">inventory_2</span>
            </div>
            <h3>Gestión de Inventario</h3>
            <p>Control de stock con alertas predictivas antes de que se agoten tus best-sellers.</p>
            <a href="#dashboard" class="feat-link">
              Ver Inventario
              <span class="material-symbols-outlined arrow">arrow_forward</span>
            </a>
          </div>

          <div class="feat-card animate-on-scroll delay-200">
            <div class="feat-icon-wrap icon-green">
              <span class="material-symbols-outlined">auto_awesome</span>
            </div>
            <h3>IA para Fragancias</h3>
            <p>Recomendaciones personalizadas, campañas segmentadas y análisis de tendencias del mercado.</p>
            <a href="#crm" class="feat-link">
              Ver IA
              <span class="material-symbols-outlined arrow">arrow_forward</span>
            </a>
          </div>

          <div class="feat-card feat-card-highlight animate-on-scroll delay-300">
            <div class="highlight-inner">
              <div class="stat-row">
                <div class="big-stat">
                  <span class="stat-num">+34%</span>
                  <span class="stat-desc">aumento promedio en ventas</span>
                </div>
                <div class="big-stat">
                  <span class="stat-num">2.4x</span>
                  <span class="stat-desc">retención de clientes</span>
                </div>
              </div>
              <p class="highlight-text">Resultados reales de perfumerías usando Esencia</p>
              <button class="btn-try btn-shimmer active-scale" (click)="scrollToSection('precios')">
                Empezar Ahora
                <span class="material-symbols-outlined">rocket_launch</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .soluciones-section {
      padding: 6rem 1.5rem;
      position: relative;
      background: rgba(245,241,234,0.3);
    }
    .section-inner {
      max-width: 80rem;
      margin: 0 auto;
    }

    /* header */
    .section-header {
      text-align: center;
      max-width: 52rem;
      margin: 0 auto 4rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: rgba(240,236,228,0.9);
      color: var(--color-primary);
      font-weight: 700;
      font-size: 0.875rem;
    }
    h2 {
      font-family: var(--font-headline);
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      color: var(--color-on-background);
      line-height: 1.2;
    }
    .accent { color: var(--color-primary); }
    .subtitle {
      font-size: 1.1rem;
      color: var(--color-on-surface-variant);
      max-width: 40rem;
      line-height: 1.7;
    }

    /* grid */
    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 640px) {
      .features-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .features-grid { grid-template-columns: repeat(3, 1fr); }
    }

    /* cards */
    .feat-card {
      background: rgba(250,246,240,0.9);
      backdrop-filter: blur(4px);
      border: 1px solid var(--color-surface-container-highest);
      border-radius: 1.5rem;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .feat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 40px rgba(46,50,48,0.1);
    }
    .feat-icon-wrap {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-green {
      background: rgba(74,124,89,0.1);
      color: var(--color-primary);
    }
    .icon-amber {
      background: rgba(112,92,48,0.1);
      color: var(--color-tertiary);
    }
    h3 {
      font-family: var(--font-headline);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-on-background);
    }
    p {
      font-size: 0.9375rem;
      color: var(--color-on-surface-variant);
      line-height: 1.6;
      flex: 1;
    }
    .feat-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--color-primary);
      transition: gap 0.2s;
      text-decoration: none;
    }
    .feat-link:hover { gap: 0.625rem; }
    .arrow { font-size: 1rem; transition: transform 0.2s; }
    .feat-link:hover .arrow { transform: translateX(3px); }

    /* highlight card */
    .feat-card-highlight {
      background: linear-gradient(135deg, rgba(74,124,89,0.9), rgba(46,96,56,0.95));
      border: none;
    }
    .feat-card-highlight:hover {
      box-shadow: 0 12px 40px rgba(74,124,89,0.3);
    }
    .highlight-inner {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: 100%;
    }
    .stat-row {
      display: flex;
      gap: 1.5rem;
    }
    .big-stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .stat-num {
      font-family: var(--font-headline);
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
      line-height: 1;
    }
    .stat-desc {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.7);
    }
    .highlight-text {
      color: rgba(255,255,255,0.8);
      font-size: 0.875rem;
    }
    .btn-try {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #fff;
      color: var(--color-primary);
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 700;
      font-size: 0.9375rem;
      border: none;
      cursor: pointer;
      transition: background 0.15s, transform 0.15s;
      align-self: flex-start;
    }
    .btn-try:hover { background: var(--color-primary-container); }
  `]
})
export class SolucionesComponent implements AfterViewInit {
  constructor(private scrollReveal: ScrollRevealService) {}
  ngAfterViewInit(): void { this.scrollReveal.observeElements(); }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
