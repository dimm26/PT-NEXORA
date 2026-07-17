/**
 * NEXORA TECH — Corporate Website JavaScript
 * Features:
 *  - Smart sticky navbar with scroll shadow
 *  - Active nav link highlighting via IntersectionObserver
 *  - Scroll-reveal animations (fade-in-up)
 *  - Animated number counters
 *  - Mobile hamburger menu
 *  - Contact form handling with validation
 *  - Scroll-to-top button
 *  - CTA shimmer effect
 *  - Smooth parallax on hero
 */

'use strict';

/* ── Utility: DOM helpers ─────────────────────────────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ── Wait for DOM ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initContactForm();
  initScrollTop();
  initActiveNavLinks();
  initParallax();

});

/* ============================================================
   1. NAVBAR — sticky shadow on scroll
   ============================================================ */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const handler = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  on(window, 'scroll', handler, { passive: true });
  handler(); // run once on load
}

/* ============================================================
   2. MOBILE MENU — hamburger toggle
   ============================================================ */
function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#nav-mobile');
  const navLinks   = $$('.nav-link', mobileMenu);

  if (!hamburger || !mobileMenu) return;

  const openMenu = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  on(hamburger, 'click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  navLinks.forEach(link => on(link, 'click', closeMenu));

  // Close on ESC key
  on(document, 'keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  // Close on outside click
  on(document, 'click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
  });
}

/* ============================================================
   3. SCROLL-REVEAL — fade-in-up animation
   ============================================================ */
function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   4. COUNTER ANIMATION — number count-up
   ============================================================ */
function initCounters() {
  const counters = $$('.counter');
  if (!counters.length) return;

  // Easing function — ease out quad
  const easeOutQuad = t => t * (2 - t);

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const start    = performance.now();

    const step = (timestamp) => {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutQuad(progress) * target);

      el.textContent = value.toLocaleString('id-ID');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('id-ID');
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ============================================================
   5. CONTACT FORM — validation & submission
   ============================================================ */
function initContactForm() {
  const form      = $('#contact-form');
  const submitBtn = $('#f-submit-btn');
  const success   = $('#f-success');

  if (!form) return;

  // Input focus styling
  $$('.form-input, .form-select, .form-textarea', form).forEach(input => {
    on(input, 'focus', () => input.style.borderColor = 'var(--accent)');
    on(input, 'blur',  () => {
      if (!input.value) input.style.borderColor = 'var(--border)';
    });
  });

  on(form, 'submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const required = $$('[required]', form);
    let valid = true;
    required.forEach(field => {
      const val = field.value.trim();
      if (!val) {
        valid = false;
        shakeField(field);
        field.style.borderColor = '#EF4444';
        on(field, 'input', () => field.style.borderColor = 'var(--border)', { once: true });
      }
    });

    // Email validation
    const emailField = $('#f-email');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      valid = false;
      shakeField(emailField);
      emailField.style.borderColor = '#EF4444';
    }

    if (!valid) return;

    // Simulate async submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.style.opacity = '0.8';

    await sleep(1500);

    // Show success
    form.style.display = 'none';
    if (success) {
      success.style.display = 'block';
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeField(el) {
  el.style.animation = 'shake 0.4s ease';
  on(el, 'animationend', () => el.style.animation = '', { once: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ============================================================
   6. SCROLL TO TOP BUTTON
   ============================================================ */
function initScrollTop() {
  const btn = $('#scroll-top-btn');
  if (!btn) return;

  on(window, 'scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  on(btn, 'click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   7. ACTIVE NAV LINKS — highlight current section
   ============================================================ */
function initActiveNavLinks() {
  const sections  = $$('section[id]');
  const navLinks  = $$('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

/* ============================================================
   8. HERO PARALLAX — subtle parallax on scroll
   ============================================================ */
function initParallax() {
  const heroBg = $('.hero-bg');
  if (!heroBg) return;

  // Disable on mobile/tablet for perf
  if (window.innerWidth < 768) return;

  let ticking = false;

  on(window, 'scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const speed   = 0.35; // 0 = no parallax, 1 = full
        heroBg.style.transform = `translateY(${scrollY * speed}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   9. INJECT SHAKE KEYFRAMES
   ============================================================ */
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   10. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  on(anchor, 'click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72', 10);
    const offset = target.getBoundingClientRect().top + window.scrollY - navH - 16;

    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});
