import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
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
    <app-shader-canvas />

    <div class="page-wrapper" *ngIf="!authService.showAdminView">
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

    <div class="admin-wrapper" *ngIf="authService.showAdminView">
      <app-admin (onBackToStore)="closeAdminView()" />
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
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private scrollReveal: ScrollRevealService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // ScrollRevealService initialises the IntersectionObserver after view is ready
    this.scrollReveal.init();
  }

  closeAdminView() {
    this.authService.showAdminView = false;
    this.authService.saveSession();
  }
}
