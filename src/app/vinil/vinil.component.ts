import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Declara a variável global do SoundCloud para o TypeScript não reclamar
declare var SC: any;

@Component({
  selector: 'app-vinil',
  // standalone: true, // Se for um componente standalone, mantenha esta linha
  imports: [RouterModule],
  templateUrl: './vinil.component.html',
  styleUrls: ['./vinil.component.css']
})
export class VinilComponent implements AfterViewInit {
  // @ViewChild pega a referência do <iframe> do template (#vinilPlayer)
  @ViewChild('vinilPlayer') vinilPlayerFrame!: ElementRef;

  // Lista de músicas com URLs da API, não do player
  tracks = [
    { url: "https://api.soundcloud.com/tracks/293", name: "Mellow Sunrise", artist: "Forss", description: "Smooth electronic vibes.", cover: "https://i1.sndcdn.com/artworks-000000000000-0-t500x500.jpg" },
    { url: 'https://api.soundcloud.com/tracks/63684984', name: 'Como tá a mente da palhasona', artist: 'LOFIHOUSEBOY', description: 'Uma vibe introspectiva com batidas suaves.', cover: 'https://i1.sndcdn.com/artworks-zLy3tY21u0c3-0-t500x500.jpg' },
    { url: "https://api.soundcloud.com/tracks/1123049251", name: "YaSuKe 弥助", artist: "Sim Production", description: "Futuristic soundscape blending traditional and modern.", cover: "https://i1.sndcdn.com/artworks-WQGncTCPSeYOVdtC-Ucf2zg-t500x500.jpg" },
    { url: "https://api.soundcloud.com/tracks/1967183415", name: "Swamp Festival", artist: "DJ Gator AIDS", description: "Underground electronic beats with experimental sound.", cover: "https://i1.sndcdn.com/artworks-WcVRnt3QHm0mzgp3-8O03yw-t500x500.jpg" }
  ];

  // Propriedades para controlar o estado do player
  trackIndex = 0;
  widget: any;
  isPlaying = false;
  currentVolume = 100;
  currentTrack = this.tracks[this.trackIndex]; // Guarda a música atual
  safeUrlForInitialTrack: SafeResourceUrl; // URL segura para a primeira música

  constructor(private sanitizer: DomSanitizer, private zone: NgZone) {
    // Cria uma URL segura apenas para a primeira música carregar no iframe
    const initialUrl = `https://w.soundcloud.com/player/?url=${this.tracks[0].url}`;
    this.safeUrlForInitialTrack = this.sanitizer.bypassSecurityTrustResourceUrl(initialUrl);
  }

  ngAfterViewInit(): void {
    // Animações GSAP (continuam iguais)
    gsap.to('.main-title', { opacity: 1, y: 0, duration: 1, delay: 0.3 });
    gsap.to('.vinyl-container', { opacity: 1, x: 0, duration: 1, delay: 0.6 });
    gsap.to('.arrow-circle', { opacity: 1, duration: 1, delay: 1 });

    this.initializePlayer();
    this.initArrow();
  }

  initializePlayer(): void {
    // Espera o SC e o elemento do iframe estarem prontos
    if (typeof SC === 'undefined' || !this.vinilPlayerFrame?.nativeElement) {
      setTimeout(() => this.initializePlayer(), 100);
      return;
    }

    this.widget = SC.Widget(this.vinilPlayerFrame.nativeElement);
    this.bindWidgetEvents();
  }

  bindWidgetEvents(): void {
    this.widget.bind(SC.Widget.Events.READY, () => {
      console.log('Player pronto!');
      this.widget.setVolume(this.currentVolume / 100);
    });

    // Usamos NgZone para garantir que o Angular atualize a tela quando um evento do SC acontecer
    this.widget.bind(SC.Widget.Events.PLAY, () => {
      this.zone.run(() => { this.isPlaying = true; });
    });

    this.widget.bind(SC.Widget.Events.PAUSE, () => {
      this.zone.run(() => { this.isPlaying = false; });
    });

    this.widget.bind(SC.Widget.Events.FINISH, () => {
      this.zone.run(() => { this.nextTrack(); }); // Pula para a próxima quando a música acaba
    });
  }

  loadTrack(index: number, autoPlay: boolean): void {
    this.trackIndex = index;
    this.currentTrack = this.tracks[index];

    // Anima a troca de informações
    gsap.fromTo(['.track-name', '.artist-name', '.description', '.vinyl-center img'],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }
    );

    // Carrega a nova música no widget
    this.widget.load(this.tracks[index].url, {
      auto_play: autoPlay
    });

    if (!autoPlay) {
      this.isPlaying = false;
    }
  }

  // --- MÉTODOS DE CONTROLE CHAMADOS PELO HTML ---

  togglePlayPause(): void {
    this.widget.toggle();
  }

  prevTrack(): void {
    const newIndex = (this.trackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack(newIndex, true);
  }

  nextTrack(): void {
    const newIndex = (this.trackIndex + 1) % this.tracks.length;
    this.loadTrack(newIndex, true);
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.currentVolume = Number(target.value);
    this.widget.setVolume(this.currentVolume / 100);
  }

  // Animação da seta (continua igual)
  initArrow(): void {
    const arrowCircle = document.querySelector('.arrow-circle');
    if (!arrowCircle) return;
    arrowCircle.addEventListener('mouseenter', () => gsap.to(arrowCircle, { scale: 1.1, duration: 0.3 }));
    arrowCircle.addEventListener('mouseleave', () => gsap.to(arrowCircle, { scale: 1, duration: 0.3 }));
    arrowCircle.addEventListener('click', () => gsap.to(arrowCircle, { rotation: "+=360", duration: 0.6, ease: "power2.out" }));
  }
}
