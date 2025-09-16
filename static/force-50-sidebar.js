// FORCE 50% SIDEBAR - AGGRESSIVE OVERRIDE
(function() {
  'use strict';
  
  console.log('🎨 Force 50% Sidebar Script Loaded');
  
  let retryCount = 0;
  const maxRetries = 20;
  
  function applySidebarFix() {
    if (window.innerWidth > 996) return;
    
    console.log(`🔄 Applying 50% Sidebar Fix (Attempt ${retryCount + 1})`);
    
    // 1. Hide title elements aggressively
    document.querySelectorAll('.navbar__title, .navbar__brand b, .navbar__brand span:not(.navbar__logo)').forEach(el => {
      if (el && !el.classList.contains('navbar__logo')) {
        el.style.cssText = 'display: none !important; visibility: hidden !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -99999px !important;';
      }
    });
    
    // 2. Apply 50% sidebar styling aggressively
    const sidebar = document.querySelector('.navbar-sidebar');
    if (sidebar) {
      console.log('📐 Found sidebar, applying 50% styling...');
      
      // Force 50% width with all possible CSS properties
      sidebar.style.cssText += `
        width: 50% !important;
        max-width: 220px !important;
        min-width: 180px !important;
        flex-basis: 50% !important;
        background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        border-radius: 0 16px 16px 0 !important;
        box-shadow: 4px 0 32px rgba(0,0,0,0.12), 2px 0 16px rgba(107,70,193,0.08) !important;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        overflow: hidden !important;
      `;
      
      // Force attributes for maximum override
      sidebar.setAttribute('style', sidebar.style.cssText);
      
      // 3. Fix close button
      const closeBtn = sidebar.querySelector('.navbar-sidebar__close');
      if (closeBtn) {
        console.log('🔘 Found close button, applying premium styling...');
        
        // Clear existing content and style
        closeBtn.innerHTML = '';
        
        closeBtn.style.cssText = `
          all: unset !important;
          position: absolute !important;
          top: 1rem !important;
          right: 1rem !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 70px !important;
          height: 36px !important;
          background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%) !important;
          border-radius: 8px !important;
          color: white !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          letter-spacing: 1px !important;
          text-transform: uppercase !important;
          cursor: pointer !important;
          z-index: 10000 !important;
          box-shadow: 0 4px 12px rgba(107,70,193,0.4), 0 2px 6px rgba(139,92,246,0.3) !important;
        `;
        
        // Add enhanced text content
        closeBtn.textContent = '✕ CLOSE';
        
        // Force click handler preservation
        const originalHandler = closeBtn.onclick;
        closeBtn.onclick = function(e) {
          console.log('🔘 Close button clicked');
          if (originalHandler) originalHandler.call(this, e);
        };
      }
      
      // 4. Enhanced backdrop
      const backdrop = document.querySelector('.navbar-sidebar__backdrop');
      if (backdrop) {
        console.log('🌫️ Found backdrop, applying premium styling...');
        backdrop.style.cssText += `
          background: radial-gradient(circle at center, rgba(107,70,193,0.15) 0%, rgba(0,0,0,0.7) 70%) !important;
          backdrop-filter: blur(8px) saturate(120%) !important;
        `;
      }
      
      console.log('✅ 50% Sidebar styling applied successfully');
      return true;
    }
    
    return false;
  }
  
  function startForceOverride() {
    // Apply immediately if DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      applySidebarFix();
    }
    
    // Set up continuous monitoring
    const monitor = setInterval(() => {
      if (retryCount >= maxRetries) {
        console.log('⚠️ Max retries reached for sidebar fix');
        clearInterval(monitor);
        return;
      }
      
      if (applySidebarFix()) {
        retryCount++;
      }
    }, 500);
    
    // MutationObserver for dynamic changes
    const observer = new MutationObserver((mutations) => {
      let shouldApplyFix = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.classList && (
                node.classList.contains('navbar-sidebar') ||
                node.querySelector && node.querySelector('.navbar-sidebar')
              )) {
                shouldApplyFix = true;
              }
            }
          });
        }
        
        if (mutation.type === 'attributes' && 
            mutation.target.classList && 
            mutation.target.classList.contains('navbar-sidebar')) {
          shouldApplyFix = true;
        }
      });
      
      if (shouldApplyFix) {
        console.log('🔄 Sidebar changes detected, reapplying fixes...');
        setTimeout(applySidebarFix, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Window resize handler
    window.addEventListener('resize', () => {
      setTimeout(applySidebarFix, 100);
    });
    
    console.log('🚀 Force 50% Sidebar monitoring started');
  }
  
  // Start the force override system
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startForceOverride);
  } else {
    startForceOverride();
  }
  
  // Backup: also run after a delay
  setTimeout(startForceOverride, 1000);
  setTimeout(applySidebarFix, 2000);
  setTimeout(applySidebarFix, 5000);
  
})();