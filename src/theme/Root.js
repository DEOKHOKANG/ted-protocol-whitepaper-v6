import React from 'react';

// PC/Mobile Responsive Navigation + Mobile Hamburger Menu
export default function Root({children}) {
  React.useEffect(() => {
    // Ultimate responsive navigation styles
    const style = document.createElement('style');
    style.id = 'responsive-navigation-styles';
    style.innerHTML = `
      /* ===== PC ENVIRONMENT STYLES ===== */
      @media screen and (min-width: 997px) {
        /* PC: Show GitHub link */
        .github-link {
          display: flex !important;
          align-items: center !important;
        }
        
        /* PC: Logo positioning - move slightly right */
        .navbar__brand {
          margin-left: 24px !important;
        }
        
        /* PC: Language dropdown positioning - move slightly left */
        .navbar__items--right {
          margin-right: 24px !important;
        }
        
        /* PC: Hide mobile hamburger */
        #mobile-hamburger-btn {
          display: none !important;
        }
      }
      
      /* ===== MOBILE ENVIRONMENT STYLES ===== */
      @media screen and (max-width: 996px) {
        /* Mobile: Hide GitHub link completely */
        .github-link {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
          position: absolute !important;
          left: -9999px !important;
        }
        
        /* Mobile: Hide original title on mobile for space */
        .navbar__title {
          display: none !important;
        }
        
        /* Mobile: Logo positioning adjustments */
        .navbar__brand {
          margin-left: 60px !important; /* Space for hamburger button */
          margin-right: auto !important;
        }
        
        /* Mobile: Language dropdown positioning - move left */
        .navbar__items--right {
          margin-right: 12px !important;
        }
        
        /* Mobile: Fix original docusaurus sidebar width when it opens */
        .navbar-sidebar {
          width: 85% !important;
          max-width: 320px !important;
          min-width: 280px !important;
        }
        
        /* Mobile: Style original sidebar close button */
        .navbar-sidebar__close {
          width: auto !important;
          min-width: 80px !important;
          height: 36px !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          background: #6B46C1 !important;
          color: white !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: none !important;
          cursor: pointer !important;
        }
        
        .navbar-sidebar__close svg {
          display: none !important;
        }
        
        .navbar-sidebar__close::before {
          content: "CLOSE" !important;
          display: block !important;
          color: white !important;
          font-weight: 600 !important;
        }
      }
      
      /* ===== MOBILE HAMBURGER MENU STYLES ===== */
      @media screen and (max-width: 996px) {
        /* Hamburger button positioning - top left */
        #mobile-hamburger-btn {
          position: fixed !important;
          top: 12px !important;
          left: 16px !important;
          z-index: 1002 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          width: 40px !important;
          height: 40px !important;
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(107, 70, 193, 0.2) !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          padding: 8px !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
        
        #mobile-hamburger-btn:hover {
          background: rgba(107, 70, 193, 0.1) !important;
          border-color: rgba(107, 70, 193, 0.3) !important;
        }
        
        /* Hamburger lines */
        #mobile-hamburger-btn span {
          width: 20px !important;
          height: 2px !important;
          background: #6B46C1 !important;
          margin: 2px 0 !important;
          transition: all 0.3s ease !important;
          border-radius: 1px !important;
          display: block !important;
        }
        
        /* Mobile slide menu */
        #mobile-slide-menu {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 90% !important;
          max-width: 360px !important;
          height: 100vh !important;
          background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%) !important;
          backdrop-filter: blur(20px) !important;
          box-shadow: 4px 0 32px rgba(0,0,0,0.15) !important;
          transform: translateX(-100%) !important;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          z-index: 1001 !important;
          overflow-y: auto !important;
          display: none !important;
        }
        
        /* Mobile backdrop */
        #mobile-backdrop {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(0,0,0,0.6) !important;
          backdrop-filter: blur(8px) !important;
          z-index: 1000 !important;
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Apply responsive fixes dynamically
    const applyResponsiveFixes = () => {
      // For mobile devices
      if (window.innerWidth <= 996) {
        // Hide GitHub links on mobile
        document.querySelectorAll('.github-link').forEach(el => {
          el.style.cssText = 'display: none !important; visibility: hidden !important;';
        });
        
        // Fix original docusaurus sidebar when it opens
        const sidebar = document.querySelector('.navbar-sidebar');
        if (sidebar && sidebar.style.display !== 'none') {
          sidebar.style.cssText += 'width: 85% !important; max-width: 320px !important;';
          
          const closeBtn = sidebar.querySelector('.navbar-sidebar__close');
          if (closeBtn) {
            closeBtn.style.cssText = `
              width: auto !important;
              min-width: 80px !important;
              height: 36px !important;
              padding: 8px 16px !important;
              border-radius: 6px !important;
              background: #6B46C1 !important;
              color: white !important;
              font-weight: 600 !important;
            `;
            
            const svg = closeBtn.querySelector('svg');
            if (svg) svg.style.display = 'none';
            
            if (!closeBtn.textContent.includes('CLOSE')) {
              closeBtn.textContent = 'CLOSE';
            }
          }
        }
      }
    };
    
    // Apply immediately
    applyResponsiveFixes();
    
    // Monitor DOM changes
    const observer = new MutationObserver(applyResponsiveFixes);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Apply on interactions
    document.addEventListener('click', () => setTimeout(applyResponsiveFixes, 100));
    window.addEventListener('resize', applyResponsiveFixes);
    
    // Create mobile hamburger menu
    const createMobileHamburgerMenu = () => {
      const portal = document.getElementById('mobile-menu-portal');
      if (!portal) return;
      
      portal.innerHTML = `
        <button id="mobile-hamburger-btn">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div id="mobile-slide-menu">
          <div style="padding: 24px; height: 100%; display: flex; flex-direction: column;">
            <!-- Header Section -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid rgba(107, 70, 193, 0.1);">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 18px;">📋</span>
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #333; line-height: 1.2;">TED Protocol</h3>
                  <p style="margin: 2px 0 0; font-size: 13px; color: #666; line-height: 1.2;">Whitepaper Navigation</p>
                </div>
              </div>
              
              <!-- Close Button -->
              <button id="mobile-close-btn" style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: rgba(107, 70, 193, 0.1);
                border: 1px solid rgba(107, 70, 193, 0.2);
                color: #6B46C1;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 18px;
              ">
                ×
              </button>
            </div>
            
            <!-- Menu Items Section -->
            <div style="flex: 1; overflow-y: auto;">
              <h4 style="margin: 0 0 20px; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.8px;">Documentation Sections</h4>
              
              <nav id="menu-items" style="display: flex; flex-direction: column; gap: 4px;">
                <a href="/" style="display: flex; align-items: center; gap: 16px; padding: 16px 12px; color: #333; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 10px; transition: all 0.2s ease; border-left: 3px solid transparent;">
                  <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(107, 70, 193, 0.1); border-radius: 6px; font-size: 14px;">📋</span>
                  <span style="flex: 1;">Executive Summary</span>
                </a>
                
                <a href="/introduction" style="display: flex; align-items: center; gap: 16px; padding: 16px 12px; color: #333; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 10px; transition: all 0.2s ease; border-left: 3px solid transparent;">
                  <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(107, 70, 193, 0.1); border-radius: 6px; font-size: 14px;">🚀</span>
                  <span style="flex: 1;">Introduction</span>
                </a>
                
                <a href="/tokenomics/utility" style="display: flex; align-items: center; gap: 16px; padding: 16px 12px; color: #333; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 10px; transition: all 0.2s ease; border-left: 3px solid transparent;">
                  <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(107, 70, 193, 0.1); border-radius: 6px; font-size: 14px;">💎</span>
                  <span style="flex: 1;">Token Utility</span>
                </a>
                
                <a href="/tokenomics/distribution" style="display: flex; align-items: center; gap: 16px; padding: 16px 12px; color: #333; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 10px; transition: all 0.2s ease; border-left: 3px solid transparent;">
                  <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(107, 70, 193, 0.1); border-radius: 6px; font-size: 14px;">📊</span>
                  <span style="flex: 1;">Token Distribution</span>
                </a>
                
                <a href="/protocol/architecture" style="display: flex; align-items: center; gap: 16px; padding: 16px 12px; color: #333; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 10px; transition: all 0.2s ease; border-left: 3px solid transparent;">
                  <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(107, 70, 193, 0.1); border-radius: 6px; font-size: 14px;">⚙️</span>
                  <span style="flex: 1;">Protocol Architecture</span>
                </a>
                
                <a href="/protocol/smart-contracts" style="display: flex; align-items: center; gap: 16px; padding: 16px 12px; color: #333; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 10px; transition: all 0.2s ease; border-left: 3px solid transparent;">
                  <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(107, 70, 193, 0.1); border-radius: 6px; font-size: 14px;">🔐</span>
                  <span style="flex: 1;">Smart Contracts</span>
                </a>
                
                <a href="/protocol/security" style="display: flex; align-items: center; gap: 16px; padding: 16px 12px; color: #333; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 10px; transition: all 0.2s ease; border-left: 3px solid transparent;">
                  <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(107, 70, 193, 0.1); border-radius: 6px; font-size: 14px;">🛡️</span>
                  <span style="flex: 1;">Security</span>
                </a>
                
                <a href="/risks/investment-risks" style="display: flex; align-items: center; gap: 16px; padding: 16px 12px; color: #333; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 10px; transition: all 0.2s ease; border-left: 3px solid transparent;">
                  <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(107, 70, 193, 0.1); border-radius: 6px; font-size: 14px;">⚠️</span>
                  <span style="flex: 1;">Investment Risks</span>
                </a>
                
                <a href="/legal/disclaimers" style="display: flex; align-items: center; gap: 16px; padding: 16px 12px; color: #333; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 10px; transition: all 0.2s ease; border-left: 3px solid transparent;">
                  <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: rgba(107, 70, 193, 0.1); border-radius: 6px; font-size: 14px;">📜</span>
                  <span style="flex: 1;">Legal Disclaimers</span>
                </a>
              </nav>
            </div>
            
            <!-- Footer Section -->
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(107, 70, 193, 0.1);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 13px; color: #666; font-weight: 500;">Version</span>
                <span style="font-size: 13px; color: #6B46C1; font-weight: 600;">v5.2</span>
              </div>
              
              <div style="display: flex; gap: 12px; justify-content: center;">
                <a href="https://twitter.com/tedprotocol" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: rgba(107, 70, 193, 0.1); border-radius: 8px; text-decoration: none; transition: all 0.2s ease;" target="_blank">
                  <span style="font-size: 16px;">🐦</span>
                </a>
                <a href="https://t.me/tedprotocol" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: rgba(107, 70, 193, 0.1); border-radius: 8px; text-decoration: none; transition: all 0.2s ease;" target="_blank">
                  <span style="font-size: 16px;">📱</span>
                </a>
                <a href="https://discord.gg/tedprotocol" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: rgba(107, 70, 193, 0.1); border-radius: 8px; text-decoration: none; transition: all 0.2s ease;" target="_blank">
                  <span style="font-size: 16px;">💬</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div id="mobile-backdrop"></div>
      `;
      
      // Event listeners for mobile menu
      const hamburgerBtn = document.getElementById('mobile-hamburger-btn');
      const slideMenu = document.getElementById('mobile-slide-menu');
      const backdrop = document.getElementById('mobile-backdrop');
      const closeBtn = document.getElementById('mobile-close-btn');
      
      if (hamburgerBtn && slideMenu && backdrop && closeBtn) {
        const openMenu = () => {
          slideMenu.style.display = 'block';
          backdrop.style.display = 'block';
          setTimeout(() => {
            slideMenu.style.transform = 'translateX(0%)';
          }, 10);
          document.body.style.overflow = 'hidden';
          
          // Animate hamburger to X
          const spans = hamburgerBtn.querySelectorAll('span');
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        };
        
        const closeMenu = () => {
          slideMenu.style.transform = 'translateX(-100%)';
          setTimeout(() => {
            slideMenu.style.display = 'none';
            backdrop.style.display = 'none';
          }, 400);
          document.body.style.overflow = 'unset';
          
          // Reset hamburger animation
          const spans = hamburgerBtn.querySelectorAll('span');
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        };
        
        // Hamburger button click
        hamburgerBtn.addEventListener('click', () => {
          const isOpen = slideMenu.style.transform === 'translateX(0%)';
          if (isOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        });
        
        // Close button click
        closeBtn.addEventListener('click', closeMenu);
        
        // Backdrop click to close
        backdrop.addEventListener('click', closeMenu);
        
        // Menu item clicks close menu
        const menuItems = document.querySelectorAll('#menu-items a');
        menuItems.forEach(item => {
          item.addEventListener('click', closeMenu);
        });
        
        // Menu item hover effects
        menuItems.forEach(item => {
          item.addEventListener('mouseenter', () => {
            item.style.background = 'rgba(107, 70, 193, 0.05)';
            item.style.borderLeftColor = '#6B46C1';
          });
          
          item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent';
            item.style.borderLeftColor = 'transparent';
          });
        });
        
        // Close button hover effect
        closeBtn.addEventListener('mouseenter', () => {
          closeBtn.style.background = 'rgba(107, 70, 193, 0.2)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.background = 'rgba(107, 70, 193, 0.1)';
        });
      }
    };
    
    // Create mobile menu only on mobile devices
    if (window.innerWidth <= 996) {
      createMobileHamburgerMenu();
    }
    
    // Recreate menu on resize if needed
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 996) {
        const existingBtn = document.getElementById('mobile-hamburger-btn');
        if (!existingBtn) {
          createMobileHamburgerMenu();
        }
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <>
      {children}
      {/* Mobile hamburger menu portal */}
      <div id="mobile-menu-portal" />
    </>
  );
}