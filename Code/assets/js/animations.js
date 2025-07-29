// Smooth scroll behavior with offset and active section highlighting
function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Only handle internal anchor links
      if (this.getAttribute('href') === '#' || this.getAttribute('href') === '#!') return;
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile menu if open
        const navList = document.querySelector('.qx-nav-list');
        if (navList && navList.classList.contains('open')) {
          navList.classList.remove('open');
        }
        
        // Calculate scroll position with offset for fixed header
        const headerHeight = document.querySelector('.qx-header').offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
        
        // Smooth scroll to target
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without adding to history
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });
  
  // Highlight active section in navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.qx-nav-list a[href*="#"]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in class
  document.querySelectorAll('.fade-in').forEach(el => {
    fadeInObserver.observe(el);
  });
}

// Page load animation handler
function handlePageLoad() {
  // Show loading animation
  const loader = document.querySelector('.qx-page-loader');
  
  // Ensure loader is visible at start
  if (loader) {
    loader.style.opacity = '1';
    loader.style.visibility = 'visible';
  }
  
  // Simulate minimum load time for better UX
  const minLoadTime = 1000; // 1 second minimum
  const loadStart = Date.now();
  
  // When everything is loaded
  window.addEventListener('load', () => {
    const loadTime = Date.now() - loadStart;
    const delay = Math.max(0, minLoadTime - loadTime);
    
    setTimeout(() => {
      // Add loaded class to body
      document.body.classList.add('loaded');
      
      // Initialize animations after a short delay
      setTimeout(() => {
        smoothScroll();
        initScrollAnimations();
        
        // Remove loader from DOM after animation completes
        if (loader) {
          loader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
          loader.style.opacity = '0';
          loader.style.visibility = 'hidden';
          
          // Remove loader from DOM after animation
          setTimeout(() => {
            if (loader && loader.parentNode) {
              loader.parentNode.removeChild(loader);
            }
          }, 500);
        }
      }, 100);
    }, delay);
  });
  
  // Fallback in case load event doesn't fire
  setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
      document.body.classList.add('loaded');
      smoothScroll();
      initScrollAnimations();
      
      if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => {
          if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
      }
    }
  }, 5000); // 5 second timeout as absolute fallback
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Page fade-in
  document.body.classList.add('page-fade-in');

  // Futuristic entrance for cards/sections
  document.querySelectorAll('.smc-futuristic-in').forEach(el => {
    el.classList.remove('visible');
  });
  const futuristicObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  document.querySelectorAll('.smc-futuristic-in').forEach(el => {
    futuristicObserver.observe(el);
  });

  // Page fade-out on navigation
  function handlePageTransition(e, href) {
    e.preventDefault();
    document.body.classList.remove('page-fade-in');
    document.body.classList.add('page-fade-out');
    setTimeout(function() {
      window.location.href = href;
    }, 480);
  }
  // Nav links
  document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href="javascript:void(0)"])').forEach(link => {
    link.addEventListener('click', function(e) {
      handlePageTransition(e, this.href);
    });
  });
  // Dropdown (services page)
  var dropdown = document.getElementById('servicesDropdown');
  if (dropdown) {
    dropdown.addEventListener('change', function(e) {
      if (this.value && this.value.startsWith('http')) {
        handlePageTransition(e, this.value);
      }
    });
  }

  // Center service card on dropdown click if on services page
  document.querySelectorAll('.dropdown-menu a[href^="services.html#"], .dropdown-menu a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      var anchor = href.split('#')[1];
      if (anchor && (window.location.pathname.endsWith('services.html') || window.location.pathname.endsWith('/services.html'))) {
        var target = document.getElementById(anchor);
        if (target) {
          e.preventDefault();
          var rect = target.getBoundingClientRect();
          var cardHeight = rect.height;
          var viewportHeight = window.innerHeight;
          var scrollY = window.scrollY || window.pageYOffset;
          var cardTop = rect.top + scrollY;
          var offset;
          if (cardHeight >= viewportHeight) {
            // If card is taller than viewport, align top
            offset = cardTop - 32; // 32px margin from top
          } else {
            // Center card in viewport
            offset = cardTop - ((viewportHeight - cardHeight) / 2);
          }
          window.scrollTo({ top: offset, behavior: 'smooth' });
          history.replaceState(null, '', '#' + anchor);
        }
      }
    });
  });

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Ensure loader is handled
  handlePageLoad();
});
