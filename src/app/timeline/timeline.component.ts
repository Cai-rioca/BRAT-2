import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DecadeData {
  id: string;
  number: string;
  title: string;
  description: string;
  trends: string[];
  image: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timelineTrack', { static: true }) timelineTrack!: ElementRef;
  @ViewChild('timelineDots', { static: true }) timelineDots!: ElementRef;

  currentIndex = 0;
  itemWidth = 390; // 350px + 40px gap
  visibleItems = 1;
  autoPlayInterval: any;
  
  decadeData: DecadeData[] = [
    {
      id: '1920s',
      number: '1920s',
      title: 'Era do Jazz',
      description: 'A revolução feminina na moda com vestidos retos, cabelos à la garçonne e o estilo flapper que simbolizava liberdade e modernidade.',
      trends: ['Vestidos Retos', 'Cabelo Chanel', 'Pérolas Longas', 'Sapatos T-Bar'],
      image: 'https://images.unsplash.com/photo-1594736797933-d0701ba02e93?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: '1950s',
      number: '1950s',
      title: 'New Look',
      description: 'Christian Dior revoluciona a moda com o New Look, trazendo de volta a feminilidade com cinturas marcadas e saias amplas.',
      trends: ['New Look', 'Cintura Marcada', 'Saias Godê', 'Pin-up Style'],
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: '1980s',
      number: '1980s',
      title: 'Power Dressing',
      description: 'A década do excesso com ombros marcados, cores neon, e o power dressing que representava a ascensão feminina no mundo corporativo.',
      trends: ['Power Suits', 'Cores Neon', 'Ombreiras', 'Leg Warmers'],
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: '2000s',
      number: '2000s',
      title: 'Era Digital',
      description: 'O início do millennium trouxe experimentação extrema com baixa cintura, metalics, e a influência da cultura pop e da tecnologia.',
      trends: ['Low Rise', 'Metallic', 'Cargo Pants', 'Chunky Highlights'],
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: '2020s',
      number: '2020s',
      title: 'Sustentabilidade',
      description: 'A moda consciente ganha força com foco na sustentabilidade, upcycling e a democratização através das redes sociais.',
      trends: ['Sustainable', 'Cottagecore', 'Y2K Revival', 'Gender Neutral'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center'
    }
  ];

  ngAfterViewInit(): void {
    this.initTimeline();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    this.removeEventListeners();
  }

  private initTimeline(): void {
    this.visibleItems = this.getVisibleItems();
    this.createDots();
    this.bindEvents();
    this.updatePosition();
    this.handleResize();
    this.startAutoPlay();
  }

  private getVisibleItems(): number {
    const containerWidth = window.innerWidth - 80; // padding
    return Math.floor(containerWidth / this.itemWidth);
  }

  private createDots(): void {
    const dotsContainer = this.timelineDots.nativeElement;
    dotsContainer.innerHTML = '';
    
    this.decadeData.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  private bindEvents(): void {
    // Touch/Swipe support
    let startX = 0;
    let isDragging = false;

    const track = this.timelineTrack.nativeElement;

    const touchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const touchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
    };

    const touchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      isDragging = false;
    };

    // Keyboard navigation
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    };

    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchmove', touchMove);
    track.addEventListener('touchend', touchEnd);
    document.addEventListener('keydown', keyDown);

    // Store references for cleanup
    track.removeEventListeners = () => {
      track.removeEventListener('touchstart', touchStart);
      track.removeEventListener('touchmove', touchMove);
      track.removeEventListener('touchend', touchEnd);
      document.removeEventListener('keydown', keyDown);
    };
  }

  private removeEventListeners(): void {
    const track = this.timelineTrack.nativeElement;
    if (track.removeEventListeners) {
      track.removeEventListeners();
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = Math.max(0, Math.min(index, this.decadeData.length - 1));
    this.updatePosition();
    this.stopAutoPlay(); // Stop autoplay on manual interaction
  }

  nextSlide(): void {
    if (this.currentIndex < this.decadeData.length - 1) {
      this.currentIndex++;
      this.updatePosition();
    } else {
      // Loop back to first slide
      this.currentIndex = 0;
      this.updatePosition();
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updatePosition();
    } else {
      // Loop to last slide
      this.currentIndex = this.decadeData.length - 1;
      this.updatePosition();
    }
  }

  private updatePosition(): void {
    // Center the current item
    const offset = -this.currentIndex * this.itemWidth + (window.innerWidth / 2) - (this.itemWidth / 2);
    const track = this.timelineTrack.nativeElement;
    track.style.transform = `translateX(${offset}px)`;

    // Update active states
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
      item.classList.toggle('active', index === this.currentIndex);
    });

    // Update dots
    const dots = this.timelineDots.nativeElement.querySelectorAll('.dot');
    dots.forEach((dot: Element, index: number) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  private handleResize(): void {
    window.addEventListener('resize', () => {
      this.visibleItems = this.getVisibleItems();
      this.updatePosition();
    });
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  onMouseEnter(): void {
    this.stopAutoPlay();
  }

  onMouseLeave(): void {
    this.startAutoPlay();
  }

  get isPrevDisabled(): boolean {
    return false; // Always enabled for looping
  }

  get isNextDisabled(): boolean {
    return false; // Always enabled for looping
  }
}