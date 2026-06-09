import { Component, AfterViewInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

@Component({
  selector: 'app-app-showcase',
  standalone: true,
  imports: [NgClass],
  template: `
    <section class="showcase-section" id="app-showcase">
      <div class="inner">

        <div class="head animate-on-scroll">
          <div class="badge">
            <span class="material-symbols-outlined">phone_iphone</span>
            La App en Acción
          </div>
          <h2>Ve Esencia funcionando <span class="accent">en vivo</span></h2>
          <p>Cada módulo diseñado para que tu equipo lo domine en minutos.</p>
        </div>

        <!-- Tab nav -->
        <div class="tabs animate-on-scroll">
          <button class="tab" [class.active]="activeTab===0" (click)="setTab(0)">
            <span class="material-symbols-outlined">dashboard</span> Dashboard
          </button>
          <button class="tab" [class.active]="activeTab===1" (click)="setTab(1)">
            <span class="material-symbols-outlined">hub</span> CRM Olfativo
          </button>
          <button class="tab" [class.active]="activeTab===2" (click)="setTab(2)">
            <span class="material-symbols-outlined">style</span> Catálogo
          </button>
        </div>

        <!-- Screenshot -->
        <div class="screenshot-wrap animate-on-scroll delay-100">
          <div class="browser-chrome">
            <div class="chrome-dots">
              <span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span>
            </div>
            <div class="chrome-bar">
              <span class="material-symbols-outlined lock-icon">lock</span>
              <span class="chrome-url">{{ tabs[activeTab].url }}</span>
            </div>
          </div>
          <div class="screenshot-frame">
            <img
              [src]="tabs[activeTab].img"
              [alt]="tabs[activeTab].alt"
              class="screenshot-img"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Feature highlights below screenshot -->
        <div class="highlights animate-on-scroll">
          @for (feat of tabs[activeTab].feats; track feat.title) {
          <div class="hl-item">
            <span class="material-symbols-outlined hl-icon">{{ feat.icon }}</span>
            <div>
              <div class="hl-title">{{ feat.title }}</div>
              <div class="hl-desc">{{ feat.desc }}</div>
            </div>
          </div>
          }
        </div>

      </div>
    </section>
  `,
  styles: [`
    .showcase-section { padding:6rem 1.5rem; background:rgba(245,241,234,0.4); }
    .inner { max-width:80rem; margin:0 auto; display:flex; flex-direction:column; gap:3rem; align-items:center; }
    .head { text-align:center; display:flex; flex-direction:column; align-items:center; gap:1rem; }
    .badge { display:inline-flex; align-items:center; gap:0.5rem; padding:0.5rem 1rem; border-radius:9999px; background:rgba(240,236,228,0.9); color:var(--color-primary); font-weight:700; font-size:0.875rem; }
    h2 { font-family:var(--font-headline); font-size:clamp(2rem,5vw,3rem); font-weight:700; color:var(--color-on-background); line-height:1.2; }
    .accent { color:var(--color-primary); }
    .head p { font-size:1.05rem; color:var(--color-on-surface-variant); }
    .tabs { display:flex; gap:0.5rem; background:var(--color-surface-container); border-radius:1rem; padding:0.375rem; }
    .tab { display:flex; align-items:center; gap:0.5rem; padding:0.625rem 1.25rem; border-radius:0.75rem; font-weight:700; font-size:0.875rem; color:var(--color-on-surface-variant); transition:all 0.2s; cursor:pointer; border:none; background:none; font-family:var(--font-body); }
    .tab .material-symbols-outlined { font-size:1.1rem; }
    .tab:hover { background:rgba(250,246,240,0.7); color:var(--color-on-background); }
    .tab.active { background:var(--color-surface-container-lowest); color:var(--color-primary); box-shadow:0 2px 8px rgba(46,50,48,0.08); }
    .screenshot-wrap { width:100%; max-width:64rem; border-radius:1rem; overflow:hidden; box-shadow:0 30px 80px rgba(46,50,48,0.18); }
    .browser-chrome { background:var(--color-surface-container-low); padding:0.75rem 1rem; display:flex; align-items:center; gap:0.75rem; border-bottom:1px solid var(--color-surface-container-highest); }
    .chrome-dots { display:flex; gap:0.4rem; }
    .dot-r,.dot-y,.dot-g { width:0.75rem; height:0.75rem; border-radius:9999px; }
    .dot-r { background:rgba(184,50,48,0.7); }
    .dot-y { background:rgba(112,92,48,0.7); }
    .dot-g { background:rgba(74,124,89,0.7); }
    .chrome-bar { flex:1; background:var(--color-surface-container); border-radius:0.375rem; padding:0.35rem 0.75rem; display:flex; align-items:center; gap:0.375rem; font-size:0.75rem; color:var(--color-on-surface-variant); }
    .lock-icon { font-size:0.875rem; color:var(--color-primary); }
    .screenshot-frame { width:100%; overflow:hidden; }
    .screenshot-img { width:100%; display:block; transition:opacity 0.3s; }
    .highlights { display:grid; grid-template-columns:1fr; gap:1rem; width:100%; }
    @media(min-width:640px) { .highlights { grid-template-columns:repeat(3,1fr); } }
    .hl-item { display:flex; align-items:flex-start; gap:0.75rem; padding:1.25rem; background:rgba(250,246,240,0.9); border:1px solid var(--color-surface-container-highest); border-radius:1rem; }
    .hl-icon { color:var(--color-primary); flex-shrink:0; margin-top:2px; }
    .hl-title { font-weight:700; color:var(--color-on-background); font-size:0.9rem; margin-bottom:0.25rem; }
    .hl-desc { font-size:0.8125rem; color:var(--color-on-surface-variant); line-height:1.5; }
  `]
})
export class AppShowcaseComponent implements AfterViewInit {
  activeTab = 0;

  tabs = [
    {
      url: 'app.esencia.io/dashboard',
      img: 'assets/dashboard-screenshot.webp',
      alt: 'Dashboard de Esencia con métricas de ventas',
      feats: [
        { icon: 'insights', title: 'Analítica en Tiempo Real', desc: 'KPIs actualizados al instante sin recargar la página.' },
        { icon: 'notifications_active', title: 'Alertas Predictivas', desc: 'Detección de quiebre de stock antes de que ocurra.' },
        { icon: 'trending_up', title: 'Tendencias Olfativas', desc: 'Qué familias de fragancias están dominando el mercado.' },
      ]
    },
    {
      url: 'app.esencia.io/crm/clientes',
      img: 'assets/crm-screenshot.webp',
      alt: 'Perfil olfativo de cliente en el CRM de Esencia',
      feats: [
        { icon: 'psychology', title: 'Perfil Olfativo IA', desc: 'Construido automáticamente desde cada interacción.' },
        { icon: 'auto_awesome', title: 'Recomendaciones 92%', desc: 'Precisión en sugerencias de fragancia por cliente.' },
        { icon: 'campaign', title: 'Campañas Segmentadas', desc: 'Envía solo la fragancia correcta a cada cliente.' },
      ]
    },
    {
      url: 'app.esencia.io/catalogo',
      img: 'assets/catalog-screenshot.webp',
      alt: 'Catálogo digital de fragancias con filtros y precios',
      feats: [
        { icon: 'tune', title: 'Filtros por Notas', desc: 'Salida, corazón y fondo — la forma natural de buscar perfumes.' },
        { icon: 'science', title: 'Gestión de Decants', desc: '5ml, 10ml o botella completa, con precios dinámicos.' },
        { icon: 'loyalty', title: 'Esencia Rewards', desc: 'Puntos integrados visualmente en cada producto.' },
      ]
    },
  ];

  constructor(private scrollReveal: ScrollRevealService) {}
  ngAfterViewInit(): void { this.scrollReveal.observeElements(); }

  setTab(i: number): void { this.activeTab = i; }
}
