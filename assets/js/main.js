/* Medal & More — main.js */
(function () {
  'use strict';

  /* Sticky nav */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav */
  const toggle  = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 12;
        window.scrollTo({ top, behavior: 'smooth' });
        if (navMenu) { navMenu.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); }
      }
    });
  });

  /* Scroll reveal */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => io.observe(el));
  }

  /* Counter animation */
  const statEls = document.querySelectorAll('.hero-stat-num[data-target]');
  if (statEls.length) {
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); io2.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => io2.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Newsletter form */
  const nlForm = document.getElementById('newsletter-form');
  const nlMsg  = document.getElementById('nl-msg');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('nl-email')?.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNlMsg('Please enter a valid email address.', 'error'); return;
      }
      const btn = nlForm.querySelector('button');
      if (btn) { btn.disabled = true; btn.textContent = 'Subscribing…'; }
      // Simulate success (replace with real API call)
      setTimeout(() => {
        showNlMsg('🎉 You\'re subscribed! First email coming soon.', 'success');
        nlForm.reset();
        if (btn) { btn.disabled = false; btn.innerHTML = 'Subscribe Free <span>→</span>'; }
      }, 800);
    });
  }
  function showNlMsg(text, type) {
    if (!nlMsg) return;
    nlMsg.textContent = text;
    nlMsg.style.display = 'block';
    nlMsg.style.color = type === 'success' ? '#22c55e' : '#ef4444';
    setTimeout(() => { nlMsg.style.display = 'none'; }, 5000);
  }

  /* Card tilt effect */
  document.querySelectorAll('.game-card, .athlete-card, .news-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 5;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 5;
      card.style.transform = `translateY(-4px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform 0.05s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.3s ease';
    });
  });

  /* LA 2028 countdown */
  const la2028 = new Date('2028-07-14T00:00:00');
  const updateCountdown = () => {
    const diff = la2028 - Date.now();
    if (diff <= 0) return;
    const days = Math.floor(diff / 86400000);
    const badge = document.querySelector('.badge-gold');
    if (badge) {
      badge.innerHTML = `<span class="badge-dot"></span> 🔴 LA 2028 Olympics — ${days.toLocaleString()} Days to Go`;
    }
  };
  updateCountdown();
  setInterval(updateCountdown, 60000);

})();
