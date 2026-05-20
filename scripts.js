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
  // HERO CAROUSEL
  // -----------------------------------------------------
  const carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-carousel__dot'));
    let activeIdx = 0;
    let timer = null;
    let isPaused = false;
    const DURATION = 6000; // ms per slide
    const FADE = 1200;

    function setActive(idx) {
      activeIdx = (idx + slides.length) % slides.length;
      slides.forEach((s, i) => {
        if (i === activeIdx) s.classList.add('is-active');
        else s.classList.remove('is-active');
      });
      dots.forEach((d, i) => {
        if (i === activeIdx) d.classList.add('is-active');
        else d.classList.remove('is-active');
      });
      applyKenBurns();
    }

    function applyKenBurns() {
      if (reduced || typeof gsap === 'undefined') return;
      const active = slides[activeIdx];
      if (!active) return;
      gsap.killTweensOf(active);
      gsap.fromTo(active, { scale: 1.05 }, {
        scale: 1.12,
        duration: DURATION / 1000,
        ease: 'none',
      });
    }

    function next() {
      if (isPaused) return;
      const nextIdx = (activeIdx + 1) % slides.length;
      crossfade(nextIdx);
    }

    function crossfade(toIdx) {
      const from = slides[activeIdx];
      const to = slides[toIdx];
      if (!from || !to) return;
      if (reduced || typeof gsap === 'undefined') {
        setActive(toIdx);
        return;
      }
      // Bring "to" up while keeping "from" visible
      gsap.set(to, { opacity: 0 });
      to.classList.add('is-active');
      gsap.to(to, { opacity: 1, duration: FADE / 1000, ease: 'power2.inOut' });
      gsap.to(from, {
        opacity: 0, duration: FADE / 1000, ease: 'power2.inOut',
        onComplete: () => {
          from.classList.remove('is-active');
          gsap.set(from, { opacity: '' });
        },
      });
      activeIdx = toIdx;
      dots.forEach((d, i) => {
        if (i === activeIdx) d.classList.add('is-active');
        else d.classList.remove('is-active');
      });
      applyKenBurns();
    }

    function start() {
      stop();
      timer = setInterval(next, DURATION);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function pause() { isPaused = true; stop(); }
    function resume() { isPaused = false; start(); }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.dataset.dot || 0);
        if (idx === activeIdx) return;
        crossfade(idx);
        // Reset timer cadence
        start();
      });
    });

    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', resume);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pause();
      else resume();
    });

    // Boot
    setActive(0);
    if (reduced) {
      // Still rotate every 8 seconds with no animation
      timer = setInterval(() => {
        const nextIdx = (activeIdx + 1) % slides.length;
        setActive(nextIdx);
      }, 8000);
    } else {
      // Defer to gsap available
      const startWhenReady = () => {
        if (typeof gsap === 'undefined') {
          setTimeout(startWhenReady, 100);
          return;
        }
        applyKenBurns();
        start();
      };
      startWhenReady();
    }
  }

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
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
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
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.reveal-hairline').forEach((el) => el.classList.add('is-visible'));
  }

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
    const oldServiceCards = document.querySelectorAll('.services__grid .service-card');
    if (oldServiceCards.length > 0) {
      gsap.from(oldServiceCards, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.services__grid', start: 'top 80%', once: true },
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
  });
})();
