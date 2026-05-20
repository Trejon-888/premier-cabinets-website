/* =====================================================
   Premier Cabinets Innovations — site behaviors
   Vanilla JS. No build step. GSAP loaded via CDN for hero parallax.
   ===================================================== */

(function () {
  'use strict';

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    // close on link click
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Scroll-triggered reveals (IntersectionObserver) ----
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Hero parallax (only on home, only if GSAP loaded) ----
  function initHeroParallax() {
    if (reduced) return;
    const heroBg = document.querySelector('.hero__bg img');
    if (!heroBg) return;
    if (typeof gsap === 'undefined') return;

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

  // GSAP may load async via CDN; defer until window load
  window.addEventListener('load', () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      initHeroParallax();
    }
  });

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

  // ---- Contact form (placeholder — no backend yet) ----
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = encodeURIComponent(data.get('name') || '');
      const contact = encodeURIComponent(data.get('contact') || '');
      const type = encodeURIComponent(data.get('project-type') || '');
      const desc = encodeURIComponent(data.get('description') || '');
      const subject = encodeURIComponent('Project inquiry from premiercabinetsinnovations.com');
      const body = `Name: ${name}%0D%0AContact: ${contact}%0D%0AProject type: ${type}%0D%0A%0D%0A${desc}`;
      // Fallback to mailto — full form wiring (GHL / Formspree) added in Month 2
      window.location.href = `mailto:felix@premiercabinetsinnovations.com?subject=${subject}&body=${body}`;
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
})();
