import { Injectable } from '@angular/core';

export interface StoreInfo {
  name: string;
  description: string;
  slug: string;
  phone: string;
  email: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private STORAGE_KEY = 'esencia_session';

  isLoggedIn = false;
  hasPaid = false;
  showAdminView = false;
  firstName = '';
  lastName = '';
  email = '';
  
  storeInfo: StoreInfo = {
    name: 'Mi Perfumería Esencia',
    description: 'Fragancias exclusivas y decants seleccionados.',
    slug: 'mi-perfumeria',
    phone: '+54 11 9876-5432',
    email: 'admin@perfumeria.com',
    address: 'Av. Alvear 1850, CABA, Argentina'
  };

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    try {
      const dataStr = localStorage.getItem(this.STORAGE_KEY);
      if (dataStr) {
        const data = JSON.parse(dataStr);
        this.isLoggedIn = !!data.isLoggedIn;
        this.hasPaid = !!data.hasPaid;
        this.showAdminView = !!data.showAdminView;
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.email = data.email || '';
        if (data.storeInfo) {
          this.storeInfo = { ...this.storeInfo, ...data.storeInfo };
        }
      }
    } catch (e) {
      console.error('Error loading session from localStorage', e);
    }
  }

  saveSession() {
    try {
      const data = {
        isLoggedIn: this.isLoggedIn,
        hasPaid: this.hasPaid,
        showAdminView: this.showAdminView,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        storeInfo: this.storeInfo
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving session to localStorage', e);
    }
  }

  login(email: string): boolean {
    this.email = email;
    this.isLoggedIn = true;
    
    // Si inicia sesión con admin@perfumeria.com, simulamos que YA pagó
    if (email.toLowerCase() === 'admin@perfumeria.com') {
      this.hasPaid = true;
      this.showAdminView = true;
      this.firstName = 'Admin';
      this.lastName = 'Esencia';
      this.storeInfo.email = email;
    } else {
      // Para cualquier otro email
      this.hasPaid = false;
      this.showAdminView = false;
      this.firstName = email.split('@')[0];
      this.lastName = '';
      this.storeInfo.email = email;
    }
    
    this.saveSession();
    return this.hasPaid;
  }

  register(firstName: string, lastName: string, email: string, storeName?: string, storeSlug?: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.isLoggedIn = true;
    this.hasPaid = false; // Requiere pagar
    this.showAdminView = false;
    this.storeInfo.email = email;
    this.storeInfo.name = storeName || `Perfumería de ${firstName}`;
    this.storeInfo.slug = storeSlug || firstName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    this.saveSession();
  }

  markAsPaid() {
    this.hasPaid = true;
    this.saveSession();
  }

  updateStoreInfo(info: Partial<StoreInfo>) {
    this.storeInfo = { ...this.storeInfo, ...info };
    this.saveSession();
  }

  logout() {
    this.isLoggedIn = false;
    this.hasPaid = false;
    this.showAdminView = false;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
