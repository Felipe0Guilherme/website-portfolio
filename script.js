document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // THEME TOGGLE
    // ===========================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';

    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
        themeToggle.style.transform = 'scale(0.85) rotate(360deg)';
        setTimeout(() => { themeToggle.style.transform = ''; }, 350);
    });

    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark'
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ===========================
    // MOBILE MENU
    // ===========================
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navbar    = document.getElementById('navbar');

    if (mobileBtn && navbar) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });

        navbar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });

        // Fecha ao clicar fora (overlay ou área externa)
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !mobileBtn.contains(e.target)) {
                navbar.classList.remove('active');
                mobileBtn.classList.remove('active');
            }
        });

        // Fecha ao pressionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navbar.classList.remove('active');
                mobileBtn.classList.remove('active');
            }
        });

        // Bloqueia scroll do body com menu aberto (mobile)
        const menuObserver = new MutationObserver(() => {
            if (window.innerWidth <= 768) {
                document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
            }
        });
        menuObserver.observe(navbar, { attributes: true, attributeFilter: ['class'] });
    }

    // ===========================
    // HEADER SCROLL BEHAVIOUR
    // ===========================
    const header = document.getElementById('header');

    function onScroll() {
        const scrolled = window.pageYOffset;

        // Scroll progress bar
        const progressBar = document.getElementById('scrollProgress');
        if (progressBar) {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = ((scrolled / docH) * 100) + '%';
        }

        // Header style
        if (header) {
            header.classList.toggle('scrolled', scrolled > 60);
        }

        // Parallax shapes (hero orbs)
        document.querySelectorAll('.orb').forEach((orb, i) => {
            const speed = (i + 1) * 0.025;
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Active nav link highlight
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - (header ? header.offsetHeight + 20 : 80);
            if (scrolled >= top) current = sec.id;
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===========================
    // SMOOTH SCROLL
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = header ? header.offsetHeight : 0;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // ===========================
    // REVEAL ON SCROLL (IntersectionObserver)
    // ===========================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay per sibling index
                const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')];
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    // ===========================
    // TYPING EFFECT
    // ===========================
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const phrases = [
            'Desenvolvedor Front-end',
            'Programador JavaScript',
            'Dev React Native & Expo',
            'WordPress Developer',
            'Estudante de C.C. — 4° Sem',
            'Criador de Experiências Web'
        ];

        let phraseIdx = 0, charIdx = 0, deleting = false, speed = 100;

        function type() {
            const phrase = phrases[phraseIdx];
            typingEl.textContent = deleting
                ? phrase.substring(0, --charIdx)
                : phrase.substring(0, ++charIdx);

            speed = deleting ? 45 : 100;
            if (!deleting && charIdx === phrase.length) { speed = 2200; deleting = true; }
            else if (deleting && charIdx === 0)         { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; speed = 500; }

            setTimeout(type, speed);
        }
        setTimeout(type, 1200);
    }

    // ===========================
    // SKILLS TABS
    // ===========================
    const tabBtns   = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.skills-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const panel = document.getElementById(`tab-${tab}`);
            if (panel) {
                panel.classList.add('active');
                // Animate skill bars in the newly shown panel
                animateSkillBarsIn(panel);
                // Re-trigger reveals for items in new panel
                panel.querySelectorAll('[data-reveal]').forEach(el => {
                    el.classList.remove('revealed');
                    setTimeout(() => el.classList.add('revealed'), 50);
                });
            }
        });
    });

    // ===========================
    // SKILL BARS ANIMATION
    // ===========================
    function animateSkillBarsIn(container) {
        container.querySelectorAll('.skill-fill').forEach((bar, i) => {
            bar.style.width = '0%';
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, i * 120 + 100);
        });
    }

    // Observe skills section to trigger bars on scroll
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activePanel = skillsSection.querySelector('.skills-panel.active');
                    if (activePanel) animateSkillBarsIn(activePanel);
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
        skillsObserver.observe(skillsSection);
    }

    // ===========================
    // CANVAS BACKGROUND — Particle Network
    // ===========================
    const canvas  = document.getElementById('bgCanvas');
    const ctx     = canvas ? canvas.getContext('2d') : null;

    if (canvas && ctx) {
        let W, H, particles = [];
        const MAX_P   = 80;
        const MAX_DIST = 160;

        function resize() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * W;
                this.y  = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.r  = Math.random() * 1.5 + 0.5;
                this.a  = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;
            }
            draw() {
                const isDark = html.getAttribute('data-theme') !== 'light';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = isDark
                    ? `rgba(6,182,212,${this.a})`
                    : `rgba(8,145,178,${this.a * 0.6})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < MAX_P; i++) particles.push(new Particle());

        function drawConnections() {
            const isDark = html.getAttribute('data-theme') !== 'light';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * (isDark ? 0.18 : 0.1);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = isDark
                            ? `rgba(6,182,212,${alpha})`
                            : `rgba(8,145,178,${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        }

        function loop() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(loop);
        }
        loop();
    }

    // ===========================
    // CURSOR GLOW (Desktop)
    // ===========================
    if (window.matchMedia('(pointer: fine)').matches) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed; pointer-events: none; z-index: 9998;
            width: 300px; height: 300px; border-radius: 50%;
            background: radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            top: -300px; left: -300px;
        `;
        document.body.appendChild(glow);
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top  = e.clientY + 'px';
        });
    }

    // ===========================
    // CONTACT FORM
    // ===========================
    const contactForm = document.getElementById('contactForm');
    const submitBtn   = document.getElementById('submitBtn');
    const formStatus  = document.getElementById('formStatus');

    // Ícone de loading inline SVG (spinner)
    const spinnerSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"
            style="animation:_spin_ 0.8s linear infinite;flex-shrink:0">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>`;

    // Injeta keyframe do spinner uma vez
    const spinStyle = document.createElement('style');
    spinStyle.textContent = '@keyframes _spin_{to{transform:rotate(360deg)}}';
    document.head.appendChild(spinStyle);

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // ── Coleta dos campos ──
            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            // ── Validações ──
            if (!name || !email || !message) {
                showStatus('❌ Preencha todos os campos obrigatórios.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showStatus('❌ Insira um email válido.', 'error');
                return;
            }
            if (message.length < 10) {
                showStatus('❌ Mensagem muito curta. Escreva pelo menos 10 caracteres.', 'error');
                return;
            }

            // ── UI: estado de carregamento ──
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Enviando...</span>${spinnerSVG}`;

            let enviado = false;

            try {
                // ── Monta FormData ──
                const fd = new FormData();
                fd.append('name',          name);
                fd.append('email',         email);
                fd.append('service',       service);
                fd.append('message',       message);
                // Campos especiais do FormSubmit
                fd.append('_subject',      `💼 Novo contato: ${service} — ${name}`);
                fd.append('_template',     'table');
                fd.append('_replyto',      email);        // resposta vai direto ao remetente
                fd.append('_captcha',      'false');       // OBRIGATÓRIO para AJAX funcionar
                fd.append('_autoresponse', `Olá ${name}, recebi sua mensagem! Retorno em breve. — Felipe Guilherme`);

                // ── Requisição com timeout de 10s ──
                const controller = new AbortController();
                const timeout    = setTimeout(() => controller.abort(), 10000);

                const res = await fetch('https://formsubmit.co/ajax/Felipeguilherma@gmail.com', {
                    method:  'POST',
                    body:    fd,
                    headers: { 'Accept': 'application/json' },
                    signal:  controller.signal
                });

                clearTimeout(timeout);

                // ── Verifica resposta do FormSubmit ──
                // FormSubmit retorna { "success": "true" } ou { "success": "false", "message": "..." }
                let data = {};
                try { data = await res.json(); } catch (_) { /* ignora parse error */ }

                if (res.ok && (data.success === 'true' || data.success === true)) {
                    enviado = true;
                    showStatus('✅ Mensagem enviada! Responderei em breve.', 'success');
                    contactForm.reset();
                    createConfetti();
                } else if (!res.ok && res.status === 403) {
                    // 403 = email do FormSubmit ainda não confirmado
                    showStatus(
                        '⚠️ Primeiro uso: verifique o email de ativação do FormSubmit na sua caixa de entrada e clique em "Confirm".',
                        'warning'
                    );
                } else {
                    throw new Error(data.message || `HTTP ${res.status}`);
                }

            } catch (err) {
                if (!enviado) {
                    const isAbort   = err.name === 'AbortError';
                    const isNetwork = err instanceof TypeError;

                    if (isAbort) {
                        showStatus('⏱️ Tempo limite atingido. Abrindo seu email como alternativa...', 'error');
                    } else if (isNetwork) {
                        showStatus('📡 Sem conexão. Abrindo seu email como alternativa...', 'error');
                    } else {
                        showStatus(`⚠️ Falha no envio (${err.message}). Abrindo seu email...`, 'error');
                    }

                    // Fallback: abre cliente de email nativo
                    const subj = encodeURIComponent(`💼 Contato — ${service}`);
                    const body = encodeURIComponent(
                        `Nome: ${name}\nEmail: ${email}\nServiço: ${service}\n\nMensagem:\n${message}`
                    );
                    setTimeout(() => {
                        window.location.href = `mailto:Felipeguilherma@gmail.com?subject=${subj}&body=${body}`;
                    }, 1500);
                }
            } finally {
                // ── Restaura botão sempre ──
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    /**
     * Exibe mensagem de status no formulário.
     * @param {string} msg   - Texto da mensagem
     * @param {'success'|'error'|'warning'} type
     * @param {number}  duration - ms até sumir (padrão 8s)
     */
    function showStatus(msg, type = 'error', duration = 8000) {
        if (!formStatus) return;
        formStatus.textContent  = msg;
        formStatus.className    = `form-status ${type}`;
        formStatus.style.display = 'block';
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        clearTimeout(formStatus._timer);
        formStatus._timer = setTimeout(() => {
            formStatus.style.display = 'none';
        }, duration);
    }

    // ===========================
    // CONFETTI
    // ===========================
    function createConfetti() {
        const colors = ['#06b6d4', '#10b981', '#a855f7', '#f59e0b', '#ef4444'];
        for (let i = 0; i < 60; i++) {
            const c = document.createElement('div');
            const size = Math.random() * 8 + 5;
            c.style.cssText = `
                position:fixed; width:${size}px; height:${size}px;
                background:${colors[Math.floor(Math.random() * colors.length)]};
                left:${Math.random() * window.innerWidth}px; top:-20px;
                border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
                pointer-events:none; z-index:9999;
                animation:confettiFall ${Math.random() * 2 + 2.5}s ease-out ${Math.random() * 0.8}s forwards;
                opacity:0.9;
            `;
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 5000);
        }
    }

    // Inject confetti keyframe
    const confStyle = document.createElement('style');
    confStyle.textContent = `@keyframes confettiFall{to{transform:translateY(110vh) rotate(720deg);opacity:0;}}`;
    document.head.appendChild(confStyle);

    // ===========================
    // STATS COUNTER ANIMATION
    // ===========================
    const statNums = document.querySelectorAll('.stat-num[data-count]');
    if (statNums.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el  = entry.target;
                    const end = parseInt(el.dataset.count, 10);
                    let current = 0;
                    const step = Math.ceil(end / 40);
                    const t = setInterval(() => {
                        current = Math.min(current + step, end);
                        el.textContent = current + '+';
                        if (current >= end) clearInterval(t);
                    }, 40);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(el => counterObserver.observe(el));
    }

    // ===========================
    // ACTIVE NAV LINK STYLE
    // ===========================
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .nav-link.active { color: var(--cyan) !important; }
        .nav-link.active::after { left: 14px !important; right: 14px !important; background: var(--cyan); }
    `;
    document.head.appendChild(styleEl);

    // ===========================
    // CARD TILT EFFECT (Desktop)
    // ===========================
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.reason-card, .interview-card, .skill-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect   = card.getBoundingClientRect();
                const cx     = rect.left + rect.width  / 2;
                const cy     = rect.top  + rect.height / 2;
                const dx     = (e.clientX - cx) / (rect.width  / 2);
                const dy     = (e.clientY - cy) / (rect.height / 2);
                card.style.transform = `translateY(-4px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
                card.style.transition = 'transform 0.1s ease';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
            });
        });
    }

    // ===========================
    // LUCIDE ICONS INIT
    // ===========================
    if (typeof lucide !== 'undefined') lucide.createIcons();

    console.log('%c✅ Portfolio Felipe Guilherme — Loaded', 'color:#06b6d4;font-family:monospace;font-size:13px;font-weight:bold;');
});
