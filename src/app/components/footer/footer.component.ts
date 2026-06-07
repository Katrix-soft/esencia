import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer animate-on-scroll">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="assets/Esencia.png" alt="Esencia" class="logo-img" />
          </div>
          <p class="footer-tagline">Un producto de <a href="https://katrix.com.ar" target="_blank" rel="noopener" class="katrix-link">Katrix</a></p>
        </div>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="https://katrix.com.ar" target="_blank" rel="noopener">katrix</a>
          <a href="https://katrix.com.ar/terminos" target="_blank" rel="noopener">Términos</a>
          <a href="https://katrix.com.ar/privacidad" target="_blank" rel="noopener">Privacidad</a>
          <a href="https://wa.me/5491100000000" target="_blank" rel="noopener">WhatsApp Soporte</a>
          <a href="#precios">Ver Planes</a>
        </nav>
      </div>
      <div class="footer-divider"></div>
      <p class="copyright">
        &copy; 2026 Esencia &mdash; Desarrollado por
        <a href="https://katrix.com.ar" target="_blank" rel="noopener" class="katrix-link">Katrix</a>
        &middot; Todos los derechos reservados
      </p>
    </footer>
  `,
  styles: [`
    .footer {
      background: rgba(228,224,216,0.9);
      backdrop-filter: blur(4px);
      padding: 3rem 2rem;
      margin-top: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      text-align: center;
    }
    .footer-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
      max-width: 60rem;
    }
    @media(min-width: 768px) {
      .footer-top { flex-direction: row; justify-content: space-between; text-align: left; }
    }
    .footer-brand { display: flex; flex-direction: column; gap: 0.25rem; }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-headline);
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    .logo-img {
      height: 2.5rem;
      width: auto;
      object-fit: contain;
      mix-blend-mode: multiply;
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-sm);
      padding: 0.1rem;
    }
    .footer-tagline {
      font-size: 0.875rem;
      color: var(--color-on-surface-variant);
    }
    .katrix-link {
      color: var(--color-primary);
      font-weight: 700;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .katrix-link:hover { opacity: 0.75; text-decoration: underline; }
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.25rem;
    }
    @media(min-width: 768px) { .footer-links { justify-content: flex-end; } }
    .footer-links a {
      color: var(--color-secondary);
      font-size: 0.875rem;
      opacity: 0.9;
      transition: color 0.2s, opacity 0.2s;
    }
    .footer-links a:hover {
      color: var(--color-primary);
      opacity: 1;
      text-decoration: underline;
      text-decoration-color: var(--color-primary);
    }
    .footer-divider {
      width: 100%;
      max-width: 60rem;
      height: 1px;
      background: var(--color-outline-variant);
      opacity: 0.5;
    }
    .copyright {
      color: var(--color-on-surface-variant);
      font-size: 0.8rem;
    }
  `]
})
export class FooterComponent {}
