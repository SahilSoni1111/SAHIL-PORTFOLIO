/**
 * SAHIL SONI — PREMIUM PORTFOLIO
 * script.js — Core JS: Navbar, Particles, Animations, Scroll
 */

'use strict';

/* ─── UTILITY ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── DOM READY ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initSkillBars();
  initParticles();
  initCursorGlow();
  initTypewriter();
});

/* ────────────────────────────────────────────────────────────
   NAVBAR — scroll effect + active link
──────────────────────────────────────────────────────────── */
function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ────────────────────────────────────────────────────────────
   MOBILE MENU
──────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Show mobile menu
    if (isOpen) {
      mobileMenu.style.display = 'flex';
      requestAnimationFrame(() => {
        mobileMenu.classList.add('open');
      });
    } else {
      mobileMenu.classList.remove('open');
      setTimeout(() => {
        if (!mobileMenu.classList.contains('open')) {
          mobileMenu.style.display = '';
        }
      }, 300);
    }
  });

  // Close on link click
  $$('a', mobileMenu).forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click / ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ────────────────────────────────────────────────────────────
   SCROLL ANIMATIONS — fade-up & fade-in via IntersectionObserver
──────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const elements = $$('.fade-up, .fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────────────────────────
   SKILL BARS — animate width when visible
──────────────────────────────────────────────────────────── */
function initSkillBars() {
  const bars = $$('.skill-bar-fill, .cgpa-bar-fill:not(.future)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.dataset.width || 0;
        setTimeout(() => {
          el.style.width = width + '%';
        }, 200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ────────────────────────────────────────────────────────────
   PARTICLES — floating gold particles on hero canvas
──────────────────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.4;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.45 + 0.1;
      this.fadeIn  = true;
      this.life    = 0;
      this.maxLife = Math.random() * 300 + 200;
    }

    update() {
      this.life++;
      this.x += this.speedX;
      this.y += this.speedY;

      // Gentle horizontal drift
      this.speedX += (Math.random() - 0.5) * 0.01;
      this.speedX = Math.max(-0.3, Math.min(0.3, this.speedX));

      if (this.fadeIn) {
        this.opacity += 0.008;
        if (this.opacity >= this.maxOpacity) {
          this.opacity = this.maxOpacity;
          this.fadeIn = false;
        }
      } else if (this.life > this.maxLife * 0.7) {
        this.opacity -= 0.005;
      }

      if (this.opacity < 0 || this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(W * H / 12000), 60);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  init();
  loop();

  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    init();
    loop();
  });
  resizeObserver.observe(canvas);

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    loop();
  }, { passive: true });
}

/* ────────────────────────────────────────────────────────────
   CURSOR GLOW — subtle gold glow following cursor (desktop only)
──────────────────────────────────────────────────────────── */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    glowX = lerp(glowX, mouseX, 0.08);
    glowY = lerp(glowY, mouseY, 0.08);
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    raf = requestAnimationFrame(animate);
  }

  animate();
}

/* ────────────────────────────────────────────────────────────
   TYPEWRITER — animate the hero role text on homepage
──────────────────────────────────────────────────────────── */
function initTypewriter() {
  // Only run on index page
  const heroRole = document.querySelector('.hero-role');
  if (!heroRole) return;

  const phrases = [
    'Computer Science & Engineering Student',
    'Competitive Programmer',
    'Web Developer',
    'Problem Solver',
    'Builder'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseTimer = null;

  // Set initial text
  heroRole.textContent = phrases[0];

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      heroRole.textContent = current.slice(0, charIndex);
    } else {
      charIndex++;
      heroRole.textContent = current.slice(0, charIndex);
    }

    let delay = isDeleting ? 40 : 75;

    if (!isDeleting && charIndex === current.length) {
      delay = 2400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    pauseTimer = setTimeout(type, delay);
  }

  // Start after the hero animation completes
  setTimeout(type, 2200);
}

/* ────────────────────────────────────────────────────────────
   SMOOTH HOVER on achievement/project cards — tilt effect
──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const tiltCards = $$('.achievement-card, .project-card, .acad-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const tiltX = ((y - midY) / midY) * 3;
      const tiltY = ((x - midX) / midX) * -3;
      card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

/* ────────────────────────────────────────────────────────────
   RESUME BUTTON — show toast
──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const resumeBtn = document.getElementById('resumeBtn');
  if (!resumeBtn) return;

  resumeBtn.addEventListener('click', e => {
    e.preventDefault();
    showToast('Resume coming soon — check back shortly!');
  });
});

function showToast(message) {
  // Remove existing
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(15,15,15,0.95);
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 8px;
    padding: 14px 24px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #F5F0E8;
    z-index: 10000;
    opacity: 0;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    white-space: nowrap;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ────────────────────────────────────────────────────────────
   COUNTER ANIMATION — animate numbers on scroll
──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const numbers = $$('.achievement-number, .cgpa-ring-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateNumber(el);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(el => observer.observe(el));
});

function animateNumber(el) {
  const text = el.textContent.trim();
  const numMatch = text.match(/[\d.]+/);
  if (!numMatch) return;

  const target = parseFloat(numMatch[0]);
  const isDecimal = text.includes('.');
  const decimalPlaces = isDecimal ? (text.split('.')[1] || '').length : 0;
  const prefix = text.slice(0, numMatch.index);
  const suffix = text.slice(numMatch.index + numMatch[0].length);
  const duration = 1200;
  const startTime = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = easeOut(progress) * target;

    el.textContent = prefix + current.toFixed(decimalPlaces) + suffix;

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target.toFixed(decimalPlaces) + suffix;
  }

  requestAnimationFrame(update);
}

/* ────────────────────────────────────────────────────────────
   PAGE TRANSITION — smooth fade on link click
──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Add page-out class on navigation
  $$('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only internal .html pages
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.25s ease';
      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  });

  // Fade in on page load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});
