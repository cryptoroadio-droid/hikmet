/**
 * Hikmet Sağlık Kabini - Main JavaScript
 * Professional Healthcare Website
 */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // Mobile Menu Toggle
  // ============================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });

    // Mobile Dropdown Toggle
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const navDropdown = document.querySelector('.nav-dropdown');

    if (dropdownToggle && navDropdown) {
      dropdownToggle.addEventListener('click', function (e) {
        // Only prevent default on mobile
        if (window.innerWidth <= 768) {
          e.preventDefault();
          navDropdown.classList.toggle('active');
        }
      });
    }
  }

  // ============================================
  // Header Scroll Effect
  // ============================================
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ============================================
  // Contact Form Handling
  // ============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const name = formData.get('name');
      const phone = formData.get('phone');
      const email = formData.get('email') || 'Belirtilmedi';
      const service = formData.get('service') || 'Belirtilmedi';
      const message = formData.get('message') || 'Belirtilmedi';

      // Validate required fields
      if (!name || !phone) {
        showNotification('Lütfen zorunlu alanları doldurunuz.', 'error');
        return;
      }

      // Create WhatsApp message
      const whatsappMessage = `
*Yeni Randevu Talebi*
━━━━━━━━━━━━━━━
👤 *Ad Soyad:* ${name}
📞 *Telefon:* ${phone}
✉️ *E-posta:* ${email}
🏥 *Hizmet:* ${getServiceName(service)}
💬 *Mesaj:* ${message}
━━━━━━━━━━━━━━━
_Bu mesaj web sitesi üzerinden gönderilmiştir._
      `.trim();

      // Encode message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);

      // Open WhatsApp with pre-filled message
      window.open(`https://api.whatsapp.com/send?phone=905050312112&text=${encodedMessage}`, '_blank');

      // Show success notification
      showNotification('WhatsApp açılıyor... Mesajınızı göndermek için WhatsApp üzerinden onaylayın.', 'success');

      // Reset form
      this.reset();
    });
  }

  // Helper function to get service name
  function getServiceName(value) {
    const services = {
      'enjeksiyon': 'Enjeksiyon (İğne)',
      'tansiyon': 'Tansiyon Ölçümü',
      'pansuman': 'Pansuman / Yara Bakımı',
      'serum': 'Serum Takma',
      'diger': 'Diğer'
    };
    return services[value] || 'Belirtilmedi';
  }

  // ============================================
  // Notification System
  // ============================================
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close" aria-label="Kapat">×</button>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#fc8181' : '#4299e1'};
      color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      max-width: 400px;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notificationStyles')) {
      const style = document.createElement('style');
      style.id = 'notificationStyles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    `;
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // ============================================
  // Scroll Animations (Intersection Observer)
  // ============================================
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .feature-item, .mv-card, .service-detail-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  };

  // Add fade-in-up animation styles
  const addAnimationStyles = () => {
    if (!document.querySelector('#animationStyles')) {
      const style = document.createElement('style');
      style.id = 'animationStyles';
      style.textContent = `
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  addAnimationStyles();
  animateOnScroll();

  // ============================================
  // Counter Animation for Stats
  // ============================================
  const animateCounters = () => {
    const counters = document.querySelectorAll('.hero-stat-number');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const text = counter.textContent;

          // Check if it's a number
          const match = text.match(/(\d+)/);
          if (match) {
            const target = parseInt(match[0]);
            const suffix = text.replace(match[0], '');
            let current = 0;
            const increment = target / 50;
            const duration = 1500;
            const stepTime = duration / 50;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current) + suffix;
              }
            }, stepTime);
          }

          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  };

  animateCounters();

  // ============================================
  // Phone number formatting
  // ============================================
  const phoneInput = document.getElementById('phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 0) {
        if (value.length <= 4) {
          value = value;
        } else if (value.length <= 7) {
          value = value.slice(0, 4) + ' ' + value.slice(4);
        } else if (value.length <= 9) {
          value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
        } else {
          value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 9) + ' ' + value.slice(9, 11);
        }
      }

      e.target.value = value;
    });
  }

});
