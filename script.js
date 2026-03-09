/* ==========================================================================
   KIN VOW - Shared JavaScript
   Navigation, scroll animations, mobile menu, form handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');

      // Toggle hamburger animation
      const spans = navToggle.querySelectorAll('span');
      if (navToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close nav on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }


  /* ---------- Scroll-triggered Animations ---------- */
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }


  /* ---------- Nav: Active Page Highlight ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });


  /* ---------- Nav: Hide on scroll down, show on scroll up ---------- */
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  if (nav) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 100) {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
      } else {
        nav.style.boxShadow = 'none';
      }

      // Optional: hide nav on scroll down (disabled for now, can enable)
      // if (currentScroll > lastScroll && currentScroll > 200) {
      //   nav.style.transform = 'translateY(-100%)';
      // } else {
      //   nav.style.transform = 'translateY(0)';
      // }

      lastScroll = currentScroll;
    });
  }


  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  /* ---------- Simple Form Handling (placeholder) ---------- */
  const forms = document.querySelectorAll('form[data-action="collect"]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Placeholder: in production, this would POST to a backend or service
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      console.log('Form submitted:', data);

      // Show success message
      const successMsg = form.querySelector('.form-success');
      if (successMsg) {
        successMsg.style.display = 'block';
        form.reset();
      } else {
        // Create one if it doesn't exist
        const msg = document.createElement('div');
        msg.className = 'form-success';
        msg.style.cssText = 'background: #E8F5E9; color: #2E7D32; padding: 1rem; border-radius: 8px; margin-top: 1rem; font-weight: 500;';
        msg.textContent = 'Thank you. We will be in touch.';
        form.appendChild(msg);
        form.reset();
      }
    });
  });

});
