/**
 * SAHIL SONI — PREMIUM PORTFOLIO
 * script.js — Core JS: Intro, Navbar, Particles, Animations, Transitions
 */

'use strict';

/* ─── UTILITY ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── DOM READY ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initIntro();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initSkillBars();
  initParticles();
  initCursorGlow();
  initTypewriter();
  initTiltCards();
  initResumeBtn();
  initCounters();
  initPageTransitions();
});

/* ────────────────────────────────────────────────────────────
   THEME — dark / light toggle, persisted in localStorage
──────────────────────────────────────────────────────────── */
function initTheme() {
  const STORAGE_KEY = 'ss_theme';
  const html = document.documentElement;

  // Apply saved theme immediately (before paint) to avoid flash
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light') html.setAttribute('data-theme', 'light');

  // Build the toggle button and inject it into the navbar
  const navInner = document.querySelector('.nav-inner');
  if (!navInner) return;

  const btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle light/dark theme');
  btn.setAttribute('title', 'Toggle theme');
  btn.innerHTML = `
    <span class="theme-toggle-icon" aria-hidden="true"></span>
    <span class="theme-toggle-label"></span>
  `;

  function applyTheme(theme) {
    const icon  = btn.querySelector('.theme-toggle-icon');
    const label = btn.querySelector('.theme-toggle-label');
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
      icon.textContent  = '☾';
      label.textContent = 'Dark';
    } else {
      html.removeAttribute('data-theme');
      icon.textContent  = '☀';
      label.textContent = 'Light';
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  // Insert button between nav-links and hamburger
  const hamburger = navInner.querySelector('.nav-hamburger');
  navInner.insertBefore(btn, hamburger || null);

  // Set initial icon state
  applyTheme(saved === 'light' ? 'light' : 'dark');
}

/* ────────────────────────────────────────────────────────────
   INTRO LOADER — luxury gold reveal on first load
   Shows a full-screen black overlay with the monogram "SS"
   and a gold scan-line, then sweeps away upward.
   Skipped if the user is navigating via back/forward (bfcache).
──────────────────────────────────────────────────────────── */
function initIntro() {
  // Don't show intro when restoring from bfcache (back button)
  // We use sessionStorage so it only runs once per session
  const already = sessionStorage.getItem('ss_intro_done');

  // Build the overlay regardless — needed for page-in fade
  const overlay = document.createElement('div');
  overlay.id = 'intro-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: #040404;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: all;
    transition: transform 0.9s cubic-bezier(0.76, 0, 0.24, 1);
    will-change: transform;
  `;

  // Monogram
  const monogram = document.createElement('div');
  monogram.style.cssText = `
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(64px, 12vw, 120px);
    font-weight: 700;
    color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.9);
    letter-spacing: -0.04em;
    line-height: 1;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  `;
  monogram.textContent = 'SS';

  // Gold scan line
  const line = document.createElement('div');
  line.style.cssText = `
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  `;

  // Tagline
  const tagline = document.createElement('div');
  tagline.style.cssText = `
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.5);
    margin-top: 20px;
    opacity: 0;
    transition: opacity 0.5s ease 0.3s;
  `;
  tagline.textContent = 'Portfolio · 2026';

  overlay.appendChild(monogram);
  overlay.appendChild(tagline);
  overlay.appendChild(line);
  document.body.appendChild(overlay);

  if (already) {
    // Already seen intro — just do a quick fade-in
    overlay.style.transition = 'none';
    overlay.style.opacity = '0';
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.35s ease';
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        // Immediately remove
        setTimeout(() => dismissOverlay(overlay), 50);
      });
    });
    return;
  }

  // First time — play full intro
  sessionStorage.setItem('ss_intro_done', '1');

  // Step 1: reveal monogram
  requestAnimationFrame(() => {
    setTimeout(() => {
      monogram.style.opacity = '1';
      monogram.style.transform = 'translateY(0)';
      tagline.style.opacity = '1';
    }, 100);

    // Step 2: scan line grows
    setTimeout(() => {
      line.style.transform = 'scaleX(1)';
    }, 500);

    // Step 3: sweep overlay up
    setTimeout(() => {
      dismissOverlay(overlay);
    }, 1600);
  });
}

function dismissOverlay(overlay) {
  overlay.style.transform = 'translateY(-100%)';
  overlay.addEventListener('transitionend', () => {
    overlay.remove();
  }, { once: true });
}

/* ────────────────────────────────────────────────────────────
   PAGE TRANSITIONS — fade out on navigate, fix back button
──────────────────────────────────────────────────────────── */
function initPageTransitions() {
  // Inject a tiny persistent fade element (not the body itself,
  // so bfcache restore doesn't leave it invisible)
  const curtain = document.createElement('div');
  curtain.id = 'page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.style.cssText = `
    position: fixed;
    inset: 0;
    background: #040404;
    z-index: 99998;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.22s ease;
  `;
  document.body.appendChild(curtain);

  // Wire internal links
  $$('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Skip: external, mailto, tel, anchors, javascript
    if (
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      href.startsWith('#') ||
      href.startsWith('javascript')
    ) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      curtain.style.opacity = '1';
      curtain.style.pointerEvents = 'all';
      setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });

  // Fix back/forward — bfcache restores the page instantly,
  // but the curtain may still be opaque. pageshow fires on restore.
  window.addEventListener('pageshow', (e) => {
    // e.persisted = true when restored from bfcache (back button)
    curtain.style.transition = 'none';
    curtain.style.opacity = '0';
    curtain.style.pointerEvents = 'none';
    if (e.persisted) {
      // Force reflow then re-enable transitions
      void curtain.offsetHeight;
    }
    requestAnimationFrame(() => {
      curtain.style.transition = 'opacity 0.22s ease';
    });
  });
}

/* ────────────────────────────────────────────────────────────
   NAVBAR — scroll effect
──────────────────────────────────────────────────────────── */
function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
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

  const open  = () => {
    hamburger.classList.add('open');
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(() => mobileMenu.classList.add('open'));
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!mobileMenu.classList.contains('open')) mobileMenu.style.display = '';
    }, 300);
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  $$('a', mobileMenu).forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) close();
  });
}

/* ────────────────────────────────────────────────────────────
   SCROLL ANIMATIONS
──────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const els = $$('.fade-up, .fade-in');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ────────────────────────────────────────────────────────────
   SKILL BARS
──────────────────────────────────────────────────────────── */
function initSkillBars() {
  const bars = $$('.skill-bar-fill, .cgpa-bar-fill:not(.future)');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        setTimeout(() => { el.style.width = (el.dataset.width || 0) + '%'; }, 200);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
}

/* ────────────────────────────────────────────────────────────
   PARTICLES
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
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.4;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.45 + 0.1;
      this.fadeIn = true;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.life++;
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedX += (Math.random() - 0.5) * 0.01;
      this.speedX = Math.max(-0.3, Math.min(0.3, this.speedX));
      if (this.fadeIn) {
        this.opacity += 0.008;
        if (this.opacity >= this.maxOpacity) { this.opacity = this.maxOpacity; this.fadeIn = false; }
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
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  init(); loop();

  const ro = new ResizeObserver(() => { cancelAnimationFrame(animId); init(); loop(); });
  ro.observe(canvas);
  window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); loop(); }, { passive: true });
}

/* ────────────────────────────────────────────────────────────
   CURSOR GLOW (desktop only)
──────────────────────────────────────────────────────────── */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9998;
    width:300px; height:300px; border-radius:50%;
    background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
    transform:translate(-50%,-50%); opacity:0;
    transition: opacity 0.3s ease; will-change:transform;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;
  const lerp = (a, b, t) => a + (b - a) * t;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; glow.style.opacity = '1'; }, { passive: true });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  (function animate() {
    gx = lerp(gx, mx, 0.08); gy = lerp(gy, my, 0.08);
    glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
    requestAnimationFrame(animate);
  })();
}

/* ────────────────────────────────────────────────────────────
   TYPEWRITER
──────────────────────────────────────────────────────────── */
function initTypewriter() {
  const heroRole = document.querySelector('.hero-role');
  if (!heroRole) return;

  const phrases = [
    'Computer Science & Engineering Student',
    'Competitive Programmer',
    'Web Developer',
    'Problem Solver',
    'Builder'
  ];

  let pi = 0, ci = 0, deleting = false;
  heroRole.textContent = phrases[0];

  function type() {
    const cur = phrases[pi];
    heroRole.textContent = deleting ? cur.slice(0, --ci) : cur.slice(0, ++ci);

    let delay = deleting ? 40 : 75;

    if (!deleting && ci === cur.length) { delay = 2400; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }

    setTimeout(type, delay);
  }

  setTimeout(type, 2200);
}

/* ────────────────────────────────────────────────────────────
   TILT CARDS
──────────────────────────────────────────────────────────── */
function initTiltCards() {
  $$('.achievement-card, .project-card, .acad-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const tx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * 3;
      const ty = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * -3;
      card.style.transform = `translateY(-4px) rotateX(${tx}deg) rotateY(${ty}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ────────────────────────────────────────────────────────────
   RESUME BUTTON
──────────────────────────────────────────────────────────── */
function initResumeBtn() {
  const btn = document.getElementById('resumeBtn');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    showToast('Resume coming soon — check back shortly!');
  });
}

function showToast(message) {
  document.getElementById('toast')?.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = `
    position:fixed; bottom:32px; left:50%;
    transform:translateX(-50%) translateY(20px);
    background:rgba(15,15,15,0.95);
    border:1px solid rgba(201,168,76,0.3);
    border-radius:8px; padding:14px 24px;
    font-family:'Inter',sans-serif; font-size:14px; color:#F5F0E8;
    z-index:10000; opacity:0;
    backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    transition:all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
    box-shadow:0 8px 32px rgba(0,0,0,0.4); white-space:nowrap;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }));

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ────────────────────────────────────────────────────────────
   COUNTER ANIMATION
──────────────────────────────────────────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateNumber(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  $$('.achievement-number, .cgpa-ring-num').forEach(el => obs.observe(el));
}

function animateNumber(el) {
  const text = el.textContent.trim();
  const match = text.match(/[\d.]+/);
  if (!match) return;

  const target = parseFloat(match[0]);
  const decimals = text.includes('.') ? (text.split('.')[1] || '').length : 0;
  const prefix = text.slice(0, match.index);
  const suffix = text.slice(match.index + match[0].length);
  const start = performance.now();
  const dur = 1200;
  const ease = t => 1 - Math.pow(1 - t, 3);

  (function update(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = prefix + (ease(p) * target).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = prefix + target.toFixed(decimals) + suffix;
  })(start);
}
