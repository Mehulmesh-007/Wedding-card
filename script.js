/* 
 * Interactive Engine: Cinematic Luxury Buddhist Wedding Invitation
 * Manages: Canvas Particle Engine (Gold Flakes), YouTube Player API Integration, Scroll Reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Systems
  initParticles();
  initScrollAnimations();
  initYouTubePlayer();
});

/* ==========================================================================
   1. Canvas Particle & Lotus Petal Engine
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  
  const particles = [];
  const petals = [];
  
  const maxParticles = 55;
  const maxPetals = 8;

  // Track window resizing
  window.addEventListener('resize', () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });

  // Particle Class (Golden-Amber Dust/Sun Speckles)
  class GoldenParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Distribute evenly at start
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.radius = Math.random() * 1.5 + 0.4;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.speedY = -(Math.random() * 0.35 + 0.1);
      this.swaySpeed = Math.random() * 0.015 + 0.005;
      this.swayAmplitude = Math.random() * 1.2 + 0.4;
      this.time = Math.random() * 100;
    }

    update() {
      this.y += this.speedY;
      this.time += this.swaySpeed;
      this.x += Math.sin(this.time) * (this.swayAmplitude * 0.05);

      // Fade out near top
      if (this.y < 120) {
        this.alpha -= 0.003;
      }
      
      // Reset if out of bounds or invisible
      if (this.y < -10 || this.alpha <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // Soft amber/gold flakes on light background
      ctx.fillStyle = `rgba(180, 130, 30, ${Math.max(0, this.alpha)})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(124, 92, 26, 0.4)';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset for canvas render speed
    }
  }

  // Petal Class (Drifting Golden Lotus Petals)
  class GoldPetal {
    constructor() {
      this.reset();
      this.y = Math.random() * height * 0.8;
    }

    reset() {
      this.x = Math.random() * (width + 100) - 50;
      this.y = -20;
      this.width = Math.random() * 10 + 6;
      this.height = this.width * 1.3;
      this.alpha = Math.random() * 0.3 + 0.12;
      this.speedY = Math.random() * 0.4 + 0.25;
      this.speedX = -(Math.random() * 0.25 + 0.05);
      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.008;
      this.swaySpeed = Math.random() * 0.01 + 0.004;
      this.time = Math.random() * 100;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.time) * 0.15;
      this.angle += this.rotationSpeed;
      this.time += this.swaySpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      
      // Draw symmetrical lotus petal path
      ctx.beginPath();
      ctx.moveTo(0, -this.height / 2);
      ctx.quadraticCurveTo(-this.width / 2, 0, 0, this.height / 2);
      ctx.quadraticCurveTo(this.width / 2, 0, 0, -this.height / 2);
      
      // Antique gold gradient for light reflections
      const grad = ctx.createLinearGradient(0, -this.height/2, 0, this.height/2);
      grad.addColorStop(0, `rgba(243, 223, 162, ${this.alpha * 1.5})`);
      grad.addColorStop(0.5, `rgba(124, 92, 26, ${this.alpha})`);
      grad.addColorStop(1, `rgba(92, 62, 7, ${this.alpha * 0.4})`);
      
      ctx.fillStyle = grad;
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'rgba(124, 92, 26, 0.2)';
      ctx.fill();
      
      ctx.restore();
      ctx.shadowBlur = 0;
    }
  }

  // Populate particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new GoldenParticle());
  }
  for (let i = 0; i < maxPetals; i++) {
    petals.push(new GoldPetal());
  }

  // Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. YouTube IFrame Player API Integration
   ========================================================================== */
let ytPlayer = null;
let playerReady = false;
let isPlaying = false;

function initYouTubePlayer() {
  // Inject the YouTube IFrame API script dynamically
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Global API callback defined on window
window.onYouTubeIframeAPIReady = function() {
  const playerVars = {
    'autoplay': 1,
    'controls': 0,
    'disablekb': 1,
    'fs': 0,
    'modestbranding': 1,
    'rel': 0,
    'showinfo': 0,
    'loop': 1,
    'playlist': 'DDYxn5IYca0'
  };
  
  // Only send origin parameter if we are running on a web server (http/https)
  if (window.location.protocol !== 'file:') {
    playerVars.origin = window.location.origin;
  }

  ytPlayer = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: 'DDYxn5IYca0',
    playerVars: playerVars,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

function onPlayerReady(event) {
  playerReady = true;
  const audioBtn = document.getElementById('audio-toggle');
  if (!audioBtn) return;

  // Sync click events
  audioBtn.addEventListener('click', () => {
    if (!playerReady || !ytPlayer) return;

    if (!isPlaying) {
      ytPlayer.unMute();
      ytPlayer.playVideo();
      audioBtn.classList.add('playing');
      audioBtn.querySelector('.btn-text').textContent = 'Sound On';
      isPlaying = true;
    } else {
      ytPlayer.pauseVideo();
      audioBtn.classList.remove('playing');
      audioBtn.querySelector('.btn-text').textContent = 'Sound Off';
      isPlaying = false;
    }
  });

  // Attempt to play automatically immediately on player ready
  attemptAutoplay();

  // Remove gesture listeners; not needed for immediate autoplay
  // Previously added listeners for click, scroll, touch, mousemove are now omitted.
}

function onPlayerStateChange(event) {
  // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
  const audioBtn = document.getElementById('audio-toggle');

  if (event.data === YT.PlayerState.PLAYING) {
    if (audioBtn) {
      audioBtn.classList.add('playing');
      audioBtn.querySelector('.btn-text').textContent = 'Sound On';
    }
    isPlaying = true;
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    if (audioBtn) {
      audioBtn.classList.remove('playing');
      audioBtn.querySelector('.btn-text').textContent = 'Sound Off';
    }
    isPlaying = false;
  }
}

/* ==========================================================================
   3. Scroll Animations & Cinematic Parallax
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const background = document.querySelector('.cinematic-background');

  // Parallax background scroll scaler
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (background) {
      // Scale up slowly and move background downward for epic depth
      const scaleValue = 1.05 + (scrollPos * 0.00007);
      background.style.transform = `scale(${Math.min(scaleValue, 1.15)}) translateY(${scrollPos * 0.025}px)`;
    }
  });

  // Intersection Observer to fire scroll reveals
  const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}