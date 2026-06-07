import { Component, HostListener } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="nav-inner">
        <!-- Logo -->
        <div class="logo" (click)="scrollTo('hero')" style="cursor:pointer">
          <img src="assets/logo.png?v=2" alt="Esencia" class="logo-img" />
          <span>Esencia</span>
        </div>

        <!-- Desktop links -->
        <div class="nav-links">
          <a href="#soluciones">Soluciones</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#crm">CRM</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#precios">Precios</a>
        </div>

        <!-- Actions -->
        <div class="nav-actions">
          <button class="icon-btn" aria-label="Buscar" (click)="openSearch()">
            <span class="material-symbols-outlined">search</span>
          </button>
          <button class="icon-btn notif-btn" aria-label="Notificaciones" (click)="showNotif()">
            <span class="material-symbols-outlined">notifications</span>
            <span class="notif-dot" *ngIf="hasNotif"></span>
          </button>
          <button class="icon-btn" aria-label="Perfil" (click)="showProfile()">
            <span class="material-symbols-outlined">person</span>
          </button>
          <button class="btn-primary btn-shimmer active-scale" (click)="scrollTo('precios')">Prueba Gratis</button>
        </div>
      </div>
    </nav>

    <!-- Search Modal -->
    <div class="search-overlay" *ngIf="searchOpen" (click)="closeSearch()">
      <div class="search-box" (click)="$event.stopPropagation()">
        <div class="search-input-wrap">
          <span class="material-symbols-outlined s-icon">search</span>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar sección, funcionalidad..."
            [(ngModel)]="searchQuery"
            (keydown.escape)="closeSearch()"
            (keydown.enter)="handleSearch()"
            autofocus
          />
          <button class="search-close" (click)="closeSearch()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="search-suggestions">
          <div class="suggestion-label">Navegar a</div>
          @for (item of filteredLinks; track item.label) {
          <button class="suggestion-item" (click)="goTo(item.id)">
            <span class="material-symbols-outlined s-item-icon">{{ item.icon }}</span>
            {{ item.label }}
          </button>
          }
          @if (filteredLinks.length === 0) {
          <p class="no-results">Sin resultados para "{{ searchQuery }}"</p>
          }
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast" [class.toast-visible]="toastVisible">
      <span class="material-symbols-outlined toast-icon">{{ toastIcon }}</span>
      {{ toastMsg }}
    </div>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(250,246,240,0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-outline-variant);
      transition: box-shadow 0.3s;
    }
    .navbar.scrolled { box-shadow: 0 4px 20px rgba(46,50,48,0.08); }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 80rem;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      gap: 1.5rem;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: var(--font-headline);
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-primary);
      white-space: nowrap;
    }
    .logo-img {
      height: 5rem;
      width: auto;
      object-fit: contain;
    }
    .nav-links { display: none; gap: 2rem; }
    @media (min-width: 768px) { .nav-links { display: flex; } }
    .nav-links a { font-weight: 600; color: var(--color-on-surface-variant); transition: color 0.2s; }
    .nav-links a:hover { color: var(--color-primary); }
    .nav-actions { display: flex; align-items: center; gap: 0.5rem; }
    .icon-btn {
      display: flex; align-items: center; justify-content: center;
      width: 2.5rem; height: 2.5rem; border-radius: var(--radius-full);
      color: var(--color-secondary); transition: background 0.2s, color 0.2s, transform 0.15s;
      position: relative;
    }
    .icon-btn:hover { background: var(--color-secondary-container); color: var(--color-primary); }
    .icon-btn:active { transform: scale(0.95); }
    .notif-dot {
      position: absolute; top: 6px; right: 6px;
      width: 8px; height: 8px;
      background: var(--color-error); border-radius: 9999px;
      border: 2px solid rgba(250,246,240,0.9);
      animation: pulse-dot 2s infinite;
    }
    @keyframes pulse-dot {
      0%,100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }
    .btn-primary {
      background: var(--color-primary); color: var(--color-on-primary);
      padding: 0.625rem 1.5rem; border-radius: var(--radius-sm);
      font-weight: 700; font-size: 0.9rem;
      transition: background 0.15s, transform 0.15s;
      box-shadow: 0 4px 20px rgba(46,50,48,0.06);
    }
    .btn-primary:hover { background: var(--color-on-primary-fixed-variant); }

    /* Search overlay */
    .search-overlay {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(46,50,48,0.5); backdrop-filter: blur(4px);
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 10vh;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    .search-box {
      background: var(--color-surface-container-lowest);
      border: 1px solid var(--color-surface-container-highest);
      border-radius: 1.5rem;
      width: 100%; max-width: 36rem; margin: 0 1.5rem;
      overflow: hidden;
      box-shadow: 0 30px 60px rgba(46,50,48,0.25);
      animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideDown { from { transform:translateY(-20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
    .search-input-wrap {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-surface-container-highest);
    }
    .s-icon { color: var(--color-on-surface-variant); }
    .search-input {
      flex: 1; border: none; background: none;
      font-family: var(--font-body); font-size: 1rem;
      color: var(--color-on-background); outline: none;
    }
    .search-input::placeholder { color: var(--color-on-surface-variant); }
    .search-close { color: var(--color-on-surface-variant); transition: color 0.2s; }
    .search-close:hover { color: var(--color-primary); }
    .search-suggestions { padding: 0.75rem; }
    .suggestion-label {
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--color-on-surface-variant);
      padding: 0.5rem 0.75rem;
    }
    .suggestion-item {
      display: flex; align-items: center; gap: 0.75rem;
      width: 100%; padding: 0.75rem; border-radius: 0.75rem;
      font-family: var(--font-body); font-weight: 600;
      color: var(--color-on-background); transition: background 0.15s; text-align: left;
    }
    .suggestion-item:hover { background: var(--color-surface-container); color: var(--color-primary); }
    .s-item-icon { color: var(--color-primary); font-size: 1.1rem; }
    .no-results { padding: 1rem; text-align: center; color: var(--color-on-surface-variant); font-size:0.875rem; }

    /* Toast */
    .toast {
      position: fixed; bottom: 2rem; right: 2rem; z-index: 200;
      background: var(--color-inverse-surface); color: var(--color-inverse-on-surface);
      padding: 0.875rem 1.25rem; border-radius: 0.75rem;
      font-weight: 600; font-size: 0.875rem;
      display: flex; align-items: center; gap: 0.5rem;
      box-shadow: 0 8px 30px rgba(46,50,48,0.2);
      opacity: 0; transform: translateY(1rem);
      transition: opacity 0.3s, transform 0.3s;
      pointer-events: none;
    }
    .toast.toast-visible { opacity: 1; transform: translateY(0); }
    .toast-icon { font-size: 1.1rem; }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  searchOpen = false;
  searchQuery = '';
  hasNotif = true;
  toastVisible = false;
  toastMsg = '';
  toastIcon = 'info';
  private toastTimer: any;

  navLinks = [
    { label: 'Soluciones', id: 'soluciones', icon: 'apps' },
    { label: 'Dashboard', id: 'dashboard', icon: 'dashboard' },
    { label: 'CRM Olfativo', id: 'crm', icon: 'hub' },
    { label: 'Catálogo Digital', id: 'catalogo', icon: 'style' },
    { label: 'Demo de la App', id: 'app-showcase', icon: 'phone_iphone' },
    { label: 'Precios', id: 'precios', icon: 'payments' },
  ];

  get filteredLinks() {
    if (!this.searchQuery) return this.navLinks;
    return this.navLinks.filter(l =>
      l.label.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 20; }

  scrollTo(id: string): void {
    if (id === 'hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  openSearch(): void {
    this.searchOpen = true;
    this.searchQuery = '';
  }

  closeSearch(): void { this.searchOpen = false; }

  goTo(id: string): void {
    this.closeSearch();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }

  handleSearch(): void {
    if (this.filteredLinks.length > 0) this.goTo(this.filteredLinks[0].id);
  }

  showNotif(): void {
    this.hasNotif = false;
    this.showToast('notifications', '3 alertas de stock revisadas ✓');
  }

  showProfile(): void {
    this.showToast('person', 'Demo — Inicia sesión para tu perfil completo');
  }

  private showToast(icon: string, msg: string): void {
    this.toastIcon = icon;
    this.toastMsg = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toastVisible = false; }, 3500);
  }
}
