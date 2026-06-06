import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollRevealService {
  private observer: IntersectionObserver | null = null;

  init(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Make all already-rendered elements visible immediately
      this.revealAll();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe elements rendered at boot
    this.observeElements();

    // Re-observe after a short delay to catch elements added by child components
    setTimeout(() => this.observeElements(), 300);
  }

  observeElements(): void {
    if (!this.observer) return;
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      this.observer!.observe(el);
    });
  }

  private revealAll(): void {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
  }
}
