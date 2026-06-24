document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav') || document.querySelector('header');
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  // En index.html y páginas de caso el idioma se define con botones data-lang.
  // Si no existen, no rompe el flujo.
  const languageButtons = document.querySelectorAll('.lang-toggle-button, [data-lang]');
  // Con Weglot activo, eliminamos la lógica de switches manuales.
  // Si existen botones en alguna página antigua, los ocultamos.
  languageButtons.forEach((btn) => {
    btn.style.display = 'none';
  });

  /* ===== Weglot ES/EN on bubble click ===== */
  const bubble = document.getElementById('weglot-bubble');
  if (bubble && window.Weglot) {
    const setBubbleLang = (lang) => {
      // lang: 'es' | 'en'
      if (!lang) return;
      bubble.classList.remove('is-lang-en');
      if (lang.toLowerCase().startsWith('en')) bubble.classList.add('is-lang-en');
    };

    // Render inicial según el idioma actual de Weglot (si está disponible)
    try {
      const initial = (window.Weglot?.getCurrentLanguage?.() || window.Weglot?.currentLang || '').toLowerCase();
      setBubbleLang(initial.startsWith('en') ? 'en' : 'es');
    } catch (e) {}

    bubble.addEventListener('click', () => {

      try {
        // Conmute ES <-> EN al hacer click.
        // Weglot suele proveer API como: Weglot.switchTo(lang)
        // Si no existe, buscamos un launcher interno y lo disparamos.
        const currentLang = (window.Weglot?.getCurrentLanguage?.() || window.Weglot?.currentLang || '').toLowerCase();
        const target = currentLang.startsWith('en') ? 'es' : 'en';

        if (typeof window.Weglot.switchTo === 'function') {
          window.Weglot.switchTo(target);
          setBubbleLang(target);
          return;
        }


        // Fallback: dispara el switcher interno (si Weglot lo inyectó aunque esté oculto)
        const internalSwitcher = document.querySelector('[data-weglot-switcher], .weglot-switcher, [data-weglot-language]');
        if (internalSwitcher) internalSwitcher.click();
      } catch (e) {
        // no-op
      }
    });
  }


  

  

  // Clients Carousel (infinite) - loop perfecto sin salto
  const initClientsCarousel = () => {
    const marquee = document.querySelector('.clients-marquee');
    const track = document.querySelector('.clients-marquee__track');

    if (!marquee || !track) return;

    // Asumimos que el track contiene 2 sets idénticos uno tras otro.
    // Calculamos "halfWidth" como la mitad del ancho total del track.
    const measure = () => {
      // width natural del track (con todo contenido)
      const totalWidth = track.scrollWidth || track.getBoundingClientRect().width;
      const halfWidth = totalWidth / 2;

      let start = null;
      const durationMs = 24000; // mantener 24s como estaba (1 ciclo completo = 24s)

      const animate = (t) => {
        if (start === null) start = t;
        const elapsed = t - start;

        // Progreso 0..1 y desplazamiento exacto -halfWidth
        const progress = (elapsed % durationMs) / durationMs;
        const x = -halfWidth * progress;

        track.style.transform = `translate3d(${x}px, 0, 0)`;

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    // Importante: al hacer resize recalculamos anchos para evitar saltos
    let resizeTimer = null;
    measure();

    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        track.style.transform = 'translate3d(0px, 0, 0)';
        measure();
      }, 150);
    });
  };

  initClientsCarousel();



  if (nav && nav.classList.contains('fixed')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('py-2', 'shadow-custom');
        nav.classList.remove('py-4');
      } else {
        nav.classList.remove('py-2', 'shadow-custom');
        nav.classList.add('py-4');
      }
    });
  }

  if (mobileMenuButton && mobileMenu && mobileMenuLinks.length) {
    mobileMenuButton.addEventListener('click', () => {
      const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
      mobileMenuButton.querySelector('.material-symbols-outlined').textContent = isExpanded ? 'menu' : 'close';
    });

    mobileMenuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
          mobileMenuButton.querySelector('.material-symbols-outlined').textContent = 'menu';
        }
      });
    });
  }

  const revealTargets = document.querySelectorAll('section, footer, .project-card, .hero-stats > div, .logo-item');
  revealTargets.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(index * 75, 300)}ms`;
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  revealTargets.forEach((el) => revealObserver.observe(el));

  const form = document.querySelector('#contact form') || document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Deja que el submit real lo gestione Formspree.
      // Solo deshabilitamos el botón para evitar doble envío.
      const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      if (!btn) return;

      btn.disabled = true;
      btn.innerText = 'SENDING...';
    });
  }

  /* ===== Selected Works holographic (Three.js + mouse 3D tilt) ===== */
  const initHolographicCards = () => {
    if (!window.THREE) return;

    const cards = document.querySelectorAll('#work .tilt-container');
    const sceneContainers = document.querySelectorAll('#work .threejs-scene-container');
    if (!cards.length || !sceneContainers.length) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Por performance: limitar número de partículas.
    const particleCount = reduceMotion ? 60 : 140;

    const makeSeededRng = (seed) => {
      // Mulberry32
      let t = seed >>> 0;
      return () => {
        t += 0x6D2B79F5;
        let x = Math.imul(t ^ (t >>> 15), 1 | t);
        x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
      };
    };

    sceneContainers.forEach((container, idx) => {
      if (container.dataset.holoInit === 'true') return;
      container.dataset.holoInit = 'true';

      // Evita conflictos: si el canvas anterior existiera.
      const existingCanvas = container.querySelector('canvas');
      if (existingCanvas) existingCanvas.remove();

      const width = container.clientWidth || 400;
      const height = container.clientHeight || 300;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
      camera.position.set(0, 0, 2.6);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      // Luces suaves para un look holográfico
      // (con Points no es crítico, pero ayuda a la atmósfera si agregamos glow via materiales)

      const rng = makeSeededRng(1337 + idx * 999);

      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const baseColor = new THREE.Color('#79a6ff');
      const accentColor = new THREE.Color('#EB9100');

      for (let i = 0; i < particleCount; i++) {
        // Un cubo alrededor del centro
        const x = (rng() - 0.5) * 2.2;
        const y = (rng() - 0.5) * 1.6;
        const z = (rng() - 0.5) * 1.6;

        positions[i * 3 + 0] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Mezcla de color
        const mix = rng();
        const c = baseColor.clone().lerp(accentColor, mix);
        colors[i * 3 + 0] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: reduceMotion ? 0.03 : 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // Un plano de “glow” muy sutil
      const glowGeometry = new THREE.PlaneGeometry(2.6, 2.2);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x79a6ff,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(0, 0.02, -0.7);
      scene.add(glow);

      let rafId = null;
      let mouseX = 0;
      let mouseY = 0;

      const tick = (t) => {
        const time = t * 0.001;

        // Movimiento holográfico: partículas “respiran”
        if (!reduceMotion) {
          points.rotation.y = time * 0.35;
          points.rotation.x = Math.sin(time * 0.6) * 0.08;

          points.position.y = Math.sin(time * 0.45) * 0.04;
          glow.position.x = Math.sin(time * 0.3) * 0.05;
        }

        // Respuesta al mouse (tilt via cámara)
        camera.position.x += (mouseX - camera.position.x) * 0.04;
        camera.position.y += (-mouseY - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(tick);
      };

      const handleMouseMove = (e) => {
        if (reduceMotion) return;
        const rect = container.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        mouseX = dx * 1.0;
        mouseY = dy * 1.0;
      };

      const parentTilt = container.closest('.tilt-container');
      if (parentTilt) {
        parentTilt.addEventListener('mousemove', handleMouseMove);
        parentTilt.addEventListener('mouseleave', () => {
          mouseX = 0;
          mouseY = 0;
          parentTilt.style.transform = '';
        });

        // transform 3D del contenedor principal (el “tile”)
        parentTilt.addEventListener('mousemove', (e) => {
          if (reduceMotion) return;
          const rect = parentTilt.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / rect.width;
          const dy = (e.clientY - cy) / rect.height;

          const rotY = dx * 10; // deg
          const rotX = -dy * 8; // deg

          parentTilt.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0px)`;
        });

        parentTilt.style.willChange = 'transform';
      }

      const onResize = () => {
        const w = container.clientWidth || 400;
        const h = container.clientHeight || 300;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(() => onResize());
      resizeObserver.observe(container);

      // Para evitar fugas si se desmonta (en este caso no pasa, pero dejamos margen)
      container.dataset.holoCleanup = 'true';

      rafId = requestAnimationFrame(tick);

      // Guardar refs para cleanup eventual
      container._holo = { scene, camera, renderer, rafId, resizeObserver };
    });
  };

  initHolographicCards();

  /* ===== Protected access modal for selected works ===== */
  const protectedModal = document.getElementById('protected-access-modal');
  const protectedCloseBtn = document.getElementById('protected-access-close');
  const protectedSubmitBtn = document.getElementById('protected-access-submit');
  const protectedCancelBtn = document.getElementById('protected-access-cancel');
  const protectedKeyInput = document.getElementById('protected-access-key');
  const protectedErrorEl = document.getElementById('protected-access-error');

  // Demo key: reemplázala por la real si aplica.
  const ACCESS_KEY = 'Esteban123';


  let pendingTargetHref = null;

  const openProtectedModal = (targetHref) => {
    pendingTargetHref = targetHref;
    if (protectedErrorEl) protectedErrorEl.classList.add('hidden');
    if (protectedKeyInput) protectedKeyInput.value = '';

    protectedModal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // focus al input para accesibilidad
    setTimeout(() => {
      protectedKeyInput?.focus();
    }, 0);
  };

  const closeProtectedModal = () => {
    pendingTargetHref = null;
    protectedModal?.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-protected-project][data-target-href]').forEach((el) => {
    el.addEventListener('click', (e) => {
      // Evitar navegación hasta validar.
      e.preventDefault();
      const href = el.getAttribute('data-target-href');
      openProtectedModal(href);
    });
  });

  protectedCloseBtn?.addEventListener('click', closeProtectedModal);
  protectedCancelBtn?.addEventListener('click', closeProtectedModal);

  protectedModal?.addEventListener('click', (e) => {
    // click fuera del panel
    if (e.target === protectedModal) closeProtectedModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !protectedModal?.classList.contains('hidden')) {
      closeProtectedModal();
    }
  });

  protectedSubmitBtn?.addEventListener('click', () => {
    const key = (protectedKeyInput?.value || '').trim();
    const isValid = key === ACCESS_KEY;

    if (!isValid) {
      protectedErrorEl?.classList.remove('hidden');
      protectedKeyInput?.focus();
      return;
    }

    closeProtectedModal();
    const href = pendingTargetHref;
    pendingTargetHref = null;
    if (href) window.location.href = href;
  });

  protectedKeyInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') protectedSubmitBtn?.click();
  });

});


