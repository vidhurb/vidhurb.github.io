// ============================================================
// Vidhur B Preman — Portfolio Interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- 1. CURSOR GLOW ----
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  // ---- 2. MOBILE NAV TOGGLE ----
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- 3. SCROLL REVEAL (INTERSECTION OBSERVER) ----
  const revealEls = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    revealEls.forEach(el => observer.observe(el));
  }

  // ---- 4. STATS COUNT-UP ANIMATION ----
  const statsEls = document.querySelectorAll('.stat-num');
  
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -20px 0px', threshold: 0.5 });
    
    statsEls.forEach(el => {
      // Store original text (e.g. "7+", "WFA", "0x02")
      el.dataset.target = el.innerText;
      if (!isNaN(parseInt(el.innerText))) {
         el.innerText = "0"; // reset if it's a number
         statsObserver.observe(el);
      } else {
         // Don't animate non-numeric ones like WFA, 0x02
         el.classList.add('is-visible');
      }
    });
  }

  function animateValue(obj) {
    let target = obj.dataset.target;
    let suffix = '';
    
    if (target.includes('+')) {
      target = target.replace('+', '');
      suffix = '+';
    }
    
    const end = parseInt(target);
    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(end * easeOutExpo(progress));
      
      obj.innerText = current + suffix;
      
      if (frame === totalFrames) {
        clearInterval(counter);
        obj.innerText = end + suffix;
      }
    }, frameDuration);
  }
  
  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  // ---- 5. ACTIVE NAV HIGHLIGHT ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  
  function updateActiveNav() {
    let currentId = '';
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('is-active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // init

});
