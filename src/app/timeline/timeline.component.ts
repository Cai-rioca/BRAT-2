import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements AfterViewInit {

  decadeData: any = {
    '1920s': [
      {
        description: 'A década de 1920 trouxe a revolução feminina na moda...',
        trends: ['VESTIDOS RETOS', 'CABELO CHANEL', 'PÉROLAS LONGAS', 'SAPATOS T-BAR'],
        image: 'https://placehold.co/600x400/FFD1D1/000000?text=Flapper+1'
      },
      {
        description: 'O estilo flapper era sinônimo de liberdade e ousadia...',
        trends: ['FRANJAS', 'PLUMAS', 'CHAPÉUS CLOCHE', 'CIGARRILHAS'],
        image: 'https://placehold.co/600x400/FFD1D1/000000?text=Flapper+2'
      }
      // Adicione os outros itens da década igual no seu JSON original
    ],
    // 1950s, 1980s, 2000s, 2020s → mesma estrutura do JSON original
  };

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);
    this.createCarousels();
    this.initAnimations();
  }

  private createCarousels() {
    document.querySelectorAll<HTMLElement>('.decade-card').forEach(card => {
      const decade = card.getAttribute('data-decade');
      if (!decade || !this.decadeData[decade]) return;

      const data = this.decadeData[decade];
      const track = card.querySelector<HTMLElement>('.carousel-track')!;
      const descriptionEl = card.querySelector<HTMLElement>('.decade-description')!;
      const trendsEl = card.querySelector<HTMLElement>('.fashion-trends')!;
      let currentIndex = 0;
      let startX = 0;

      // Preenche o carrossel
      data.forEach((style: any) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        const img = document.createElement('img');
        img.src = style.image;
        img.alt = 'Fashion style';
        item.appendChild(img);
        track.appendChild(item);
      });

      const updateCarouselAndContent = () => {
        const itemWidth = track.firstElementChild?.getBoundingClientRect().width || 0;
        gsap.to(track, { x: -currentIndex * itemWidth, duration: 0.5, ease: 'power2.inOut' });

        const currentStyle = data[currentIndex];
        descriptionEl.textContent = currentStyle.description;
        trendsEl.innerHTML = '';
        currentStyle.trends.forEach((trend: string) => {
          const badge = document.createElement('div');
          badge.classList.add('trend-badge');
          badge.textContent = trend;
          trendsEl.appendChild(badge);
        });
      };

      // Swipe - touch events
      track.addEventListener('touchstart', (e: Event) => {
        const touch = e as TouchEvent;
        startX = touch.touches[0].clientX;
      });

      track.addEventListener('touchend', (e: Event) => {
        const touch = e as TouchEvent;
        const diffX = touch.changedTouches[0].clientX - startX;
        if (Math.abs(diffX) > 50) {
          currentIndex = diffX > 0
            ? (currentIndex - 1 + data.length) % data.length
            : (currentIndex + 1) % data.length;
          updateCarouselAndContent();
        }
      });

      // Autoplay
      setInterval(() => {
        currentIndex = (currentIndex + 1) % data.length;
        updateCarouselAndContent();
      }, 5000);

      window.addEventListener('resize', updateCarouselAndContent);
      updateCarouselAndContent();
    });
  }

  private initAnimations() {
    // Hero animations
    gsap.timeline({ delay: 0.5 })
      .to('.hero-title', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    // Timeline items animation
    document.querySelectorAll<HTMLElement>('.timeline-item').forEach(item => {
      const card = item.querySelector<HTMLElement>('.decade-card')!;
      const isLeft = item.classList.contains('left');

      gsap.set(item, { opacity: 0 });
      gsap.set(card, { x: isLeft ? -100 : 100, opacity: 0 });

      ScrollTrigger.create({
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          gsap.timeline()
            .to(item, { opacity: 1, duration: 0.6 })
            .to(card, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3');
        }
      });
    });

    // Floating stars
    document.querySelectorAll<HTMLElement>('.floating-star').forEach((el, i) => {
      gsap.to(el, { rotation: 360, duration: 10 + i * 2, repeat: -1, ease: 'none' });
      gsap.to(el, { y: 'random(-50,50)', x: 'random(-30,30)', duration: 4 + i, repeat: -1, yoyo: true, ease: 'power1.inOut' });
    });

    // Timeline dots hover effect
    document.querySelectorAll<HTMLElement>('.timeline-dot').forEach(dot => {
      dot.addEventListener('mouseenter', () => gsap.to(dot, { scale: 1.5, duration: 0.3, ease: 'back.out(1.7)' }));
      dot.addEventListener('mouseleave', () => gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' }));
    });

    // Card hover effects
    document.querySelectorAll<HTMLElement>('.decade-card').forEach(card => {
      card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' }));
      card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' }));
    });

    // Timeline line progress
    ScrollTrigger.create({
      trigger: '.timeline-container',
      start: 'top center',
      end: 'bottom center',
      onUpdate: self => {
        gsap.to('.timeline-line', { scaleY: self.progress, transformOrigin: 'top center', duration: 0.3, ease: 'none' });
      }
    });
  }
}
