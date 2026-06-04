// ── Navbar scroll ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile nav toggle ─────────────────────────────────────────
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  });
}

// ── Counter animation ─────────────────────────────────────────
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0');
    let start = null;
    const duration = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + (target * ease).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { requestAnimationFrame(step); obs.disconnect(); }
    });
    obs.observe(el);
  });
}

// ── AOS init ──────────────────────────────────────────────────
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 50 });
  }
}

// ── Hero parallax ─────────────────────────────────────────────
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `scale(1.04) translateY(${window.scrollY * 0.12}px)`;
    }, { passive: true });
  }
}

// ── Init on DOM ready ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initAOS();
  initParallax();
});
