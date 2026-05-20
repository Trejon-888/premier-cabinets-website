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
  const ORNAMENT_SVG = `
<svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet" aria-hidden="true">
  <!-- Outer L-bracket -->
  <path d="M 4 100 L 4 4 L 100 4" stroke-width="1.5" fill="none" stroke-linecap="square" />
  <!-- Inner parallel L -->
  <path d="M 12 100 L 12 12 L 100 12" stroke-width="0.8" fill="none" stroke-linecap="square" />
  <!-- Acanthus curl -->
  <path d="M 18 18 Q 32 18 38 24 Q 44 30 38 38 Q 32 44 26 38 Q 22 34 26 28" stroke-width="1" fill="none" stroke-linecap="round" />
  <!-- Accent dots -->
  <circle class="ornament-dot" cx="30" cy="12" r="1.2" />
  <circle class="ornament-dot" cx="12" cy="30" r="1.2" />
  <circle class="ornament-dot" cx="60" cy="4" r="0.7" />
  <circle class="ornament-dot" cx="4" cy="60" r="0.7" />
  <!-- Tiny diagonal accent -->
  <line x1="4" y1="4" x2="14" y2="14" stroke-width="0.6" />
</svg>
`;

  function injectOrnaments() {
    document.querySelectorAll('.ornament-frame__corner').forEach((el) => {
      if (!el.querySelector('svg')) el.innerHTML = ORNAMENT_SVG;
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
    document.addEventListener('DOMContentLoaded', injectOrnaments);
  } else {
    injectOrnaments();
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

    const SLIDE_DURATION = 9000;   // ms — slower, more elegant pacing
    const FADE_DURATION = 1.8;     // seconds — slightly longer crossfade
    const KB_START = 1.0;          // Ken Burns starting scale
    const KB_END = 1.04;           // Ken Burns ending scale — reduced from 1.08
                                    // to minimize blur amplification on the
                                    // source photos (now upscaled to 2400px).

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
  // -----------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader && !siteHeader.classList.contains('site-header--solid')) {
    const onHeaderScroll = () => {
      if (window.scrollY > 80) siteHeader.classList.add('is-scrolled');
      else siteHeader.classList.remove('is-scrolled');
    };
    onHeaderScroll();
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
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
  });
})();
