import { Component, AfterViewInit } from '@angular/core';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  template: `
    <section class="test-section">
      <div class="inner">

        <!-- Logos -->
        <div class="logos-wrap animate-on-scroll">
          <p class="logos-label">Perfumerías que confían en Esencia</p>
          <div class="logos-row">
            <div class="logo-pill"><span class="material-symbols-outlined">spa</span>Olfatto Milano</div>
            <div class="logo-pill"><span class="material-symbols-outlined">local_florist</span>Maison Fleurie</div>
            <div class="logo-pill"><span class="material-symbols-outlined">water_drop</span>Aqua Vitae</div>
            <div class="logo-pill"><span class="material-symbols-outlined">eco</span>Verde Olfativo</div>
            <div class="logo-pill"><span class="material-symbols-outlined">diamond</span>Luxe Scents</div>
          </div>
        </div>

        <!-- Animated stats -->
        <div class="stats-band animate-on-scroll">
          <div class="stat-item">
            <div class="stat-num" data-target="127">0</div>
            <div class="stat-lbl">Perfumerías activas</div>
          </div>
          <div class="stat-div"></div>
          <div class="stat-item">
            <div class="stat-num" data-target="34">0</div>
            <div class="stat-lbl">% más ventas en promedio</div>
          </div>
          <div class="stat-div"></div>
          <div class="stat-item">
            <div class="stat-num" data-target="98">0</div>
            <div class="stat-lbl">% satisfacción de clientes</div>
          </div>
          <div class="stat-div"></div>
          <div class="stat-item">
            <div class="stat-num" data-target="2">0</div>
            <div class="stat-lbl">min de onboarding promedio</div>
          </div>
        </div>

        <!-- Heading -->
        <div class="head animate-on-scroll">
          <h2>Lo que dicen nuestros clientes</h2>
          <p>Resultados reales de perfumerías usando Esencia cada día.</p>
        </div>

        <!-- Cards -->
        <div class="cards-grid">
          <div class="t-card featured animate-on-scroll">
            <div class="qmark">"</div>
            <p class="quote">Desde que usamos Esencia, nuestros clientes nunca se van sin encontrar su fragancia ideal. El CRM olfativo es una revolución. Aumentamos la retención un <strong>40%</strong> en solo 3 meses.</p>
            <div class="author">
              <div class="av av-green">CM</div>
              <div>
                <div class="aname">Camila Moretti</div>
                <div class="arole">Dueña · Olfatto Milano, Buenos Aires</div>
              </div>
              <div class="stars">★★★★★</div>
            </div>
          </div>
          <div class="t-card animate-on-scroll delay-100">
            <div class="qmark">"</div>
            <p class="quote">El dashboard me avisa antes de quedarme sin stock. Parece magia pero es IA. Nunca más perdí una venta por falta de inventario.</p>
            <div class="author">
              <div class="av av-amber">LR</div>
              <div>
                <div class="aname">Lucas Rodríguez</div>
                <div class="arole">Gerente · Verde Olfativo, Montevideo</div>
              </div>
              <div class="stars">★★★★★</div>
            </div>
          </div>
          <div class="t-card animate-on-scroll delay-200">
            <div class="qmark">"</div>
            <p class="quote">El catálogo digital triplicó nuestras ventas online. Los clientes adoran filtrar por notas olfativas. Es exactamente lo que necesitábamos.</p>
            <div class="author">
              <div class="av av-rose">SP</div>
              <div>
                <div class="aname">Sofía Peralta</div>
                <div class="arole">Fundadora · Maison Fleurie, Córdoba</div>
              </div>
              <div class="stars">★★★★★</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .test-section { padding:6rem 1.5rem; background:var(--color-surface-container-lowest); border-top:1px solid var(--color-surface-container-highest); border-bottom:1px solid var(--color-surface-container-highest); }
    .inner { max-width:80rem; margin:0 auto; display:flex; flex-direction:column; gap:4rem; }
    .logos-wrap { text-align:center; }
    .logos-label { font-size:0.8rem; color:var(--color-on-surface-variant); font-weight:700; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1.5rem; }
    .logos-row { display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem; }
    .logo-pill { display:flex; align-items:center; gap:0.4rem; padding:0.5rem 1.25rem; border:1px solid var(--color-outline-variant); border-radius:9999px; font-weight:700; font-size:0.875rem; color:var(--color-on-surface-variant); opacity:0.7; transition:opacity 0.2s,border-color 0.2s; cursor:default; }
    .logo-pill:hover { opacity:1; border-color:var(--color-primary); }
    .logo-pill .material-symbols-outlined { font-size:1rem; color:var(--color-primary); }
    .stats-band { display:flex; flex-wrap:wrap; background:rgba(250,246,240,0.9); border:1px solid var(--color-surface-container-highest); border-radius:1.5rem; overflow:hidden; }
    .stat-item { flex:1; min-width:140px; padding:2rem; text-align:center; }
    .stat-num { font-family:var(--font-headline); font-size:2.5rem; font-weight:700; color:var(--color-primary); line-height:1; margin-bottom:0.5rem; }
    .stat-lbl { font-size:0.8rem; color:var(--color-on-surface-variant); }
    .stat-div { width:1px; background:var(--color-surface-container-highest); align-self:stretch; }
    .head { text-align:center; }
    h2 { font-family:var(--font-headline); font-size:clamp(1.75rem,4vw,2.5rem); font-weight:700; color:var(--color-on-background); margin-bottom:0.75rem; }
    .head p { font-size:1.05rem; color:var(--color-on-surface-variant); }
    .cards-grid { display:grid; grid-template-columns:1fr; gap:1.5rem; }
    @media(min-width:768px) { .cards-grid { grid-template-columns:repeat(3,1fr); } }
    .t-card { background:rgba(250,246,240,0.9); border:1px solid var(--color-surface-container-highest); border-radius:1.5rem; padding:2rem; display:flex; flex-direction:column; gap:1.25rem; transition:transform 0.3s,box-shadow 0.3s; }
    .t-card:hover { transform:translateY(-6px); box-shadow:0 12px 40px rgba(46,50,48,0.1); }
    .featured { border:2px solid var(--color-primary); background:linear-gradient(to bottom right,rgba(200,232,208,0.2),rgba(250,246,240,0.9)); }
    .qmark { font-family:Georgia,serif; font-size:4rem; color:var(--color-primary); opacity:0.2; line-height:0.8; }
    .quote { font-size:0.9375rem; color:var(--color-on-background); line-height:1.7; flex:1; }
    .quote strong { color:var(--color-primary); }
    .author { display:flex; align-items:center; gap:0.75rem; }
    .av { width:2.5rem; height:2.5rem; border-radius:9999px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem; flex-shrink:0; }
    .av-green { background:rgba(74,124,89,0.15); color:var(--color-primary); }
    .av-amber { background:rgba(112,92,48,0.15); color:var(--color-tertiary); }
    .av-rose { background:rgba(184,50,48,0.1); color:var(--color-error); }
    .aname { font-weight:700; color:var(--color-on-background); font-size:0.875rem; }
    .arole { font-size:0.75rem; color:var(--color-on-surface-variant); }
    .stars { margin-left:auto; color:var(--color-tertiary); font-size:0.875rem; letter-spacing:0.05em; }
  `]
})
export class TestimonialsComponent implements AfterViewInit {
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
          this.animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-num[data-target]').forEach(c => observer.observe(c));
  }

  private animateCounter(el: HTMLElement, target: number): void {
    const duration = 2000;
    const start = performance.now();
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target).toString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
}
