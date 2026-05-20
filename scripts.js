/* =====================================================
   Premier Cabinets Innovations — site behaviors
   Somerville-grade choreography. Vanilla JS + GSAP via CDN.
   ===================================================== */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Scroll-triggered reveals (IntersectionObserver fallback for non-GSAP) ----
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

  // ---- Sticky CTA: enter + pulse-once on hero scroll-past ----
  const stickyCta = document.querySelector('[data-sticky-cta]');
  if (stickyCta) {
    // Enter from below
    if (reduced) {
      stickyCta.classList.add('is-ready');
    } else {
      // GSAP-driven entrance if available, else CSS class toggle
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

    // Pulse once when user scrolls past hero
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

    // Click handler: smooth scroll to #contact if on home/contact, else navigate
    stickyCta.addEventListener('click', (e) => {
      const onHome = /\/(index\.html)?$/.test(window.location.pathname) || window.location.pathname.endsWith('/');
      const hasContact = document.querySelector('#contact');
      if ((onHome || window.location.pathname.endsWith('contact.html')) && hasContact) {
        e.preventDefault();
        hasContact.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
      // else default <a href="contact.html#form"> behavior runs
    });
  }

  // ---- Sticky header scroll state ----
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader && !siteHeader.classList.contains('site-header--solid')) {
    const onHeaderScroll = () => {
      if (window.scrollY > 80) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    };
    onHeaderScroll();
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
  }

  // ---- GSAP choreography (loaded on window load) ----
  function initGsap() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) return;

    // Hero background parallax (home only)
    const heroBg = document.querySelector('.hero__bg img');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Case-study photo parallax
    document.querySelectorAll('.case-study__photo img').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.case-study'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    // Workshop photo subtle parallax
    document.querySelectorAll('.workshop__photo img').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.workshop__photo'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    // Service cards stagger
    const serviceCards = document.querySelectorAll('.services__grid .service-card');
    if (serviceCards.length > 0) {
      gsap.from(serviceCards, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.services__grid',
          start: 'top 80%',
        },
      });
    }
  }

  // ---- Projects filter (only on projects.html) ----
  const filterBar = document.querySelector('[data-filter-bar]');
  if (filterBar) {
    const cards = document.querySelectorAll('[data-project-cat]');
    filterBar.querySelectorAll('.filter-bar__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-bar__btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.dataset.filter;
        cards.forEach((card) => {
          const cats = (card.dataset.projectCat || '').split(/\s+/);
          if (filter === 'all' || cats.includes(filter)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Year in footer ----
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // ---- Active nav link (current page) ----
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  // ---- GSAP defer until load ----
  window.addEventListener('load', () => {
    initGsap();
  });
})();
