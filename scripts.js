/* =====================================================
   Premier Cabinets Innovations — site behaviors
   Iteration 2: Lenis smooth scroll, hero carousel,
   full GSAP choreography, mobile drawer, split-text,
   number counter, back-to-top.
   ===================================================== */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('no-anim');

  // ============================================================
  // ORNAMENT FRAME — inject SVG corners + GSAP draw-in animation
  // ============================================================
  // Iteration 11 — richer corner ornament. Three L-brackets layered for depth,
  // a more elaborate acanthus curl with an inset leaf, tick-mark rhythm along
  // the bracket, and a denser dot pattern. Animation still works because every
  // <path>/<line> participates in stroke-dashoffset draw-in and every <circle>
  // fades in afterward.
  const ORNAMENT_SVG = `
<svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet" aria-hidden="true">
  <!-- Outer L-bracket -->
  <path d="M 4 100 L 4 4 L 100 4" stroke-width="1.6" fill="none" stroke-linecap="square" />
  <!-- Inner parallel L -->
  <path d="M 12 100 L 12 12 L 100 12" stroke-width="0.7" fill="none" stroke-linecap="square" />
  <!-- Third even-thinner inner L for extra refinement -->
  <path d="M 16 100 L 16 16 L 100 16" stroke-width="0.4" fill="none" stroke-linecap="square" opacity="0.55" />
  <!-- Acanthus curl (refined scroll with return curl) -->
  <path d="M 20 20 Q 34 20 40 26 Q 46 32 40 40 Q 34 46 26 40 Q 21 35 26 30 Q 30 26 34 30" stroke-width="1" fill="none" stroke-linecap="round" />
  <!-- Diagonal accent stroke from the corner outward -->
  <line x1="4" y1="4" x2="14" y2="14" stroke-width="0.6" />
  <!-- Tick marks along the L for decorative rhythm -->
  <line x1="30" y1="4" x2="30" y2="8" stroke-width="0.5" />
  <line x1="50" y1="4" x2="50" y2="7" stroke-width="0.4" />
  <line x1="4" y1="30" x2="8" y2="30" stroke-width="0.5" />
  <line x1="4" y1="50" x2="7" y2="50" stroke-width="0.4" />
  <!-- Accent dots -->
  <circle class="ornament-dot" cx="34" cy="12" r="1.3" />
  <circle class="ornament-dot" cx="12" cy="34" r="1.3" />
  <circle class="ornament-dot" cx="64" cy="4" r="0.7" />
  <circle class="ornament-dot" cx="4" cy="64" r="0.7" />
  <circle class="ornament-dot" cx="80" cy="4" r="0.5" />
  <circle class="ornament-dot" cx="4" cy="80" r="0.5" />
</svg>
`;

  function injectOrnaments() {
    document.querySelectorAll('.ornament-frame__corner').forEach((el) => {
      if (!el.querySelector('svg')) el.innerHTML = ORNAMENT_SVG;
    });
  }

  // ============================================================
  // SERVICE ICONS — line illustrations for the "What we build" grid.
  // Each SVG uses stroke-only paths/rects so GSAP can animate
  // stroke-dashoffset on scroll-in for a draw-on effect.
  // ============================================================
  const SERVICE_ICONS = {
    // 01 — Custom Kitchens (range hood + counter + island)
    kitchens: `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 36 16 L 64 16 L 70 30 L 30 30 Z" stroke-width="1.4"/>
        <line x1="34" y1="33" x2="66" y2="33" stroke-width="0.9"/>
        <path d="M 14 36 L 14 56 L 86 56 L 86 36" stroke-width="1.4"/>
        <line x1="14" y1="56" x2="86" y2="56" stroke-width="1.4"/>
        <line x1="34" y1="39" x2="34" y2="55" stroke-width="0.7"/>
        <line x1="50" y1="39" x2="50" y2="55" stroke-width="0.7"/>
        <line x1="66" y1="39" x2="66" y2="55" stroke-width="0.7"/>
        <rect x="28" y="66" width="44" height="24" stroke-width="1.4"/>
        <line x1="46" y1="70" x2="46" y2="86" stroke-width="0.7"/>
        <line x1="54" y1="70" x2="54" y2="86" stroke-width="0.7"/>
        <circle cx="42" cy="78" r="0.9" fill="currentColor"/>
        <circle cx="58" cy="78" r="0.9" fill="currentColor"/>
      </g>
    </svg>`,

    // 02 — Bathroom Vanities (mirror + sink + cabinet)
    baths: `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <rect x="36" y="12" width="28" height="24" rx="1" stroke-width="1.4"/>
        <line x1="40" y1="16" x2="40" y2="32" stroke-width="0.5" opacity="0.6"/>
        <rect x="14" y="48" width="72" height="6" stroke-width="1.4"/>
        <ellipse cx="50" cy="57" rx="11" ry="3.5" stroke-width="1"/>
        <path d="M 50 46 L 50 41 Q 50 39 52 39" stroke-width="1"/>
        <rect x="14" y="54" width="72" height="32" stroke-width="1.4"/>
        <line x1="50" y1="57" x2="50" y2="84" stroke-width="0.7"/>
        <line x1="30" y1="68" x2="38" y2="68" stroke-width="1"/>
        <line x1="62" y1="68" x2="70" y2="68" stroke-width="1"/>
      </g>
    </svg>`,

    // 03 — Wall Paneling (5 raised panels)
    paneling: `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <rect x="10" y="14" width="16" height="72" stroke-width="1.4"/>
        <rect x="13" y="17" width="10" height="66" stroke-width="0.6" opacity="0.7"/>
        <rect x="29" y="14" width="16" height="72" stroke-width="1.4"/>
        <rect x="32" y="17" width="10" height="66" stroke-width="0.6" opacity="0.7"/>
        <rect x="48" y="14" width="16" height="72" stroke-width="1.4"/>
        <rect x="51" y="17" width="10" height="66" stroke-width="0.6" opacity="0.7"/>
        <rect x="67" y="14" width="16" height="72" stroke-width="1.4"/>
        <rect x="70" y="17" width="10" height="66" stroke-width="0.6" opacity="0.7"/>
        <line x1="6" y1="12" x2="90" y2="12" stroke-width="0.7"/>
        <line x1="6" y1="88" x2="90" y2="88" stroke-width="0.7"/>
      </g>
    </svg>`,

    // 04 — Custom Moldings & Frames (three molding cross-sections stacked)
    moldings: `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 18 18 L 82 18 L 82 24 Q 76 26 70 24 L 64 24 Q 58 28 52 24 L 48 24 L 48 32 L 18 32 Z" stroke-width="1.4"/>
        <path d="M 18 42 L 82 42 L 82 47 Q 76 50 70 47 L 60 47 Q 50 54 40 47 L 30 47 L 22 52 L 18 52 Z" stroke-width="1.4"/>
        <path d="M 18 64 L 82 64 L 82 70 Q 74 74 66 70 L 56 70 Q 46 77 36 70 L 26 70 L 22 76 L 18 76 Z" stroke-width="1.4"/>
        <circle cx="14" cy="25" r="0.9" fill="currentColor"/>
        <circle cx="14" cy="47" r="0.9" fill="currentColor"/>
        <circle cx="14" cy="70" r="0.9" fill="currentColor"/>
      </g>
    </svg>`,

    // 05 — Built-In Bookshelves (frame + shelves + books)
    bookshelves: `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <rect x="14" y="12" width="72" height="76" stroke-width="1.4"/>
        <line x1="14" y1="30" x2="86" y2="30" stroke-width="1"/>
        <line x1="14" y1="50" x2="86" y2="50" stroke-width="1"/>
        <line x1="14" y1="70" x2="86" y2="70" stroke-width="1"/>
        <rect x="22" y="16" width="3" height="14" stroke-width="0.5"/>
        <rect x="27" y="14" width="3" height="16" stroke-width="0.5"/>
        <rect x="32" y="17" width="3" height="13" stroke-width="0.5"/>
        <rect x="38" y="15" width="3" height="15" stroke-width="0.5"/>
        <rect x="50" y="16" width="3" height="14" stroke-width="0.5"/>
        <rect x="55" y="14" width="3" height="16" stroke-width="0.5"/>
        <rect x="65" y="17" width="3" height="13" stroke-width="0.5"/>
        <rect x="70" y="15" width="3" height="15" stroke-width="0.5"/>
        <rect x="22" y="36" width="3" height="14" stroke-width="0.5"/>
        <rect x="28" y="34" width="3" height="16" stroke-width="0.5"/>
        <rect x="40" y="37" width="3" height="13" stroke-width="0.5"/>
        <rect x="48" y="35" width="3" height="15" stroke-width="0.5"/>
        <rect x="60" y="34" width="3" height="16" stroke-width="0.5"/>
        <rect x="70" y="36" width="3" height="14" stroke-width="0.5"/>
        <rect x="22" y="56" width="3" height="14" stroke-width="0.5"/>
        <rect x="30" y="54" width="3" height="16" stroke-width="0.5"/>
        <rect x="40" y="55" width="3" height="15" stroke-width="0.5"/>
        <rect x="50" y="57" width="3" height="13" stroke-width="0.5"/>
        <rect x="60" y="54" width="3" height="16" stroke-width="0.5"/>
        <rect x="70" y="56" width="3" height="14" stroke-width="0.5"/>
        <rect x="22" y="76" width="3" height="10" stroke-width="0.5"/>
        <rect x="32" y="74" width="3" height="12" stroke-width="0.5"/>
        <rect x="42" y="75" width="3" height="11" stroke-width="0.5"/>
        <rect x="60" y="74" width="3" height="12" stroke-width="0.5"/>
        <rect x="70" y="76" width="3" height="10" stroke-width="0.5"/>
      </g>
    </svg>`,

    // 06 — Mantels & Fireplace (mantel + opening + flame)
    mantels: `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <rect x="8" y="28" width="84" height="7" stroke-width="1.4"/>
        <line x1="8" y1="33" x2="92" y2="33" stroke-width="0.5" opacity="0.7"/>
        <path d="M 16 35 L 16 88 M 84 35 L 84 88" stroke-width="1.4"/>
        <line x1="16" y1="88" x2="84" y2="88" stroke-width="1.4"/>
        <rect x="34" y="46" width="32" height="36" stroke-width="1.2"/>
        <path d="M 50 56 Q 47 64 50 70 Q 53 64 50 56" stroke-width="0.9"/>
        <path d="M 48 60 Q 45 68 48 72" stroke-width="0.7"/>
        <line x1="20" y1="37" x2="20" y2="86" stroke-width="0.5" opacity="0.7"/>
        <line x1="80" y1="37" x2="80" y2="86" stroke-width="0.5" opacity="0.7"/>
        <circle cx="50" cy="40" r="1" fill="currentColor"/>
      </g>
    </svg>`,

    // 07 — Restoration & Refinishing (cabinet door + paintbrush diagonal)
    restoration: `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <rect x="14" y="18" width="72" height="64" stroke-width="1.4"/>
        <rect x="20" y="24" width="60" height="52" stroke-width="0.6" opacity="0.7"/>
        <circle cx="76" cy="50" r="1" fill="currentColor"/>
        <g transform="rotate(-32, 52, 52)">
          <rect x="22" y="50" width="34" height="4" stroke-width="1.2"/>
          <rect x="56" y="49" width="6" height="6" stroke-width="1.2"/>
          <path d="M 62 49 L 76 47 L 76 57 L 62 55 Z" stroke-width="1.2"/>
          <line x1="64" y1="49" x2="64" y2="55" stroke-width="0.5" opacity="0.8"/>
          <line x1="68" y1="48" x2="68" y2="56" stroke-width="0.5" opacity="0.8"/>
          <line x1="72" y1="48" x2="72" y2="56" stroke-width="0.5" opacity="0.8"/>
        </g>
      </g>
    </svg>`
  };

  function injectServiceIcons() {
    document.querySelectorAll('[data-service-icon]').forEach((el) => {
      const key = el.dataset.serviceIcon;
      if (SERVICE_ICONS[key] && !el.querySelector('svg')) {
        el.innerHTML = SERVICE_ICONS[key];
      }
    });
  }

  function animateServiceIcons() {
    if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Reduced motion or no GSAP — just ensure visibility
      document.querySelectorAll('.service-card').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    document.querySelectorAll('[data-services-grid]').forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll('.service-card'));
      if (cards.length === 0) return;

      // Prime the cards + paths
      cards.forEach((card) => {
        const paths = card.querySelectorAll('svg path, svg line, svg rect, svg circle, svg ellipse');
        paths.forEach((p) => {
          // For circles/ellipses, only fade them in (no stroke draw)
          const tag = p.tagName.toLowerCase();
          if (tag === 'circle' || tag === 'ellipse') {
            p.style.opacity = '0';
          } else if (p.getTotalLength) {
            try {
              const len = p.getTotalLength();
              p.style.strokeDasharray = len;
              p.style.strokeDashoffset = len;
            } catch (e) { /* skip */ }
          }
        });
        card.classList.remove('is-visible');
      });

      // Safety net — force visibility after 3s no matter what
      const safetyTimer = setTimeout(() => {
        cards.forEach((card) => {
          card.classList.add('is-visible');
          card.querySelectorAll('svg path, svg line, svg rect').forEach((p) => { p.style.strokeDashoffset = '0'; });
          card.querySelectorAll('svg circle, svg ellipse').forEach((p) => { p.style.opacity = '1'; });
        });
      }, 3000);

      ScrollTrigger.create({
        trigger: grid,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          clearTimeout(safetyTimer);
          cards.forEach((card, idx) => {
            const delay = idx * 0.12;
            // Card itself: fade up
            gsap.to(card, {
              onStart: () => card.classList.add('is-visible'),
              delay: delay,
              duration: 0.01,
            });
            // SVG paths draw in
            const paths = card.querySelectorAll('svg path, svg line, svg rect');
            gsap.to(paths, {
              strokeDashoffset: 0,
              duration: 1.4,
              ease: 'power2.inOut',
              delay: delay + 0.2,
            });
            // Circles/ellipses fade in
            const dots = card.querySelectorAll('svg circle, svg ellipse');
            gsap.to(dots, {
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              delay: delay + 1.0,
            });
          });
        },
      });
    });
  }

  function animateOrnaments() {
    if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Reduced motion / no GSAP: just make ornaments fully visible
      document.querySelectorAll('.ornament-frame__corner svg').forEach((svg) => {
        svg.style.opacity = '1';
      });
      return;
    }
    document.querySelectorAll('.ornament-frame').forEach((frame) => {
      const corners = frame.querySelectorAll('.ornament-frame__corner');
      if (corners.length === 0) return;
      // Prime each path/line to be invisible by dash offset
      corners.forEach((corner) => {
        corner.querySelectorAll('svg path, svg line').forEach((p) => {
          const len = (typeof p.getTotalLength === 'function') ? p.getTotalLength() : 200;
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
        });
        corner.querySelectorAll('svg circle').forEach((c) => {
          c.style.opacity = '0';
        });
      });
      // SAFETY: after 2.5s force all corners visible even if scroll trigger fails
      const safetyTimer = setTimeout(() => {
        corners.forEach((corner) => {
          corner.querySelectorAll('svg path, svg line').forEach((p) => { p.style.strokeDashoffset = '0'; });
          corner.querySelectorAll('svg circle').forEach((c) => { c.style.opacity = '1'; });
        });
      }, 2500);
      // Draw-in on scroll trigger
      ScrollTrigger.create({
        trigger: frame,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          clearTimeout(safetyTimer);
          corners.forEach((corner, idx) => {
            const paths = corner.querySelectorAll('svg path, svg line');
            const dots = corner.querySelectorAll('svg circle');
            gsap.to(paths, {
              strokeDashoffset: 0,
              duration: 1.4,
              ease: 'power2.inOut',
              delay: idx * 0.15,
            });
            gsap.to(dots, {
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              delay: idx * 0.15 + 0.9,
            });
          });
        },
      });
    });
  }

  // Inject ornaments early so the hero corners exist before paint
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectOrnaments();
      injectServiceIcons();
    });
  } else {
    injectOrnaments();
    injectServiceIcons();
  }

  // -----------------------------------------------------
  // LENIS SMOOTH SCROLL (init early so scrollTo works)
  // -----------------------------------------------------
  let lenis = null;
  function initLenis() {
    if (reduced) return; // honor user preference
    if (typeof window.Lenis === 'undefined') return;
    lenis = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    // Integrate with GSAP ScrollTrigger if loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        if (lenis) lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  function smoothScrollTo(target) {
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(target, { offset: 0 });
    } else if (target instanceof Element) {
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  // -----------------------------------------------------
  // MOBILE DRAWER
  // -----------------------------------------------------
  const drawer = document.querySelector('[data-drawer]');
  const drawerBackdrop = document.querySelector('[data-drawer-backdrop]');
  const navToggle = document.querySelector('.nav-toggle');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (drawerBackdrop) drawerBackdrop.classList.add('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    if (navToggle) navToggle.classList.add('is-open');
    if (lenis) lenis.stop();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (drawerBackdrop) drawerBackdrop.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    if (navToggle) navToggle.classList.remove('is-open');
    if (lenis) lenis.start();
  }

  if (navToggle && drawer) {
    navToggle.addEventListener('click', () => {
      if (drawer.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    });
  }
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeDrawer);
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeDrawer();
  });

  // Legacy: also support the old inline .nav slide-down if present (when drawer markup is missing)
  const legacyNav = document.querySelector('.nav');
  if (legacyNav && navToggle && !drawer) {
    navToggle.addEventListener('click', () => {
      const open = legacyNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    legacyNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        legacyNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -----------------------------------------------------
  // BACK TO TOP
  // -----------------------------------------------------
  document.querySelectorAll('[data-back-to-top]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo(0);
    });
  });

  // -----------------------------------------------------
  // HERO CAROUSEL — GSAP-driven crossfade + Ken Burns (Iteration 5)
  // Cadence runs on setInterval (reliable, decoupled from GSAP ticker so
  // Lenis/ScrollTrigger can't stomp it). GSAP only handles the visual
  // transitions (opacity crossfade + slow scale-zoom on the active slide).
  // Tweens are killed on slides before new ones start to prevent races.
  // -----------------------------------------------------
  (function initHeroCarousel() {
    const carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-carousel__dot'));
    if (slides.length < 2) return;

    const SLIDE_DURATION = 2000;   // ms — Iteration 11: client requested 2s cadence
    const FADE_DURATION = 0.5;     // seconds — tight crossfade to match faster pace
    const KB_START = 1.0;          // Ken Burns starting scale
    const KB_END = 1.02;           // Ken Burns ending scale — reduced to 1.02 at
                                    // 2s cadence so scale-zoom doesn't feel jittery.

    const hasGSAP = typeof gsap !== 'undefined';
    let activeIdx = 0;
    let timer = null;
    let isPaused = false;

    // Prime initial state — first slide visible at base scale, rest hidden
    slides.forEach((s, i) => {
      if (hasGSAP) gsap.set(s, { opacity: i === 0 ? 1 : 0, scale: KB_START, transformOrigin: 'center center' });
      else s.style.opacity = i === 0 ? '1' : '0';
      s.classList.toggle('is-active', i === 0);
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === 0));

    // Start Ken Burns on the first slide right away
    if (hasGSAP && !reduced) {
      gsap.to(slides[0], { scale: KB_END, duration: SLIDE_DURATION / 1000, ease: 'none' });
    }

    function go(nextIdx) {
      nextIdx = ((nextIdx % slides.length) + slides.length) % slides.length;
      if (nextIdx === activeIdx) return;

      const fromSlide = slides[activeIdx];
      const toSlide = slides[nextIdx];

      if (reduced || !hasGSAP) {
        // Simple swap — no animation
        fromSlide.classList.remove('is-active');
        fromSlide.style.opacity = '0';
        toSlide.classList.add('is-active');
        toSlide.style.opacity = '1';
      } else {
        // Kill any in-flight tweens on these two slides
        gsap.killTweensOf([fromSlide, toSlide]);

        // Reset incoming slide to base scale + invisible, then add active class
        gsap.set(toSlide, { scale: KB_START, opacity: 0 });
        toSlide.classList.add('is-active');

        // Crossfade in
        gsap.to(toSlide, { opacity: 1, duration: FADE_DURATION, ease: 'power2.inOut' });
        // Crossfade out the previous
        gsap.to(fromSlide, {
          opacity: 0,
          duration: FADE_DURATION,
          ease: 'power2.inOut',
          onComplete: () => {
            fromSlide.classList.remove('is-active');
          },
        });
        // Ken Burns on the incoming slide for the full slide duration
        gsap.to(toSlide, { scale: KB_END, duration: SLIDE_DURATION / 1000, ease: 'none' });
      }

      dots.forEach((d, i) => d.classList.toggle('is-active', i === nextIdx));
      activeIdx = nextIdx;
    }

    function next() {
      if (isPaused) return;
      go(activeIdx + 1);
    }
    function start() {
      stop();
      if (isPaused) return;
      timer = setInterval(next, SLIDE_DURATION);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function pause() { isPaused = true; stop(); }
    function resume() { isPaused = false; start(); }

    dots.forEach((d) => {
      d.addEventListener('click', () => {
        const idx = Number(d.dataset.dot || 0);
        go(idx);
        start();
      });
    });
    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', resume);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pause(); else resume();
    });

    start();
  })();

  // -----------------------------------------------------
  // SCROLL-TRIGGERED REVEALS (IntersectionObserver fallback)
  // -----------------------------------------------------
  if (!reduced && 'IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -5% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));

    const hairlineEls = document.querySelectorAll('.reveal-hairline');
    const hio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            hio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    hairlineEls.forEach((el) => hio.observe(el));

    // Iteration 3 — numbered list stagger fallback (works even without GSAP)
    const numberedItems = document.querySelectorAll('.numbered-list__item');
    if (numberedItems.length > 0) {
      const nio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const items = entry.target.parentElement.querySelectorAll('.numbered-list__item');
              items.forEach((el, i) => {
                setTimeout(() => el.classList.add('is-revealed'), i * 60);
              });
              nio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      // Observe just the first item of each list
      document.querySelectorAll('[data-numbered-list] .numbered-list__item:first-child').forEach((el) => nio.observe(el));
    }
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.reveal-hairline').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.numbered-list__item').forEach((el) => el.classList.add('is-revealed'));
  }

  // -----------------------------------------------------
  // SAFETY: ensure any .reveal element gets is-visible within 1.5s of page load.
  // Prevents content from being permanently hidden if the IntersectionObserver
  // fails to fire (e.g., section is already in viewport, Lenis races, etc.).
  // -----------------------------------------------------
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
        // Check if element is already visible in viewport — show it immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-visible');
        }
      });
      // After another 1.5s, force-show all remaining (even off-screen) so future
      // scroll always reveals them
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
          el.classList.add('is-visible');
        });
        document.querySelectorAll('.reveal-hairline:not(.is-visible)').forEach((el) => {
          el.classList.add('is-visible');
        });
      }, 1500);
    }, 1500);
  });

  // -----------------------------------------------------
  // STICKY CTA enter + pulse
  // -----------------------------------------------------
  const stickyCta = document.querySelector('[data-sticky-cta]');
  if (stickyCta) {
    if (reduced) {
      stickyCta.classList.add('is-ready');
    } else {
      const enter = () => {
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(
            stickyCta,
            { y: '110%', autoAlpha: 1 },
            { y: '0%', duration: 0.6, ease: 'power2.out', delay: 0.3, onComplete: () => stickyCta.classList.add('is-ready') }
          );
        } else {
          setTimeout(() => stickyCta.classList.add('is-ready'), 320);
        }
      };
      if (document.readyState === 'complete') enter();
      else window.addEventListener('load', enter, { once: true });
    }

    let pulsed = false;
    const hero = document.querySelector('.hero, .page-hero');
    if (hero && !reduced) {
      const onScroll = () => {
        if (pulsed) return;
        const rect = hero.getBoundingClientRect();
        if (rect.bottom < 80) {
          pulsed = true;
          stickyCta.classList.add('is-pulsing');
          setTimeout(() => stickyCta.classList.remove('is-pulsing'), 1000);
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    stickyCta.addEventListener('click', (e) => {
      const onHome = /\/(index\.html)?$/.test(window.location.pathname) || window.location.pathname.endsWith('/');
      const hasContact = document.querySelector('#contact');
      if ((onHome || window.location.pathname.endsWith('contact.html')) && hasContact) {
        e.preventDefault();
        smoothScrollTo(hasContact);
      }
    });
  }

  // -----------------------------------------------------
  // STICKY HEADER scroll state
  // Iteration 11: header is position:fixed and always visible.
  // The .is-scrolled class adds extra polish (shadow + tighter padding +
  // stronger backdrop) once the user scrolls past 80px. Lenis intercepts
  // scroll events on some pages, so we listen on BOTH window + Lenis.
  // -----------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    let lastY = -1;
    const onHeaderScroll = () => {
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      siteHeader.classList.toggle('is-scrolled', y > 80);
    };
    onHeaderScroll();
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    // If Lenis is active, it emits its own scroll event with a scroll value —
    // also use that path so the state updates during smooth-scroll frames.
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', onHeaderScroll);
    }
  }

  // -----------------------------------------------------
  // NUMBER COUNTER (about page stat)
  // -----------------------------------------------------
  function initCounters() {
    if (reduced) {
      document.querySelectorAll('[data-count]').forEach((el) => {
        el.textContent = el.dataset.count;
      });
      return;
    }
    if (!('IntersectionObserver' in window)) return;
    const counters = document.querySelectorAll('[data-count]');
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        if (typeof gsap !== 'undefined') {
          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(proxy.val); },
          });
        } else {
          // Fallback tween
          let start = null;
          const dur = 1500;
          const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            el.textContent = Math.round(p * target);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  // -----------------------------------------------------
  // SPLIT-TEXT REVEAL (contact headline)
  // -----------------------------------------------------
  function initSplitText() {
    const targets = document.querySelectorAll('[data-split-text]');
    if (targets.length === 0) return;

    targets.forEach((el) => {
      // Walk top-level child nodes, replacing text nodes with span-wrapped words.
      // Keep element nodes (e.g. .gold-word) intact, but mark them as a single split unit.
      const newNodes = [];
      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          const tokens = text.split(/(\s+)/); // keep whitespace
          tokens.forEach((tok) => {
            if (tok.trim() === '') {
              newNodes.push(document.createTextNode(tok));
            } else {
              const span = document.createElement('span');
              span.className = 'split-word';
              span.textContent = tok;
              newNodes.push(span);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // wrap the whole inline element as one split-word
          const span = document.createElement('span');
          span.className = 'split-word';
          span.appendChild(node.cloneNode(true));
          newNodes.push(span);
        }
      });
      el.innerHTML = '';
      newNodes.forEach((n) => el.appendChild(n));
    });

    if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('.split-word').forEach((w) => w.classList.add('is-revealed'));
      return;
    }

    targets.forEach((el) => {
      const words = el.querySelectorAll('.split-word');
      gsap.fromTo(words,
        { opacity: 0, y: '0.6em' },
        {
          opacity: 1,
          y: '0em',
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onComplete: () => {
            words.forEach((w) => w.classList.add('is-revealed'));
          },
        }
      );
    });
  }

  // -----------------------------------------------------
  // GSAP CHOREOGRAPHY
  // -----------------------------------------------------
  function initGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      // Ensure cards still appear without animation
      document.querySelectorAll('.proj-card, .svc-card').forEach((el) => el.classList.add('is-visible'));
      document.querySelectorAll('.numbered-list__item').forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    // Hero ken-burns is handled by carousel above.

    // Non-hero photo parallax (case studies + workshop + featured + service detail)
    const parallaxTargets = [
      '.case-study__photo img',
      '.workshop__photo img',
      '.featured-project__photo img',
      '.service-detail__photo img',
    ];
    parallaxTargets.forEach((sel) => {
      document.querySelectorAll(sel).forEach((img) => {
        const trigger = img.closest('.case-study, .workshop__photo, .featured-project, .service-detail') || img.parentElement;
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });
    });

    // Section headline reveals — every h2 inside a section that isn't already wrapped in split-text
    document.querySelectorAll('section h2:not([data-split-text])').forEach((h) => {
      gsap.fromTo(h,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: h, start: 'top 85%', once: true },
        }
      );
    });

    // Body paragraphs delayed fade-in (the .lede right after a headline)
    document.querySelectorAll('section h2 + p, section h2 + .lede, .display--md + p').forEach((p) => {
      gsap.fromTo(p,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: p, start: 'top 88%', once: true },
        }
      );
    });

    // Hairline draws
    document.querySelectorAll('.case-study__hairline, .thank-you__hairline, .hairline--champagne, .hairline--walnut').forEach((line) => {
      gsap.fromTo(line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
          transformOrigin: 'left',
          scrollTrigger: { trigger: line, start: 'top 90%', once: true },
        }
      );
    });

    // Projects grid stagger
    const projCards = document.querySelectorAll('.projects-grid .proj-card');
    if (projCards.length > 0) {
      gsap.to(projCards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.projects-grid', start: 'top 82%', once: true },
      });
    }

    // Services cards stagger — for the new .svc-card layout
    const svcCardGroups = document.querySelectorAll('[data-services-grid]');
    svcCardGroups.forEach((group) => {
      const cards = group.querySelectorAll('.svc-card');
      if (cards.length === 0) return;
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: group, start: 'top 82%', once: true },
      });
      // Numerals fade in a touch later
      const nums = group.querySelectorAll('[data-card-num]');
      gsap.fromTo(nums,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: group, start: 'top 82%', once: true },
        }
      );
    });

    // Old-style .services__grid (still used on home as service-card grid) — keep its stagger
    // Iteration 8: fromTo + safety pattern
    const oldServiceCards = document.querySelectorAll('.services__grid .service-card');
    if (oldServiceCards.length > 0) {
      gsap.set(oldServiceCards, { opacity: 0.001, y: 24 });
      const oldSvcSafety = setTimeout(() => {
        gsap.to(oldServiceCards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 });
      }, 2000);
      ScrollTrigger.create({
        trigger: '.services__grid',
        start: 'top 90%',
        once: true,
        onEnter: () => {
          clearTimeout(oldSvcSafety);
          gsap.to(oldServiceCards, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power2.out' });
        },
      });
    }

    // Iteration 3 — Numbered "What We Build" list stagger
    document.querySelectorAll('[data-numbered-list]').forEach((list) => {
      const items = list.querySelectorAll('.numbered-list__item');
      if (items.length === 0) return;
      gsap.to(items, {
        opacity: 1,
        x: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: list, start: 'top 85%', once: true },
        onStart: () => items.forEach((el) => el.classList.add('is-revealed')),
      });
    });

    // Iteration 3 — Editorial card reveal stagger (Recent Work + Projects editorial grid)
    // Iteration 8: use fromTo with safety fallback — cards are ALWAYS visible
    // by default; the animation is enhancement only. If ScrollTrigger fails,
    // cards stay visible (no opacity 0 trap).
    document.querySelectorAll('[data-editorial-grid]').forEach((grid) => {
      const cards = grid.querySelectorAll('.editorial-card');
      if (cards.length === 0) return;
      // Set initial state — barely-visible but in layout
      gsap.set(cards, { opacity: 0.001, y: 28 });
      // Safety: force visibility after 2s no matter what
      const safetyTimer = setTimeout(() => {
        gsap.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 });
      }, 2000);
      // Normal scroll-triggered stagger reveal
      ScrollTrigger.create({
        trigger: grid,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          clearTimeout(safetyTimer);
          gsap.to(cards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' });
        },
      });
    });

    // Iteration 3 — Process strip step reveals (Iteration 8: fromTo + safety pattern)
    const processSteps = document.querySelectorAll('.process-strip__step');
    if (processSteps.length > 0) {
      gsap.set(processSteps, { opacity: 0.001, y: 20 });
      const processSafety = setTimeout(() => {
        gsap.to(processSteps, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 });
      }, 2000);
      const firstStep = processSteps[0];
      ScrollTrigger.create({
        trigger: firstStep.closest('.process-strip__grid') || firstStep,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          clearTimeout(processSafety);
          gsap.to(processSteps, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' });
        },
      });
    }

    // ScrollTrigger.create — a tiny passive trigger for any extension hooks
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: () => { /* placeholder for future scroll-bound updates */ },
    });
  }

  // -----------------------------------------------------
  // YEAR + ACTIVE NAV
  // -----------------------------------------------------
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) link.classList.add('is-active');
  });

  // -----------------------------------------------------
  // SMOOTH-SCROLL HASH LINKS (use Lenis if available)
  // -----------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
    });
  });

  // ============================================================
  // ITERATION 15 — Extended scroll motion
  // ============================================================
  function initExtendedMotion() {
    if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Hero subtitle/CTAs entrance on load
    const heroEyebrow = document.querySelector('.hero__eyebrow');
    const heroHeadline = document.querySelector('.hero__headline');
    const heroSub = document.querySelector('.hero__sub');
    const heroCTAs = document.querySelectorAll('.hero__ctas .btn');
    const heroTrust = document.querySelector('.hero__trust');
    const heroEls = [heroEyebrow, heroHeadline, heroSub, ...heroCTAs, heroTrust].filter(Boolean);
    if (heroEls.length) {
      gsap.from(heroEls, {
        y: 30,
        opacity: 0,
        duration: 1.0,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.25,
      });
    }

    // Hero photo carousel — subtle parallax on scroll (photo drifts up slightly)
    const heroMedia = document.querySelector('.hero--split__media');
    if (heroMedia) {
      gsap.to(heroMedia, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }

    // Every section h2 + key headline — use the robust .reveal class pattern
    // (IntersectionObserver + safety net) instead of GSAP gsap.from which can
    // trap content at opacity 0 if ScrollTrigger races with Lenis.
    document.querySelectorAll('section h2, .built-and-work__title, .built-and-work__sub-title, .about-hero h1, .about-story__title, .reviews-strip__label, .process-strip__title, .contact-section__headline, .project-detail__title').forEach((el) => {
      el.classList.add('reveal');
    });

    // Project gallery photos — subtle scale-in on enter
    document.querySelectorAll('.featured-project__photo img, .editorial-card__photo img').forEach((img) => {
      gsap.from(img, {
        scale: 1.06,
        opacity: 0.85,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: img.closest('.featured-project, .editorial-card'),
          start: 'top 85%',
          once: true,
        },
      });
    });

    // About story photo — extended parallax
    const aboutPhoto = document.querySelector('.about-story__photo');
    if (aboutPhoto) {
      gsap.to(aboutPhoto, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-story',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }

    // Process strip steps — counter-style reveal
    document.querySelectorAll('.process-strip__step').forEach((step, i) => {
      gsap.from(step, {
        y: 30,
        opacity: 0.001,
        duration: 0.7,
        ease: 'power3.out',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: '.process-strip',
          start: 'top 80%',
          once: true,
        },
      });
    });

    // Review cards stagger
    document.querySelectorAll('.review-card').forEach((card, i) => {
      gsap.from(card, {
        y: 30,
        opacity: 0.001,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.15,
        scrollTrigger: {
          trigger: '.reviews-strip',
          start: 'top 85%',
          once: true,
        },
      });
    });

    // Refresh ScrollTrigger after icons + ornaments may have caused layout shifts
    setTimeout(() => { ScrollTrigger.refresh(); }, 600);
  }

  // SAFETY: 3.5s after load, force all opacity-0 motion elements to visible
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('section h2, .review-card, .process-strip__step').forEach((el) => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.5) {
          if (typeof gsap !== 'undefined') {
            gsap.set(el, { opacity: 1, y: 0 });
          } else {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        }
      });
    }, 3500);
  });

  // -----------------------------------------------------
  // BOOT
  // -----------------------------------------------------
  window.addEventListener('load', () => {
    initLenis();
    initGsap();
    initSplitText();
    initCounters();
    injectOrnaments();   // safety re-inject in case any frames were missed
    animateOrnaments();  // wire GSAP draw-in for ornament corners
    injectServiceIcons();
    animateServiceIcons();
    initExtendedMotion();  // iteration 15 — extended scroll motion
  });

  // FINAL SAFETY: 2 seconds after window load, force any element still at
  // opacity < 0.5 to fully visible. Catches any GSAP/IO escape paths.
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.contact-section__headline, .contact-section__body, .contact-section__meta, .enquiry-form, .reviews-strip, .review-card, .process-strip__step, .editorial-card, .service-card, section h2, .built-and-work__title, .built-and-work__sub-title, .reveal').forEach((el) => {
        const op = parseFloat(getComputedStyle(el).opacity);
        if (op < 0.5) {
          el.style.setProperty('opacity', '1', 'important');
          el.style.setProperty('transform', 'none', 'important');
        }
      });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 2000);
  });

  // ============================================================
  // ITERATION 16 — LANGUAGE TOGGLE (EN/ES) with localStorage persistence
  // ============================================================
  const I18N = {
    en: {
      'nav.work': 'Our Work',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.cta': 'Start Your Project',
      'nav.services': 'What We Build',
      'hero.eyebrow': 'Custom Cabinetry + Millwork · Since 1985',
      'hero.headline': 'Built for the places you\'re <span class="gold-word">proud</span> of.',
      'hero.sub': 'Custom cabinetry and millwork for residential and commercial spaces across Sacramento, the Bay Area, and Northern California.',
      'hero.cta.primary': 'Start Your Project',
      'hero.cta.secondary': 'See Our Work',
      'hero.trust': 'Citrus Heights · Sacramento · Bay Area · Northern California',
      'workshop.eyebrow': '01 — What we build',
      'workshop.title': 'Custom cabinetry and millwork, <span class="gold-word">made in our workshop</span>.',
      'workshop.lede': 'We measure, draw, build, and install every piece from our Citrus Heights workshop. Here is what we build, and a sample of how it lives in our clients\' homes.',
      'recentwork.eyebrow': '02 — See it in action',
      'recentwork.title': 'What we built. <span class="gold-word">Recently</span>.',
      'recentwork.lede': 'Examples of the work above, drawn and built in our Citrus Heights workshop.',
      'gbp.eyebrow': '03 — Trusted on Google',
      'gbp.title': 'From our <span class="gold-word">Google Business Profile</span>.',
      'gbp.lede': 'Real reviews from clients across Sacramento and the Bay Area.',
      'gbp.more': 'See all reviews on Google →',
      'contact.eyebrow': '04 — Start Your Project',
      'contact.eyebrow.project': 'Start Your Project',
      'contact.headline': 'Ready to start your next <span class="gold-word">project</span>?',
      'contact.headline.project': 'Build something like this <span class="gold-word">together</span>?',
      'contact.body': 'We build cabinetry and millwork for fine homes across Sacramento, the Bay Area, and Northern California. We\'d love to help build yours.',
      'contact.call': 'Give us a call',
      'contact.email': 'Send us an email',
      'contact.workshop': 'Workshop',
      'contact.hours': 'Hours',
      'footer.nav.work': 'Our Work',
      'footer.nav.about': 'About',
      'footer.nav.contact': 'Contact',
      'footer.nav.services': 'What We Build',
      'footer.tagline': 'Custom Cabinetry + Millwork. Since 1985.',
      'footer.copy': 'Built with care in California.',
      'footer.navHeading': 'Navigation',
      'footer.workshopHeading': 'Workshop',
      'see-more.title': 'See <span class="gold-word">more of our work</span>.',
      'see-more.lede': 'From Sacramento kitchens to Bay Area paneled rooms. Browse the full portfolio.',
      'see-more.btn': 'Browse All Projects',
      'project.back': '← Back to Our Work',
      'sticky.cta': 'Start Your Project',
    },
    es: {
      'nav.work': 'Nuestro Trabajo',
      'nav.about': 'Nosotros',
      'nav.contact': 'Contacto',
      'nav.cta': 'Iniciar Proyecto',
      'nav.services': 'Lo Que Construimos',
      'hero.eyebrow': 'Gabinetería Personalizada + Carpintería · Desde 1985',
      'hero.headline': 'Construido para los lugares de los que te sientes <span class="gold-word">orgulloso</span>.',
      'hero.sub': 'Gabinetería personalizada y carpintería fina para espacios residenciales y comerciales en Sacramento, el Área de la Bahía y el norte de California.',
      'hero.cta.primary': 'Iniciar Proyecto',
      'hero.cta.secondary': 'Ver Nuestro Trabajo',
      'hero.trust': 'Citrus Heights · Sacramento · Área de la Bahía · Norte de California',
      'workshop.eyebrow': '01 — Lo que construimos',
      'workshop.title': 'Gabinetería personalizada y carpintería, <span class="gold-word">hecha en nuestro taller</span>.',
      'workshop.lede': 'Medimos, diseñamos, construimos e instalamos cada pieza desde nuestro taller en Citrus Heights. Esto es lo que construimos, y una muestra de cómo vive en los hogares de nuestros clientes.',
      'recentwork.eyebrow': '02 — Véalo en acción',
      'recentwork.title': 'Lo que construimos. <span class="gold-word">Recientemente</span>.',
      'recentwork.lede': 'Ejemplos del trabajo de arriba, diseñado y construido en nuestro taller en Citrus Heights.',
      'gbp.eyebrow': '03 — Verificado en Google',
      'gbp.title': 'De nuestro <span class="gold-word">Perfil de Empresa en Google</span>.',
      'gbp.lede': 'Reseñas reales de clientes en Sacramento y el Área de la Bahía.',
      'gbp.more': 'Ver todas las reseñas en Google →',
      'contact.eyebrow': '04 — Iniciar Proyecto',
      'contact.eyebrow.project': 'Iniciar Proyecto',
      'contact.headline': '¿Listo para comenzar tu próximo <span class="gold-word">proyecto</span>?',
      'contact.headline.project': '¿Construimos algo así <span class="gold-word">juntos</span>?',
      'contact.body': 'Construimos gabinetería y carpintería fina para hogares en Sacramento, el Área de la Bahía y el norte de California. Nos encantaría ayudarte a construir el tuyo.',
      'contact.call': 'Llámanos',
      'contact.email': 'Envíanos un correo',
      'contact.workshop': 'Taller',
      'contact.hours': 'Horario',
      'footer.nav.work': 'Nuestro Trabajo',
      'footer.nav.about': 'Nosotros',
      'footer.nav.contact': 'Contacto',
      'footer.nav.services': 'Lo Que Construimos',
      'footer.tagline': 'Gabinetería Personalizada + Carpintería. Desde 1985.',
      'footer.copy': 'Construido con cuidado en California.',
      'footer.navHeading': 'Navegación',
      'footer.workshopHeading': 'Taller',
      'see-more.title': 'Ver <span class="gold-word">más de nuestro trabajo</span>.',
      'see-more.lede': 'De cocinas en Sacramento a salones con paneles en el Área de la Bahía. Explora todo el portafolio.',
      'see-more.btn': 'Ver Todos los Proyectos',
      'project.back': '← Volver a Nuestro Trabajo',
      'sticky.cta': 'Iniciar Proyecto',
    }
  };

  function applyLanguage(lang) {
    if (!I18N[lang]) lang = 'en';
    const dict = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (!dict[key]) return;
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    });
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      const en = btn.querySelector('.lang-toggle__en');
      const es = btn.querySelector('.lang-toggle__es');
      if (en) en.classList.toggle('is-active', lang === 'en');
      if (es) es.classList.toggle('is-active', lang === 'es');
    });
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('pci-lang', lang); } catch (e) {}
  }

  function initLangToggle() {
    let lang = 'en';
    try {
      const saved = localStorage.getItem('pci-lang');
      if (saved && I18N[saved]) lang = saved;
    } catch (e) {}
    applyLanguage(lang);
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        let current = 'en';
        try { current = localStorage.getItem('pci-lang') || 'en'; } catch (e) {}
        applyLanguage(current === 'en' ? 'es' : 'en');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangToggle);
  } else {
    initLangToggle();
  }
})();
