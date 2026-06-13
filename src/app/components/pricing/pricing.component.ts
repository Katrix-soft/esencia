import { environment } from '../../../environments/environment';
import { Component, AfterViewInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollRevealService } from '../../services/scroll-reveal.service';
import { AuthService } from '../../services/auth.service';

declare var MercadoPago: any;
declare var Swal: any;

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <section class="pricing-section" id="precios">
      <div class="dots-bg"></div>
      <div class="section-inner">

        <!-- Header -->
        <div class="section-header animate-on-scroll">
          <h2>Inversión que Crece Contigo</h2>
          <p>Planes transparentes, sin costos ocultos. Diseñados para perfumerías de todos los tamaños.</p>
        </div>

        <!-- Cards -->
        <div class="pricing-grid">

          <!-- Semilla -->
          <div class="pricing-card animate-on-scroll">
            <div class="card-header">
              <h3>Semilla</h3>
              <p>Para emprendedores y perfumerías boutique iniciando su camino.</p>
            </div>
            <div class="price">
              <span class="amount">$20</span>
              <span class="period">/mes</span>
            </div>
            <ul class="features">
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Catálogo Básico (hasta 15 productos)
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Gestión de Stock Simple
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                CRM Estándar
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Datos seguros
              </li>
            </ul>
            <button class="btn-outline active-scale" (click)="openPaymentModal('Semilla', 20)">Elegir Semilla</button>
          </div>

          <!-- Flor (featured) -->
          <div class="pricing-card featured animate-on-scroll delay-100">
            <div class="popular-badge">MÁS POPULAR</div>
            <div class="card-header">
              <h3 class="featured-title">Flor</h3>
              <p class="featured-sub">Para perfumerías establecidas buscando optimizar y escalar.</p>
            </div>
            <div class="price">
              <span class="amount featured-amount">$20.999</span>
              <span class="period featured-period">/mes</span>
            </div>
            <ul class="features">
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">Catálogo Ilimitado</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">CRM Olfativo Avanzado</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">Gestión de Decants Pro</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">Alarmas Predictivas de Stock</span>
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                <span class="featured-li">Datos seguros</span>
              </li>
            </ul>
            <button class="btn-solid btn-shimmer active-scale" (click)="openPaymentModal('Flor', 20999)">Comenzar con Flor</button>
          </div>

          <!-- Extracto -->
          <div class="pricing-card animate-on-scroll delay-200">
            <div class="card-header">
              <h3>Extracto</h3>
              <p>La solución definitiva con Inteligencia Artificial para líderes del mercado.</p>
            </div>
            <div class="price">
              <span class="amount">$35.000</span>
              <span class="period">/mes</span>
            </div>
            <ul class="features">
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Todo lo del plan Flor
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Asistente de IA Integrado
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Analítica de Tendencias
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Marketing Automatizado
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Datos seguros
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Soporte 24/7
              </li>
              <li>
                <span class="material-symbols-outlined check">check_circle</span>
                Actualizaciones gratis
              </li>
            </ul>
            <button class="btn-outline active-scale" (click)="openPaymentModal('Extracto', 35000)">Elegir Extracto</button>
          </div>

        </div>
      </div>

      <!-- Payment Modal -->
      <div class="payment-modal-overlay" *ngIf="showPaymentModal" (click)="closePaymentModal()">
        <div class="payment-modal-box" [style.background]="checkoutStep === 'payment' ? '#ffffff' : ''" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">
              <span class="material-symbols-outlined shield-icon">security</span>
              <h3>{{ checkoutStep === 'payment' ? 'Pago Seguro' : 'Cuenta' }}</h3>
            </div>
            <button class="close-btn" (click)="closePaymentModal()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="modal-body" [class.no-padding]="checkoutStep === 'payment'">
            
            <!-- Auth Layout -->
            <div *ngIf="checkoutStep === 'login' || checkoutStep === 'register'" class="auth-container">
              <div class="auth-tabs">
                <button [class.active]="checkoutStep === 'login'" (click)="checkoutStep = 'login'">Iniciar Sesión</button>
                <button [class.active]="checkoutStep === 'register'" (click)="checkoutStep = 'register'">Crear Cuenta</button>
              </div>

              <!-- Login Form -->
              <div *ngIf="checkoutStep === 'login'" class="auth-form animate-fade-in">
                <p class="form-instructions">Ingresa a tu cuenta para gestionar tu negocio o continuar con la compra.</p>
                <div class="form-group">
                  <label for="loginEmail">Email</label>
                  <input type="email" id="loginEmail" [(ngModel)]="loginEmail" placeholder="tu@email.com" class="form-control">
                </div>
                <div class="form-group">
                  <label for="loginPass">Contraseña</label>
                  <input type="password" id="loginPass" [(ngModel)]="loginPassword" placeholder="••••••••" class="form-control">
                </div>
                <button class="btn-solid form-continue-btn active-scale" (click)="simulateLogin()" [disabled]="!loginEmail">
                  Iniciar Sesión
                </button>
              </div>

              <!-- Register Form -->
              <div *ngIf="checkoutStep === 'register'" class="auth-form animate-fade-in">
                <p class="form-instructions">Crea tu cuenta en Esencia para gestionar tu negocio.</p>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName">Nombre</label>
                    <input type="text" id="firstName" [(ngModel)]="customerData.firstName" placeholder="Ej. Juan" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="lastName">Apellido</label>
                    <input type="text" id="lastName" [(ngModel)]="customerData.lastName" placeholder="Ej. Perez" class="form-control">
                  </div>
                </div>

                <div class="form-group">
                  <label for="regEmail">Email</label>
                  <input type="email" id="regEmail" [(ngModel)]="customerData.email" placeholder="tu@email.com" class="form-control">
                </div>
                <div class="form-group">
                  <label for="regPass">Contraseña</label>
                  <input type="password" id="regPass" placeholder="Mínimo 8 caracteres" class="form-control">
                </div>

                <div class="form-group">
                  <label for="storeName">Nombre de tu Tienda</label>
                  <input type="text" id="storeName" [(ngModel)]="customerData.storeName" (ngModelChange)="onStoreNameChange($event)" placeholder="Ej. Mi Perfumería" class="form-control">
                </div>

                <button class="btn-solid form-continue-btn active-scale" 
                        (click)="continueToPayment()" 
                        [disabled]="!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.storeName">
                  Crear Cuenta y Continuar
                </button>
              </div>
            </div>

            <!-- Paso 2: Mercado Pago Brick -->
            <div [style.display]="(checkoutStep === 'payment' && !paymentSuccess) ? 'block' : 'none'" id="paymentBrick_container">
              <!-- El SDK de Mercado Pago renderizará aquí -->
            </div>

          </div>
          
          <div class="success-overlay" *ngIf="paymentSuccess">
            <span class="material-symbols-outlined check-icon animate-bounce">check_circle</span>
            <h3 class="success-title">¡Tu Tienda está Lista!</h3>
            <p class="success-subtitle">Hemos procesado el pago y aprovisionado tu espacio digital.</p>
            
            <div class="onboarding-details-card">
              <div class="details-card-header">
                <span class="material-symbols-outlined">key</span>
                <h4>Detalles de Acceso</h4>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Nombre de la Tienda</span>
                <span class="detail-value highlight-value">{{ customerData.storeName || authService.storeInfo.name }}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Enlace Público</span>
                <div class="detail-value-wrapper">
                  <a class="store-link" href="http://{{ onboardingDetails.storeUrl }}" target="_blank">
                    {{ onboardingDetails.storeUrl }}
                    <span class="material-symbols-outlined open-icon">open_in_new</span>
                  </a>
                </div>
              </div>

              <div class="detail-divider"></div>
              
              <div class="detail-row">
                <span class="detail-label">Usuario (Email)</span>
                <span class="detail-value">{{ authService.email }}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Contraseña Temporal</span>
                <div class="password-badge-container">
                  <code class="temp-password">{{ onboardingDetails.tempPassword }}</code>
                  <button class="btn-copy-mini" (click)="copyTempPassword()" title="Copiar Contraseña">
                    <span class="material-symbols-outlined">content_copy</span>
                  </button>
                </div>
              </div>
            </div>
            
            <button class="btn-panel-submit active-scale" (click)="enterAdminPanel()">
              <span>Ir al Panel de Control</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .pricing-section {
      position: relative;
      padding: 6rem 1.5rem;
    }
    .dots-bg {
      position: absolute;
      inset: 0;
      opacity: 0.03;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234a7c59' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
    }
    .section-inner {
      max-width: 80rem;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
    .section-header {
      text-align: center;
      max-width: 48rem;
      margin: 0 auto 4rem;
    }
    .section-header h2 {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 700;
      color: var(--color-on-background);
      margin-bottom: 1rem;
    }
    .section-header p {
      font-size: 1.1rem;
      color: var(--color-on-surface-variant);
    }
    .pricing-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: center;
    }
    @media (min-width: 768px) {
      .pricing-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .pricing-card {
      background: rgba(250,246,240,0.9);
      backdrop-filter: blur(4px);
      border: 1px solid var(--color-surface-container-highest);
      border-radius: 1.5rem;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0 4px 20px rgba(46,50,48,0.04);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }
    .pricing-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(46,50,48,0.12);
    }
    .pricing-card.featured {
      background: rgba(120,168,134,0.95);
      border: 2px solid var(--color-primary);
      box-shadow: 0 10px 30px rgba(74,124,89,0.15);
      transform: translateY(-1rem);
    }
    .pricing-card.featured:hover { transform: translateY(calc(-1rem - 8px)); }
    .popular-badge {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 0.25rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    .featured-title, .featured-amount, .featured-period, .featured-sub, .featured-li {
      color: var(--color-on-primary) !important;
    }
    .featured .check { color: rgba(255,255,255,0.9) !important; }
    .card-header { margin-bottom: 2rem; }
    .card-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-on-background);
      margin-bottom: 0.5rem;
    }
    .card-header p {
      font-size: 0.95rem;
      color: var(--color-on-surface-variant);
      line-height: 1.5;
    }
    .price {
      margin-bottom: 2rem;
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }
    .amount {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-on-background);
      letter-spacing: -0.02em;
    }
    .period {
      color: var(--color-on-surface-variant);
      font-weight: 500;
    }
    .features {
      list-style: none;
      padding: 0;
      margin: 0 0 2.5rem 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .features li {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.95rem;
      color: var(--color-on-background);
      line-height: 1.4;
    }
    .check {
      color: var(--color-primary);
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    button {
      width: 100%;
      padding: 1rem;
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-outline {
      background: transparent;
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
    }
    .btn-outline:hover { background: rgba(74,124,89,0.05); }
    .btn-solid {
      background: var(--color-on-primary);
      color: var(--color-primary);
      border: none;
    }
    .btn-solid:hover {
      background: var(--color-surface);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .btn-shimmer {
      position: relative;
      overflow: hidden;
    }
    .btn-shimmer::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        to right,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.3) 50%,
        rgba(255,255,255,0) 100%
      );
      transform: rotate(30deg);
      animation: shimmer 3s infinite;
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%) rotate(30deg); }
      100% { transform: translateX(100%) rotate(30deg); }
    }
    .payment-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.3s ease;
    }
    .payment-modal-box {
      background: var(--color-surface);
      border-radius: 1.5rem;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      position: relative;
      transition: background-color 0.3s ease;
    }
    .payment-modal-box::-webkit-scrollbar { width: 6px; }
    .payment-modal-box::-webkit-scrollbar-track { background: transparent; }
    .payment-modal-box::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    .payment-modal-box::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--color-surface-container-highest);
    }
    .modal-title { display: flex; align-items: center; gap: 0.5rem; }
    .shield-icon { color: var(--color-primary); font-size: 1.2rem; }
    .modal-title h3 { font-weight: 700; font-size: 1.1rem; margin: 0; }
    .close-btn {
      background: none; border: none; cursor: pointer; color: var(--color-on-surface-variant);
      display: flex; align-items: center; justify-content: center;
    }
    .modal-body { padding: 1.5rem; min-height: 300px; }
    .modal-body.no-padding { padding: 0; background: #ffffff; border-radius: 0 0 1.5rem 1.5rem; }
    .success-overlay {
      position: absolute;
      inset: 0;
      background: var(--color-surface);
      border-radius: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      z-index: 10;
      padding: 2.25rem 2rem;
      animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
      overflow-y: auto;
    }
    .success-overlay .check-icon {
      font-size: 3.8rem;
      color: var(--color-primary);
      margin-bottom: 0.75rem;
      filter: drop-shadow(0 4px 8px rgba(74,124,89,0.15));
    }
    .success-title {
      font-family: var(--font-headline);
      font-size: 1.6rem;
      color: var(--color-on-background);
      font-weight: 700;
      margin-bottom: 0.35rem;
    }
    .success-subtitle {
      color: var(--color-on-surface-variant);
      font-size: 0.95rem;
      margin-bottom: 1.25rem;
      line-height: 1.4;
      max-width: 90%;
    }
    .onboarding-details-card {
      background: #faf8f5;
      border: 1px solid #e2ded7;
      border-radius: 1.25rem;
      padding: 1.25rem;
      width: 100%;
      text-align: left;
      box-sizing: border-box;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 12px rgba(46,50,48,0.02);
    }
    .details-card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid #e8e4dc;
      padding-bottom: 0.5rem;
      color: var(--color-primary);
    }
    .details-card-header span {
      font-size: 1.2rem;
    }
    .details-card-header h4 {
      margin: 0;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.02em;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0.6rem 0;
      font-size: 0.9rem;
      gap: 1rem;
    }
    .detail-divider {
      height: 1px;
      background: #e8e4dc;
      margin: 0.8rem 0;
    }
    .detail-label {
      color: var(--color-on-surface-variant);
      font-weight: 600;
      font-size: 0.85rem;
    }
    .detail-value {
      color: var(--color-on-background);
      font-weight: 700;
    }
    .detail-value.highlight-value {
      color: var(--color-primary);
    }
    .detail-value-wrapper {
      display: flex;
      align-items: center;
    }
    .store-link {
      color: var(--color-primary) !important;
      font-weight: 700;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      transition: opacity 0.2s ease;
    }
    .store-link:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
    .store-link .open-icon {
      font-size: 0.95rem;
    }
    .password-badge-container {
      display: flex;
      align-items: center;
      background: #eae7e0;
      padding: 0.2rem 0.5rem 0.2rem 0.75rem;
      border-radius: 0.5rem;
      gap: 0.5rem;
      border: 1px solid #dcd8d0;
    }
    .temp-password {
      font-family: monospace;
      font-size: 0.9rem;
      font-weight: 700;
      color: #2e3230;
      letter-spacing: 0.05em;
    }
    .btn-copy-mini {
      background: none;
      border: none;
      padding: 0.2rem;
      cursor: pointer;
      color: #6b6358;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
      transition: background 0.2s, color 0.2s;
    }
    .btn-copy-mini:hover {
      background: rgba(0,0,0,0.05);
      color: var(--color-primary);
    }
    .btn-copy-mini span {
      font-size: 1rem;
    }
    .btn-panel-submit {
      width: 100%;
      padding: 1rem;
      border-radius: 0.75rem;
      background: var(--color-primary);
      color: white;
      border: none;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(74,124,89,0.25);
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }
    .btn-panel-submit:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(74,124,89,0.35);
      background: #3e6b4b;
    }
    .btn-panel-submit span {
      font-size: 1rem;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .auth-container { display: flex; flex-direction: column; gap: 1.5rem; padding: 0.5rem 0; }
    .auth-tabs {
      display: flex;
      background: #f3f4f6;
      border-radius: var(--radius-full);
      padding: 0.35rem;
      gap: 0;
    }
    .auth-tabs button {
      flex: 1;
      background: transparent;
      border: none;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--color-on-surface-variant);
      cursor: pointer;
      padding: 0.75rem 0;
      border-radius: var(--radius-full);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .auth-tabs button.active { 
      background: white;
      color: var(--color-primary);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    }
    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; padding-top: 0.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .animate-fade-in { animation: fadeIn 0.4s ease; }
    .form-instructions { color: var(--color-on-surface-variant); font-size: 0.95rem; margin: 0 0 0.5rem 0; line-height: 1.5; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { font-weight: 600; font-size: 0.85rem; color: var(--color-on-background); letter-spacing: 0.02em; }
    .form-control {
      padding: 0.85rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      background: #f9fafb;
      font-size: 0.95rem;
      color: #111827;
      transition: all 0.2s ease;
      box-sizing: border-box;
      width: 100%;
    }
    .form-control::placeholder { color: #9ca3af; }
    .form-control:focus { 
      outline: none; 
      background: white;
      border-color: var(--color-primary); 
      box-shadow: 0 0 0 4px rgba(74,124,89,0.1); 
    }
    .form-continue-btn {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: var(--color-primary) !important;
      color: var(--color-on-primary) !important;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(74,124,89,0.2);
    }
    .form-continue-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
    .form-continue-btn:not(:disabled):hover { 
      background: var(--color-secondary) !important; 
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(74,124,89,0.3);
    }
  `]
})
export class PricingComponent implements AfterViewInit {
  showPaymentModal = false;
  paymentSuccess = false;
  selectedPlan = '';
  selectedAmount = 0;
  paymentBrickController: any;

  plans: any[] = [];
  plansLoading = true;

  checkoutStep: 'login' | 'register' | 'payment' = 'register';
  customerData = {
    firstName: '',
    lastName: '',
    email: '',
    storeName: '',
    storeSlug: ''
  };
  loginEmail = '';
  loginPassword = '';
  onboardingDetails = {
    tempPassword: '',
    storeUrl: '',
    storeSlug: '',
    storeName: ''
  };

  constructor(
    private scrollReveal: ScrollRevealService,
    public authService: AuthService
  ) {
    this.authService.openLoginModalEmitter.subscribe(() => {
      this.openPaymentModal('Plan Semilla', 11900);
      this.checkoutStep = 'login';
    });
  }

  ngAfterViewInit(): void {
    this.scrollReveal.observeElements();
    fetch(`${environment.apiUrl}/api/plans`)
      .then(r => r.json())
      .then(data => { this.plans = data; this.plansLoading = false; })
      .catch(() => { this.plansLoading = false; });
  }

  openPaymentModal(plan: string, amount: number) {
    this.selectedPlan = plan;
    this.selectedAmount = amount;
    this.showPaymentModal = true;
    this.paymentSuccess = false;
    
    this.checkoutStep = 'register';
    this.customerData = { firstName: '', lastName: '', email: '', storeName: '', storeSlug: '' };
    this.loginEmail = '';
    this.loginPassword = '';
    this.onboardingDetails = { tempPassword: '', storeUrl: '', storeSlug: '', storeName: '' };
    
    if (this.paymentBrickController) {
      this.paymentBrickController.unmount();
      this.paymentBrickController = null;
    }
  }

  onStoreNameChange(name: string) {
    this.customerData.storeSlug = name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  enterAdminPanel() {
    this.authService.showAdminView = true;
    this.authService.saveSession();
    this.closePaymentModal();
  }

  copyTempPassword() {
    if (!this.onboardingDetails.tempPassword) return;
    navigator.clipboard.writeText(this.onboardingDetails.tempPassword).then(() => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Contraseña copiada',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  async simulateLogin() {
    if (!this.loginEmail) return;
    
    const hasAlreadyPaid = await this.authService.login(this.loginEmail);
    
    if (hasAlreadyPaid) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: '¡Sesión Iniciada!',
          text: 'Redirigiendo a tu panel de administración...',
          timer: 1500,
          showConfirmButton: false
        });
      }
      setTimeout(() => {
        this.closePaymentModal();
      }, 1500);
    } else {
      // Si no pagó, completamos sus datos y abrimos la pasarela de Mercado Pago
      this.customerData.firstName = this.authService.firstName;
      this.customerData.lastName = this.authService.lastName || 'Cliente';
      this.customerData.email = this.authService.email;
      this.continueToPayment();
    }
  }

  continueToPayment() {
    if (this.checkoutStep === 'register') {
      this.authService.register(
        this.customerData.firstName,
        this.customerData.lastName,
        this.customerData.email,
        this.customerData.storeName,
        this.customerData.storeSlug
      );
    }
    
    this.checkoutStep = 'payment';
    
    setTimeout(() => {
      this.initMercadoPagoBrick();
    }, 100);
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    if (this.paymentBrickController) {
      this.paymentBrickController.unmount();
      this.paymentBrickController = null;
    }
  }

  async initMercadoPagoBrick() {
    try {
      if (!window.hasOwnProperty('MercadoPago')) {
        console.error('MercadoPago SDK not loaded');
        return;
      }

      if (this.paymentBrickController) {
        try {
          await this.paymentBrickController.unmount();
        } catch (unmountErr) {
          console.warn('Error unmounting existing brick:', unmountErr);
        }
        this.paymentBrickController = null;
      }

      // Pedimos la llave pública al backend dinámicamente con fallback robusto
      let publicKey = 'APP_USR-7de37b05-1fe7-4e28-b855-3aaafc4a96f4';
      try {
        const configRes = await fetch(`${environment.apiUrl}/api/config`);
        const configData = await configRes.json();
        if (configData && configData.publicKey) {
          publicKey = configData.publicKey;
        }
      } catch (fetchErr) {
        console.warn('⚠️ No se pudo obtener la llave pública del backend. Usando fallback.', fetchErr);
      }

      const mp = new MercadoPago(publicKey, {
        locale: 'es-AR'
      });
      const bricksBuilder = mp.bricks();
      
      const settings = {
        initialization: {
          amount: this.selectedAmount,
          payer: {
            email: this.customerData.email || "",
          },
        },
        customization: {
          visual: {
            style: {
              theme: 'default',
            },
          },
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            ticket: 'all',
            maxInstallments: 1,
          },
        },
        callbacks: {
          onReady: () => {
            // callback llamado cuando Brick esté listo
          },
          onSubmit: ({ selectedPaymentMethod, formData }: any) => {
            // callback llamado cuando el usuario haga clic en el botón enviar los datos
            return new Promise<void>((resolve, reject) => {
              
              // Inyectamos el nombre y apellido recolectado en el Paso 1
              if (!formData.payer) formData.payer = {};
              formData.payer.first_name = this.customerData.firstName;
              formData.payer.last_name = this.customerData.lastName;
              formData.payer.email = this.customerData.email;

              fetch(`${environment.apiUrl}/process_payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...formData,
                  payment_method_type: selectedPaymentMethod,
                  plan_name: this.selectedPlan,
                  plan_price: this.selectedAmount,
                  store_name: this.customerData.storeName || this.authService.storeInfo.name,
                  store_slug: this.customerData.storeSlug || this.authService.storeInfo.slug
                })
              })
              .then((response) => response.json())
              .then((data) => {
                const isSuccess = data.status === 'processed' || data.status === 'approved' || data.status === 'in_process';
                const isTicketPending = selectedPaymentMethod === 'ticket' && data.status === 'pending';

                if (isSuccess || isTicketPending) {
                  this.authService.markAsPaid();
                  this.onboardingDetails = {
                    tempPassword: data.tempPassword || 'Esencia_Temporal_Pass',
                    storeUrl: data.storeUrl || `http://${this.customerData.storeSlug}.katrix.com.ar`,
                    storeSlug: data.storeSlug || this.customerData.storeSlug,
                    storeName: data.storeName || this.customerData.storeName
                  };
                  this.authService.updateStoreInfo({
                    name: this.onboardingDetails.storeName,
                    slug: this.onboardingDetails.storeSlug
                  });
                  this.paymentSuccess = true;
                  
                  if (selectedPaymentMethod === 'ticket') {
                    // Extraer url del cupón
                    let ticketUrl = data.external_resource_url;
                    if (!ticketUrl && data.payments && data.payments.length > 0) {
                      ticketUrl = data.payments[0].external_resource_url;
                    }
                    if (!ticketUrl && data.transactions?.payments?.length > 0) {
                      ticketUrl = data.transactions.payments[0].external_resource_url;
                    }
                    
                    Swal.fire({
                      icon: 'info',
                      title: '¡Cupón generado con éxito!',
                      html: `<p>Para completar tu suscripción de <strong>${this.selectedPlan}</strong>, debes abonar en Rapipago o Pago Fácil.</p>
                             <p>Tu Order ID es: <strong>${data.id}</strong></p>
                             ${ticketUrl ? `<a href="${ticketUrl}" target="_blank" style="display:inline-block;padding:12px 24px;background:#4a7c59;color:white;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:15px;">Ver Cupón de Pago</a>` : ''}`,
                      confirmButtonColor: '#4a7c59'
                    });
                  } else {
                    Swal.fire({
                      icon: 'success',
                      title: '¡Pago procesado con éxito!',
                      text: `Tu Order ID es: ${data.id}`,
                      confirmButtonColor: '#4a7c59'
                    });
                  }
                  
                  resolve();
                } else {
                  console.error('Pago rechazado o con error:', data);
                  const errorMsg = this.getMercadoPagoMessage(data.status, data.status_detail);
                  Swal.fire({
                    icon: 'error',
                    title: 'El pago no pudo ser procesado',
                    text: errorMsg,
                    confirmButtonColor: '#d33'
                  });
                  reject();
                }
              })
              .catch((error) => {
                console.error('Error enviando pago:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Ocurrió un error',
                  text: 'No se pudo conectar con el servidor para procesar el pago.',
                  confirmButtonColor: '#d33'
                });
                reject();
              });
            });
          },
          onError: (error: any) => {
            console.error('MP Brick Error:', error);
          },
        },
      };

      this.paymentBrickController = await bricksBuilder.create(
        'payment',
        'paymentBrick_container',
        settings
      );
    } catch (e) {
      console.error('Error al inicializar MP:', e);
    }
  }

  private getMercadoPagoMessage(status: string, statusDetail: string): string {
    const dictionary: { [key: string]: string } = {
      // Reembolsos y Cancelaciones
      'partially_refunded': 'La transacción fue procesada con éxito y una parte del monto fue reembolsada.',
      'refunded': 'La orden ha sido reembolsada. El monto ha sido devuelto íntegramente al pagador.',
      'cancelled': 'La transacción fue cancelada y no será procesada.',
      
      // Contracargos
      'in_process_charged_back': 'La transacción ha sufrido un contracargo y está en proceso de evaluación.',
      'settled': 'La transacción ha sufrido un contracargo y el monto fue reembolsado.',
      'reimbursed': 'La transacción ha sufrido un contracargo y el monto fue acreditado al vendedor.',
      
      // Rechazos por tarjeta o banco
      'bad_filled_card_data': 'La transacción falló debido a datos de la tarjeta completados incorrectamente (ej. número de la tarjeta, CVV, fecha de vencimiento).',
      'invalid_card_token': 'La transacción falló debido a un token de tarjeta inválido.',
      'rejected_by_issuer': 'La transacción falló debido a un rechazo por parte del banco emisor de la tarjeta.',
      'required_call_for_authorize': 'La transacción falló porque se requiere una llamada para autorización. El banco exige una verificación adicional.',
      'card_disabled': 'La transacción falló debido a que la tarjeta está desactivada o bloqueada por el banco emisor.',
      
      // Rechazos de límite y saldo
      'insufficient_amount': 'La transacción falló debido a un monto insuficiente. El saldo disponible no cubre el monto de la transacción.',
      'card_insufficient_amount': 'La tarjeta elegida para la transacción no tiene fondos suficientes.',
      'amount_limit_exceeded': 'La transacción falló debido a que se excedió el límite de monto permitido por tu tarjeta.',
      'max_attempts_exceeded': 'La transacción falló debido a que se excedió el número máximo de intentos permitidos.',
      
      // Otros fallos
      'high_risk': 'La transacción falló debido a un alto riesgo detectado por el sistema de seguridad.',
      'processing_error': 'La transacción falló debido a un error de procesamiento o un problema técnico en el sistema.',
      'invalid_installments': 'La transacción falló debido a cuotas inválidas. El número de cuotas seleccionadas no es aceptado por el emisor.',
      
      // Expiración y 3DS
      'expired': 'La transacción ha expirado debido a que no se completó dentro del tiempo límite.',
      '3ds_challenge_expired': 'La transacción falló debido a la expiración del tiempo para completar la autenticación 3DS.',
      'pending_challenge': 'Transacción pendiente de autenticación. Posees hasta 40 minutos para completarlo.',
      
      // Action required
      'waiting_payment': 'La transacción requiere una acción adicional y está esperando el pago.',
      'waiting_capture': 'El pago ha sido autorizado pero está esperando ser capturado.',
      'waiting_transfer': 'La transacción está esperando la transferencia de los fondos.',
      
      // Revisiones
      'pending_review_manual': 'La transacción está en curso pero requiere una evaluación manual antes de continuar.',
      'in_review': 'El pago está en análisis automático de riesgo y prevención de fraudes. No se requiere ninguna acción por ahora.'
    };

    // Algunos details pueden sobreescribirse si comparten nombre pero distinto status, 
    // pero el dictionary cubre la mayoría de status_detail específicos.
    if (dictionary[statusDetail]) {
      return dictionary[statusDetail];
    }
    
    // Fallbacks generales por status
    if (status === 'rejected' || status === 'failed') {
      return 'El pago fue rechazado. Verifica los datos de tu tarjeta o contacta a tu banco.';
    }

    return statusDetail || 'Ocurrió un error desconocido al procesar el pago.';
  }
}
