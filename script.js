document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav') || document.querySelector('header');
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  const languageButtons = document.querySelectorAll('.lang-toggle-button');

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

  const translations = {
    en: {
      home: 'Home',
      work: 'Work',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      heroTitle: 'Product & UX UI Designer',
      heroText: 'Creating meaningful experiences through research and craft. I bridge the gap between human needs and business goals through curated design systems.',
      years: 'Years of Experience',
      brands: 'Brands',
      sectors: 'Sectors',
      philosophy: 'Design Philosophy',
      selectedWorks: 'Selected Works & Insights',
      expertise: 'Expertise & Services',
      contactTitle: 'Let\'s craft something remarkable.',
      contactText: 'I am currently available for selective freelance projects and permanent leadership roles. Drop me a line if you want to collaborate.',
      nameLabel: 'Name',
      emailLabel: 'Email',
      messageLabel: 'Message',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'your@email.com',
      messagePlaceholder: 'Tell me about your project',
      sendMessageButton: 'Send Message',
      footerCopyright: '© 2024 Product Designer Portfolio. All rights reserved.',
      footerLinkedIn: 'LinkedIn',
      footerBehance: 'Behance',
      footerDribbble: 'Dribbble',
      footerEmail: 'Email',
      // About + Work card / misc
      aboutHeroAltPlaceholder: '',
      aboutBio: 'I am a Senior UX/UI Designer with over seven years of experience crafting intuitive, data-driven digital solutions across diverse sectors like banking and e-commerce. I specialize in leading cross-functional teams and managing complex design systems to bridge the gap between user needs and business objectives. Currently, I am leveraging advanced AI platforms—including Anthropic, Stitch, and Google Labs—to innovate and streamline the design process. I am seeking new professional opportunities where I can apply my expertise in product strategy and emerging technologies to drive impactful user experiences.',
      // Services cards
      servicesCard1Title: 'UI/UX Design',
      servicesCard1Desc: 'Creating seamless digital interfaces across mobile and web platforms.',
      servicesCard2Title: 'User Research',
      servicesCard2Desc: 'In-depth qualitative and quantitative studies to drive design decisions.',
      servicesCard3Title: 'Design Systems',
      servicesCard3Desc: 'Architecting scalable and maintainable component libraries.',
      servicesCard4Title: 'Product Strategy',
      servicesCard4Desc: 'Aligning product goals with user needs for long-term success.',
      servicesCard5Title: 'Prototyping',
      servicesCard5Desc: 'High-fidelity interactive demos for testing and stakeholder alignment.',
      servicesCard6Title: 'Data Analysis',
      servicesCard6Desc: 'Transforming complex data into actionable design insights.',
      servicesCard7Title: 'Design Mentorship',
      servicesCard7Desc: 'Leading and growing design teams through structured feedback.',
      servicesCard8Title: 'AI Expertise',
      servicesCard8Desc: 'Leveraging generative AI and machine learning to build intelligent, user-centric interfaces.',
      // Work cards
      workCard1Tag: 'Real estate',
      workCard1Title: 'Mia Ciencuadras',
      workCard1OverlayText: 'Architecting a seamless cross-border payment ecosystem for high-growth enterprises, focusing on clarity, security, and rapid transaction processing workflows.',
      workCard2Tag: 'Superapp',
      workCard2Title: 'Totalplay',
      workCard2OverlayText: 'A patient-first mobile experience designed to reduce friction in appointment booking and medical record management for over 2 million active users.',
      workCard3Tag: 'Cybersecurity',
      workCard3Title: 'Netdata - Sentria',
      workCard3OverlayText: 'Redefining luxury retail through a headless commerce solution that prioritizes high-fidelity visual storytelling and a frictionless checkout journey.',
      workCard4Tag: 'Ecommerce',
      workCard4Title: 'TZM',
      workCard4OverlayText: 'Developing a complex design system for an enterprise-level analytics tool, ensuring scalability across multiple product modules and global teams.',
      // Study case strings (index link labels)
      caseStudyLabel: 'Case Study — Real Estate Innovation',
      caseStudyTitle: 'MIA — Motor de Inteligencia Artificial',
      caseStudyDesc: 'Senior UX/UI Designer at Imaginamos for Grupo Bolívar (2023–2024). Revolutionizing the Colombian property market through conversational AI and data-driven matching.',
      resultsTitle: 'Results',
      learningTitle: 'Learning & Reflection'
    },
    es: {
      home: 'Inicio',
      work: 'Proyectos',
      about: 'Sobre mí',
      services: 'Servicios',
      contact: 'Contacto',
      heroTitle: 'Diseñador de Producto & Pensador Estratégico',
      heroText: 'Creo experiencias significativas mediante la investigación y el detalle. Conecto las necesidades humanas con los objetivos de negocio a través de sistemas de diseño cuidadosamente curados.',
      years: 'Años de Experiencia',
      brands: 'Marcas',
      sectors: 'Sectores',
      philosophy: 'Filosofía de Diseño',
      selectedWorks: 'Proyectos Seleccionados & Insights',
      expertise: 'Experiencia & Servicios',
      contactTitle: 'Construyamos algo extraordinario.',
      contactText: 'Actualmente estoy disponible para proyectos freelance selectivos y roles permanentes de liderazgo. Escríbeme si quieres colaborar.',
      nameLabel: 'Nombre',
      emailLabel: 'Email',
      messageLabel: 'Mensaje',
      namePlaceholder: 'Tu Nombre',
      emailPlaceholder: 'tu@email.com',
      messagePlaceholder: 'Cuéntame sobre tu proyecto',
      sendMessageButton: 'Enviar Mensaje',
      footerCopyright: '© 2024 Product Designer Portfolio. Todos los derechos reservados.',
      footerLinkedIn: 'LinkedIn',
      footerBehance: 'Behance',
      footerDribbble: 'Dribbble',
      footerEmail: 'Email',
      aboutBio: 'Soy un Senior UX/UI Designer con más de siete años de experiencia creando soluciones digitales intuitivas y basadas en datos en sectores diversos como banca y e-commerce. Me especializo en liderar equipos multifuncionales y gestionar sistemas de diseño complejos para conectar las necesidades de los usuarios con los objetivos del negocio. Actualmente, utilizo plataformas de IA avanzadas—incluyendo Anthropic, Stitch y Google Labs—para innovar y agilizar el proceso de diseño. Busco nuevas oportunidades profesionales donde pueda aplicar mi experiencia en estrategia de producto y tecnologías emergentes para impulsar experiencias significativas.',
      // Services cards
      servicesCard1Title: 'UI/UX Design',
      servicesCard1Desc: 'Creación de interfaces digitales fluidas en plataformas móviles y web.',
      servicesCard2Title: 'User Research',
      servicesCard2Desc: 'Estudios cualitativos y cuantitativos profundos para impulsar decisiones de diseño.',
      servicesCard3Title: 'Design Systems',
      servicesCard3Desc: 'Arquitectura de librerías de componentes escalables y mantenibles.',
      servicesCard4Title: 'Product Strategy',
      servicesCard4Desc: 'Alinear objetivos del producto con las necesidades del usuario para el éxito a largo plazo.',
      servicesCard5Title: 'Prototyping',
      servicesCard5Desc: 'Prototipos interactivos de alta fidelidad para pruebas y alineación con stakeholders.',
      servicesCard6Title: 'Data Analysis',
      servicesCard6Desc: 'Transformar datos complejos en insights accionables de diseño.',
      servicesCard7Title: 'Design Mentorship',
      servicesCard7Desc: 'Liderar y hacer crecer equipos de diseño con feedback estructurado.',
      servicesCard8Title: 'AI Expertise',
      servicesCard8Desc: 'Aprovechar IA generativa y machine learning para construir interfaces inteligentes centradas en el usuario.',
      // Work cards
      workCard1Tag: 'Real state',
      workCard1Title: 'Mia Ciencuadras',
      workCard1OverlayText: 'Arquitectando un ecosistema de pagos transfronterizos sin fricción para empresas de alto crecimiento, enfocado en claridad, seguridad y procesamiento rápido de transacciones.',
      workCard2Tag: 'Superapp',
      workCard2Title: 'Totalplay',
      workCard2OverlayText: 'Una experiencia móvil centrada en el paciente para reducir fricción al agendar citas y gestionar historiales médicos para más de 2 millones de usuarios activos.',
      workCard3Tag: 'cibersecurity',
      workCard3Title: 'Netdata - Sentria',
      workCard3OverlayText: 'Redefiniendo el retail de lujo con una solución headless que prioriza storytelling visual de alta fidelidad y un checkout sin fricción.',
      workCard4Tag: 'Ecomerce',
      workCard4Title: 'TZM',
      workCard4OverlayText: 'Desarrollando un sistema de diseño complejo para una herramienta de analítica empresarial, asegurando escalabilidad en múltiples módulos de producto y equipos globales.',
      // Study case strings (index link labels)
      caseStudyLabel: 'Estudio de Caso — Innovación Inmobiliaria',
      caseStudyTitle: 'MIA — Motor de Inteligencia Artificial',
      caseStudyDesc: 'Diseñador Senior UX/UI en Imaginamos para Grupo Bolívar (2023–2024). Revolucionando el mercado inmobiliario colombiano con IA conversacional y matching basado en datos.',
      resultsTitle: 'Resultados',
      learningTitle: 'Aprendizaje y Reflexión'
    }
  };

  const applyLanguage = (lang) => {
    const activeLang = translations[lang] ? lang : 'en';
    document.documentElement.lang = activeLang;
    document.documentElement.setAttribute('data-lang', activeLang);
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (translations[activeLang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[activeLang][key];
        } else {
          el.textContent = translations[activeLang][key];
        }
      }
    });

    languageButtons.forEach((button) => {
      const isActive = button.dataset.lang === activeLang;
      button.classList.toggle('bg-primary', isActive);
      button.classList.toggle('text-on-primary', isActive);
      button.classList.toggle('border-primary', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    localStorage.setItem('preferredLanguage', activeLang);
  };

  const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
  applyLanguage(savedLanguage);

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });

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
      // Formspree necesita el submit real; no hacemos preventDefault.
      const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      if (!btn) return;

      const originalText = btn.innerText;
      btn.innerText = 'SENDING...';
      btn.disabled = true;

      setTimeout(() => {
        // No reseteamos aquí porque Formspree/servidor define la respuesta.
        btn.innerText = originalText;
        btn.disabled = false;
      }, 10000);
    });
  }

});
