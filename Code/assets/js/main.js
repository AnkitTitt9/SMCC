// main.js - SandMartin Consultancy

// Initialize particles for the background
function initParticles() {
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-bg';
  document.body.appendChild(particleContainer);

  // Create particles
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    createParticle(particleContainer);
  }

  function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 1px and 3px
    const size = Math.random() * 2 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    
    // Random animation duration between 10s and 30s
    const duration = Math.random() * 20 + 10;
    particle.style.animationDuration = `${duration}s`;
    
    // Random delay up to 15s
    const delay = Math.random() * 15;
    particle.style.animationDelay = `-${delay}s`;
    
    // Random opacity between 0.3 and 1
    const opacity = Math.random() * 0.7 + 0.3;
    particle.style.opacity = opacity;
    
    container.appendChild(particle);
  }
}

// Initialize scroll-based animations
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        // Unobserve after animation completes
        setTimeout(() => {
          observer.unobserve(entry.target);
        }, 1000);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

// Add smooth scroll behavior to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Function to handle smooth scrolling to sections with offset
function scrollToSection(event) {
  // Check if the link is an anchor link
  if (event.target.getAttribute('href') && event.target.getAttribute('href').startsWith('#')) {
    event.preventDefault();
    
    const targetId = event.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Get the parent section element
      let sectionElement = targetElement;
      if (!sectionElement.classList.contains('section-with-header')) {
        sectionElement = targetElement.closest('section');
        if (!sectionElement) {
          sectionElement = targetElement.parentElement;
        }
      }
      
      if (sectionElement) {
        // Calculate the position to scroll to (accounting for fixed header)
        const headerOffset = 100; // Adjust this value based on your header height
        const elementPosition = sectionElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // Smooth scroll to the section element
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize animations and effects
  initParticles();
  initScrollAnimations();
  
  // Add click event listeners to all anchor links in the dropdown
  const dropdownLinks = document.querySelectorAll('.qx-dropdown-content a[href^="#"]');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', scrollToSection);
  });
  
  // Add hover effect to all buttons
  const buttons = document.querySelectorAll('button, .qx-cta, .qx-btn');
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      button.style.setProperty('--x', `${x}px`);
      button.style.setProperty('--y', `${y}px`);
    });
  });

  // --- Service Card Expansion ---
  const cardButtons = document.querySelectorAll('.qx-card-button');
  const allCards = document.querySelectorAll('.qx-service-card');

  cardButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentCard = button.closest('.qx-service-card');
      if (!currentCard) return;

      // Close all other cards before toggling the current one
      allCards.forEach(card => {
        if (card !== currentCard) {
          card.classList.remove('expanded');
          const otherButton = card.querySelector('.qx-card-button');
          if (otherButton) {
            otherButton.textContent = 'Read more';
          }
        }
      });

      // Toggle the current card
      const isExpanding = !currentCard.classList.contains('expanded');
      currentCard.classList.toggle('expanded');
      button.textContent = isExpanding ? 'Read less' : 'Read more';

      // Add or remove a class on the body to indicate a card is open
      if (isExpanding) {
        document.body.classList.add('card-is-expanded');
        // Scroll the card into view with smooth behavior
        setTimeout(() => {
          currentCard.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }, 50); // Small delay to allow for CSS transitions
      } else {
        document.body.classList.remove('card-is-expanded');
      }
    });
  });

  // --- Navigation ---
  const hamburger = document.getElementById('qxHamburger');
  const navList = document.querySelector('.qx-nav-list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', function () {
      navList.classList.toggle('open');
    });
  }

  // --- Animated Meters for Services page ---
  function onScrollMeters() {
    const meters = [
      {id: 'meter-grow', percent: 86},
      {id: 'meter-satisfaction', percent: 90},
      {id: 'meter-payroll', percent: 88}
    ];
    let triggered = false;
    
    function checkAndAnimate() {
      if (triggered) {
        window.removeEventListener('scroll', checkAndAnimate);
        return;
      }
      const anyMeter = document.getElementById('meter-grow');
      if (!anyMeter) return;
      
      const rect = anyMeter.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        meters.forEach(m => {
          const el = document.getElementById(m.id);
          if (el) el.style.width = m.percent + '%';
        });
        triggered = true;
      }
    }
    
    window.addEventListener('scroll', checkAndAnimate);
    checkAndAnimate(); // Initial check
  }

  onScrollMeters(); // Initialize meter animation

});