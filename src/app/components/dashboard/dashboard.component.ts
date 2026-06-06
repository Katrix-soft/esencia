import { Component, AfterViewInit } from '@angular/core';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section class="dashboard-section" id="dashboard">

      <!-- Soft BG blob -->
      <div class="blob blob-right"></div>

      <div class="section-inner">

        <!-- Left: copy -->
        <div class="copy animate-on-scroll">
          <div class="badge">
            <span class="material-symbols-outlined badge-icon">dashboard</span>
            Inteligencia de Negocio
          </div>

          <h2>El centro neurálgico de tu perfumería</h2>

          <p class="lead">
            Un panel intuitivo diseñado para anticiparse a tus necesidades.
            Visualiza tendencias de ventas, recibe alertas tempranas de
            inventario y descubre qué notas olfativas están dominando el mercado.
          </p>

          <ul class="feature-list">
            <li>
              <span class="material-symbols-outlined feat-icon">insights</span>
              <div>
                <strong>Analítica Predictiva</strong>
                <span>Anticipa picos de demanda según estacionalidad y tendencias globales.</span>
              </div>
            </li>
            <li>
              <span class="material-symbols-outlined feat-icon icon-tertiary">notifications_active</span>
              <div>
                <strong>Alertas de Reposición</strong>
                <span>Evita quiebres de stock en tus best-sellers con nuestro sistema 'ready to bloom'.</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Right: mockup -->
        <div class="mockup-wrap animate-on-scroll delay-200">
          <div class="mockup">

            <!-- Mac-like title bar -->
            <div class="title-bar">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
              <span class="title-label">Esencia Dashboard</span>
            </div>

            <div class="mockup-body">

              <!-- Stats row -->
              <div class="stats-row">
                              <div class="stat-card stat-green">
                  <span class="stat-label">Ventas del Mes</span>
                  <div class="stat-value" data-target="45">$0</div>
                  <div class="stat-trend">
                    <span class="material-symbols-outlined trend-icon">trending_up</span>
                    +12% vs mes anterior
                  </div>
                </div>
                <div class="stat-card stat-amber">
                  <span class="stat-label">Stock en Riesgo</span>
                  <div class="stat-value" data-target="3" data-prefix="" data-suffix=" ítems">0</div>
                  <div class="stat-note">Requiere atención pronto</div>
                </div>
              </div>

              <!-- Chart -->
              <div class="chart-box">
                <div class="chart-title">Tendencia Olfativa Semanal</div>
                <div class="chart-bars">
                  <div class="bar-wrap">
                    <div class="bar" style="height:40%; background: rgba(74,124,89,0.2);"></div>
                    <span class="bar-label">Lun</span>
                  </div>
                  <div class="bar-wrap">
                    <div class="bar" style="height:70%; background: rgba(112,92,48,0.4);"></div>
                    <span class="bar-label">Mar</span>
                  </div>
                  <div class="bar-wrap">
                    <div class="bar" style="height:50%; background: rgba(74,124,89,0.6);"></div>
                    <span class="bar-label">Mié</span>
                  </div>
                  <div class="bar-wrap featured-bar">
                    <div class="bar bar-primary" style="height:90%;"></div>
                    <div class="bar-top-label">Floral</div>
                    <span class="bar-label">Jue</span>
                  </div>
                  <div class="bar-wrap">
                    <div class="bar" style="height:30%; background: rgba(107,99,88,0.3);"></div>
                    <span class="bar-label">Vie</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .dashboard-section {
      padding: 6rem 1.5rem;
      overflow: hidden;
      position: relative;
    }
    .blob {
      position: absolute;
      border-radius: 9999px;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }
    .blob-right {
      top: -10rem;
      right: -16rem;
      width: 50rem;
      height: 50rem;
      background: rgba(74,124,89,0.05);
    }

    /* layout */
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
    .feature-list li {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }
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
    .mockup {
      background: var(--color-surface);
      border: 1px solid var(--color-surface-container-highest);
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(46,50,48,0.12);
    }
    .title-bar {
      background: var(--color-surface-container-low);
      border-bottom: 1px solid var(--color-surface-container-highest);
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .dot { width: 0.75rem; height: 0.75rem; border-radius: 9999px; }
    .dot-red   { background: rgba(184,50,48,0.7); }
    .dot-yellow{ background: rgba(112,92,48,0.7); }
    .dot-green { background: rgba(74,124,89,0.7); }
    .title-label {
      margin: 0 auto;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-on-surface-variant);
    }
    .mockup-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }

    /* stats */
    .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .stat-card { padding: 1rem; border-radius: 1rem; }
    .stat-green { background: rgba(200,232,208,0.2); border: 1px solid rgba(74,124,89,0.1); }
    .stat-amber { background: rgba(248,224,168,0.2); border: 1px solid rgba(112,92,48,0.1); }
    .stat-label { font-size: 0.8rem; color: var(--color-on-surface-variant); }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--color-on-background); margin-top: 0.25rem; }
    .stat-unit { font-size: 0.875rem; font-weight: 400; color: var(--color-on-surface-variant); }
    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: var(--color-primary);
      margin-top: 0.5rem;
    }
    .trend-icon { font-size: 0.875rem; }
    .stat-note { font-size: 0.75rem; color: var(--color-tertiary); margin-top: 0.5rem; }

    /* chart */
    .chart-box {
      padding: 1rem;
      border-radius: 1rem;
      border: 1px solid var(--color-surface-container-highest);
      background: var(--color-surface-container-lowest);
    }
    .chart-title { font-size: 0.875rem; font-weight: 700; color: var(--color-on-background); margin-bottom: 1rem; }
    .chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      height: 8rem;
      padding-top: 1.5rem;
    }
    .bar-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      position: relative;
      justify-content: flex-end;
    }
    .bar {
      width: 100%;
      border-radius: 4px 4px 0 0;
      transition: opacity 0.3s;
    }
    .bar-primary { background: var(--color-primary); }
    .bar-label { font-size: 0.6rem; color: var(--color-on-surface-variant); margin-top: 0.4rem; }
    .bar-top-label {
      position: absolute;
      top: -1.25rem;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--color-primary);
      white-space: nowrap;
    }
  `]
})
export class DashboardComponent implements AfterViewInit {
  constructor(private scrollReveal: ScrollRevealService) {}

  ngAfterViewInit(): void {
    this.scrollReveal.observeElements();
    this.initCounters();
  }

  private initCounters(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseInt(el.getAttribute('data-target') || '0', 10);
          const prefix = el.getAttribute('data-prefix') ?? '$';
          const suffix = el.getAttribute('data-suffix') ?? '.2K';
          this.animateCounter(el, target, prefix, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-value[data-target]').forEach(c => observer.observe(c));
  }

  private animateCounter(el: HTMLElement, target: number, prefix: string, suffix: string): void {
    const duration = 2000;
    const start = performance.now();
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
}
