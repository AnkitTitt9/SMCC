document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.qx-header');
  let lastScroll = 0;
  const scrollThreshold = 100; // Minimum scroll distance needed to trigger hide/show
  
  // Add scrolled class on initial load if not at top
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  }

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Always add scrolled class when not at top
    if (currentScroll > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      header.classList.remove('hide-nav');
      return; // Don't do anything else at the top of the page
    }

    // Scrolling down
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      header.classList.add('hide-nav');
    } 
    // Scrolling up
    else if (currentScroll < lastScroll) {
      header.classList.remove('hide-nav');
    }
    
    lastScroll = currentScroll;
  });

  // Add padding to body to account for fixed header
  document.body.style.paddingTop = header.offsetHeight + 'px';
});
