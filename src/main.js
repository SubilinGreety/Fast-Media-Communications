import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Custom Cursor & Cursor Spotlight
  initCustomCursor();

  // Initialize Scroll Reveal Animations
  initScrollReveal();

  // Initialize Animated Counters
  initNumberCounters();

  // Mobile Navigation Menu Toggle
  initMobileMenu();

  // Equipment Category Filter Tabs
  initEquipmentTabs();

  // Active Nav Link Spy on Scroll
  initNavScrollSpy();

  // Contact Form Submission to WhatsApp
  initContactForm();
});

/* ================= CUSTOM CURSOR & SPOTLIGHT ================= */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;

    // Direct precision dot update
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    // Ambient background spotlight update
    document.documentElement.style.setProperty('--cursor-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${mouseY}px`);
  });

  // Smooth lerp animation for magnetic trailing ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // Interactive Hover expansion for buttons, links, cards
  const interactiveTargets = document.querySelectorAll(
    'a, button, input, select, textarea, .tab-btn, .service-card, .equip-card, .event-card, .client-pill'
  );

  interactiveTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hovered');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

/* ================= SCROLL REVEAL OBSERVER ================= */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ================= ANIMATED NUMBER COUNTERS ================= */
function initNumberCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1500;
        const increment = target / (duration / 16);

        function updateCount() {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current) + (target > 10 ? '+' : '');
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target + (target > 10 ? '+' : '');
          }
        }
        updateCount();
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ================= MOBILE NAVIGATION MENU ================= */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ================= EQUIPMENT FILTER TABS ================= */
function initEquipmentTabs() {
  const tabButtons = document.querySelectorAll('#equip-category-tabs .tab-btn');
  const equipCards = document.querySelectorAll('#equipments-grid .equip-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      equipCards.forEach(card => {
        const cat = card.getAttribute('data-cat') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ================= ACTIVE NAV SCROLL SPY ================= */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 120;
      const secId = sec.getAttribute('id');
      const navLinks = document.querySelectorAll(`.nav-link[href="#${secId}"]`);

      if (scrollY > secTop && scrollY <= secTop + secHeight) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        navLinks.forEach(link => link.classList.add('active'));
      }
    });
  });
}

/* ================= CONTACT FORM ================= */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      const email = document.getElementById('form-email').value;
      const service = document.getElementById('form-service').value;
      const message = document.getElementById('form-message').value;

      const waText = `*New Equipment Rental Inquiry (Fast Media Communications)*
---------------------------------------------
• *Name:* ${name}
• *Phone:* ${phone}
• *Email:* ${email}
• *Requirement:* ${service}
• *Details:* ${message || 'Please contact me with rental pricing and equipment availability.'}
---------------------------------------------`;

      if (formAlert) {
        formAlert.style.display = 'block';
        formAlert.innerHTML = `✓ Thank you <strong>${name}</strong>! Redirecting to WhatsApp dispatch...`;
      }

      setTimeout(() => {
        window.open(`https://wa.me/919444089654?text=${encodeURIComponent(waText)}`, '_blank');
      }, 500);

      contactForm.reset();
    });
  }
}
