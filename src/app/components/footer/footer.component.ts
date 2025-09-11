import { Component, ElementRef, AfterViewInit, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit {
  prefersReducedMotion = false;
  private scrollingText?: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Detecta se o usuário pediu redução de animação (acessibilidade)
    try {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      this.prefersReducedMotion = false;
    }
  }

  ngAfterViewInit(): void {
    // Busca o elemento .scrolling-text dentro do componente
    this.scrollingText = this.el.nativeElement.querySelector('.scrolling-text');

    if (!this.scrollingText) return;

    // Se for usuário que prefere menos movimento, desliga a animação
    if (this.prefersReducedMotion) {
      this.renderer.setStyle(this.scrollingText, 'animation', 'none');
    } else {
      // Garantia: assegura que a animação esteja rodando por padrão
      this.renderer.setStyle(this.scrollingText, 'animationPlayState', 'running');
    }
  }

  // Chamadas disparadas pelo template via (mouseenter)/(mouseleave)
  onMouseEnter(): void {
    if (this.prefersReducedMotion || !this.scrollingText) return;
    this.renderer.setStyle(this.scrollingText, 'animationPlayState', 'paused');
  }

  onMouseLeave(): void {
    if (this.prefersReducedMotion || !this.scrollingText) return;
    this.renderer.setStyle(this.scrollingText, 'animationPlayState', 'running');
  }
}

