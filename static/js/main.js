// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}
// Mobile toggle
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}
// Counter animation
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals || '0');
  let start = null;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = (target * ease).toFixed(decimals);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { requestAnimationFrame(step); observer.disconnect(); }
  });
  observer.observe(el);
});
// AOS init
if (typeof AOS !== 'undefined') AOS.init({ duration: 700, once: true, offset: 60 });
// Hero parallax
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `scale(1.04) translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });
}
