// ——— CURSOR ———
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .service-card, .portfolio-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '60px';
    ring.style.height = '60px';
    ring.style.borderColor = 'rgba(0,212,255,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'rgba(0,212,255,0.5)';
  });
});

// ——— NAVBAR SCROLL ———
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ——— MOBILE MENU ———
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
  window.ITANALYTICS.trackConversion('mobile-menu-open');
});

document.getElementById('menuClose').addEventListener('click', closeMobile);

function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ——— PARTICLES ———
const container = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.cssText = `left:${Math.random() * 100}%;animation-duration:${6 + Math.random() * 10}s;animation-delay:${Math.random() * 10}s;opacity:${0.2 + Math.random() * 0.4}`;
  container.appendChild(p);
}

// ——— SCROLL REVEAL ———
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const section = e.target.closest('section');
      if (section && section.id) window.ITANALYTICS.trackSection(section.id);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .process-step').forEach(el => observer.observe(el));

// ——— COUNTER ANIMATION ———
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.count);
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          el.textContent = target + (target === 100 ? '' : '+');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start) + (target === 24 ? '/7' : '+');
        }
      }, 25);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ——— FORM SUBMIT ———
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre   = document.getElementById('formNombre').value.trim();
  const email    = document.getElementById('formEmail').value.trim();
  const telefono = document.getElementById('formTelefono').value.trim();
  const empresa  = document.getElementById('formEmpresa').value.trim();
  const tipo     = document.getElementById('formTipo').value;
  const mensaje  = document.getElementById('formMensaje').value.trim();

  if (!nombre || !email) {
    alert('Por favor completá nombre y email.');
    return;
  }

  const btn = document.querySelector('.form-submit');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Enviando...';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '0fb83ab4-60ca-49a0-b016-2e1b684c8a23',
        subject: `Nueva consulta de ${nombre} — IT-Integral Solutions`,
        from_name: nombre,
        reply_to: email,
        name: nombre,
        email: email,
        telefono: telefono || '—',
        empresa: empresa || '—',
        tipo_proyecto: tipo || '—',
        mensaje: mensaje || '—'
      })
    });

    const data = await res.json();

    if (data.success) {
      window.ITANALYTICS.trackConversion('form-submit');
      window.ITANALYTICS.trackConversion('lead-' + (tipo || 'general'));
      btn.querySelector('span').textContent = '¡Consulta enviada! ✓';
      btn.style.background = 'linear-gradient(135deg, #0a7a3e, #0fa854)';
      document.getElementById('contactForm').reset();
    } else {
      throw new Error(data.message || 'Error desconocido');
    }
  } catch (err) {
    console.error('[Form] Error:', err);
    btn.querySelector('span').textContent = 'Error al enviar. Intentá de nuevo.';
    btn.disabled = false;
    setTimeout(() => {
      btn.querySelector('span').textContent = 'Enviar Consulta →';
      btn.style.background = '';
    }, 4000);
  }
});

// ——— ANALYTICS: Track outbound links ———
document.querySelectorAll('a[href^="http"]').forEach(link => {
  link.addEventListener('click', () => {
    window.ITANALYTICS.trackConversion('outbound-' + link.href);
  });
});

// ——— FOOTER YEAR ———
const footerYearEl = document.getElementById('footerYear');
if (footerYearEl) footerYearEl.textContent = new Date().getFullYear();

// ——— FAQ ACCORDION ———
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
