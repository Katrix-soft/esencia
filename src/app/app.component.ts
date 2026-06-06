import { Component, OnInit } from '@angular/core';
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
import { ScrollRevealService } from './services/scroll-reveal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
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
  ],
  template: `
    <app-shader-canvas />

    <div class="page-wrapper">
      <app-navbar />
      <main>
        <app-hero />
        <app-bento />
        <app-soluciones />
        <app-dashboard />
        <app-crm />
        <app-catalog />
        <app-app-showcase />
        <app-testimonials />
        <app-pricing />
        <app-cta-final />
      </main>
      <app-footer />
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
  `]
})
export class AppComponent implements OnInit {
  constructor(private scrollReveal: ScrollRevealService) {}

  ngOnInit(): void {
    // ScrollRevealService initialises the IntersectionObserver after view is ready
    this.scrollReveal.init();
  }
}
