import React from 'react';
import NavbarMobileSidebar from '@theme-original/NavbarMobileSidebar';

export default function NavbarMobileSidebarWrapper(props) {
  React.useEffect(() => {
    // Force mobile optimizations
    if (window.innerWidth <= 996) {
      document.body.classList.add('mobile-nav-optimized');
      
      // Apply immediate fixes
      const applyFixes = () => {
        // Hide Whitepaper text
        const titles = document.querySelectorAll('.navbar__title, .navbar__brand b, .navbar__brand span:not(.navbar__logo)');
        titles.forEach(el => {
          if (el && !el.classList.contains('navbar__logo')) {
            el.style.cssText = 'display: none !important; visibility: hidden !important; width: 0 !important;';
          }
        });
        
        // Optimize sidebar
        const sidebar = document.querySelector('.navbar-sidebar');
        if (sidebar) {
          sidebar.style.cssText = 'width: 75% !important; max-width: 280px !important; min-width: 240px !important;';
        }
        
        // Fix close button
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        if (closeBtn) {
          // Clear existing content
          closeBtn.innerHTML = '';
          closeBtn.style.cssText = `
            all: unset !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 60px !important;
            height: 32px !important;
            margin: 1rem !important;
            background: #6B46C1 !important;
            border-radius: 6px !important;
            color: white !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
          `;
          closeBtn.textContent = 'CLOSE';
        }
        
        // Hide GitHub
        document.querySelectorAll('[href*="github"]').forEach(el => {
          if (el.closest('.navbar')) {
            el.style.display = 'none';
          }
        });
      };
      
      // Apply immediately and on mutations
      applyFixes();
      const observer = new MutationObserver(applyFixes);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      return () => observer.disconnect();
    }
  }, []);
  
  return <NavbarMobileSidebar {...props} />;
}