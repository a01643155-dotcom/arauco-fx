/* ═══════════════════════════════════════════════════════════
   ARAUCO · FX RISK ANALYSIS · main.js
═══════════════════════════════════════════════════════════ */

// ─── AOS Init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile menu
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObserver.observe(el));
});

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 1800;
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = prefix + current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ─── CHART HELPERS ────────────────────────────────────────── */
const COLORS = {
  forest: '#1C3A1A', green: '#2D5A1B', olive: '#6B8E23',
  sage: '#8FAF5A', wood: '#8B5E3C', woodLt: '#C49A6C',
  beige: '#F5F0E8', gray: '#9AA3AE',
  red: '#C62828', yellow: '#F9A825',
  gridLine: 'rgba(0,0,0,.06)',
};

const defaultFont = { family: "'Inter', sans-serif", size: 12 };

Chart.defaults.font = defaultFont;
Chart.defaults.color = '#6C757D';

function makeLineChart(id, labels, datasets, options = {}) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
        tooltip: {
          backgroundColor: '#1C3A1A', titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,.8)', padding: 12,
          cornerRadius: 8,
        },
        ...options.plugins,
      },
      scales: {
        x: { grid: { color: COLORS.gridLine }, ...options.xScale },
        y: { grid: { color: COLORS.gridLine }, ...options.yScale },
      },
      ...options.extra,
    },
  });
}

function makeBarChart(id, labels, datasets, options = {}) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
        tooltip: {
          backgroundColor: '#1C3A1A', titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,.8)', padding: 12, cornerRadius: 8,
        },
        ...options.plugins,
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: COLORS.gridLine }, ...options.yScale },
      },
      ...options.extra,
    },
  });
}

function makeDoughnutChart(id, labels, data, colors) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }],
    },
    options: {
      responsive: true, cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1C3A1A', titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,.8)', padding: 12, cornerRadius: 8,
        },
      },
    },
  });
}

/* ─── PAGE-SPECIFIC CHARTS ─────────────────────────────────── */

// ─── HOME ─────────────────────────────────────────────────────
function initHomeCharts() {
  // Revenue by segment donut
  makeDoughnutChart('segmentChart',
    ['Pulpa', 'Madera & Paneles'],
    [50, 50],
    [COLORS.green, COLORS.wood]
  );
}

// ─── COMPANY ──────────────────────────────────────────────────
function initCompanyCharts() {
  // Revenue by region
  makeDoughnutChart('regionChart',
    ['Norte América', 'LATAM', 'Asia & Oceanía', 'Europa', 'Otros'],
    [37, 38, 19, 6, 1] ,
    [COLORS.forest, COLORS.green, COLORS.olive, COLORS.sage, COLORS.gray]
  );

  // Wood products volumes
  makeBarChart('woodVolChart',
    ['2021', '2022', '2023', '2024', '2025'],
    [{
      label: 'Producción (M m³)',
      data: [3.8, 3.4, 3.0, 2.9, 2.9],
      backgroundColor: COLORS.green,
      borderRadius: 6,
    },{
      label: 'Ventas (M m³)',
      data: [3.6, 3.2, 2.8, 2.8, 2.7],
      backgroundColor: COLORS.sage,
      borderRadius: 6,
    }],
    { yScale: { title: { display: true, text: 'Millones de m³' } } }
  );

  // EBITDA evolution (illustrative based on public data)
  makeBarChart('ebitdaChart',
    ['2021', '2022', '2023', '2024', '2025 LTM'],
    [{
      label: 'EBITDA Ajustado (US$ M)',
      data: [1820, 2100, 1540, 1210, 1331],
      backgroundColor: [COLORS.sage, COLORS.sage, COLORS.olive, COLORS.olive, COLORS.green],
      borderRadius: 6,
    }],
    {
      plugins: { legend: { display: false } },
      yScale: { title: { display: true, text: 'US$ Millones' } }
    }
  );
}

// ─── INDUSTRY ─────────────────────────────────────────────────
function initIndustryCharts() {
  // Global pulp capacity comparison
  makeBarChart('pulpCapChart',
    ['Suzano', 'APRIL/Bracell', 'ARAUCO', 'UPM-Kymmene', 'CMPC'],
    [{
      label: 'Capacidad (Miles ton)',
      data: [8775, 5275, 5275, 4800, 4200],
      backgroundColor: [COLORS.gray, COLORS.gray, COLORS.green, COLORS.gray, COLORS.gray],
      borderRadius: 6,
    }],
    { plugins: { legend: { display: false } }, yScale: { title: { display: true, text: 'Miles de toneladas' } } }
  );

  // Mexico melamine market CAGR
  makeLineChart('melamineMxChart',
    ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'],
    [{
      label: 'Mercado Melamina México (Miles m³)',
      data: [310, 330, 350, 377, 415, 456, 507, 624, 637, 762],
      borderColor: COLORS.wood,
      backgroundColor: 'rgba(139,94,60,.1)',
      fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 4,
    }],
    { yScale: { title: { display: true, text: 'Miles de m³' } } }
  );
}

// ─── MACRO ────────────────────────────────────────────────────
function initMacroCharts() {
  // USD/MXN historical trend
  makeLineChart('usdmxnChart',
    ['2019','2020','2021','2022','2023','2024','2025 E'],
    [{
      label: 'TC Promedio (MXN/USD)',
      data: [19.26, 21.49, 20.28, 20.11, 17.45, 17.20, 18.50],
      borderColor: COLORS.wood,
      backgroundColor: 'rgba(139,94,60,.08)',
      fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 5,
      pointBackgroundColor: COLORS.wood,
    },{
      label: 'TC Fin de Año',
      data: [18.85, 19.90, 20.55, 19.50, 17.05, 20.20, 18.80],
      borderColor: COLORS.sage,
      borderDash: [5,4],
      backgroundColor: 'transparent',
      tension: 0.4, borderWidth: 1.8, pointRadius: 4,
      pointBackgroundColor: COLORS.sage,
    }],
    {
      yScale: { title: { display: true, text: 'MXN por USD' }, min: 15, max: 24 },
    }
  );

  // Mexico interest rate & inflation
  makeLineChart('macroMxChart',
    ['2020','2021','2022','2023','2024','2025 E'],
    [{
      label: 'Tasa Banxico (%)',
      data: [4.25, 5.50, 10.50, 11.25, 10.00, 8.50],
      borderColor: COLORS.forest,
      backgroundColor: 'transparent',
      tension: 0.4, borderWidth: 2.5, pointRadius: 4,
    },{
      label: 'Inflación MX (%)',
      data: [3.15, 7.36, 7.82, 4.66, 4.21, 3.80],
      borderColor: COLORS.wood,
      backgroundColor: 'transparent',
      tension: 0.4, borderWidth: 2.5, pointRadius: 4,
    }],
    {
      yScale: { title: { display: true, text: 'Porcentaje (%)' } },
    }
  );

  // Global lumber price index (illustrative)
  makeLineChart('lumberChart',
    ['2020','2021','2022','2023','2024','2025 E'],
    [{
      label: 'Índice Precio Madera (USD/MBF)',
      data: [350, 1650, 600, 380, 420, 490],
      borderColor: COLORS.olive,
      backgroundColor: 'rgba(107,142,35,.1)',
      fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 5,
    }],
    { plugins: { legend: { display: false } }, yScale: { title: { display: true, text: 'USD/MBF' } } }
  );
}

// ─── FX EXPOSURE ──────────────────────────────────────────────
function initFXCharts() {
  // Cost structure pie
  makeDoughnutChart('costStructureChart',
    ['Materias Primas USD', 'Mano de Obra MXN', 'Logística Mixta', 'Overhead MXN'],
    [55, 22, 13, 10],
    [COLORS.wood, COLORS.green, COLORS.sage, COLORS.olive]
  );

  // Sensitivity: EBITDA impact per peso depreciation
  makeBarChart('sensitivityChart',
    ['−5% MXN', '−3% MXN', 'Base', '+3% MXN', '+5% MXN'],
    [{
      label: 'Impacto en EBITDA México (US$ M)',
      data: [-18.5, -11.1, 0, 11.1, 18.5],
      backgroundColor: ['#C62828','#EF5350','#9AA3AE','#4CAF50','#2E7D32'],
      borderRadius: 6,
    }],
    {
      plugins: { legend: { display: false } },
      yScale: { title: { display: true, text: 'US$ Millones' } },
      extra: {
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: COLORS.gridLine }, title: { display: true, text: 'US$ Millones' } },
        }
      }
    }
  );

  // USD/MXN forecast scenarios
  makeLineChart('fxScenarioChart',
    ['Hoy', 'Q2-2026', 'Q3-2026', 'Q4-2026'],
    [{
      label: 'Escenario Optimista',
      data: [17.2, 16.8, 16.5, 16.2],
      borderColor: '#2E7D32', backgroundColor: 'transparent',
      borderDash: [4,3], tension: 0.3, borderWidth: 2, pointRadius: 4,
    },{
      label: 'Escenario Base',
      data: [17.2, 17.8, 18.3, 18.8],
      borderColor: COLORS.forest, backgroundColor: 'transparent',
      tension: 0.3, borderWidth: 2.5, pointRadius: 5,
    },{
      label: 'Escenario Adverso',
      data: [17.2, 19.0, 20.5, 22.0],
      borderColor: '#C62828', backgroundColor: 'transparent',
      borderDash: [4,3], tension: 0.3, borderWidth: 2, pointRadius: 4,
    }],
    { yScale: { min: 15, max: 23, title: { display: true, text: 'MXN / USD' } } }
  );
}

// ─── HEDGING ──────────────────────────────────────────────────
function initHedgingCharts() {
  // Payoff diagram: forward vs unhedged
  const tcValues = [14, 15, 16, 17, 18, 19, 20, 21, 22];
  const fwdRate = 17.5;
  makeLineChart('payoffChart',
    tcValues.map(v => v.toFixed(0)),
    [{
      label: 'Sin cobertura (pago en MXN)',
      data: tcValues.map(v => -(v * 1000000)),
      borderColor: COLORS.wood,
      backgroundColor: 'transparent',
      tension: 0, borderWidth: 2, pointRadius: 3,
    },{
      label: 'Con Forward (Strike 17.50)',
      data: tcValues.map(() => -(fwdRate * 1000000)),
      borderColor: COLORS.green,
      backgroundColor: 'transparent',
      borderDash: [6,4], tension: 0, borderWidth: 2.5, pointRadius: 0,
    },{
      label: 'Con Call OTM (K=18.00)',
      data: tcValues.map(v => -(Math.max(v, 18.0) * 1000000) + (v > 18 ? 0 : 0) - 85000),
      borderColor: COLORS.sage,
      backgroundColor: 'transparent',
      tension: 0, borderWidth: 2, pointRadius: 3,
    }],
    {
      yScale: { title: { display: true, text: 'Costo neto (MXN)' } },
      xScale: { title: { display: true, text: 'TC spot vencimiento (MXN/USD)' } },
    }
  );

  // Cost of hedging comparison
  makeBarChart('hedgeCostChart',
    ['Forward', 'Futuro MEXDER', 'Swap', 'Opción Call OTM', 'Cobertura Natural'],
    [{
      label: 'Costo estimado (% del nocional)',
      data: [0.0, 0.1, 0.3, 0.8, 0.0],
      backgroundColor: [COLORS.green, COLORS.olive, COLORS.sage, COLORS.wood, COLORS.gray],
      borderRadius: 6,
    }],
    { plugins: { legend: { display: false } }, yScale: { title: { display: true, text: '% del nocional' } } }
  );
}

// ─── AUTO-INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body.dataset.page;
  if (body === 'home')     initHomeCharts();
  if (body === 'company')  initCompanyCharts();
  if (body === 'industry') initIndustryCharts();
  if (body === 'macro')    initMacroCharts();
  if (body === 'fx')       initFXCharts();
  if (body === 'hedging')  initHedgingCharts();
});
