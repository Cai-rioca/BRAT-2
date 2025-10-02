import { Component, ElementRef, AfterViewInit, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit {
  prefersReducedMotion = false;
  private scrollingText?: HTMLElement;
  footerText: string = 'TEXTO PADRÃO';

  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) {}

  ngOnInit(): void {
    // Detecta preferência de animação reduzida
    try {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      this.prefersReducedMotion = false;
    }

    // Atualiza o texto do footer quando a rota muda
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        switch (event.urlAfterRedirects) {
          case '/timeline':
            this.footerText = 'SINTA O PODER DO TEMPO';
            break;
          case '/':
            this.footerText = 'CURTA O SOM DO VINIL';
            break;
            case '/letstalk':
              this.footerText = 'VENHA FALAR CO NÓIXX';
              break;
          case '/about':
            this.footerText = 'SAIBA MAIS SOBRE NÓS';
            break;
          default:
            this.footerText = 'VENHA FUDER SUA VIDA';
        }
      });
  }

  ngAfterViewInit(): void {

    this.scrollingText = this.el.nativeElement.querySelector('.scrolling-text');

    if (!this.scrollingText) return;


    if (this.prefersReducedMotion) {

      this.renderer.setStyle(this.scrollingText, 'animation', 'none');

    } else {

      this.renderer.setStyle(this.scrollingText, 'animationPlayState', 'running');
    }
  }


  onMouseEnter(): void {
    if (this.prefersReducedMotion || !this.scrollingText) return;
    this.renderer.setStyle(this.scrollingText, 'animationPlayState', 'paused');
  }

  onMouseLeave(): void {
    if (this.prefersReducedMotion || !this.scrollingText) return;
    this.renderer.setStyle(this.scrollingText, 'animationPlayState', 'running');
  }
}

