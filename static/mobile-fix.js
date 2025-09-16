// Force mobile fixes on every page load
(function() {
  function applyMobileFixes() {
    if (window.innerWidth <= 996) {
      // Hide title
      const titles = document.querySelectorAll('.navbar__title, .navbar__brand .navbar__title');
      titles.forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
      });
      
      // Fix sidebar
      const sidebar = document.querySelector('.navbar-sidebar');
      if (sidebar) {
        sidebar.style.width = '85%';
        sidebar.style.maxWidth = '320px';
        sidebar.style.minWidth = '280px';
      }
      
      // Fix close button
      const closeBtn = document.querySelector('.navbar-sidebar__close');
      if (closeBtn) {
        closeBtn.style.width = 'auto';
        closeBtn.style.minWidth = '80px';
        closeBtn.style.height = '36px';
        closeBtn.style.borderRadius = '6px';
        closeBtn.style.background = '#6B46C1';
        closeBtn.style.color = 'white';
        closeBtn.style.fontWeight = '600';
        closeBtn.style.display = 'flex';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.justifyContent = 'center';
        
        const svg = closeBtn.querySelector('svg');
        if (svg) svg.style.display = 'none';
        
        if (!closeBtn.textContent.includes('CLOSE')) {
          closeBtn.textContent = 'CLOSE';
        }
      }
      
      // Hide GitHub
      const githubLinks = document.querySelectorAll('[href*="github"]');
      githubLinks.forEach(link => {
        if (link.closest('.navbar')) {
          link.style.display = 'none';
        }
      });
    }
  }
  
  // Apply on load
  applyMobileFixes();
  
  // Apply on DOM changes
  const observer = new MutationObserver(applyMobileFixes);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
  
  // Apply on clicks
  document.addEventListener('click', function(e) {
    if (e.target.closest('.navbar__toggle, .navbar-sidebar__close')) {
      setTimeout(applyMobileFixes, 100);
    }
  });
  
  // Apply on resize
  window.addEventListener('resize', applyMobileFixes);
})();