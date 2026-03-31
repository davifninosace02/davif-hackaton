document.addEventListener('DOMContentLoaded', () => {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Reveal Hero immediately
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .reveal');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 150);
        });
    }, 200);

    // Language Toggle Logic
    const langToggle = document.getElementById('lang-toggle');
    const translatableElements = document.querySelectorAll('[data-es]');
    let currentLang = 'es';

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            langToggle.textContent = currentLang === 'es' ? 'EN / ES' : 'ES / EN';
            
            translatableElements.forEach(el => {
                const translation = el.getAttribute(`data-${currentLang}`);
                if (translation) {
                    el.innerHTML = translation;
                }
            });
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Code window subtle glow effect (Optional interaction)
    const codeWindow = document.querySelector('.code-window');
    if (codeWindow) {
        codeWindow.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = codeWindow.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            
            codeWindow.style.boxShadow = `0 4px 60px rgba(199, 153, 255, 0.15), inset 0 0 100px rgba(199, 153, 255, ${Math.min(0.08, (100 - y) / 1000)})`;
        });
    }


});
