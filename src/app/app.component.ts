import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { BentoComponent } from './components/bento/bento.component';
import { SolucionesComponent } from './components/soluciones/soluciones.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CrmComponent } from './components/crm/crm.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { AppShowcaseComponent } from './components/app-showcase/app-showcase.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { CtaFinalComponent } from './components/cta-final/cta-final.component';
import { FooterComponent } from './components/footer/footer.component';
import { ShaderCanvasComponent } from './components/shader-canvas/shader-canvas.component';
import { AdminComponent } from './components/admin/admin.component';
import { ScrollRevealService } from './services/scroll-reveal.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DecimalPipe,
    NavbarComponent,
    HeroComponent,
    BentoComponent,
    SolucionesComponent,
    DashboardComponent,
    CrmComponent,
    CatalogComponent,
    AppShowcaseComponent,
    TestimonialsComponent,
    PricingComponent,
    CtaFinalComponent,
    FooterComponent,
    ShaderCanvasComponent,
    AdminComponent,
  ],
  template: `
    <app-shader-canvas *ngIf="!isStoreView" />

    <div class="page-wrapper" *ngIf="!authService.showAdminView && !isStoreView">
      <app-navbar />
      <main>
        <app-hero />
        <app-bento />
        <app-soluciones />
        <app-dashboard />
        <app-crm />
        <app-catalog />
        <app-app-showcase />
        @if (false) {
          <app-testimonials />
        }
        <app-pricing />
        <app-cta-final />
      </main>
      <app-footer />
    </div>

    <div class="admin-wrapper" *ngIf="authService.showAdminView && !isStoreView">
      <app-admin (onBackToStore)="closeAdminView()" />
    </div>

    <!-- Public Store View -->
    <div class="store-view-wrapper" *ngIf="isStoreView">
      <header class="store-header">
        <div class="store-header-inner">
          <div class="store-branding">
            <span class="material-symbols-outlined store-logo-icon">local_florist</span>
            <h1>{{ authService.storeInfo.name }}</h1>
          </div>
          <p class="store-description">{{ authService.storeInfo.description }}</p>
        </div>
      </header>

      <main class="store-main">
        <div class="catalog-container">
          <div class="catalog-title-section">
            <h2>Catálogo Exclusivo</h2>
            <p>Explora nuestra selección de fragancias premium y decants.</p>
          </div>

          <div class="product-grid">
            <div class="product-card" *ngFor="let product of authService.mockProducts">
              <div class="product-img">
                <span class="material-symbols-outlined product-icon">filter_vintage</span>
                <span class="pts-badge" *ngIf="product.stock > 0">
                  <span class="material-symbols-outlined pts-star">stars</span> Disponible
                </span>
                <span class="pts-badge low-stock" *ngIf="product.stock === 0">
                  Sin Stock
                </span>
              </div>
              <div class="product-info">
                <h5 class="product-name">{{ product.name }}</h5>
                <p class="product-brand">{{ product.brand }} · {{ product.category }}</p>
                <div class="product-footer">
                  <span class="product-price">&#36;{{ product.price | number:'1.0-0' }}</span>
                  <span class="product-size">{{ product.volume }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer class="store-footer">
        <div class="store-footer-inner">
          <p class="store-contact">
            <span class="material-symbols-outlined">phone</span> {{ authService.storeInfo.phone }} | 
            <span class="material-symbols-outlined">mail</span> {{ authService.storeInfo.email }}
          </p>
          <p class="store-address" *ngIf="authService.storeInfo.address">
            <span class="material-symbols-outlined">location_on</span> {{ authService.storeInfo.address }}
          </p>
          <div class="powered-by">
            <span>Potenciado por <strong>Esencia SaaS</strong></span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .page-wrapper {
      position: relative;
      z-index: 10;
      width: 100%;
      min-height: 100vh;
    }
    .admin-wrapper {
      position: relative;
      z-index: 20;
      width: 100%;
      min-height: 100vh;
    }
    
    /* Store View Styles */
    .store-view-wrapper {
      background: #faf9f6;
      min-height: 100vh;
      color: #2e3230;
      font-family: 'Outfit', sans-serif;
    }
    .store-header {
      background: white;
      border-bottom: 1px solid #e5e0d8;
      padding: 3rem 1.5rem;
      text-align: center;
    }
    .store-header-inner {
      max-width: 60rem;
      margin: 0 auto;
    }
    .store-branding {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .store-logo-icon {
      font-size: 2.5rem;
      color: #4a7c59;
    }
    .store-branding h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0;
      color: #2e3230;
    }
    .store-description {
      font-size: 1.1rem;
      color: #666;
      margin: 0;
      line-height: 1.6;
    }
    .store-main {
      padding: 4rem 1.5rem;
      max-width: 75rem;
      margin: 0 auto;
    }
    .catalog-title-section {
      text-align: center;
      margin-bottom: 3rem;
    }
    .catalog-title-section h2 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .catalog-title-section p {
      color: #666;
      margin: 0;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
    .product-card {
      background: white;
      border: 1px solid #e5e0d8;
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.02);
      transition: all 0.3s ease;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    }
    .product-img {
      aspect-ratio: 1.2;
      background: #faf9f6;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-bottom: 1px solid #e5e0d8;
    }
    .product-icon {
      font-size: 3.5rem;
      color: rgba(74, 124, 89, 0.25);
    }
    .pts-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: white;
      border: 1px solid #4a7c59;
      color: #4a7c59;
      padding: 0.25rem 0.6rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .pts-badge.low-stock {
      border-color: #ef4444;
      color: #ef4444;
    }
    .pts-star {
      font-size: 0.85rem;
    }
    .product-info {
      padding: 1.25rem;
    }
    .product-name {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      color: #2e3230;
    }
    .product-brand {
      font-size: 0.85rem;
      color: #777;
      margin: 0 0 1rem 0;
    }
    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .product-price {
      font-size: 1.2rem;
      font-weight: 800;
      color: #4a7c59;
    }
    .product-size {
      font-size: 0.75rem;
      background: #faf9f6;
      border: 1px solid #e5e0d8;
      padding: 0.25rem 0.5rem;
      border-radius: 0.35rem;
      font-weight: 700;
      color: #555;
    }
    .store-footer {
      background: white;
      border-top: 1px solid #e5e0d8;
      padding: 3rem 1.5rem;
      text-align: center;
      margin-top: 4rem;
    }
    .store-footer-inner {
      max-width: 40rem;
      margin: 0 auto;
    }
    .store-contact, .store-address {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      color: #555;
      margin: 0.5rem 0;
    }
    .store-contact span, .store-address span {
      font-size: 1.1rem;
      color: #4a7c59;
    }
    .powered-by {
      margin-top: 1.5rem;
      font-size: 0.85rem;
      color: #999;
    }
    .powered-by strong {
      color: #4a7c59;
    }
  `]
})
export class AppComponent implements OnInit {
  isStoreView = false;
  storeSlug = '';

  constructor(
    private scrollReveal: ScrollRevealService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.scrollReveal.init();

    const hostname = window.location.hostname;
    const path = window.location.pathname;

    if (hostname.endsWith('.katrix.online') && hostname !== 'katrix.online') {
      this.isStoreView = true;
      this.storeSlug = hostname.split('.')[0];
    } else if (path.startsWith('/tienda/')) {
      this.isStoreView = true;
      this.storeSlug = path.substring(8);
    }
  }

  closeAdminView() {
    this.authService.showAdminView = false;
    this.authService.saveSession();
  }
}
