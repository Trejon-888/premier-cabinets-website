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

  // ============================================================
  // PORTFOLIO ILLUSTRATION — large line-art for projects.html
  // Open book / drafting portfolio: cabinet elevation on left
  // page, floor plan on right, diagonal pencil. Draws in via
  // GSAP stroke-dashoffset like the service icons.
  // ============================================================
  const PORTFOLIO_ICON = `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <!-- Book spine -->
      <line x1="300" y1="80" x2="300" y2="335" stroke-width="1.4"/>
      <!-- Left page outline -->
      <path d="M 300 80 Q 200 75 80 95 L 80 320 Q 200 305 300 335" stroke-width="1.8"/>
      <path d="M 300 92 Q 210 88 95 105" stroke-width="0.6" opacity="0.5"/>
      <!-- Right page outline -->
      <path d="M 300 80 Q 400 75 520 95 L 520 320 Q 400 305 300 335" stroke-width="1.8"/>
      <path d="M 300 92 Q 390 88 505 105" stroke-width="0.6" opacity="0.5"/>

      <!-- LEFT PAGE — cabinet elevation -->
      <rect x="120" y="125" width="150" height="105" stroke-width="1.3"/>
      <line x1="120" y1="170" x2="270" y2="170" stroke-width="1"/>
      <line x1="170" y1="125" x2="170" y2="170" stroke-width="0.7"/>
      <line x1="220" y1="125" x2="220" y2="170" stroke-width="0.7"/>
      <line x1="170" y1="170" x2="170" y2="230" stroke-width="0.7"/>
      <line x1="220" y1="170" x2="220" y2="230" stroke-width="0.7"/>
      <circle cx="160" cy="148" r="1.3" fill="currentColor"/>
      <circle cx="180" cy="148" r="1.3" fill="currentColor"/>
      <circle cx="210" cy="148" r="1.3" fill="currentColor"/>
      <circle cx="230" cy="148" r="1.3" fill="currentColor"/>
      <circle cx="160" cy="200" r="1.3" fill="currentColor"/>
      <circle cx="180" cy="200" r="1.3" fill="currentColor"/>
      <circle cx="210" cy="200" r="1.3" fill="currentColor"/>
      <circle cx="230" cy="200" r="1.3" fill="currentColor"/>
      <!-- Dimension line -->
      <line x1="120" y1="115" x2="270" y2="115" stroke-width="0.5"/>
      <line x1="120" y1="111" x2="120" y2="119" stroke-width="0.5"/>
      <line x1="270" y1="111" x2="270" y2="119" stroke-width="0.5"/>
      <!-- Caption lines -->
      <line x1="120" y1="252" x2="270" y2="252" stroke-width="0.5" opacity="0.55"/>
      <line x1="120" y1="265" x2="240" y2="265" stroke-width="0.5" opacity="0.55"/>
      <line x1="120" y1="278" x2="258" y2="278" stroke-width="0.5" opacity="0.55"/>

      <!-- RIGHT PAGE — floor plan -->
      <rect x="330" y="125" width="150" height="105" stroke-width="1.3"/>
      <line x1="370" y1="125" x2="370" y2="170" stroke-width="0.9"/>
      <line x1="370" y1="170" x2="440" y2="170" stroke-width="0.9"/>
      <line x1="440" y1="170" x2="440" y2="230" stroke-width="0.9"/>
      <rect x="385" y="180" width="55" height="28" stroke-width="0.7"/>
      <rect x="335" y="178" width="8" height="48" stroke-width="0.6"/>
      <rect x="335" y="130" width="8" height="35" stroke-width="0.6"/>
      <rect x="447" y="178" width="8" height="48" stroke-width="0.6"/>
      <path d="M 462 132 A 11 11 0 0 1 473 143" stroke-width="0.6"/>
      <circle cx="462" cy="132" r="1.3" fill="currentColor"/>
      <!-- Caption lines -->
      <line x1="330" y1="252" x2="480" y2="252" stroke-width="0.5" opacity="0.55"/>
      <line x1="330" y1="265" x2="455" y2="265" stroke-width="0.5" opacity="0.55"/>
      <line x1="330" y1="278" x2="465" y2="278" stroke-width="0.5" opacity="0.55"/>

      <!-- Pencil diagonal across right page -->
      <g transform="rotate(35, 460, 295)">
        <rect x="402" y="290" width="78" height="9" stroke-width="1.2"/>
        <path d="M 480 290 L 494 294.5 L 480 299 Z" stroke-width="1.2"/>
        <rect x="395" y="288" width="7" height="13" stroke-width="0.9"/>
        <line x1="412" y1="290" x2="412" y2="299" stroke-width="0.5" opacity="0.55"/>
        <line x1="425" y1="290" x2="425" y2="299" stroke-width="0.5" opacity="0.55"/>
        <line x1="438" y1="290" x2="438" y2="299" stroke-width="0.5" opacity="0.55"/>
        <line x1="451" y1="290" x2="451" y2="299" stroke-width="0.5" opacity="0.55"/>
        <line x1="464" y1="290" x2="464" y2="299" stroke-width="0.5" opacity="0.55"/>
      </g>
    </g>
  </svg>`;

  function injectPortfolioIcon() {
    document.querySelectorAll('[data-portfolio-icon]').forEach((el) => {
      if (!el.querySelector('svg')) el.innerHTML = PORTFOLIO_ICON;
    });
  }

  function animatePortfolioIcon() {
    const els = document.querySelectorAll('[data-portfolio-icon]');
    if (els.length === 0) return;
    if (reduced || typeof gsap === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    els.forEach((el) => {
      const paths = el.querySelectorAll('svg path, svg line, svg rect');
      const dots = el.querySelectorAll('svg circle, svg ellipse');
      paths.forEach((p) => {
        if (p.getTotalLength) {
          try {
            const len = p.getTotalLength();
            p.style.strokeDasharray = len;
            p.style.strokeDashoffset = len;
          } catch (e) { /* skip */ }
        }
      });
      dots.forEach((c) => { c.style.opacity = '0'; });

      // Iteration 21: detect if element is in viewport on load (e.g. hero placement).
      // If yes, animate IMMEDIATELY — don't wait for ScrollTrigger which can stall
      // when the trigger is already past its start position at page load.
      const rect = el.getBoundingClientRect();
      const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;

      const runDrawIn = () => {
        el.classList.add('is-visible');
        gsap.to(paths, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut' });
        gsap.to(dots, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.8 });
      };

      if (alreadyInView) {
        // Small delay to let layout settle, then draw in
        setTimeout(runDrawIn, 250);
      } else if (typeof ScrollTrigger !== 'undefined') {
        const safetyTimer = setTimeout(runDrawIn, 3000);
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => { clearTimeout(safetyTimer); runDrawIn(); },
        });
      } else {
        runDrawIn();
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
      injectPortfolioIcon();
    });
  } else {
    injectOrnaments();
    injectServiceIcons();
    injectPortfolioIcon();
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

    // Section headline reveals — every h2 inside a section that isn't already
    // wrapped in split-text AND isn't using the .reveal IntersectionObserver
    // path (iter 17: prevents double-animation conflict on .contact-section__headline
    // which was causing the visible "fade in, fade out, fade in" flicker).
    document.querySelectorAll('section h2:not([data-split-text]):not(.reveal):not(.contact-section__headline)').forEach((h) => {
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
    // Iteration 17: run initExtendedMotion BEFORE initGsap so the `.reveal`
    // class is applied to section h2 elements before the GSAP `section h2`
    // ScrollTrigger sweep would have grabbed them, preventing the double-
    // animation conflict that produced the contact-section flicker.
    initExtendedMotion();  // iteration 15 — extended scroll motion (must run first)
    initGsap();
    initSplitText();
    initCounters();
    injectOrnaments();   // safety re-inject in case any frames were missed
    animateOrnaments();  // wire GSAP draw-in for ornament corners
    injectServiceIcons();
    animateServiceIcons();
    injectPortfolioIcon();
    animatePortfolioIcon();
  });

  // FINAL SAFETY: 2 seconds after window load, force any element STILL stuck
  // below opacity 0.5 to fully visible. Smarter than before (iter 17):
  //  - Skips anything already animated in normally (the previous version
  //    forced opacity:1 + transform:none !important on EVERY element in the
  //    selector list, which could overwrite an in-flight reveal transform
  //    and cause the visible "fade out, fade back in" flicker on the
  //    contact section's headline).
  //  - For `.reveal` elements that ARE stuck, also add `.is-visible` so the
  //    reveal CSS path is consistent (no inline style stomping the class).
  window.addEventListener('load', () => {
    setTimeout(() => {
      const selectors = '.contact-section__headline, .contact-section__body, .contact-section__meta, .enquiry-form, .reviews-strip, .review-card, .process-strip__step, .editorial-card, .service-card, .built-and-work__title, .built-and-work__sub-title, .reveal';
      document.querySelectorAll(selectors).forEach((el) => {
        const op = parseFloat(getComputedStyle(el).opacity);
        // Skip elements that are already visible — don't re-poke them
        if (op > 0.5) return;
        // For .reveal elements, prefer the CSS class path
        if (el.classList.contains('reveal')) {
          el.classList.add('is-visible');
        } else {
          // Force visible without GSAP (avoid retriggering tweens)
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
      // ===== NAV / HEADER =====
      'nav.work': 'Our Work',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.cta': 'Start Your Project',
      'nav.services': 'What We Build',
      'nav.home': 'Home',

      // ===== HERO =====
      'hero.eyebrow': 'Custom Cabinetry + Millwork · Since 1985',
      'hero.headline': 'Built for the places you\'re <span class="gold-word">proud</span> of.',
      'hero.sub': 'Custom cabinetry and millwork for residential and commercial spaces across Sacramento, the Bay Area, and Northern California.',
      'hero.cta.primary': 'Start Your Project',
      'hero.cta.secondary': 'See Our Work',
      'hero.trust': 'Citrus Heights · Sacramento · Bay Area · Northern California',

      // ===== WORKSHOP / BUILT & WORK (home) =====
      'workshop.eyebrow': '01 — What we build',
      'workshop.title': 'Custom cabinetry and millwork, from <span class="gold-word">our workshop</span>.',
      'workshop.lede': 'We measure, draw, build, and install every piece from our Citrus Heights workshop. Here is what we build, and a sample of how it lives in our clients\' homes.',
      'workshop.caveat': 'Plus custom millwork tailored to your home.',

      // ===== SERVICE CARDS (home — 7 cards) =====
      'sc.01.name': 'Custom Kitchens',
      'sc.01.desc': 'The whole room measured, drawn, built. Eight to ten weeks in shop, one to two weeks on site.',
      'sc.02.name': 'Bathroom Vanities',
      'sc.02.desc': 'Floating, footed, or integrated. Built around your bathroom\'s exact layout.',
      'sc.03.name': 'Wall Paneling',
      'sc.03.desc': 'Floor-to-ceiling panels for living rooms, libraries, dining rooms, and entryways.',
      'sc.04.name': 'Custom Moldings & Frames',
      'sc.04.desc': 'Crown, base, casing, and frames cut to match historical or modern profiles.',
      'sc.05.name': 'Built-In Bookshelves',
      'sc.05.desc': 'Library-grade shelving for studies, home offices, and great rooms.',
      'sc.06.name': 'Mantels & Fireplace Surrounds',
      'sc.06.desc': 'Custom-shaped mantels in oak, walnut, or painted hardwood.',
      'sc.07.name': 'Restoration & Refinishing',
      'sc.07.desc': 'Period restoration, cabinet refacing, and full refinishing of existing millwork.',

      // ===== RECENT WORK (home) =====
      'recentwork.eyebrow': '02 — See it in action',
      'recentwork.title': 'Recently in our clients\' homes.',
      'recentwork.lede': 'Examples of the work above, drawn and built in our Citrus Heights workshop.',
      'recentwork.seeAll': 'See all projects →',
      'rw.card.1.cat': '01 · Custom Kitchens',
      'rw.card.1.title': 'Matte-black slab and walnut kitchen for Bay Area residence',
      'rw.card.1.client': 'Private client',
      'rw.card.1.loc': 'San Francisco Bay Area',
      'rw.card.2.cat': '03 · Wall Paneling',
      'rw.card.2.title': 'Walnut library and study paneling',
      'rw.card.2.client': 'Private residence',
      'rw.card.2.loc': 'Sacramento, CA',
      'rw.card.3.cat': '01 · Custom Kitchens',
      'rw.card.3.title': 'Arched glass display cabinets and slab marble island',
      'rw.card.3.client': 'Private residence',
      'rw.card.3.loc': 'Citrus Heights, CA',
      'rw.card.4.cat': '02 · Bathroom Vanities',
      'rw.card.4.title': 'Hollywood Regency dual vanity with fluted columns',
      'rw.card.4.client': 'Private residence',
      'rw.card.4.loc': 'Bay Area, CA',

      // ===== REVIEWS STRIP (home) =====
      'rs.label': 'In their words',
      'rs.r1.quote': 'We\'ve never been happier with how everything turned out. The kitchen feels like it was always supposed to be there.',
      'rs.r1.name': 'Lauren Schmidt',
      'rs.r1.role': 'Kitchen · Sacramento',
      'rs.r2.quote': 'Felix and his team handled a project that spanned two kitchens, a media room, and three bathrooms. Every space feels like it belongs to the same home now.',
      'rs.r2.name': 'Malahat Tavassoli',
      'rs.r2.role': 'Multi-room residence',
      'rs.r3.quote': 'Delivered on time and on budget. The cabinets are exactly what we asked for.',
      'rs.r3.name': 'Dustin Moore',
      'rs.r3.role': 'Kitchen renovation',
      'rs.more': 'More reviews on Google Business Profile →',

      // ===== GOOGLE BUSINESS PROFILE =====
      'gbp.eyebrow': '03 — Trusted on Google',
      'gbp.title': 'From our <span class="gold-word">Google Business Profile</span>.',
      'gbp.lede': 'Real reviews from clients across Sacramento and the Bay Area.',
      'gbp.more': 'See all reviews on Google →',

      // ===== PROCESS STRIP =====
      'ps.label': '03 — Our Process',
      'ps.title': 'From first meeting to final <span class="gold-word">install</span>.',
      'ps.lede': 'Four steps. Same shop end to end.',
      'ps.s1.name': 'Consultation',
      'ps.s1.desc': 'We meet at your home or our Citrus Heights showroom.',
      'ps.s2.name': 'Design',
      'ps.s2.desc': 'Measured drawings, material samples, written proposal.',
      'ps.s3.name': 'Build',
      'ps.s3.desc': 'Six to ten weeks in the workshop, with weekly photos.',
      'ps.s4.name': 'Install',
      'ps.s4.desc': 'One to two weeks on site. Punch list cleared at end.',

      // ===== CONTACT SECTION (shared across pages) =====
      'contact.eyebrow': '04 — Start Your Project',
      'contact.eyebrow.project': 'Start Your Project',
      'contact.headline': 'Ready to start your next <span class="gold-word">project</span>?',
      'contact.headline.project': 'Build something like this <span class="gold-word">together</span>?',
      'contact.body': 'We build cabinetry and millwork for fine homes across Sacramento, the Bay Area, and Northern California.',
      'contact.call': 'Give us a call',
      'contact.email': 'Send us an email',
      'contact.workshop': 'Workshop',
      'contact.hours': 'Hours',
      'contact.hours.value': 'Mon–Fri, 8a–5p<br />Saturday by appointment',
      'contact.workshop.value': '5910 Auburn Blvd Suite 21<br />Citrus Heights, CA 95621',

      // ===== ENQUIRY FORM =====
      'form.firstName': 'First Name',
      'form.lastName': 'Last Name',
      'form.phone': 'Phone Number',
      'form.phoneOpt': '(optional)',
      'form.email': 'Email',
      'form.enquiryType': 'Enquiry Type',
      'form.enquirySelect': 'Please select',
      'form.opt.kitchen': 'Custom Kitchen',
      'form.opt.bath': 'Bathroom Cabinetry',
      'form.opt.paneled': 'Paneled Rooms + Millwork',
      'form.opt.builtins': 'Built-ins + Specialty Work',
      'form.opt.restoration': 'Restoration',
      'form.opt.general': 'General Enquiry',
      'form.location': 'Project Address / City',
      'form.locationPlaceholder': 'Sacramento, Bay Area, other',
      'form.message': 'Message',
      'form.messagePlaceholder': 'What you have in mind, rough timeline, and the address or city if you can share it.',
      'form.subscribe': 'Subscribe for occasional updates on the workshop and new projects.',
      'form.privacy': 'We use your message only to respond to your enquiry. Your details are not shared.',
      'form.send': 'Send Message',
      'form.submitNote': 'We respond within one business day.',
      'form.felixReply': 'Felix typically replies within one business day.',

      // ===== FOOTER =====
      'footer.nav.work': 'Our Work',
      'footer.nav.about': 'About',
      'footer.nav.contact': 'Contact',
      'footer.nav.services': 'What We Build',
      'footer.tagline': 'Custom Cabinetry + Millwork. Since 1985.',
      'footer.copy': 'Built with care in California.',
      'footer.care': 'Built in our Citrus Heights workshop.',
      'footer.navHeading': 'Navigation',
      'footer.workshopHeading': 'Workshop',
      'footer.copyYear': '© 2026 Premier Cabinets Innovations LLC',
      'footer.privacy': 'Privacy',
      'footer.terms': 'Terms',
      'footer.backtotop': 'Back to top',
      'footer.copyPrefix': '© ',
      'footer.copySuffix': ' Premier Cabinets Innovations LLC',

      // ===== SEE MORE (shared) =====
      'see-more.title': 'See <span class="gold-word">more of our work</span>.',
      'see-more.lede': 'From Sacramento kitchens to Bay Area paneled rooms. Browse the full portfolio.',
      'see-more.btn': 'Browse All Projects',
      'project.back': '← Back to Our Work',
      'project.materials': 'Materials & details',
      'project.featured': 'Featured · Kitchen',

      // ===== STICKY CTA =====
      'sticky.cta': 'Start Your Project',
      'sticky.label': 'Talk to us',
      'sticky.short': 'Start',

      // ===== ABOUT PAGE =====
      'about.eyebrow': 'About the workshop',
      'about.h1': 'Meet Felix. Forty-one years of cabinet craft.',
      'about.lede': 'When you call Premier Cabinets Innovations, you talk to Felix. He\'s been drawing, building, and installing cabinets from the same Citrus Heights workshop since 1985.',
      'about.story.title': 'A workshop, not a showroom.',
      'about.story.p1': 'Felix opened the shop in 1985. The phone has been at the same address ever since. Forty-one years on, the work passes through fewer hands than at any other cabinet shop in the region.',
      'about.story.p2': 'Every project is measured, drawn, cut, joined, finished, and installed by the same small team. Felix is on every consultation, every drawing review, and every final walkthrough.',
      'about.story.p3': 'We work with homeowners directly and with the architects and interior designers they trust. Most of our work comes from referrals — people who had Felix do their kitchen telling their friends he\'ll do theirs too.',
      'about.story.sidebar.title': 'Felix',
      'about.story.sidebar.p': 'Founded the workshop in 1985. Still on every project, from first measure to final install.',
      'about.stats.41.label': 'Years of cabinet craft',
      'about.stats.1.label': 'Workshop in Citrus Heights',
      'about.stats.0.label': 'Projects Felix hasn\'t personally seen',
      'about.area.eyebrow': 'Service area',
      'about.area.title': 'Where we work.',
      'about.area.lede': 'Sacramento Metro is home. The Bay Area is a regular drive. Destination work follows a careful schedule.',
      'about.area.sac': 'Sacramento Metro',
      'about.area.sac.list': 'Citrus Heights · Roseville · Folsom · El Dorado Hills · Granite Bay · Auburn · Elk Grove',
      'about.area.bay': 'Bay Area',
      'about.area.bay.list': 'San Francisco · Oakland · Berkeley · Marin · Walnut Creek · San Jose · Palo Alto · Atherton',
      'about.area.dest': 'Destination',
      'about.area.dest.list': 'Tahoe Basin · Wine Country · Carmel / Monterey',

      // ===== PROJECTS PAGE =====
      'pj.hero.h1': 'Built in Citrus Heights. Made for fine homes across Northern California.',
      'pj.hero.lede': 'Custom cabinetry and millwork projects from 1985 to today.',
      'pj.featured.eyebrow': 'Featured · Kitchen',
      'pj.featured.title': 'Matte-black slab and walnut kitchen for Bay Area residence.',
      'pj.featured.type': 'Type',
      'pj.featured.loc': 'Location',
      'pj.featured.year': 'Year',
      'pj.featured.materials': 'Materials',
      'pj.grid.eyebrow1': 'Selected · Recent work',
      'pj.grid.eyebrow2': 'More Projects',
      'pj.grid.title': 'A scannable <span class="gold-word">selection</span>.',
      'pj.grid.lede': 'Nine more projects — full kitchens to single built-ins. Each carries the workshop\'s measured, finished standard.',
      'pj.portfolio.eyebrow': 'Portfolio · Our Work',
      'pj.portfolio.caption': 'Every project starts on paper. Measured drawings, elevations, and floor plans drafted in our Citrus Heights workshop.',
      'pj.materials.h': 'Materials & details',
      'project.materials': 'Materials & details',
      'project.back': '<span aria-hidden="true">←</span> Back to Our Work',
      'project.prev': '← Previous project',
      'project.next': 'Next project →',

      // ===== SERVICES PAGE =====
      'sv.hero.eyebrow': 'What we build',
      'sv.hero.h1': 'Custom cabinetry and millwork for the rooms that matter.',
      'sv.hero.lede': 'Every project measured, drawn, built, and installed by the same small team in our Citrus Heights workshop.',

      // ===== CONTACT PAGE =====
      'cn.hero.eyebrow': 'Start a Project',
      'cn.hero.h1': 'Tell us about the room.',
      'cn.hero.lede': 'A short note about what you have in mind is enough to get the conversation started. Felix replies within one business day.',

      // ===== THANK YOU =====
      'ty.h1': 'Thank you.',
      'ty.body': 'Your message is in the workshop. We\'ll respond within one business day.',
      'ty.back': '← Back to home',
    },

    es: {
      // ===== NAV / HEADER =====
      'nav.work': 'Nuestro Trabajo',
      'nav.about': 'Nosotros',
      'nav.contact': 'Contacto',
      'nav.cta': 'Iniciar Proyecto',
      'nav.services': 'Lo Que Construimos',
      'nav.home': 'Inicio',

      // ===== HERO =====
      'hero.eyebrow': 'Gabinetería Personalizada + Carpintería Fina · Desde 1985',
      'hero.headline': 'Construido para los lugares que lo hacen sentir <span class="gold-word">orgulloso</span>.',
      'hero.sub': 'Gabinetería personalizada y carpintería fina para espacios residenciales y comerciales en Sacramento, el Área de la Bahía y el norte de California.',
      'hero.cta.primary': 'Iniciar Proyecto',
      'hero.cta.secondary': 'Ver Nuestro Trabajo',
      'hero.trust': 'Citrus Heights · Sacramento · Área de la Bahía · Norte de California',

      // ===== WORKSHOP / BUILT & WORK =====
      'workshop.eyebrow': '01 — Lo que construimos',
      'workshop.title': 'Gabinetería personalizada y carpintería fina, desde <span class="gold-word">nuestro taller</span>.',
      'workshop.lede': 'Medimos, dibujamos, construimos e instalamos cada pieza desde nuestro taller en Citrus Heights. Esto es lo que construimos, y una muestra de cómo vive en los hogares de nuestros clientes.',
      'workshop.caveat': 'Más carpintería fina personalizada a la medida de su hogar.',

      // ===== SERVICE CARDS =====
      'sc.01.name': 'Cocinas Personalizadas',
      'sc.01.desc': 'La habitación completa medida, dibujada y construida. De ocho a diez semanas en el taller, una a dos semanas en obra.',
      'sc.02.name': 'Tocadores de Baño',
      'sc.02.desc': 'Flotantes, con base o integrados. Construidos a la medida exacta de su baño.',
      'sc.03.name': 'Paneles de Pared',
      'sc.03.desc': 'Paneles de piso a techo para salas, bibliotecas, comedores y vestíbulos.',
      'sc.04.name': 'Molduras y Marcos Personalizados',
      'sc.04.desc': 'Cornisas, zócalos, marcos de puerta y marcos cortados para igualar perfiles históricos o modernos.',
      'sc.05.name': 'Estanterías Empotradas',
      'sc.05.desc': 'Estanterías de calidad de biblioteca para estudios, oficinas en casa y salones principales.',
      'sc.06.name': 'Repisas y Marcos de Chimenea',
      'sc.06.desc': 'Repisas de chimenea personalizadas en roble, nogal o madera dura pintada.',
      'sc.07.name': 'Restauración y Reacabado',
      'sc.07.desc': 'Restauración de época, recubrimiento de gabinetes y reacabado completo de carpintería existente.',

      // ===== RECENT WORK =====
      'recentwork.eyebrow': '02 — Véalo en acción',
      'recentwork.title': 'Recientemente, en los hogares de nuestros clientes.',
      'recentwork.lede': 'Ejemplos del trabajo de arriba, dibujado y construido en nuestro taller en Citrus Heights.',
      'recentwork.seeAll': 'Ver todos los proyectos →',
      'rw.card.1.cat': '01 · Cocinas Personalizadas',
      'rw.card.1.title': 'Cocina de placas negras mate y nogal para residencia en el Área de la Bahía',
      'rw.card.1.client': 'Cliente privado',
      'rw.card.1.loc': 'Área de la Bahía de San Francisco',
      'rw.card.2.cat': '03 · Paneles de Pared',
      'rw.card.2.title': 'Biblioteca y estudio con paneles de nogal',
      'rw.card.2.client': 'Residencia privada',
      'rw.card.2.loc': 'Sacramento, CA',
      'rw.card.3.cat': '01 · Cocinas Personalizadas',
      'rw.card.3.title': 'Vitrinas con arco de cristal e isla de placa de mármol',
      'rw.card.3.client': 'Residencia privada',
      'rw.card.3.loc': 'Citrus Heights, CA',
      'rw.card.4.cat': '02 · Tocadores de Baño',
      'rw.card.4.title': 'Tocador doble estilo Hollywood Regency con columnas estriadas',
      'rw.card.4.client': 'Residencia privada',
      'rw.card.4.loc': 'Área de la Bahía, CA',

      // ===== REVIEWS STRIP =====
      'rs.label': 'En sus palabras',
      'rs.r1.quote': 'Nunca habíamos estado más contentos con cómo quedó todo. La cocina se siente como si siempre hubiera estado ahí.',
      'rs.r1.name': 'Lauren Schmidt',
      'rs.r1.role': 'Cocina · Sacramento',
      'rs.r2.quote': 'Felix y su equipo manejaron un proyecto que abarcó dos cocinas, una sala multimedia y tres baños. Cada espacio se siente parte del mismo hogar ahora.',
      'rs.r2.name': 'Malahat Tavassoli',
      'rs.r2.role': 'Residencia multi-habitación',
      'rs.r3.quote': 'Entregado a tiempo y dentro del presupuesto. Los gabinetes son exactamente lo que pedimos.',
      'rs.r3.name': 'Dustin Moore',
      'rs.r3.role': 'Renovación de cocina',
      'rs.more': 'Más reseñas en el Perfil de Empresa de Google →',

      // ===== GOOGLE BUSINESS PROFILE =====
      'gbp.eyebrow': '03 — Verificado en Google',
      'gbp.title': 'De nuestro <span class="gold-word">Perfil de Empresa en Google</span>.',
      'gbp.lede': 'Reseñas reales de clientes en Sacramento y el Área de la Bahía.',
      'gbp.more': 'Ver todas las reseñas en Google →',

      // ===== PROCESS STRIP =====
      'ps.label': '03 — Nuestro Proceso',
      'ps.title': 'Desde la primera reunión hasta la <span class="gold-word">instalación</span> final.',
      'ps.lede': 'Cuatro pasos. El mismo taller de principio a fin.',
      'ps.s1.name': 'Consulta',
      'ps.s1.desc': 'Nos reunimos en su hogar o en nuestra sala de exhibición en Citrus Heights.',
      'ps.s2.name': 'Diseño',
      'ps.s2.desc': 'Dibujos a medida, muestras de materiales, propuesta por escrito.',
      'ps.s3.name': 'Construcción',
      'ps.s3.desc': 'De seis a diez semanas en el taller, con fotos semanales.',
      'ps.s4.name': 'Instalación',
      'ps.s4.desc': 'Una a dos semanas en obra. Lista de pendientes resuelta al final.',

      // ===== CONTACT SECTION =====
      'contact.eyebrow': '04 — Iniciar Proyecto',
      'contact.eyebrow.project': 'Iniciar Proyecto',
      'contact.headline': '¿Listo para comenzar su próximo <span class="gold-word">proyecto</span>?',
      'contact.headline.project': '¿Construimos algo así <span class="gold-word">juntos</span>?',
      'contact.body': 'Construimos gabinetería y carpintería fina para hogares en Sacramento, el Área de la Bahía y el norte de California.',
      'contact.call': 'Llámenos',
      'contact.email': 'Envíenos un correo',
      'contact.workshop': 'Taller',
      'contact.hours': 'Horario',
      'contact.hours.value': 'Lun–Vie, 8a–5p<br />Sábado con cita previa',
      'contact.workshop.value': '5910 Auburn Blvd Suite 21<br />Citrus Heights, CA 95621',

      // ===== ENQUIRY FORM =====
      'form.firstName': 'Nombre',
      'form.lastName': 'Apellido',
      'form.phone': 'Número de Teléfono',
      'form.phoneOpt': '(opcional)',
      'form.email': 'Correo Electrónico',
      'form.enquiryType': 'Tipo de Consulta',
      'form.enquirySelect': 'Seleccione',
      'form.opt.kitchen': 'Cocina Personalizada',
      'form.opt.bath': 'Gabinetería de Baño',
      'form.opt.paneled': 'Habitaciones con Paneles + Carpintería',
      'form.opt.builtins': 'Empotrados + Trabajo Especial',
      'form.opt.restoration': 'Restauración',
      'form.opt.general': 'Consulta General',
      'form.location': 'Dirección / Ciudad del Proyecto',
      'form.locationPlaceholder': 'Sacramento, Área de la Bahía, otra',
      'form.message': 'Mensaje',
      'form.messagePlaceholder': 'Lo que tiene en mente, el plazo aproximado, y la dirección o ciudad si puede compartirla.',
      'form.subscribe': 'Suscríbase para actualizaciones ocasionales del taller y proyectos nuevos.',
      'form.privacy': 'Usamos su mensaje solamente para responder a su consulta. Sus datos no se comparten.',
      'form.send': 'Enviar Mensaje',
      'form.submitNote': 'Respondemos dentro de un día hábil.',
      'form.felixReply': 'Felix normalmente responde dentro de un día hábil.',

      // ===== FOOTER =====
      'footer.nav.work': 'Nuestro Trabajo',
      'footer.nav.about': 'Nosotros',
      'footer.nav.contact': 'Contacto',
      'footer.nav.services': 'Lo Que Construimos',
      'footer.tagline': 'Gabinetería Personalizada + Carpintería Fina. Desde 1985.',
      'footer.copy': 'Construido con cuidado en California.',
      'footer.care': 'Construido en nuestro taller de Citrus Heights.',
      'footer.navHeading': 'Navegación',
      'footer.workshopHeading': 'Taller',
      'footer.copyYear': '© 2026 Premier Cabinets Innovations LLC',
      'footer.privacy': 'Privacidad',
      'footer.terms': 'Términos',
      'footer.backtotop': 'Volver arriba',
      'footer.copyPrefix': '© ',
      'footer.copySuffix': ' Premier Cabinets Innovations LLC',

      // ===== SEE MORE (shared) =====
      'see-more.title': 'Vea <span class="gold-word">más de nuestro trabajo</span>.',
      'see-more.lede': 'De cocinas en Sacramento a salones con paneles en el Área de la Bahía. Explore todo el portafolio.',
      'see-more.btn': 'Ver Todos los Proyectos',
      'project.back': '← Volver a Nuestro Trabajo',
      'project.materials': 'Materiales y detalles',
      'project.featured': 'Destacado · Cocina',

      // ===== STICKY CTA =====
      'sticky.cta': 'Iniciar Proyecto',
      'sticky.label': 'Hablemos',
      'sticky.short': 'Iniciar',

      // ===== ABOUT PAGE =====
      'about.eyebrow': 'Sobre el taller',
      'about.h1': 'Conozca a Felix. Cuarenta y un años de arte en gabinetería.',
      'about.lede': 'Cuando llama a Premier Cabinets Innovations, habla con Felix. Lleva diseñando, construyendo e instalando gabinetes desde el mismo taller de Citrus Heights desde 1985.',
      'about.story.title': 'Un taller, no una sala de exhibición.',
      'about.story.p1': 'Felix abrió el taller en 1985. El teléfono ha estado en la misma dirección desde entonces. Cuarenta y un años después, el trabajo pasa por menos manos que en cualquier otro taller de gabinetería de la región.',
      'about.story.p2': 'Cada proyecto se mide, se dibuja, se corta, se ensambla, se acaba y se instala por el mismo equipo pequeño. Felix está en cada consulta, en cada revisión de diseño y en cada recorrido final.',
      'about.story.p3': 'Trabajamos directamente con los propietarios y con los arquitectos y diseñadores de interiores en los que confían. La mayoría de nuestro trabajo viene por referencias — personas a las que Felix les hizo su cocina contándoles a sus amigos que también les hará la suya.',
      'about.story.sidebar.title': 'Felix',
      'about.story.sidebar.p': 'Fundó el taller en 1985. Sigue en cada proyecto, desde la primera medición hasta la instalación final.',
      'about.stats.41.label': 'Años de arte en gabinetería',
      'about.stats.1.label': 'Taller en Citrus Heights',
      'about.stats.0.label': 'Proyectos que Felix no ha visto personalmente',
      'about.area.eyebrow': 'Área de servicio',
      'about.area.title': 'Dónde trabajamos.',
      'about.area.lede': 'Sacramento Metro es nuestra casa. El Área de la Bahía es un viaje regular. El trabajo en destinos sigue un calendario cuidadoso.',
      'about.area.sac': 'Sacramento Metro',
      'about.area.sac.list': 'Citrus Heights · Roseville · Folsom · El Dorado Hills · Granite Bay · Auburn · Elk Grove',
      'about.area.bay': 'Área de la Bahía',
      'about.area.bay.list': 'San Francisco · Oakland · Berkeley · Marin · Walnut Creek · San Jose · Palo Alto · Atherton',
      'about.area.dest': 'Destino',
      'about.area.dest.list': 'Cuenca de Tahoe · Wine Country · Carmel / Monterey',

      // ===== PROJECTS PAGE =====
      'pj.hero.h1': 'Construido en Citrus Heights. Hecho para hogares finos en todo el norte de California.',
      'pj.hero.lede': 'Proyectos de gabinetería personalizada y carpintería fina desde 1985 hasta hoy.',
      'pj.featured.eyebrow': 'Destacado · Cocina',
      'pj.featured.title': 'Cocina de placas negras mate y nogal para residencia en el Área de la Bahía.',
      'pj.featured.type': 'Tipo',
      'pj.featured.loc': 'Ubicación',
      'pj.featured.year': 'Año',
      'pj.featured.materials': 'Materiales',
      'pj.grid.eyebrow1': 'Selección · Trabajo reciente',
      'pj.grid.eyebrow2': 'Más proyectos',
      'pj.grid.title': 'Una <span class="gold-word">selección</span> escaneable.',
      'pj.grid.lede': 'Nueve proyectos más — desde cocinas completas hasta piezas empotradas individuales. Cada uno lleva el estándar medido y acabado del taller.',
      'pj.portfolio.eyebrow': 'Portafolio · Nuestro Trabajo',
      'pj.portfolio.caption': 'Cada proyecto comienza en papel. Planos a medida, alzados y plantas de planta dibujadas en nuestro taller en Citrus Heights.',
      'pj.materials.h': 'Materiales y detalles',
      'project.materials': 'Materiales y detalles',
      'project.back': '<span aria-hidden="true">←</span> Volver a Nuestro Trabajo',
      'project.prev': '← Proyecto anterior',
      'project.next': 'Siguiente proyecto →',

      // ===== SERVICES PAGE =====
      'sv.hero.eyebrow': 'Lo que construimos',
      'sv.hero.h1': 'Gabinetería personalizada y carpintería fina para las habitaciones que importan.',
      'sv.hero.lede': 'Cada proyecto medido, dibujado, construido e instalado por el mismo equipo pequeño en nuestro taller en Citrus Heights.',

      // ===== CONTACT PAGE =====
      'cn.hero.eyebrow': 'Iniciar Proyecto',
      'cn.hero.h1': 'Cuéntenos sobre la habitación.',
      'cn.hero.lede': 'Una nota breve sobre lo que tiene en mente es suficiente para iniciar la conversación. Felix responde dentro de un día hábil.',

      // ===== THANK YOU =====
      'ty.h1': 'Gracias.',
      'ty.body': 'Su mensaje está en el taller. Responderemos dentro de un día hábil.',
      'ty.back': '← Volver al inicio',
    }
  };

  function applyLanguage(lang) {
    if (!I18N[lang]) lang = 'en';
    const dict = I18N[lang];
    // Dict-based translation (shared UI chrome)
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (!dict[key]) return;
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    });
    // Iteration 18: inline per-element translation (project-specific content)
    document.querySelectorAll('[data-i18n-es]').forEach((el) => {
      const enValue = el.dataset.i18nEn;
      const esValue = el.dataset.i18nEs;
      const target = lang === 'es' ? esValue : enValue;
      if (typeof target !== 'string') return;
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = target;
      } else {
        el.textContent = target;
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
