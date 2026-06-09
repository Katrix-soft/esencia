import { Component, AfterViewInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollRevealService } from '../../services/scroll-reveal.service';

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
              <span class="amount">$11.900</span>
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
            <button class="btn-outline active-scale" (click)="openPaymentModal('Semilla', 11900)">Elegir Semilla</button>
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
        <div class="payment-modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">
              <span class="material-symbols-outlined shield-icon">security</span>
              <h3>{{ checkoutStep === 'payment' ? 'Pago Seguro' : 'Cuenta' }}</h3>
            </div>
            <button class="close-btn" (click)="closePaymentModal()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="modal-body">
            
            <!-- Auth Layout -->
            <div *ngIf="checkoutStep === 'login' || checkoutStep === 'register'" class="auth-container">
              <div class="auth-tabs">
                <button [class.active]="checkoutStep === 'login'" (click)="checkoutStep = 'login'">Iniciar Sesión</button>
                <button [class.active]="checkoutStep === 'register'" (click)="checkoutStep = 'register'">Crear Cuenta</button>
              </div>

              <!-- Login Form -->
              <div *ngIf="checkoutStep === 'login'" class="auth-form animate-fade-in">
                <p class="form-instructions">Ingresa a tu cuenta para continuar con la compra.</p>
                <div class="form-group">
                  <label for="loginEmail">Email</label>
                  <input type="email" id="loginEmail" placeholder="tu@email.com" class="form-control">
                </div>
                <div class="form-group">
                  <label for="loginPass">Contraseña</label>
                  <input type="password" id="loginPass" placeholder="••••••••" class="form-control">
                </div>
                <button class="btn-solid form-continue-btn active-scale" (click)="simulateLogin()">
                  Iniciar Sesión y Pagar
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

                <button class="btn-solid form-continue-btn active-scale" 
                        (click)="continueToPayment()" 
                        [disabled]="!customerData.firstName || !customerData.lastName || !customerData.email">
                  Crear Cuenta y Continuar
                </button>
              </div>
            </div>

            <!-- Paso 2: Mercado Pago Brick -->
            <div [style.display]="checkoutStep === 'payment' ? 'block' : 'none'" id="paymentBrick_container">
              <!-- El SDK de Mercado Pago renderizará aquí -->
            </div>

          </div>
          
          <div class="success-overlay" *ngIf="paymentSuccess">
            <span class="material-symbols-outlined check-icon">check_circle</span>
            <h3>¡Pago Exitoso!</h3>
            <p>Gracias por suscribirte al plan {{ selectedPlan }}.</p>
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
    }
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
      padding: 2rem;
      animation: fadeIn 0.3s ease;
    }
    .success-overlay .check-icon {
      font-size: 4rem;
      color: var(--color-primary);
      margin-bottom: 1rem;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .auth-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .auth-tabs {
      display: flex;
      gap: 1.5rem;
      border-bottom: 2px solid var(--color-surface-container-highest);
    }
    .auth-tabs button {
      background: none;
      border: none;
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-on-surface-variant);
      cursor: pointer;
      padding: 0.75rem 0;
      position: relative;
      transition: color 0.3s ease;
      width: auto;
      border-radius: 0;
    }
    .auth-tabs button.active { color: var(--color-primary); }
    .auth-tabs button.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--color-primary);
      border-radius: 3px 3px 0 0;
    }
    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .animate-fade-in { animation: fadeIn 0.3s ease; }
    .form-instructions { color: var(--color-on-surface-variant); font-size: 0.95rem; margin: 0; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-weight: 600; font-size: 0.9rem; color: var(--color-on-background); }
    .form-control {
      padding: 0.75rem 1rem;
      border: 1px solid var(--color-surface-container-highest);
      border-radius: 0.5rem;
      background: var(--color-surface);
      font-size: 1rem;
    }
    .form-control:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(74,124,89,0.1); }
    .form-continue-btn {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background: var(--color-primary) !important;
      color: var(--color-on-primary) !important;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s, opacity 0.2s;
    }
    .form-continue-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .form-continue-btn:not(:disabled):hover { background: var(--color-secondary) !important; }
  `]
})
export class PricingComponent implements AfterViewInit {
  showPaymentModal = false;
  paymentSuccess = false;
  selectedPlan = '';
  selectedAmount = 0;
  paymentBrickController: any;

  checkoutStep: 'login' | 'register' | 'payment' = 'register';
  customerData = {
    firstName: '',
    lastName: '',
    email: ''
  };

  constructor(private scrollReveal: ScrollRevealService) {}
  ngAfterViewInit(): void { this.scrollReveal.observeElements(); }

  openPaymentModal(plan: string, amount: number) {
    this.selectedPlan = plan;
    this.selectedAmount = amount;
    this.showPaymentModal = true;
    this.paymentSuccess = false;
    
    this.checkoutStep = 'register';
    this.customerData = { firstName: '', lastName: '', email: '' };
    
    if (this.paymentBrickController) {
      this.paymentBrickController.unmount();
      this.paymentBrickController = null;
    }
  }

  simulateLogin() {
    this.customerData.firstName = 'Juan';
    this.customerData.lastName = 'Perez';
    this.customerData.email = 'juan@esencia.com';
    this.continueToPayment();
  }

  continueToPayment() {
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

      // Pedimos la llave pública al backend dinámicamente
      const configRes = await fetch('/api/config');
      const configData = await configRes.json();
      const publicKey = configData.publicKey || 'APP_USR-7de37b05-1fe7-4e28-b855-3aaafc4a96f4';

      const mp = new MercadoPago(publicKey, {
        locale: 'es-AR'
      });
      const bricksBuilder = mp.bricks();
      
      const settings = {
        initialization: {
          amount: this.selectedAmount,
          payer: {
            email: "",
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

              fetch("/process_payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...formData,
                  payment_method_type: selectedPaymentMethod,
                  plan_name: this.selectedPlan,
                  plan_price: this.selectedAmount
                })
              })
              .then((response) => response.json())
              .then((data) => {
                const isSuccess = data.status === 'processed' || data.status === 'approved' || data.status === 'in_process';
                const isTicketPending = selectedPaymentMethod === 'ticket' && data.status === 'pending';

                if (isSuccess || isTicketPending) {
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
                             <p>Tu Order ID de prueba es: <strong>${data.id}</strong></p>
                             ${ticketUrl ? `<a href="${ticketUrl}" target="_blank" style="display:inline-block;padding:12px 24px;background:#4a7c59;color:white;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:15px;">Ver Cupón de Pago</a>` : ''}`,
                      confirmButtonColor: '#4a7c59'
                    });
                  } else {
                    Swal.fire({
                      icon: 'success',
                      title: '¡Pago procesado con éxito!',
                      text: `Tu Order ID de prueba es: ${data.id}`,
                      confirmButtonColor: '#4a7c59'
                    });
                  }
                  resolve();
                } else {
                  console.error('Pago rechazado o con error:', data);
                  const errorMsg = data.message || data.status_detail || data.error || 'Error desconocido';
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
}
