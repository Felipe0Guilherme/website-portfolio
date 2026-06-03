
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle — transição lenta (~4.5s)
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  themeToggle.addEventListener('click', () => {
    if (html.classList.contains('theme-transitioning')) return; // ignora clique durante transição

    const cur = html.getAttribute('data-theme');
    const nxt = cur === 'dark' ? 'light' : 'dark';

    // Ripple visual no botão
    themeToggle.classList.remove('rippling');
    void themeToggle.offsetWidth; // força reflow
    themeToggle.classList.add('rippling');

    // Ativa transição lenta
    html.classList.add('theme-transitioning');
    themeToggle.classList.add('transitioning');

    // Troca o tema
    html.setAttribute('data-theme', nxt);
    localStorage.setItem('theme', nxt);

    // Atualiza ícone no meio da animação (após 0.6s, quando ele some)
    setTimeout(() => updateIcon(nxt), 600);

    // Remove classes de transição após completar
    const DURATION = 1000;
    setTimeout(() => {
      html.classList.remove('theme-transitioning');
      themeToggle.classList.remove('transitioning', 'rippling');
    }, DURATION);
  });

  function updateIcon(t) {
    themeToggle.innerHTML = t === 'dark'
      ? '<i data-lucide="sun"></i>'
      : '<i data-lucide="moon"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Mobile menu
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navbar = document.getElementById('navbar');
  if (mobileBtn && navbar) {
    mobileBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = navbar.classList.toggle('active');
      mobileBtn.classList.toggle('active', isOpen);
      mobileBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navbar.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        navbar.classList.remove('active');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobileBtn.contains(e.target)) {
        navbar.classList.remove('active');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        mobileBtn.focus();
      }
    });
  }

  // Header scroll
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    // scroll progress
    const prog = document.getElementById('scrollProgress');
    const total = document.body.scrollHeight - window.innerHeight;
    prog.style.width = (window.scrollY / total * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Typing effect
  const words = ['Dev Full Stack Jr', 'React Developer', 'React Native Dev', 'Python Enthusiast', 'Problem Solver'];
  let wi = 0, ci = 0, deleting = false;
  const typingEl = document.getElementById('typingText');
  function type() {
    const word = words[wi];
    if (!deleting) {
      typingEl.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      typingEl.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();

  // Reveal on scroll
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('revealed'), i * 80);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObs.observe(el));

  // Skill bars
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(fill => {
          const prog = fill.getAttribute('data-progress');
          fill.style.width = prog + '%';
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skills-panel').forEach(p => barObs.observe(p));

  // Skill tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.getAttribute('data-tab'));
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.skill-fill').forEach(fill => {
          fill.style.width = fill.getAttribute('data-progress') + '%';
        });
      }
    });
  });
  // Init first panel bars
  document.querySelectorAll('#tab-principal .skill-fill').forEach(fill => {
    setTimeout(() => { fill.style.width = fill.getAttribute('data-progress') + '%'; }, 600);
  });

  // Container scroll effect
  const scrollCard = document.querySelector('.container-scroll-card');
  if (scrollCard) {
    const scrollObs = new IntersectionObserver(([entry]) => {
      scrollCard.classList.toggle('flat', entry.intersectionRatio > 0.5);
    }, { threshold: [0, 0.5, 1] });
    scrollObs.observe(scrollCard);
  }

  // Orbital timeline
  const timelineData = [
    { id:1, title:'Início', date:'Jan 2024', content:'Comecei levantando todos os requisitos do projeto, mapeando as funcionalidades essenciais e definindo a estrutura base. É aqui que tudo ganha forma na minha cabeça.', icon:'lightbulb', status:'completed', energy:100 },
    { id:2, title:'Design', date:'Fev 2024', content:'Desenhei a interface e a arquitetura do sistema. Defini paleta de cores, fluxo de telas e a experiência que queria entregar pro usuário final.', icon:'pen-tool', status:'completed', energy:90 },
    { id:3, title:'Dev', date:'Mar 2024', content:'Mão na massa! Implementei as funcionalidades principais, integrações e componentização. É a fase que mais gosto — ver o código virar produto.', icon:'code-2', status:'in-progress', energy:60 },
    { id:4, title:'Testes', date:'Abr 2024', content:'Coloquei o projeto na mão de usuários reais, coletei feedback e corrigi os bugs encontrados. Cada erro resolvido é um passo a mais rumo à qualidade.', icon:'check-circle', status:'pending', energy:30 },
    { id:5, title:'Deploy', date:'Mai 2024', content:'Hora de subir para produção! Configurei o ambiente, fiz o build final e publiquei. Ver o projeto ao vivo é sempre a melhor sensação.', icon:'rocket', status:'pending', energy:10 },
  ];

  const container = document.getElementById('orbitalContainer');
  if (!container) return;

  let rotation = 0;
  let autoRotate = true;
  let activeId = null;
  const nodeEls = {};

  function buildNodes() {
    const cx = container.offsetWidth / 2;
    const cy = container.offsetHeight / 2;
    const radius = Math.min(cx, cy) * 0.72;

    timelineData.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'orbital-node';
      el.id = 'node-' + item.id;
      el.innerHTML = `
        <div class="node-dot">
          <i data-lucide="${item.icon}"></i>
          <div class="node-pulse"></div>
        </div>
        <div class="node-label">${item.title}</div>
        <div class="node-card">
          <div class="node-card-header">
            <span class="node-status ${item.status}">${item.status === 'completed' ? 'Concluído' : item.status === 'in-progress' ? 'Em andamento' : 'Pendente'}</span>
            <span class="node-date">${item.date}</span>
          </div>
          <div class="node-title">${item.title}</div>
          <div class="node-desc">${item.content}</div>
          <div class="node-energy-bar"><div class="node-energy-fill" style="width:${item.energy}%"></div></div>
        </div>
      `;
      el.addEventListener('click', e => {
        e.stopPropagation();
        if (activeId === item.id) {
          el.classList.remove('active');
          activeId = null;
          autoRotate = true;
        } else {
          if (activeId) document.getElementById('node-' + activeId)?.classList.remove('active');
          el.classList.add('active');
          activeId = item.id;
          autoRotate = false;
        }
      });
      container.appendChild(el);
      nodeEls[item.id] = { el, idx };
    });

    container.addEventListener('click', e => {
      if (e.target === container) {
        if (activeId) document.getElementById('node-' + activeId)?.classList.remove('active');
        activeId = null; autoRotate = true;
      }
    });
  }

  function updatePositions() {
    const cx = container.offsetWidth / 2;
    const cy = container.offsetHeight / 2;
    const radius = Math.min(cx, cy) * 0.72;
    const total = timelineData.length;

    Object.values(nodeEls).forEach(({ el, idx }) => {
      const angle = ((idx / total) * 360 + rotation) * Math.PI / 180;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const opacity = 0.4 + 0.6 * ((1 + Math.sin(angle)) / 2);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.opacity = el.classList.contains('active') ? 1 : opacity;
      el.style.zIndex = el.classList.contains('active') ? 200 : Math.round(50 + 30 * Math.sin(angle));
    });
  }

  buildNodes();
  if (typeof lucide !== 'undefined') lucide.createIcons();

  function animate() {
    if (autoRotate) rotation = (rotation + 0.3) % 360;
    updatePositions();
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', updatePositions);

  // Contact form — Formspree
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Enviando...';

      // Honeypot bot check
      if (form.querySelector('[name="_honey"]') && form.querySelector('[name="_honey"]').value) {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Enviar Mensagem';
        return;
      }

      try {
        const res = await fetch('https://formspree.io/f/mvzynplk', {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          status.textContent = '✓ Mensagem enviada! Entrarei em contato em breve.';
          status.classList.add('success');
          form.reset();
        } else {
          const json = await res.json();
          const msg = json.errors ? json.errors.map(er => er.message).join(', ') : 'Erro ao enviar.';
          status.textContent = '✗ ' + msg;
          status.classList.add('error');
        }
      } catch (err) {
        status.textContent = '✗ Sem conexão. Tente novamente ou me contate pelo email.';
        status.classList.add('error');
      }

      btn.disabled = false;
      btn.querySelector('span').textContent = 'Enviar Mensagem';
    });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
});


if (typeof lucide !== 'undefined') lucide.createIcons();


// ── Sparkles canvas — mouse repulse + 2000 particles ──
(function initSparkles() {
  const canvas = document.getElementById('sparkles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('home');

  let W, H;
  // Mouse position relative to canvas (-9999 = off-screen / not hovering)
  const mouse = { x: -9999, y: -9999, active: false };

  const REPULSE_RADIUS  = 120;  // pixels — how far the repulse reaches
  const REPULSE_FORCE   = 2.8;  // strength multiplier
  const RETURN_EASE     = 0.12; // how quickly particles drift back (0–1)
  const COUNT           = 2000;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }
  window.addEventListener('resize', () => { resize(); });
  resize();

  // Track mouse over the hero section only
  section.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  section.addEventListener('mouseleave', function() {
    mouse.active = false;
    mouse.x = -9999; mouse.y = -9999;
  });
  // Touch support
  section.addEventListener('touchmove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });
  section.addEventListener('touchend', function() {
    mouse.active = false;
    mouse.x = -9999; mouse.y = -9999;
  });

  function mkParticle(forceX, forceY) {
    const baseVx = (Math.random() - 0.5) * 0.35;
    const baseVy = (Math.random() - 0.5) * 0.35;
    return {
      x:    forceX !== undefined ? forceX : Math.random() * W,
      y:    forceY !== undefined ? forceY : Math.random() * H,
      r:    Math.random() * 1.3 + 0.25,
      alpha: Math.random(),
      da:   (Math.random() * 0.007 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
      // base (natural) velocity — particles want to return to this
      baseVx,
      baseVy,
      // actual velocity (will be perturbed by repulse)
      vx: baseVx,
      vy: baseVy,
    };
  }

  const particles = [];
  for (let i = 0; i < COUNT; i++) particles.push(mkParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      // ── Repulse from mouse ──
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPULSE_RADIUS && dist > 0) {
          // Force falls off with distance (strongest near cursor)
          const force = (1 - dist / REPULSE_RADIUS) * REPULSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // ── Ease velocity back toward natural drift ──
      p.vx += (p.baseVx - p.vx) * RETURN_EASE;
      p.vy += (p.baseVy - p.vy) * RETURN_EASE;

      // ── Cap speed to avoid particles flying off ──
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const maxSpeed = 6;
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      // ── Move & wrap ──
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      // ── Twinkle ──
      p.alpha += p.da;
      if (p.alpha <= 0 || p.alpha >= 1) {
        p.da *= -1;
        p.alpha = Math.max(0, Math.min(1, p.alpha));
      }

      // ── Draw ──
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + p.alpha.toFixed(3) + ')';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();

  // ── Click burst ──
  section.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const speed = Math.random() * 3 + 1.5;
      const p = mkParticle(mx, my);
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.baseVx = (Math.random() - 0.5) * 0.35;
      p.baseVy = (Math.random() - 0.5) * 0.35;
      p.r = Math.random() * 2 + 0.8;
      p.alpha = 1; p.da = -0.015;
      particles.push(p);
    }
    // Keep particle count stable
    if (particles.length > COUNT + 200) particles.splice(0, particles.length - COUNT);
  });
})();
