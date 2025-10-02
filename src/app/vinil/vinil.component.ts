import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var SC: any;

@Component({
  selector: 'app-vinil',
  imports: [RouterModule],
  templateUrl: './vinil.component.html',
  styleUrls: ['./vinil.component.css']
})
export class VinilComponent implements AfterViewInit {
  safeTracks: SafeResourceUrl[] = [];
  tracks = [
    {
      url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/293",
      name: "Mellow Sunrise",
      artist: "Forss",
      description: "Smooth electronic vibes that transport you to another dimension.",
      cover: "https://i1.sndcdn.com/artworks-000000000000-0-t500x500.jpg"
    },
    {
      url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/6368498459a54de591f8af20098edcad',
      name: 'Como tá a mente da palhasona (eu)',
      artist: 'LOFIHOUSEBOY',
      description: 'Uma vibe introspectiva com batidas suaves.',
      cover: 'https://i1.sndcdn.com/artworks-000000000000-0-t500x500.jpg'
    },
    {
      url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1123049251",
      name: "YaSuKe 弥助",
      artist: "Sim Production",
      description: "Futuristic soundscape blending traditional and modern elements.",
      cover: "https://i1.sndcdn.com/artworks-WQGncTCPSeYOVdtC-Ucf2zg-t500x500.jpg"
    },
    {
      url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967183415",
      name: "Swamp Festival",
      artist: "DJ Gator AIDS",
      description: "Underground electronic beats with experimental sound design.",
      cover: "https://i1.sndcdn.com/artworks-WcVRnt3QHm0mzgp3-8O03yw-t500x500.jpg"
    }
  ];

  trackIndex = 0;
  widget: any;
  isPlaying = false;

  constructor(private sanitizer: DomSanitizer) {
    // transforma URLs das tracks em SafeResourceUrl
    this.safeTracks = this.tracks.map(t => this.sanitizer.bypassSecurityTrustResourceUrl(t.url));
  }

  ngAfterViewInit(): void {
    // Animações iniciais
    gsap.to('.header', { opacity: 1, duration: 1 });
    gsap.to('.main-title', { opacity: 1, y: 0, duration: 1, delay: 0.3 });
    gsap.to('.vinyl-container', { opacity: 1, x: 0, duration: 1, delay: 0.6 });
    gsap.to('.arrow-circle', { opacity: 1, duration: 1, delay: 1 });

    this.initializePlayer();
    this.initArrow();
  }

  initializePlayer(): void {
    const tryInit = () => {
      if (typeof SC === 'undefined') {
        console.log('⚠️ SoundCloud SDK não carregado ainda, tentando de novo...');
        setTimeout(tryInit, 500);
        return;
      }

      this.widget = SC.Widget(document.getElementById('sc-player'));
      const playBtn = document.getElementById('play')!;
      const icon = document.getElementById('playIcon')!;
      const prevBtn = document.getElementById('prev')!;
      const nextBtn = document.getElementById('next')!;
      const trackImage = document.getElementById('trackImage') as HTMLImageElement;
      const trackName = document.getElementById('trackName')!;
      const artistName = document.getElementById('artistName')!;
      const trackDesc = document.getElementById('trackDescription')!;
      const grooves = document.querySelector('.vinyl-grooves') as HTMLElement;
      const vinylImg = document.querySelector('.vinyl-center img') as HTMLElement;
      const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;

      const loadTrack = (i: number, auto = false) => {
        const t = this.tracks[i];
        this.widget.load(t.url, { auto_play: auto, show_artwork: false });
        trackName.textContent = t.name;
        artistName.textContent = t.artist;
        trackDesc.textContent = t.description;
        trackImage.src = t.cover;

        gsap.fromTo([trackName, artistName, trackDesc, trackImage],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }
        );
      };

      this.widget.bind(SC.Widget.Events.READY, () => {
        loadTrack(this.trackIndex);
        this.widget.setVolume(0.5);
      });
      

      // play/pause
      playBtn.addEventListener('click', () => {
        if (this.isPlaying) {
          this.widget.pause();
        } else {
          this.widget.setVolume(volumeSlider ? Number(volumeSlider.value)/100 : 0.5);
          this.widget.play();
        }
      });

      // prev
      prevBtn.addEventListener('click', () => {
        this.trackIndex = (this.trackIndex - 1 + this.tracks.length) % this.tracks.length;
        loadTrack(this.trackIndex, true);
      });

      // next
      nextBtn.addEventListener('click', () => {
        this.trackIndex = (this.trackIndex + 1) % this.tracks.length;
        loadTrack(this.trackIndex, true);
      });

      // eventos do widget
      this.widget.bind(SC.Widget.Events.PLAY, () => {
        this.isPlaying = true;
        icon.classList.replace('fa-play', 'fa-pause');
        grooves.style.animationPlayState = 'running';
        vinylImg.style.animationPlayState = 'running';
      });

      this.widget.bind(SC.Widget.Events.PAUSE, () => {
        this.isPlaying = false;
        icon.classList.replace('fa-pause', 'fa-play');
        grooves.style.animationPlayState = 'paused';
        vinylImg.style.animationPlayState = 'paused';
      });

      this.widget.bind(SC.Widget.Events.FINISH, () => {
        this.trackIndex = (this.trackIndex + 1) % this.tracks.length;
        loadTrack(this.trackIndex, true);
      });

      // volume
      volumeSlider.addEventListener('input', e => {
        this.widget.setVolume((e.target as HTMLInputElement).valueAsNumber / 100);
      });

      // inicia vinil parado
      grooves.style.animationPlayState = 'paused';
      vinylImg.style.animationPlayState = 'paused';
    };

    tryInit();
  }

  initArrow(): void {
    const arrowCircle = document.querySelector('.arrow-circle');
    if (!arrowCircle) return;

    arrowCircle.addEventListener('mouseenter', () => {
      gsap.to(arrowCircle, { scale: 1.1, duration: 0.3 });
    });
    arrowCircle.addEventListener('mouseleave', () => {
      gsap.to(arrowCircle, { scale: 1, duration: 0.3 });
    });
    arrowCircle.addEventListener('click', () => {
      gsap.to(arrowCircle, { rotation: "+=360", duration: 0.6, ease: "power2.out" });
    });
  }
}
