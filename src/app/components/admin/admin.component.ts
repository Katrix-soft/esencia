import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, StoreInfo } from '../../services/auth.service';

declare var Swal: any;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-panel animate-fade-in">
      <!-- Sidebar / Navigation -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <img src="assets/Esencia.webp" alt="Esencia Logo" class="sidebar-logo" />
          <span class="badge-premium">PLAN {{ authService.email === 'admin@perfumeria.com' ? 'FLOR' : 'SEMILLA' }}</span>
        </div>

        <nav class="sidebar-menu">
          <button [class.active]="activeTab === 'general'" (click)="activeTab = 'general'">
            <span class="material-symbols-outlined">settings</span>
            Mi Tienda
          </button>
          <button [class.active]="activeTab === 'catalog'" (click)="activeTab = 'catalog'">
            <span class="material-symbols-outlined">category</span>
            Catálogo
          </button>
          <button [class.active]="activeTab === 'stats'" (click)="activeTab = 'stats'">
            <span class="material-symbols-outlined">query_stats</span>
            Estadísticas
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="user-profile">
            <span class="material-symbols-outlined user-avatar">account_circle</span>
            <div class="user-info">
              <span class="user-name">{{ authService.firstName }} {{ authService.lastName }}</span>
              <span class="user-email">{{ authService.email }}</span>
            </div>
          </div>
          <button class="btn-logout" (click)="logout()">
            <span class="material-symbols-outlined">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="admin-main">
        <!-- Top Navbar -->
        <header class="admin-header">
          <div class="header-left">
            <h1>Panel de Administración</h1>
            <p class="subtitle">Gestiona tu perfumería digital y visualiza tu rendimiento</p>
          </div>
          <div class="header-right">
            <button class="btn-store active-scale" (click)="goToStore()">
              <span class="material-symbols-outlined">open_in_new</span>
              Ver Tienda Pública
            </button>
          </div>
        </header>

        <!-- Tab contents -->
        <div class="content-container">
          
          <!-- Tab 1: General Info -->
          <div *ngIf="activeTab === 'general'" class="tab-content animate-slide-up">
            <div class="card settings-card">
              <div class="card-header">
                <h2>Información de tu Tienda</h2>
                <p>Personaliza los datos básicos que verán tus clientes en el catálogo.</p>
              </div>

              <form (submit)="saveSettings($event)" class="settings-form">
                <div class="form-grid">
                  <div class="form-group">
                    <label for="storeName">Nombre de la Tienda</label>
                    <input type="text" id="storeName" [(ngModel)]="editableInfo.name" name="name" class="form-control" required>
                  </div>
                  <div class="form-group">
                    <label for="storeSlug">Link personalizado (subdominio)</label>
                    <div class="input-addon-wrapper">
                      <input type="text" id="storeSlug" [(ngModel)]="editableInfo.slug" name="slug" class="form-control slug-input" required>
                      <span class="input-suffix">.katrix.online</span>
                    </div>
                  </div>
                  <div class="form-group span-2">
                    <label for="storeDesc">Descripción / Eslogan</label>
                    <textarea id="storeDesc" [(ngModel)]="editableInfo.description" name="description" rows="3" class="form-control" required></textarea>
                  </div>
                  <div class="form-group">
                    <label for="storePhone">Teléfono de Contacto</label>
                    <input type="text" id="storePhone" [(ngModel)]="editableInfo.phone" name="phone" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="storeEmail">Email de la Tienda</label>
                    <input type="email" id="storeEmail" [(ngModel)]="editableInfo.email" name="email" class="form-control" required>
                  </div>
                  <div class="form-group span-2">
                    <label for="storeAddr">Dirección Física</label>
                    <input type="text" id="storeAddr" [(ngModel)]="editableInfo.address" name="address" class="form-control">
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn-save active-scale" [disabled]="!isDirty()">
                    <span class="material-symbols-outlined">save</span>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>

            <!-- Shop Link Info Card -->
            <div class="card promo-card">
              <div class="promo-icon">
                <span class="material-symbols-outlined">storefront</span>
              </div>
              <div class="promo-text">
                <h3>¡Tu tienda está online!</h3>
                <p>Cualquier persona puede ver tu catálogo e interactuar en: <strong>{{ authService.storeInfo.slug }}.katrix.online</strong></p>
              </div>
              <button class="btn-copy-link" (click)="copyStoreLink()">
                <span class="material-symbols-outlined">content_copy</span>
                Copiar Enlace
              </button>
            </div>
          </div>

          <!-- Tab 2: Catalog list -->
          <div *ngIf="activeTab === 'catalog'" class="tab-content animate-slide-up">
            <div class="card table-card">
              <div class="table-header">
                <div>
                  <h2>Tus Productos ({{ mockProducts.length }})</h2>
                  <p>Listado de perfumes y decants cargados en tu catálogo.</p>
                </div>
                <button class="btn-add-product" (click)="addProduct()">
                  <span class="material-symbols-outlined">add</span>
                  Agregar Perfume
                </button>
              </div>

              <div class="table-responsive">
                <table class="products-table">
                  <thead>
                    <tr>
                      <th>Perfume</th>
                      <th>Marca</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let product of mockProducts">
                      <td>
                        <div class="product-name-cell">
                          <span class="material-symbols-outlined p-avatar">filter_vintage</span>
                          <div>
                            <span class="p-name">{{ product.name }}</span>
                            <span class="p-volume">{{ product.volume }}</span>
                          </div>
                        </div>
                      </td>
                      <td>{{ product.brand }}</td>
                      <td>
                        <span class="category-badge">{{ product.category }}</span>
                      </td>
                      <td class="p-price">\${{ product.price | number:'1.0-0' }}</td>
                      <td>
                        <span class="stock-indicator" [class.low-stock]="product.stock < 5">
                          {{ product.stock }} u.
                        </span>
                      </td>
                      <td>
                        <div class="action-buttons">
                          <button class="action-btn edit" (click)="editProduct(product)" title="Editar">
                            <span class="material-symbols-outlined">edit</span>
                          </button>
                          <button class="action-btn delete" (click)="deleteProduct(product)" title="Eliminar">
                            <span class="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Tab 3: Stats -->
          <div *ngIf="activeTab === 'stats'" class="tab-content animate-slide-up">
            <!-- Stats overview cards -->
            <div class="stats-overview-grid">
              <div class="stat-card green-soft">
                <div class="stat-icon">
                  <span class="material-symbols-outlined">payments</span>
                </div>
                <div class="stat-data">
                  <span class="stat-label">Ventas acumuladas</span>
                  <span class="stat-number">$154,200</span>
                  <span class="stat-sub text-green">
                    <span class="material-symbols-outlined text-icon">trending_up</span>
                    +18% esta semana
                  </span>
                </div>
              </div>

              <div class="stat-card beige-soft">
                <div class="stat-icon">
                  <span class="material-symbols-outlined">group</span>
                </div>
                <div class="stat-data">
                  <span class="stat-label">Visitas a tu Tienda</span>
                  <span class="stat-number">1,420</span>
                  <span class="stat-sub text-green">
                    <span class="material-symbols-outlined text-icon">trending_up</span>
                    +5% hoy
                  </span>
                </div>
              </div>

              <div class="stat-card amber-soft">
                <div class="stat-icon">
                  <span class="material-symbols-outlined">shopping_cart</span>
                </div>
                <div class="stat-data">
                  <span class="stat-label">Conversión</span>
                  <span class="stat-number">3.2%</span>
                  <span class="stat-sub">Tasa promedio</span>
                </div>
              </div>
            </div>

            <!-- Charts container -->
            <div class="stats-charts-row">
              <div class="card chart-card">
                <h2>Rendimiento de Ventas (Últimos 6 meses)</h2>
                <p>Montos procesados de suscripciones y ventas directas.</p>
                <div class="bar-chart-container">
                  <div class="chart-y-axis">
                    <span>$40k</span>
                    <span>$30k</span>
                    <span>$20k</span>
                    <span>$10k</span>
                    <span>0</span>
                  </div>
                  <div class="chart-bars-wrap">
                    <div class="bar-col">
                      <div class="bar-fill" style="height: 40%"></div>
                      <span class="bar-lbl">Ene</span>
                    </div>
                    <div class="bar-col">
                      <div class="bar-fill" style="height: 60%"></div>
                      <span class="bar-lbl">Feb</span>
                    </div>
                    <div class="bar-col">
                      <div class="bar-fill" style="height: 50%"></div>
                      <span class="bar-lbl">Mar</span>
                    </div>
                    <div class="bar-col">
                      <div class="bar-fill" style="height: 80%"></div>
                      <span class="bar-lbl">Abr</span>
                    </div>
                    <div class="bar-col">
                      <div class="bar-fill" style="height: 70%"></div>
                      <span class="bar-lbl">May</span>
                    </div>
                    <div class="bar-col active-bar">
                      <div class="bar-fill" style="height: 95%"></div>
                      <span class="bar-lbl">Jun</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card notes-card">
                <h2>Distribución por Categorías</h2>
                <div class="pie-sim">
                  <div class="pie-chart-mock">
                    <div class="pie-slice p1"></div>
                    <div class="pie-slice p2"></div>
                    <div class="pie-slice p3"></div>
                    <div class="pie-center"></div>
                  </div>
                  <div class="pie-labels">
                    <div class="label-item">
                      <span class="dot-indicator" style="background:#4a7c59"></span>
                      <span>Floral (45%)</span>
                    </div>
                    <div class="label-item">
                      <span class="dot-indicator" style="background:#705c30"></span>
                      <span>Amaderado (35%)</span>
                    </div>
                    <div class="label-item">
                      <span class="dot-indicator" style="background:#c4a66a"></span>
                      <span>Cítrico (20%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-panel {
      display: flex;
      min-height: 100vh;
      background: #f7f5f0;
      font-family: var(--font-body);
      color: #333;
    }
    
    /* Sidebar styling */
    .admin-sidebar {
      width: 280px;
      background: #faf6f0;
      border-right: 1px solid #e5e0d8;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      flex-shrink: 0;
    }
    .sidebar-header {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      align-items: center;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e5e0d8;
    }
    .sidebar-logo {
      height: 4.5rem;
      mix-blend-mode: multiply;
    }
    .badge-premium {
      background: #4a7c59;
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.75rem;
      border-radius: 99px;
      letter-spacing: 0.05em;
    }
    .sidebar-menu {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-grow: 1;
    }
    .sidebar-menu button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.95rem;
      color: #555;
      width: 100%;
      text-align: left;
      transition: all 0.2s;
    }
    .sidebar-menu button:hover {
      background: #f0ece4;
      color: #4a7c59;
    }
    .sidebar-menu button.active {
      background: #4a7c59;
      color: #fff;
    }
    .sidebar-footer {
      border-top: 1px solid #e5e0d8;
      padding-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-avatar {
      font-size: 2.2rem;
      color: #8c857b;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .user-name {
      font-weight: 700;
      font-size: 0.9rem;
      color: #2e3230;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .user-email {
      font-size: 0.75rem;
      color: #777;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.75rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: #ef4444;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: #fef2f2;
      border-color: #fee2e2;
    }

    /* Main Area styling */
    .admin-main {
      flex-grow: 1;
      padding: 2.5rem;
      overflow-y: auto;
      height: 100vh;
      box-sizing: border-box;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid #e5e0d8;
      padding-bottom: 1.5rem;
    }
    .admin-header h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #2e3230;
      margin-bottom: 0.25rem;
    }
    .subtitle {
      color: #666;
      font-size: 0.95rem;
    }
    .btn-store {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #4a7c59;
      color: #fff;
      padding: 0.75rem 1.25rem;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(74,124,89,0.15);
      transition: all 0.2s;
    }
    .btn-store:hover {
      background: #3c6548;
    }

    /* Cards */
    .content-container {
      max-width: 1000px;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .card {
      background: #fff;
      border: 1px solid #e5e0d8;
      border-radius: 1.25rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.02);
    }
    .card-header {
      margin-bottom: 1.5rem;
    }
    .card-header h2 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #2e3230;
      margin-bottom: 0.25rem;
    }
    .card-header p {
      color: #777;
      font-size: 0.9rem;
    }

    /* Forms */
    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-group.span-2 {
      grid-column: span 2;
    }
    .form-group label {
      font-weight: 700;
      font-size: 0.85rem;
      color: #444;
      letter-spacing: 0.02em;
    }
    .form-control {
      padding: 0.8rem 1rem;
      border: 1px solid #dcdad5;
      border-radius: 0.75rem;
      background: #fafaf9;
      font-size: 0.95rem;
      font-family: var(--font-body);
      color: #222;
      transition: all 0.2s;
    }
    .form-control:focus {
      outline: none;
      border-color: #4a7c59;
      background: #fff;
      box-shadow: 0 0 0 4px rgba(74,124,89,0.1);
    }
    .input-addon-wrapper {
      display: flex;
      border: 1px solid #dcdad5;
      border-radius: 0.75rem;
      overflow: hidden;
      background: #fafaf9;
    }
    .input-prefix {
      background: #f1ede6;
      border-right: 1px solid #dcdad5;
      padding: 0 0.85rem;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: #666;
      font-weight: 600;
      user-select: none;
    }
    .input-suffix {
      background: #f1ede6;
      border-left: 1px solid #dcdad5;
      padding: 0 0.85rem;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: #666;
      font-weight: 600;
      user-select: none;
    }
    .slug-input {
      border: none !important;
      flex-grow: 1;
      border-radius: 0 !important;
      background: transparent !important;
    }
    .slug-input:focus {
      box-shadow: none !important;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid #f0ece4;
      padding-top: 1.25rem;
    }
    .btn-save {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #4a7c59;
      color: #fff;
      padding: 0.8rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(74,124,89,0.15);
      transition: all 0.2s;
    }
    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }

    /* Promo Card */
    .promo-card {
      background: rgba(74,124,89,0.05);
      border: 1px dashed rgba(74,124,89,0.3);
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .promo-icon {
      background: #4a7c59;
      color: #fff;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .promo-icon span {
      font-size: 2rem;
    }
    .promo-text {
      flex-grow: 1;
    }
    .promo-text h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2a6038;
      margin-bottom: 0.25rem;
    }
    .promo-text p {
      color: #4a5a4e;
      font-size: 0.9rem;
    }
    .btn-copy-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #fff;
      border: 1px solid #cbd5e1;
      color: #334155;
      padding: 0.6rem 1.25rem;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-copy-link:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }

    /* Product Table Card */
    .table-card {
      padding: 1.5rem 0 0 0;
      overflow: hidden;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.5rem 1.5rem 1.5rem;
      border-bottom: 1px solid #f0ece4;
    }
    .table-header h2 {
      font-size: 1.3rem;
      font-weight: 700;
    }
    .table-header p {
      color: #777;
      font-size: 0.85rem;
    }
    .btn-add-product {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #4a7c59;
      color: #fff;
      padding: 0.6rem 1.2rem;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.85rem;
      box-shadow: 0 4px 10px rgba(74,124,89,0.1);
      transition: all 0.2s;
    }
    .btn-add-product:hover {
      background: #3c6548;
    }
    .table-responsive {
      width: 100%;
      overflow-x: auto;
    }
    .products-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .products-table th {
      background: #faf9f6;
      color: #555;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f0ece4;
    }
    .products-table td {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f0ece4;
      font-size: 0.9rem;
      color: #444;
      vertical-align: middle;
    }
    .product-name-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .p-avatar {
      background: #f0ede6;
      color: #705c30;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    .p-name {
      display: block;
      font-weight: 700;
      color: #2e3230;
    }
    .p-volume {
      font-size: 0.75rem;
      color: #777;
    }
    .category-badge {
      background: #f0e8db;
      color: #5e5548;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
    }
    .p-price {
      font-weight: 700;
      color: #2e3230;
    }
    .stock-indicator {
      font-weight: 600;
      color: #4a7c59;
    }
    .stock-indicator.low-stock {
      color: #b83230;
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .action-btn {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .action-btn span {
      font-size: 1.15rem;
    }
    .action-btn.edit {
      border: 1px solid #cbd5e1;
      color: #475569;
    }
    .action-btn.edit:hover {
      background: #f1f5f9;
    }
    .action-btn.delete {
      border: 1px solid #fee2e2;
      color: #ef4444;
    }
    .action-btn.delete:hover {
      background: #fef2f2;
    }

    /* Stats view */
    .stats-overview-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      border-radius: 1.25rem;
      border: 1px solid rgba(0,0,0,0.04);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.01);
    }
    .stat-card.green-soft { background: #e8f5e9; }
    .stat-card.beige-soft { background: #faf3e8; }
    .stat-card.amber-soft { background: #fef8e7; }
    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.03);
    }
    .stat-icon span {
      font-size: 1.5rem;
    }
    .green-soft .stat-icon span { color: #4a7c59; }
    .beige-soft .stat-icon span { color: #705c30; }
    .amber-soft .stat-icon span { color: #c4a66a; }
    .stat-data {
      display: flex;
      flex-direction: column;
    }
    .stat-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-number {
      font-size: 1.75rem;
      font-weight: 800;
      color: #2e3230;
      line-height: 1.2;
      margin: 0.15rem 0;
    }
    .stat-sub {
      font-size: 0.75rem;
      color: #777;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .stat-sub.text-green {
      color: #2e6038;
      font-weight: 700;
    }
    .text-icon {
      font-size: 0.95rem;
    }

    /* Charts Row */
    .stats-charts-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    .chart-card {
      display: flex;
      flex-direction: column;
    }
    .chart-card h2, .notes-card h2 {
      font-size: 1.15rem;
      font-weight: 700;
    }
    .chart-card p {
      font-size: 0.85rem;
      color: #777;
      margin-bottom: 2rem;
    }
    .bar-chart-container {
      display: flex;
      gap: 1rem;
      height: 200px;
      padding-top: 1rem;
    }
    .chart-y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #888;
      font-size: 0.75rem;
      text-align: right;
      width: 30px;
      padding-bottom: 20px;
    }
    .chart-bars-wrap {
      flex-grow: 1;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 100%;
      border-bottom: 1px solid #e2e8f0;
      border-left: 1px solid #e2e8f0;
      padding: 0 1rem;
    }
    .bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 35px;
      height: 100%;
      justify-content: flex-end;
      position: relative;
    }
    .bar-fill {
      width: 100%;
      background: #cbd5e1;
      border-radius: 4px 4px 0 0;
      transition: height 1s ease-out;
    }
    .bar-col:hover .bar-fill {
      background: #78a886;
    }
    .active-bar .bar-fill {
      background: #4a7c59;
    }
    .bar-lbl {
      font-size: 0.7rem;
      color: #777;
      margin-top: 0.5rem;
      position: absolute;
      bottom: -20px;
    }

    /* Pie Simulator */
    .pie-sim {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      height: 100%;
      padding: 1.5rem 0;
    }
    .pie-chart-mock {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(
        #4a7c59 0% 45%,
        #705c30 45% 80%,
        #c4a66a 80% 100%
      );
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .pie-center {
      position: absolute;
      top: 25px;
      left: 25px;
      width: 70px;
      height: 70px;
      background: #fff;
      border-radius: 50%;
    }
    .pie-labels {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    .label-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #555;
    }
    .dot-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(15px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-slide-up { animation: slideUp 0.3s ease-out; }
  `]
})
export class AdminComponent implements OnInit {
  @Output() onBackToStore = new EventEmitter<void>();

  activeTab: 'general' | 'catalog' | 'stats' = 'general';
  
  editableInfo: StoreInfo = {
    name: '',
    description: '',
    slug: '',
    phone: '',
    email: '',
    address: ''
  };

  get mockProducts(): any[] {
    return this.authService.mockProducts;
  }
  set mockProducts(val: any[]) {
    this.authService.mockProducts = val;
    this.authService.saveSession();
  }

  saveProducts() {
    this.authService.saveSession();
  }

  windowOrigin = window.location.origin;

  getHostPrefix(): string {
    return window.location.host + '/tienda/';
  }

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.editableInfo = { ...this.authService.storeInfo };
  }

  isDirty(): boolean {
    return (
      this.editableInfo.name !== this.authService.storeInfo.name ||
      this.editableInfo.description !== this.authService.storeInfo.description ||
      this.editableInfo.slug !== this.authService.storeInfo.slug ||
      this.editableInfo.phone !== this.authService.storeInfo.phone ||
      this.editableInfo.email !== this.authService.storeInfo.email ||
      this.editableInfo.address !== this.authService.storeInfo.address
    );
  }

  saveSettings(event: Event) {
    event.preventDefault();
    if (!this.editableInfo.name || !this.editableInfo.slug || !this.editableInfo.email) {
      return;
    }
    
    // Convertir el slug a un formato seguro de URL
    this.editableInfo.slug = this.editableInfo.slug.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    this.authService.updateStoreInfo(this.editableInfo);
    
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'La información de tu tienda ha sido actualizada.',
        confirmButtonColor: '#4a7c59'
      });
    } else {
      alert('Información de tienda actualizada.');
    }
  }

  copyStoreLink() {
    const link = `http://${this.authService.storeInfo.slug}.katrix.online`;
    navigator.clipboard.writeText(link).then(() => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Enlace copiado al portapapeles',
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        alert('Enlace copiado.');
      }
    });
  }

  goToStore() {
    const link = `http://${this.authService.storeInfo.slug}.katrix.online`;
    window.open(link, '_blank');
  }

  logout() {
    this.authService.logout();
    this.onBackToStore.emit();
  }

  addProduct() {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Agregar Nuevo Perfume',
        html: `
          <input id="swal-pname" class="swal2-input" placeholder="Nombre del perfume" style="font-size: 0.95rem;">
          <input id="swal-brand" class="swal2-input" placeholder="Marca" style="font-size: 0.95rem;">
          <select id="swal-category" class="swal2-input" style="font-size: 0.95rem;">
            <option value="Floral">Floral</option>
            <option value="Amaderado">Amaderado</option>
            <option value="Cítrico">Cítrico</option>
            <option value="Especiado">Especiado</option>
          </select>
          <input id="swal-price" type="number" class="swal2-input" placeholder="Precio ($)" style="font-size: 0.95rem;">
          <input id="swal-stock" type="number" class="swal2-input" placeholder="Stock inicial" style="font-size: 0.95rem;">
          <input id="swal-vol" class="swal2-input" placeholder="Volumen (ej. 100ml)" style="font-size: 0.95rem;">
        `,
        focusConfirm: false,
        confirmButtonText: 'Crear',
        confirmButtonColor: '#4a7c59',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          return {
            name: (document.getElementById('swal-pname') as HTMLInputElement).value,
            brand: (document.getElementById('swal-brand') as HTMLInputElement).value,
            category: (document.getElementById('swal-category') as HTMLSelectElement).value,
            price: Number((document.getElementById('swal-price') as HTMLInputElement).value),
            stock: Number((document.getElementById('swal-stock') as HTMLInputElement).value),
            volume: (document.getElementById('swal-vol') as HTMLInputElement).value
          }
        }
      }).then((result: any) => {
        if (result.isConfirmed && result.value) {
          const v = result.value;
          if (!v.name || !v.price) {
            Swal.fire('Error', 'El nombre y precio son obligatorios', 'error');
            return;
          }
          this.mockProducts.push({
            id: Date.now(),
            name: v.name,
            brand: v.brand || 'Esencia',
            category: v.category,
            price: v.price,
            stock: v.stock || 0,
            volume: v.volume || '100ml'
          });
          this.saveProducts();
          Swal.fire('¡Creado!', 'El perfume fue agregado al catálogo.', 'success');
        }
      });
    } else {
      const name = prompt('Nombre del perfume:');
      if (name) {
        this.mockProducts.push({
          id: Date.now(),
          name: name,
          brand: 'Esencia',
          category: 'Floral',
          price: 15000,
          stock: 10,
          volume: '100ml'
        });
        this.saveProducts();
      }
    }
  }

  editProduct(product: any) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Editar Perfume',
        html: `
          <label style="text-align:left; display:block; font-size:0.8rem; font-weight:700; margin:10px 20px 0 20px;">Nombre</label>
          <input id="swal-pname" class="swal2-input" value="${product.name}" style="margin-top:2px;">
          <label style="text-align:left; display:block; font-size:0.8rem; font-weight:700; margin:10px 20px 0 20px;">Precio</label>
          <input id="swal-price" type="number" class="swal2-input" value="${product.price}" style="margin-top:2px;">
          <label style="text-align:left; display:block; font-size:0.8rem; font-weight:700; margin:10px 20px 0 20px;">Stock</label>
          <input id="swal-stock" type="number" class="swal2-input" value="${product.stock}" style="margin-top:2px;">
        `,
        focusConfirm: false,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#4a7c59',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          return {
            name: (document.getElementById('swal-pname') as HTMLInputElement).value,
            price: Number((document.getElementById('swal-price') as HTMLInputElement).value),
            stock: Number((document.getElementById('swal-stock') as HTMLInputElement).value)
          }
        }
      }).then((result: any) => {
        if (result.isConfirmed && result.value) {
          const v = result.value;
          product.name = v.name || product.name;
          product.price = v.price;
          product.stock = v.stock;
          this.saveProducts();
          Swal.fire('¡Actualizado!', 'El producto fue modificado.', 'success');
        }
      });
    } else {
      const newPrice = prompt('Nuevo precio:', product.price.toString());
      if (newPrice) {
        product.price = Number(newPrice);
        this.saveProducts();
      }
    }
  }

  deleteProduct(product: any) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `Vas a eliminar "${product.name}" de tu catálogo.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#cbd5e1',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.mockProducts = this.mockProducts.filter(p => p.id !== product.id);
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        }
      });
    } else {
      if (confirm(`¿Eliminar ${product.name}?`)) {
        this.mockProducts = this.mockProducts.filter(p => p.id !== product.id);
      }
    }
  }
}
