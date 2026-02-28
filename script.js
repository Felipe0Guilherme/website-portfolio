document.addEventListener('DOMContentLoaded', () => {
    
 
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

  
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        themeToggle.style.transform = 'scale(0.9) rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });

    function updateThemeIcon(theme) {
       
        themeToggle.innerHTML = theme === 'dark' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
        if(typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.getElementById('navbar');
    const navLinks = navbar.querySelectorAll('.nav-link');

    if (mobileBtn && navbar) {
        mobileBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !mobileBtn.contains(e.target)) {
                navbar.classList.remove('active');
                mobileBtn.classList.remove('active');
            }
        });
    }


    
    const typingText = document.getElementById('typingText');
    if (typingText) {
        const phrases = [
            'Desenvolvedor Front-end',
            'Programador JavaScript',
            'Começando no React',
            'Criador de Experiências Web'
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1000);
    }


    
    function animateSkillBars() {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            setTimeout(() => {
                const progress = card.querySelector('.skill-progress');
                if (progress) {
                    const targetProgress = progress.getAttribute('data-progress');
                    progress.style.width = targetProgress + '%';
                }
            }, index * 150);
        });
    }

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        skillsObserver.observe(skillsSection);
    }

    // ===========================
    // SMOOTH SCROLL
    // ===========================
    
    const header = document.querySelector('.header-glass');
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================
    // CONTACT FORM
    // ===========================
    
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showFormStatus('❌ Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showFormStatus('❌ Por favor, insira um email válido.', 'error');
                return;
            }

            submitBtn.disabled = true;
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Enviando...</span>';

            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('service', service);
                formData.append('message', message);
                formData.append('_subject', `Novo contato do site - ${service}`);
                formData.append('_template', 'table');
                
                const response = await fetch('https://formsubmit.co/ajax/Felipeguilherma@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showFormStatus('✅ Mensagem enviada com sucesso! Retornarei em breve.', 'success');
                    contactForm.reset();
                    createConfetti();
                } else {
                    throw new Error('Erro no envio');
                }
            } catch (error) {
                const subject = encodeURIComponent(`Contato - ${service}`);
                const body = encodeURIComponent(
                    `Nome: ${name}\nEmail: ${email}\nServiço: ${service}\n\nMensagem:\n${message}`
                );
                window.location.href = `mailto:Felipeguilherma@gmail.com?subject=${subject}&body=${body}`;
                showFormStatus('📧 Abrindo seu cliente de email...', 'success');
                setTimeout(() => contactForm.reset(), 3000);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                if(typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormStatus(msg, type) {
        if (!formStatus) return;
        formStatus.textContent = msg;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 8000);
    }

    // ===========================
    // CONFETTI
    // ===========================
    
    function createConfetti() {
        const colors = ['#22d3ee', '#a855f7', '#10b981', '#ff6b35'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * window.innerWidth}px;
                top: -20px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: confettiFall ${Math.random() * 2 + 3}s ease-out forwards;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyle);

 
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Header shadow
        if (header) {
            if (scrolled > 50) {
                header.classList.add('scrolled');
                header.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.2)';
            } else {
                header.classList.remove('scrolled');
                header.style.boxShadow = 'none';
            }
        }

        // Shapes parallax
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.03;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

  
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    console.log('✅ Portfolio Felipe Guilherme - Ready!');
});
