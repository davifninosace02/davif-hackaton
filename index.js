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
    // --- Botón Descargar / Instalar Proyecto ---
    const installButtons = [
        document.getElementById('btn-install-nav'),
        document.getElementById('btn-install-hero')
    ];

    const GITHUB_REPO = "davifninosace02/contrarian-coder";

    async function downloadProject() {
        const originalTexts = installButtons.map(btn => btn.innerText);

        // --- Plan A: Clonar desde GitHub directo a carpeta local ---
        if ('showDirectoryPicker' in window) {
            try {
                // Seleccionar carpeta de destino
                const directoryHandle = await window.showDirectoryPicker({
                    mode: 'readwrite'
                });

                installButtons.forEach(btn => {
                    btn.innerText = currentLang === 'es' ? 'Conectando con GitHub...' : 'Connecting to GitHub...';
                });

                // Obtener lista de archivos del repo (vía GitHub API)
                const apiURL = `https://api.github.com/repos/${GITHUB_REPO}/git/trees/main?recursive=1`;
                const treeRes = await fetch(apiURL);
                if (!treeRes.ok) throw new Error("GitHub API unreachable");
                
                const { tree } = await treeRes.json();
                const files = tree.filter(item => item.type === 'blob');

                let count = 0;
                for (const file of files) {
                    try {
                        count++;
                        installButtons.forEach(btn => {
                            btn.innerText = `${currentLang === 'es' ? 'Descargando' : 'Downloading'} (${count}/${files.length})`;
                        });

                        const rawURL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${file.path}`;
                        const response = await fetch(rawURL);
                        const content = await response.text();

                        // Manejar carpetas anidadas
                        const pathParts = file.path.split('/');
                        let currentHandle = directoryHandle;
                        for (let i = 0; i < pathParts.length - 1; i++) {
                            currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
                        }

                        // Guardar archivo
                        const fileName = pathParts[pathParts.length - 1];
                        const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
                        const writable = await fileHandle.createWritable();
                        await writable.write(content);
                        await writable.close();
                    } catch (err) {
                        console.warn(`Saltando archivo ${file.path}:`, err);
                    }
                }

                installButtons.forEach((btn, i) => {
                    btn.innerText = currentLang === 'es' ? '¡Proyecto Instalado!' : 'Project Installed!';
                    setTimeout(() => {
                        btn.innerText = originalTexts[i];
                    }, 2000);
                });

                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error('Fallo el clonado nativo:', err);
            }
        }

        // --- Plan B: Si falla o no hay API, descarga el ZIP de GitHub directamente ---
        const githubZipUrl = `https://github.com/${GITHUB_REPO}/archive/refs/heads/main.zip`;
        window.location.href = githubZipUrl;
    }

    installButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                downloadProject();
            });
        }
    });

});
