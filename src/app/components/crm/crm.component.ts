import { Component, AfterViewInit } from '@angular/core';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

@Component({
  selector: 'app-crm',
  standalone: true,
  template: `
    <section class="crm-section" id="crm">
      <div class="blob blob-left"></div>

      <div class="section-inner">

        <!-- Left: mockup (reversed order on desktop) -->
        <div class="mockup-wrap animate-on-scroll delay-200">
          <div class="crm-card">

            <!-- Customer header -->
            <div class="customer-header">
              <div class="avatar">VC</div>
              <div>
                <h3 class="customer-name">Valeria Costa</h3>
                <p class="customer-meta">
                  <span class="material-symbols-outlined star-icon">star</span>
                  Cliente VIP · 12 compras
                </p>
              </div>
            </div>

            <!-- Olfactory profile -->
            <div class="profile-section">
              <h4 class="profile-heading">Perfil Olfativo Dominante</h4>
              <div class="tag-row">
                <span class="tag tag-primary">Floral Blanco</span>
                <span class="tag tag-tertiary">Amaderado Suave</span>
              </div>

              <h4 class="profile-heading" style="margin-top:1.5rem;">Afinidad de Notas</h4>
              <div class="bars">
                <div class="note-row">
                  <div class="note-meta">
                    <span class="note-name">Jazmín</span>
                    <span class="note-pct">85%</span>
                  </div>
                  <div class="track">
                    <div class="fill fill-primary" style="width:85%"></div>
                  </div>
                </div>
                <div class="note-row">
                  <div class="note-meta">
                    <span class="note-name">Sándalo</span>
                    <span class="note-pct">60%</span>
                  </div>
                  <div class="track">
                    <div class="fill fill-tertiary" style="width:60%"></div>
                  </div>
                </div>
              </div>

              <!-- AI Recommendation -->
              <div class="ai-rec">
                <span class="material-symbols-outlined ai-icon">auto_awesome</span>
                <div>
                  <div class="ai-title">Recomendación IA</div>
                  <div class="ai-body">
                    Sugerir "Nuit de Cellophane" en su próximo email. Coincide 92% con su perfil.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Right: copy -->
        <div class="copy animate-on-scroll">
          <div class="badge">
            <span class="material-symbols-outlined badge-icon">hub</span>
            CRM Olfativo Avanzado
          </div>

          <h2>Conoce a tus clientes por su esencia</h2>

          <p class="lead">
            Transforma compradores ocasionales en clientes fieles. Nuestro CRM
            construye automáticamente un perfil olfativo detallado basado en cada
            interacción, compra y consulta.
          </p>

          <div class="feat-grid">
            <div class="feat-item border-primary">
              <strong>Recomendaciones Precisas</strong>
              <p>Aumenta tu ticket promedio sugiriendo fragancias que científicamente encajan con sus gustos.</p>
            </div>
            <div class="feat-item border-tertiary">
              <strong>Campañas Segmentadas</strong>
              <p>Envía ofertas de perfumes cítricos solo a quienes aman esas notas, maximizando la conversión.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .crm-section {
      padding: 6rem 1.5rem;
      background: rgba(245,241,234,0.5);
      backdrop-filter: blur(4px);
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
    .blob-left {
      top: 50%;
      left: -12rem;
      transform: translateY(-50%);
      width: 24rem;
      height: 24rem;
      background: rgba(112,92,48,0.05);
    }

    /* layout */
    .section-inner {
      max-width: 80rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      gap: 4rem;
      position: relative;
      z-index: 1;
    }
    @media (min-width: 1024px) {
      .section-inner { flex-direction: row; }
    }

    /* mockup */
    .mockup-wrap { flex: 1; width: 100%; }
    .crm-card {
      background: var(--color-surface);
      border: 1px solid var(--color-surface-container-highest);
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(46,50,48,0.12);
      padding: 1.5rem;
    }

    /* customer header */
    .customer-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-surface-container-highest);
      margin-bottom: 1.5rem;
    }
    .avatar {
      width: 4rem;
      height: 4rem;
      border-radius: 9999px;
      background: var(--color-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-headline);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
      flex-shrink: 0;
    }
    .customer-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-on-background);
      margin-bottom: 0.2rem;
    }
    .customer-meta {
      font-size: 0.875rem;
      color: var(--color-on-surface-variant);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .star-icon { font-size: 1rem; color: var(--color-tertiary); }

    /* profile */
    .profile-section { display: flex; flex-direction: column; gap: 0.75rem; }
    .profile-heading {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-on-background);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .tag {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 700;
    }
    .tag-primary { background: rgba(74,124,89,0.1); color: var(--color-primary); border: 1px solid rgba(74,124,89,0.2); }
    .tag-tertiary { background: rgba(112,92,48,0.1); color: var(--color-tertiary); border: 1px solid rgba(112,92,48,0.2); }

    /* bars */
    .bars { display: flex; flex-direction: column; gap: 0.75rem; }
    .note-row { display: flex; flex-direction: column; gap: 0.25rem; }
    .note-meta { display: flex; justify-content: space-between; font-size: 0.75rem; }
    .note-name { color: var(--color-on-surface-variant); }
    .note-pct { font-weight: 700; color: var(--color-on-background); }
    .track { width: 100%; background: var(--color-surface-container-high); border-radius: 9999px; height: 6px; }
    .fill { height: 100%; border-radius: 9999px; }
    .fill-primary { background: var(--color-primary); }
    .fill-tertiary { background: var(--color-tertiary); }

    /* AI rec */
    .ai-rec {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: linear-gradient(to right, rgba(200,232,208,0.3), var(--color-surface-container-lowest));
      border: 1px solid rgba(74,124,89,0.1);
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }
    .ai-icon { color: var(--color-primary); flex-shrink: 0; }
    .ai-title { font-size: 0.875rem; font-weight: 700; color: var(--color-on-background); }
    .ai-body { font-size: 0.75rem; color: var(--color-on-surface-variant); margin-top: 0.25rem; }

    /* copy */
    .copy { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: rgba(240,236,228,0.8);
      color: var(--color-tertiary);
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

    .feat-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-top: 1rem;
    }
    @media (min-width: 640px) {
      .feat-grid { grid-template-columns: 1fr 1fr; }
    }
    .feat-item {
      border-left: 2px solid;
      padding-left: 1rem;
    }
    .border-primary { border-color: var(--color-primary); }
    .border-tertiary { border-color: var(--color-tertiary); }
    .feat-item strong {
      display: block;
      color: var(--color-on-background);
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .feat-item p { font-size: 0.875rem; color: var(--color-on-surface-variant); }
  `]
})
export class CrmComponent implements AfterViewInit {
  constructor(private scrollReveal: ScrollRevealService) {}
  ngAfterViewInit(): void { this.scrollReveal.observeElements(); }
}
