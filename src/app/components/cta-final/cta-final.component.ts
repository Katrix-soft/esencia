import { Component } from '@angular/core';

@Component({
  selector: 'app-cta-final',
  standalone: true,
  template: `
    <section class="cta-section">
      <div class="inner">
        <div class="glow-orb glow-left"></div>
        <div class="glow-orb glow-right"></div>

        <div class="content">
          <div class="badge">
            <span class="material-symbols-outlined">rocket_launch</span>
            Empieza Hoy
          </div>
          <h2>Tu perfumería merece la mejor tecnología</h2>
          <p>
            14 días de prueba gratuita. Sin tarjeta de crédito. Onboarding en 2 minutos.
            Cancela cuando quieras.
          </p>

          <div class="cta-actions">
            <button class="btn-hero btn-shimmer active-scale" (click)="scrollTo('precios')">
              <span class="material-symbols-outlined">rocket_launch</span>
              Comenzar Prueba Gratis
            </button>
            <button class="btn-ghost active-scale" (click)="scrollTo('app-showcase')">
              <span class="material-symbols-outlined">play_circle</span>
              Ver Demo Interactiva
            </button>
          </div>


        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta-section {
      padding: 8rem 1.5rem;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(46,96,56,0.97) 0%, rgba(74,124,89,0.95) 50%, rgba(46,96,56,0.97) 100%);
    }
    .inner {
      max-width: 56rem;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
    .glow-orb {
      position: absolute;
      border-radius: 9999px;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }
    .glow-left {
      top: -10rem; left: -10rem;
      width: 30rem; height: 30rem;
      background: rgba(200,232,208,0.15);
    }
    .glow-right {
      bottom: -10rem; right: -10rem;
      width: 30rem; height: 30rem;
      background: rgba(112,92,48,0.15);
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(4px);
      color: rgba(255,255,255,0.9);
      font-weight: 700;
      font-size: 0.875rem;
      border: 1px solid rgba(255,255,255,0.2);
    }
    h2 {
      font-family: var(--font-headline);
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      color: #fff;
      line-height: 1.15;
      max-width: 44rem;
    }
    p {
      font-size: 1.1rem;
      color: rgba(255,255,255,0.75);
      max-width: 36rem;
      line-height: 1.7;
    }
    .cta-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 28rem;
    }
    @media(min-width:540px) {
      .cta-actions { flex-direction:row; max-width:none; justify-content:center; }
    }
    .btn-hero {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #fff;
      color: var(--color-primary);
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      font-weight: 700;
      font-size: 1.05rem;
      border: none;
      cursor: pointer;
      transition: background 0.15s, transform 0.15s;
      font-family: var(--font-body);
    }
    .btn-hero:hover { background: var(--color-primary-container); }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(4px);
      color: #fff;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      font-weight: 700;
      font-size: 1.05rem;
      border: 2px solid rgba(255,255,255,0.3);
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      font-family: var(--font-body);
    }
    .btn-ghost:hover { background:rgba(255,255,255,0.18); border-color:rgba(255,255,255,0.5); }
  `]

})
export class CtaFinalComponent {
  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
