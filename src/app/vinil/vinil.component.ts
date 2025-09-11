import { Component, AfterViewInit } from '@angular/core';
import gsap from 'gsap';

declare var SC: any;

@Component({
  selector: 'app-vinil',
  templateUrl: './vinil.component.html',
  styleUrls: ['./vinil.component.css']
})
export class VinilComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Animações iniciais
    gsap.to('.header', { opacity: 1, duration: 1 });
    gsap.to('.main-title', { opacity: 1, y: 0, duration: 1, delay: 0.3 });
    gsap.to('.vinyl-container', { opacity: 1, x: 0, duration: 1, delay: 0.6 });
    gsap.to('.arrow-circle', { opacity: 1, duration: 1, delay: 1 });

    this.initializePlayer();
    this.initBurger();
    this.initArrow();
  }

  initializePlayer(): void {
    const tryInit = () => {
      if (typeof SC === 'undefined') {
        console.log('SoundCloud SDK not loaded, retrying...');
        setTimeout(tryInit, 500);
        return;
      }

      const widget = SC.Widget(document.getElementById('sc-player'));
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

      let isPlaying = false, trackIndex = 0;

      const tracks = [
        { 
          url: "https://api.soundcloud.com/tracks/293", 
          name: "Mellow Sunrise", 
          artist: "Forss", 
          description: "Smooth electronic vibes that transport you to another dimension.", 
          cover: "https://i1.sndcdn.com/artworks-000000000000-0-t500x500.jpg" 
        },
        { 
          url: "https://api.soundcloud.com/tracks/1123049251", 
          name: "YaSuKe 弥助", 
          artist: "Sim Production", 
          description: "Futuristic soundscape blending traditional and modern elements.", 
          cover: "https://i1.sndcdn.com/artworks-WQGncTCPSeYOVdtC-Ucf2zg-t500x500.jpg" 
        },
        { 
          url: "https://api.soundcloud.com/tracks/1967183415", 
          name: "Swamp Festival", 
          artist: "DJ Gator AIDS", 
          description: "Underground electronic beats with experimental sound design.", 
          cover: "https://i1.sndcdn.com/artworks-WcVRnt3QHm0mzgp3-8O03yw-t500x500.jpg" 
        }
      ];

      const loadTrack = (i: number, auto = false) => {
        const t = tracks[i];
        widget.load(t.url, { auto_play: auto, show_artwork: false });
        trackName.textContent = t.name;
        artistName.textContent = t.artist;
        trackDesc.textContent = t.description;
        trackImage.src = t.cover;

        gsap.fromTo([trackName, artistName, trackDesc, trackImage],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }
        );
      };

      widget.bind(SC.Widget.Events.READY, () => {
        loadTrack(trackIndex);
        widget.setVolume(Number(volumeSlider.value) / 100);
      });

      playBtn.addEventListener('click', () => {
        if (isPlaying) widget.pause(); else widget.play();
      });

      prevBtn.addEventListener('click', () => {
        trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(trackIndex, true);
      });

      nextBtn.addEventListener('click', () => {
        trackIndex = (trackIndex + 1) % tracks.length;
        loadTrack(trackIndex, true);
      });

      widget.bind(SC.Widget.Events.PLAY, () => {
        isPlaying = true;
        icon.classList.replace('fa-play', 'fa-pause');
        grooves.style.animationPlayState = 'running';
        vinylImg.style.animationPlayState = 'running';
      });

      widget.bind(SC.Widget.Events.PAUSE, () => {
        isPlaying = false;
        icon.classList.replace('fa-pause', 'fa-play');
        grooves.style.animationPlayState = 'paused';
        vinylImg.style.animationPlayState = 'paused';
      });

      widget.bind(SC.Widget.Events.FINISH, () => {
        trackIndex = (trackIndex + 1) % tracks.length;
        loadTrack(trackIndex, true);
      });

      volumeSlider.addEventListener('input', e => {
        widget.setVolume((e.target as HTMLInputElement).valueAsNumber / 100);
      });

      grooves.style.animationPlayState = 'paused';
      vinylImg.style.animationPlayState = 'paused';
    };

    tryInit();
  }

  initBurger(): void {
    const hamburger = document.querySelector('.hamburger')!;
    const nav = document.querySelector('.nav')!;
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
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

