import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Force mobile fixes on every page
if (ExecutionEnvironment.canUseDOM) {
  // Inject critical styles immediately
  const style = document.createElement('style');
  style.id = 'mobile-critical-overrides';
  style.innerHTML = `
    @media screen and (max-width: 996px) {
      /* Hide Whitepaper text completely */
      .navbar__title,
      .navbar__brand b,
      .navbar__brand span:not(.navbar__logo) {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
        position: absolute !important;
        left: -9999px !important;
      }
      
      /* Optimize sidebar */
      .navbar-sidebar {
        width: 75% !important;
        max-width: 280px !important;
        min-width: 240px !important;
      }
      
      /* Redesign close button */
      .navbar-sidebar__close {
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
      }
      
      .navbar-sidebar__close::before {
        content: "CLOSE" !important;
        color: white !important;
      }
      
      .navbar-sidebar__close svg,
      .navbar-sidebar__close > * {
        display: none !important;
      }
      
      /* Hide GitHub */
      [href*="github"] {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Apply fixes on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyMobileFixes);
  } else {
    applyMobileFixes();
  }
  
  function applyMobileFixes() {
    if (window.innerWidth <= 996) {
      // Force hide title
      document.querySelectorAll('.navbar__title, .navbar__brand b').forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
      });
      
      // Monitor for sidebar open
      const observer = new MutationObserver(() => {
        const sidebar = document.querySelector('.navbar-sidebar');
        if (sidebar && sidebar.style.display !== 'none') {
          sidebar.style.width = '75%';
          sidebar.style.maxWidth = '280px';
          
          const closeBtn = sidebar.querySelector('.navbar-sidebar__close');
          if (closeBtn && !closeBtn.textContent.includes('CLOSE')) {
            closeBtn.innerHTML = 'CLOSE';
            closeBtn.style.cssText = `
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              width: 60px !important;
              height: 32px !important;
              background: #6B46C1 !important;
              border-radius: 6px !important;
              color: white !important;
              font-weight: 600 !important;
            `;
          }
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
  }
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}