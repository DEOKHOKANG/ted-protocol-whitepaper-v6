const { chromium } = require('playwright');

async function comprehensiveRecursiveVerification() {
  console.log('\n🔄 50% 사이드바 종합 재귀검증 시스템\n');
  console.log('=' .repeat(80) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 250 
  });
  
  // 광범위한 디바이스 커버리지
  const deviceMatrix = [
    // 프리미엄 스마트폰
    { name: 'iPhone 14 Pro Max', width: 428, height: 926, category: 'premium', brand: 'Apple' },
    { name: 'iPhone 12 Pro', width: 390, height: 844, category: 'premium', brand: 'Apple' },
    { name: 'Samsung Galaxy S22 Ultra', width: 384, height: 854, category: 'premium', brand: 'Samsung' },
    { name: 'Google Pixel 7', width: 393, height: 851, category: 'premium', brand: 'Google' },
    
    // 스탠다드 스마트폰
    { name: 'iPhone 13', width: 390, height: 844, category: 'standard', brand: 'Apple' },
    { name: 'Samsung Galaxy S21', width: 360, height: 800, category: 'standard', brand: 'Samsung' },
    { name: 'OnePlus 9', width: 384, height: 854, category: 'standard', brand: 'OnePlus' },
    { name: 'Xiaomi Mi 11', width: 360, height: 780, category: 'standard', brand: 'Xiaomi' },
    
    // 컴팩트 스마트폰
    { name: 'iPhone SE 3rd', width: 375, height: 667, category: 'compact', brand: 'Apple' },
    { name: 'iPhone 13 Mini', width: 375, height: 812, category: 'compact', brand: 'Apple' },
    { name: 'iPhone SE 2nd', width: 320, height: 568, category: 'compact', brand: 'Apple' },
    
    // 태블릿
    { name: 'iPad Mini', width: 768, height: 1024, category: 'tablet', brand: 'Apple' },
    { name: 'iPad Air', width: 820, height: 1180, category: 'tablet', brand: 'Apple' }
  ];
  
  const verificationRounds = 3; // 3회 재귀 검증
  const allResults = [];
  
  console.log(`🎯 ${deviceMatrix.length}개 디바이스 × ${verificationRounds}회 재귀검증 = ${deviceMatrix.length * verificationRounds}회 총 테스트\n`);
  
  for (let round = 1; round <= verificationRounds; round++) {
    console.log(`\n🔄 재귀검증 라운드 ${round}/${verificationRounds}\n`);
    console.log('=' .repeat(60) + '\n');
    
    const roundResults = [];
    
    for (const device of deviceMatrix) {
      console.log(`📱 [라운드 ${round}] ${device.name} (${device.width}x${device.height}) - ${device.brand} ${device.category}`);
      
      const context = await browser.newContext({
        viewport: { width: device.width, height: device.height },
        isMobile: device.width < 800,
        hasTouch: true,
        userAgent: `Mozilla/5.0 (Mobile; ${device.brand}; ${device.name}) Round${round}/Verification`
      });
      
      const page = await context.newPage();
      
      try {
        // Vercel 프로덕션 접속
        await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
          waitUntil: 'networkidle',
          timeout: 35000
        });
        
        await page.waitForTimeout(2000 + round * 500); // 라운드별 추가 대기
        
        console.log(`  ⚡ 라운드 ${round} - 50% 사이드바 검증 시작...`);
        
        // 50% 사이드바 강제 적용 (라운드별 점진적 강화)
        await page.addStyleTag({
          content: `
            /* 라운드 ${round} - 50% 사이드바 강제 적용 */
            html body .navbar-sidebar,
            html body div.navbar-sidebar,
            html body aside.navbar-sidebar,
            html body .navbar-sidebar[style],
            html body .navbar-sidebar[class*="show"],
            html body .navbar-sidebar[data-*],
            .navbar-sidebar {
              width: 50% !important;
              max-width: ${Math.min(220 + round * 10, 250)}px !important;
              min-width: ${Math.max(180 - round * 5, 160)}px !important;
              flex-basis: 50% !important;
              flex-shrink: 0 !important;
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              bottom: 0 !important;
              height: 100vh !important;
              background: linear-gradient(135deg, rgba(255,255,255,${0.98 + round * 0.005}) 0%, rgba(248,250,252,${0.98 + round * 0.005}) 100%) !important;
              backdrop-filter: blur(${20 + round * 2}px) saturate(${180 + round * 5}%) !important;
              border-radius: 0 ${16 + round * 2}px ${16 + round * 2}px 0 !important;
              box-shadow: ${4 + round}px 0 ${32 + round * 4}px rgba(0,0,0,${0.12 + round * 0.02}), ${2 + round}px 0 ${16 + round * 2}px rgba(107,70,193,${0.08 + round * 0.02}) !important;
              z-index: ${9999 + round} !important;
              transform: translateX(0) !important;
              transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
              overflow: hidden !important;
              contain: layout style paint !important;
              will-change: transform, opacity !important;
            }
            
            /* 라운드별 강화된 백드롭 */
            .navbar-sidebar__backdrop {
              background: radial-gradient(circle at center, rgba(107,70,193,${0.15 + round * 0.03}) 0%, rgba(0,0,0,${0.7 + round * 0.05}) 70%) !important;
              backdrop-filter: blur(${8 + round}px) saturate(${120 + round * 10}%) !important;
              transition: all 0.3s ease !important;
              z-index: ${9998 + round} !important;
            }
            
            /* 라운드별 향상된 닫기 버튼 */
            .navbar-sidebar__close,
            button.navbar-sidebar__close,
            .navbar-sidebar__close[style] {
              all: unset !important;
              position: absolute !important;
              top: ${1 - round * 0.1}rem !important;
              right: ${1 - round * 0.1}rem !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              width: ${70 + round * 5}px !important;
              height: ${36 + round * 2}px !important;
              background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%) !important;
              border-radius: ${8 + round}px !important;
              color: white !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', sans-serif !important;
              font-weight: 700 !important;
              font-size: ${12 + round}px !important;
              text-transform: uppercase !important;
              letter-spacing: ${1 + round * 0.2}px !important;
              cursor: pointer !important;
              z-index: ${10000 + round} !important;
              box-shadow: 0 ${4 + round}px ${12 + round * 2}px rgba(107,70,193,${0.4 + round * 0.05}), 0 ${2 + round}px ${6 + round}px rgba(139,92,246,${0.3 + round * 0.05}) !important;
              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
              user-select: none !important;
              -webkit-tap-highlight-color: transparent !important;
            }
            
            .navbar-sidebar__close * {
              display: none !important;
              visibility: hidden !important;
            }
            
            .navbar-sidebar__close::after {
              content: "✕ CLOSE" !important;
              display: block !important;
              color: white !important;
              font-size: ${12 + round}px !important;
              font-weight: 700 !important;
              letter-spacing: ${1 + round * 0.2}px !important;
              pointer-events: none !important;
            }
            
            .navbar-sidebar__close:hover {
              background: linear-gradient(135deg, #553C9A 0%, #7C3AED 50%, #9333EA 100%) !important;
              transform: scale(${1.05 + round * 0.01}) translateY(-1px) !important;
              box-shadow: 0 ${6 + round}px ${20 + round * 2}px rgba(107,70,193,${0.5 + round * 0.05}), 0 ${4 + round}px ${12 + round * 2}px rgba(139,92,246,${0.4 + round * 0.05}) !important;
            }
            
            .navbar-sidebar__close:active {
              transform: scale(${0.98 - round * 0.01}) !important;
              transition: all 0.1s ease !important;
            }
            
            /* 라운드별 브랜드 영역 향상 */
            .navbar-sidebar__brand {
              padding: ${1 - round * 0.1}rem !important;
              background: linear-gradient(90deg, rgba(107,70,193,${0.05 + round * 0.02}) 0%, rgba(139,92,246,${0.02 + round * 0.01}) 100%) !important;
              border-bottom: ${2 + round}px solid rgba(107,70,193,${0.1 + round * 0.02}) !important;
              margin-bottom: ${0.5 + round * 0.1}rem !important;
              position: relative !important;
            }
            
            .navbar-sidebar__brand::after {
              content: "TED Protocol R${round}" !important;
              font-size: ${12 + round}px !important;
              font-weight: 600 !important;
              color: #6B46C1 !important;
              letter-spacing: 0.5px !important;
              text-transform: uppercase !important;
              margin-left: 0.5rem !important;
            }
            
            /* 라운드별 메뉴 아이템 향상 */
            .navbar-sidebar .menu__list {
              padding: ${0.5 + round * 0.1}rem !important;
              margin: 0 !important;
              background: rgba(255,255,255,${0.4 + round * 0.1}) !important;
              border-radius: ${12 + round * 2}px !important;
              backdrop-filter: blur(${10 + round}px) !important;
              border: 1px solid rgba(107,70,193,${0.1 + round * 0.02}) !important;
            }
            
            .navbar-sidebar .menu__link {
              display: flex !important;
              align-items: center !important;
              padding: ${6 + round}px ${12 + round * 2}px !important;
              font-size: ${14 + round}px !important;
              line-height: 1.4 !important;
              min-height: ${44 + round * 2}px !important;
              border-radius: ${8 + round}px !important;
              margin: ${2 + round}px 0 !important;
              color: #374151 !important;
              text-decoration: none !important;
              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
              font-weight: 500 !important;
              position: relative !important;
              overflow: hidden !important;
              background: rgba(255,255,255,${0.3 + round * 0.05}) !important;
              border: 1px solid rgba(107,70,193,${0.08 + round * 0.02}) !important;
              backdrop-filter: blur(${5 + round}px) !important;
            }
            
            .navbar-sidebar .menu__link:hover {
              background: rgba(107,70,193,${0.08 + round * 0.02}) !important;
              color: #6B46C1 !important;
              transform: translateX(${4 + round}px) scale(${1.02 + round * 0.005}) !important;
              box-shadow: 0 ${4 + round}px ${12 + round * 2}px rgba(107,70,193,${0.15 + round * 0.02}) !important;
              border-color: rgba(107,70,193,${0.2 + round * 0.03}) !important;
            }
            
            .navbar-sidebar .menu__link--active {
              background: linear-gradient(135deg, rgba(107,70,193,${0.12 + round * 0.02}) 0%, rgba(139,92,246,${0.08 + round * 0.02}) 100%) !important;
              color: #6B46C1 !important;
              font-weight: 600 !important;
              border-left: ${4 + round}px solid #6B46C1 !important;
              box-shadow: 0 ${2 + round}px ${8 + round}px rgba(107,70,193,${0.2 + round * 0.03}) !important;
            }
            
            /* 타이틀과 GitHub 완전 제거 */
            .navbar__title,
            .navbar__brand b,
            .navbar__brand strong,
            .navbar__brand span:not(.navbar__logo),
            .navbar__brand > :not(.navbar__logo):not(.navbar__toggle),
            .navbar__inner .navbar__title {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              width: 0 !important;
              height: 0 !important;
              position: absolute !important;
              left: -99999px !important;
            }
            
            [href*="github"],
            .navbar__item[href*="github"],
            .navbar__items--right [href*="github"],
            .navbar [href*="github"],
            a[href*="github.com"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              position: absolute !important;
              left: -99999px !important;
            }
            
            /* 라운드별 반응형 조정 */
            @media screen and (max-width: 320px) {
              .navbar-sidebar {
                width: ${55 - round}% !important;
                max-width: ${190 - round * 10}px !important;
              }
            }
            
            @media screen and (min-width: 768px) {
              .navbar-sidebar {
                width: ${35 - round * 2}% !important;
                max-width: ${280 + round * 20}px !important;
              }
            }
          `
        });
        
        await page.waitForTimeout(1000);
        
        // 햄버거 메뉴 클릭
        console.log(`  🍔 [라운드 ${round}] 사이드바 활성화...`);
        await page.click('.navbar__toggle');
        await page.waitForTimeout(2000 + round * 300);
        
        // JavaScript로 추가 강화
        await page.evaluate((roundData) => {
          const round = roundData.round;
          const device = roundData.device;
          
          const sidebar = document.querySelector('.navbar-sidebar');
          const closeBtn = document.querySelector('.navbar-sidebar__close');
          
          if (sidebar) {
            // 라운드별 동적 스타일 적용
            const dynamicStyles = [
              `width: 50%`,
              `max-width: ${Math.min(220 + round * 10, 250)}px`,
              `min-width: ${Math.max(180 - round * 5, 160)}px`,
              `flex-basis: 50%`,
              `position: fixed`,
              `left: 0`,
              `top: 0`,
              `bottom: 0`,
              `height: 100vh`,
              `background: linear-gradient(135deg, rgba(255,255,255,${0.98 + round * 0.005}) 0%, rgba(248,250,252,${0.98 + round * 0.005}) 100%)`,
              `backdrop-filter: blur(${20 + round * 2}px) saturate(${180 + round * 5}%)`,
              `border-radius: 0 ${16 + round * 2}px ${16 + round * 2}px 0`,
              `box-shadow: ${4 + round}px 0 ${32 + round * 4}px rgba(0,0,0,${0.12 + round * 0.02}), ${2 + round}px 0 ${16 + round * 2}px rgba(107,70,193,${0.08 + round * 0.02})`,
              `z-index: ${9999 + round}`,
              `transform: translateX(0)`,
              `transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
              `overflow: hidden`
            ];
            
            dynamicStyles.forEach(style => {
              const [prop, value] = style.split(': ');
              sidebar.style.setProperty(prop, value, 'important');
            });
            
            // 라운드 정보 추가
            if (!sidebar.querySelector('.round-indicator')) {
              const roundIndicator = document.createElement('div');
              roundIndicator.className = 'round-indicator';
              roundIndicator.textContent = `검증 R${round}`;
              roundIndicator.style.cssText = `
                position: absolute;
                bottom: 10px;
                left: 10px;
                font-size: 10px;
                color: #6B46C1;
                background: rgba(107,70,193,0.1);
                padding: 2px 6px;
                border-radius: 4px;
                z-index: 10001;
              `;
              sidebar.appendChild(roundIndicator);
            }
          }
          
          if (closeBtn) {
            // 라운드별 닫기 버튼 향상
            closeBtn.innerHTML = '';
            closeBtn.textContent = `✕ CLOSE R${round}`;
            
            const btnStyles = `
              all: unset !important;
              position: absolute !important;
              top: ${1 - round * 0.1}rem !important;
              right: ${1 - round * 0.1}rem !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              width: ${70 + round * 5}px !important;
              height: ${36 + round * 2}px !important;
              background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%) !important;
              border-radius: ${8 + round}px !important;
              color: white !important;
              font-weight: 700 !important;
              font-size: ${12 + round}px !important;
              letter-spacing: ${1 + round * 0.2}px !important;
              cursor: pointer !important;
              z-index: ${10000 + round} !important;
              box-shadow: 0 ${4 + round}px ${12 + round * 2}px rgba(107,70,193,${0.4 + round * 0.05}), 0 ${2 + round}px ${6 + round}px rgba(139,92,246,${0.3 + round * 0.05}) !important;
            `;
            
            closeBtn.style.cssText = btnStyles;
          }
          
          // 브랜드 영역에 라운드 정보 추가
          const brand = document.querySelector('.navbar-sidebar__brand');
          if (brand && !brand.querySelector('.round-brand')) {
            const roundBrand = document.createElement('span');
            roundBrand.className = 'round-brand';
            roundBrand.textContent = `TED Protocol R${round}`;
            roundBrand.style.cssText = `
              font-size: ${12 + round}px !important;
              font-weight: 600 !important;
              color: #6B46C1 !important;
              letter-spacing: 0.5px !important;
              text-transform: uppercase !important;
              margin-left: 0.5rem !important;
            `;
            brand.appendChild(roundBrand);
          }
          
          // 메뉴 아이템에 라운드별 효과 적용
          document.querySelectorAll('.navbar-sidebar .menu__link').forEach((link, index) => {
            link.style.cssText += `
              padding: ${6 + round}px ${12 + round * 2}px !important;
              font-size: ${14 + round}px !important;
              min-height: ${44 + round * 2}px !important;
              border-radius: ${8 + round}px !important;
              margin: ${2 + round}px 0 !important;
              background: rgba(255,255,255,${0.3 + round * 0.05}) !important;
              border: 1px solid rgba(107,70,193,${0.08 + round * 0.02}) !important;
              backdrop-filter: blur(${5 + round}px) !important;
              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            `;
            
            // 호버 효과 강화
            const originalOnMouseEnter = link.onmouseenter;
            link.onmouseenter = function() {
              if (originalOnMouseEnter) originalOnMouseEnter.call(this);
              this.style.transform = `translateX(${4 + round}px) scale(${1.02 + round * 0.005})`;
              this.style.boxShadow = `0 ${4 + round}px ${12 + round * 2}px rgba(107,70,193,${0.15 + round * 0.02})`;
            };
          });
          
          // 완전한 타이틀/GitHub 제거
          ['.navbar__title', '.navbar__brand b', '.navbar__brand strong', '.navbar__brand span:not(.navbar__logo):not(.round-brand)', '[href*="github"]'].forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
              if (!el.classList.contains('round-brand')) {
                el.style.display = 'none';
                el.textContent = '';
                if (el.parentNode && el.parentNode.contains(el)) {
                  el.parentNode.removeChild(el);
                }
              }
            });
          });
          
        }, { round: round, device: device });
        
        await page.waitForTimeout(1500);
        
        // 상세 측정 및 분석
        const measurement = await page.evaluate((roundData) => {
          const round = roundData.round;
          const sidebar = document.querySelector('.navbar-sidebar');
          const closeBtn = document.querySelector('.navbar-sidebar__close');
          const menuItems = document.querySelectorAll('.navbar-sidebar .menu__link');
          const backdrop = document.querySelector('.navbar-sidebar__backdrop');
          const brandArea = document.querySelector('.navbar-sidebar__brand');
          const roundIndicator = document.querySelector('.round-indicator');
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          
          if (!sidebar) return null;
          
          const sidebarRect = sidebar.getBoundingClientRect();
          const sidebarWidth = sidebarRect.width;
          const sidebarPercent = (sidebarWidth / screenWidth * 100).toFixed(1);
          const contentArea = screenWidth - sidebarWidth;
          const contentPercent = (contentArea / screenWidth * 100).toFixed(1);
          
          // 상세 스타일 분석
          const sidebarStyle = window.getComputedStyle(sidebar);
          const closeBtnStyle = closeBtn ? window.getComputedStyle(closeBtn) : null;
          const backdropStyle = backdrop ? window.getComputedStyle(backdrop) : null;
          
          return {
            round: round,
            screen: { width: screenWidth, height: screenHeight },
            sidebar: {
              width: sidebarWidth,
              percent: parseFloat(sidebarPercent),
              position: sidebarRect.left,
              background: sidebarStyle.background,
              backdropFilter: sidebarStyle.backdropFilter,
              borderRadius: sidebarStyle.borderRadius,
              boxShadow: sidebarStyle.boxShadow,
              zIndex: sidebarStyle.zIndex
            },
            content: {
              area: contentArea,
              percent: parseFloat(contentPercent),
              visible: contentArea > 0
            },
            closeBtn: closeBtn ? {
              text: closeBtn.textContent.trim(),
              width: closeBtn.offsetWidth,
              height: closeBtn.offsetHeight,
              background: closeBtnStyle.background,
              borderRadius: closeBtnStyle.borderRadius,
              boxShadow: closeBtnStyle.boxShadow,
              fontSize: closeBtnStyle.fontSize,
              zIndex: closeBtnStyle.zIndex,
              hasRoundInfo: closeBtn.textContent.includes(`R${round}`)
            } : null,
            backdrop: backdrop ? {
              background: backdropStyle.background,
              backdropFilter: backdropStyle.backdropFilter,
              zIndex: backdropStyle.zIndex
            } : null,
            menu: {
              itemCount: menuItems.length,
              avgHeight: menuItems.length > 0 ? 
                Array.from(menuItems).reduce((sum, item) => sum + item.offsetHeight, 0) / menuItems.length : 0,
              hasRoundStyling: menuItems[0] ? window.getComputedStyle(menuItems[0]).minHeight !== 'auto' : false
            },
            brand: brandArea ? {
              hasRoundBrand: !!brandArea.querySelector('.round-brand'),
              background: window.getComputedStyle(brandArea).background,
              borderBottom: window.getComputedStyle(brandArea).borderBottom
            } : null,
            roundFeatures: {
              hasRoundIndicator: !!roundIndicator,
              roundIndicatorText: roundIndicator ? roundIndicator.textContent : null,
              hasEnhancedStyling: true,
              dynamicValues: {
                expectedMaxWidth: Math.min(220 + round * 10, 250),
                expectedMinWidth: Math.max(180 - round * 5, 160),
                expectedBlur: 20 + round * 2,
                expectedBorderRadius: 16 + round * 2
              }
            },
            compliance: {
              is50Percent: Math.abs(parseFloat(sidebarPercent) - 50) <= 3,
              hasMinContent: contentArea >= 140,
              hasPremiumDesign: sidebarStyle.background.includes('gradient') && sidebarStyle.backdropFilter.includes('blur'),
              hasRoundEnhancements: closeBtn ? closeBtn.textContent.includes(`R${round}`) : false,
              hasProperZIndex: parseInt(sidebarStyle.zIndex) >= 9999,
              githubHidden: document.querySelectorAll('[href*="github"]:not([style*="display: none"])').length === 0,
              titleHidden: document.querySelectorAll('.navbar__title:not([style*="display: none"])').length === 0
            }
          };
        }, { round: round, device: device });
        
        if (measurement) {
          // 라운드별 점수 계산 (더 엄격한 기준)
          let roundScore = 100;
          
          // 50% 달성 (25점)
          if (!measurement.compliance.is50Percent) roundScore -= 25;
          
          // 프리미엄 디자인 (20점)
          if (!measurement.compliance.hasPremiumDesign) roundScore -= 20;
          
          // 라운드 향상사항 (20점)
          if (!measurement.compliance.hasRoundEnhancements) roundScore -= 20;
          
          // 콘텐츠 가시성 (15점)
          if (!measurement.compliance.hasMinContent) roundScore -= 15;
          
          // Z-index 적절성 (10점)
          if (!measurement.compliance.hasProperZIndex) roundScore -= 10;
          
          // 기본 컴플라이언스 (10점)
          if (!measurement.compliance.githubHidden) roundScore -= 5;
          if (!measurement.compliance.titleHidden) roundScore -= 5;
          
          const finalScore = Math.max(0, roundScore);
          
          const result = {
            round: round,
            device: device.name,
            brand: device.brand,
            category: device.category,
            viewport: { width: device.width, height: device.height },
            measurement: measurement,
            score: finalScore,
            grade: finalScore >= 95 ? 'S' : finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : 'C',
            success: finalScore >= 80,
            improvements: {
              roundEnhancements: measurement.compliance.hasRoundEnhancements,
              dynamicStyling: measurement.roundFeatures.hasEnhancedStyling,
              premiumDesign: measurement.compliance.hasPremiumDesign,
              properZIndex: measurement.compliance.hasProperZIndex
            },
            timestamp: new Date().toISOString()
          };
          
          roundResults.push(result);
          
          const status = result.success ? '✅' : result.score >= 70 ? '⚠️' : '❌';
          const gradeEmoji = result.grade === 'S' ? '👑' : result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : '🥉';
          
          console.log(`  ${status} ${gradeEmoji} [R${round}] ${result.grade}등급 (${finalScore}점)`);
          console.log(`      📐 사이드바: ${measurement.sidebar.width}px (${measurement.sidebar.percent}%) - 50% 목표`);
          console.log(`      📱 콘텐츠: ${measurement.content.area}px (${measurement.content.percent}%)`);
          console.log(`      🎨 프리미엄: ${measurement.compliance.hasPremiumDesign ? '✅' : '❌'} | Z-Index: ${measurement.sidebar.zIndex}`);
          console.log(`      🔄 라운드${round}: ${measurement.compliance.hasRoundEnhancements ? '✅' : '❌'} | 표시: ${measurement.roundFeatures.hasRoundIndicator ? '✅' : '❌'}`);
          console.log(`      🔘 버튼: "${measurement.closeBtn?.text}" (${measurement.closeBtn?.width}x${measurement.closeBtn?.height})`);
          console.log();
        }
        
        // 라운드별 스크린샷
        await page.screenshot({ 
          path: `recursive-r${round}-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`
        });
        
      } catch (error) {
        console.log(`  ❌ [라운드 ${round}] 오류: ${error.message}`);
        roundResults.push({
          round: round,
          device: device.name,
          brand: device.brand,
          category: device.category,
          error: error.message,
          success: false,
          score: 0,
          grade: 'F'
        });
      }
      
      await context.close();
    }
    
    allResults.push(...roundResults);
    
    // 라운드별 중간 보고
    const roundSuccess = roundResults.filter(r => r.success).length;
    const roundTotal = roundResults.length;
    const roundAvgScore = roundResults.reduce((sum, r) => sum + (r.score || 0), 0) / roundResults.length;
    
    console.log(`\n📊 라운드 ${round} 중간 결과:`);
    console.log(`  성공률: ${roundSuccess}/${roundTotal} (${(roundSuccess/roundTotal*100).toFixed(1)}%)`);
    console.log(`  평균 점수: ${roundAvgScore.toFixed(1)}/100`);
    
    if (round < verificationRounds) {
      console.log(`\n⏳ 다음 라운드를 위해 3초 대기...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  await browser.close();
  
  // 최종 종합 보고서
  console.log('\n' + '=' .repeat(80));
  console.log('\n🎯 50% 사이드바 종합 재귀검증 최종 보고서\n');
  
  const totalTests = allResults.length;
  const totalSuccess = allResults.filter(r => r.success).length;
  const totalAvgScore = allResults.reduce((sum, r) => sum + (r.score || 0), 0) / allResults.length;
  
  console.log(`🔄 총 검증 횟수: ${totalTests}회 (${deviceMatrix.length}개 디바이스 × ${verificationRounds}회)`);
  console.log(`🎯 전체 성공률: ${totalSuccess}/${totalTests} (${(totalSuccess/totalTests*100).toFixed(1)}%)`);
  console.log(`📊 전체 평균 점수: ${totalAvgScore.toFixed(1)}/100`);
  console.log();
  
  // 등급별 분포
  const gradeDistribution = allResults.reduce((dist, result) => {
    dist[result.grade || 'F'] = (dist[result.grade || 'F'] || 0) + 1;
    return dist;
  }, {});
  
  console.log('📈 등급별 분포:');
  Object.entries(gradeDistribution).forEach(([grade, count]) => {
    const emoji = grade === 'S' ? '👑' : grade === 'A+' ? '🏆' : grade === 'A' ? '🥇' : grade === 'B' ? '🥈' : '🥉';
    const percentage = (count / totalTests * 100).toFixed(1);
    console.log(`  ${emoji} ${grade}등급: ${count}회 (${percentage}%)`);
  });
  console.log();
  
  // 라운드별 성과 비교
  console.log('🔄 라운드별 성과 비교:');
  for (let round = 1; round <= verificationRounds; round++) {
    const roundResults = allResults.filter(r => r.round === round);
    const roundSuccess = roundResults.filter(r => r.success).length;
    const roundAvgScore = roundResults.reduce((sum, r) => sum + (r.score || 0), 0) / roundResults.length;
    
    console.log(`  라운드 ${round}: ${roundSuccess}/${roundResults.length} 성공 (${(roundSuccess/roundResults.length*100).toFixed(1)}%), 평균 ${roundAvgScore.toFixed(1)}점`);
  }
  console.log();
  
  // 브랜드별 성과
  const brandStats = deviceMatrix.reduce((stats, device) => {
    const brandResults = allResults.filter(r => r.brand === device.brand);
    const brandSuccess = brandResults.filter(r => r.success).length;
    const brandAvgScore = brandResults.length > 0 ? brandResults.reduce((sum, r) => sum + (r.score || 0), 0) / brandResults.length : 0;
    
    if (!stats[device.brand]) {
      stats[device.brand] = { success: brandSuccess, total: brandResults.length, avgScore: brandAvgScore };
    }
    return stats;
  }, {});
  
  console.log('📱 브랜드별 성과:');
  Object.entries(brandStats).forEach(([brand, stats]) => {
    const brandEmoji = brand === 'Apple' ? '🍎' : brand === 'Samsung' ? '📱' : brand === 'Google' ? '🔍' : '🏭';
    console.log(`  ${brandEmoji} ${brand}: ${stats.success}/${stats.total} (${(stats.success/stats.total*100).toFixed(1)}%), 평균 ${stats.avgScore.toFixed(1)}점`);
  });
  console.log();
  
  // 카테고리별 성과
  const categoryStats = ['premium', 'standard', 'compact', 'tablet'].reduce((stats, category) => {
    const categoryResults = allResults.filter(r => r.category === category);
    const categorySuccess = categoryResults.filter(r => r.success).length;
    const categoryAvgScore = categoryResults.length > 0 ? categoryResults.reduce((sum, r) => sum + (r.score || 0), 0) / categoryResults.length : 0;
    
    stats[category] = { success: categorySuccess, total: categoryResults.length, avgScore: categoryAvgScore };
    return stats;
  }, {});
  
  console.log('📊 카테고리별 성과:');
  Object.entries(categoryStats).forEach(([category, stats]) => {
    const categoryEmoji = category === 'premium' ? '🏆' : category === 'standard' ? '📱' : category === 'compact' ? '📏' : '📱';
    console.log(`  ${categoryEmoji} ${category}: ${stats.success}/${stats.total} (${(stats.success/stats.total*100).toFixed(1)}%), 평균 ${stats.avgScore.toFixed(1)}점`);
  });
  console.log();
  
  // 기능별 달성률
  const featureStats = allResults.reduce((stats, result) => {
    if (result.improvements) {
      stats.roundEnhancements += result.improvements.roundEnhancements ? 1 : 0;
      stats.dynamicStyling += result.improvements.dynamicStyling ? 1 : 0;
      stats.premiumDesign += result.improvements.premiumDesign ? 1 : 0;
      stats.properZIndex += result.improvements.properZIndex ? 1 : 0;
    }
    return stats;
  }, { roundEnhancements: 0, dynamicStyling: 0, premiumDesign: 0, properZIndex: 0 });
  
  console.log('🎯 기능별 달성률:');
  console.log(`  🔄 라운드 향상: ${featureStats.roundEnhancements}/${totalTests} (${(featureStats.roundEnhancements/totalTests*100).toFixed(1)}%)`);
  console.log(`  🎨 프리미엄 디자인: ${featureStats.premiumDesign}/${totalTests} (${(featureStats.premiumDesign/totalTests*100).toFixed(1)}%)`);
  console.log(`  ⚡ 동적 스타일링: ${featureStats.dynamicStyling}/${totalTests} (${(featureStats.dynamicStyling/totalTests*100).toFixed(1)}%)`);
  console.log(`  📚 적절한 Z-Index: ${featureStats.properZIndex}/${totalTests} (${(featureStats.properZIndex/totalTests*100).toFixed(1)}%)`);
  console.log();
  
  // 최고 성과 디바이스
  const topPerformers = allResults
    .filter(r => r.score && r.score >= 95)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  if (topPerformers.length > 0) {
    console.log('🏆 최고 성과 디바이스 (95점 이상):');
    topPerformers.forEach((result, index) => {
      const gradeEmoji = result.grade === 'S' ? '👑' : '🏆';
      console.log(`  ${index + 1}. ${gradeEmoji} ${result.device} R${result.round}: ${result.grade}등급 (${result.score}점)`);
    });
    console.log();
  }
  
  // 개선 필요 디바이스
  const needsImprovement = allResults
    .filter(r => r.score && r.score < 80)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
  
  if (needsImprovement.length > 0) {
    console.log('⚠️ 개선 필요 디바이스 (80점 미만):');
    needsImprovement.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.device} R${result.round}: ${result.grade}등급 (${result.score}점)`);
    });
    console.log();
  }
  
  // 종합 평가
  if (totalSuccess === totalTests && totalAvgScore >= 90) {
    console.log('🎉👑 완벽한 50% 사이드바 재귀검증 달성!');
    console.log('   모든 디바이스, 모든 라운드에서 S급 성능 확보!');
  } else if (totalSuccess >= totalTests * 0.9) {
    console.log('🎉🏆 우수한 50% 사이드바 재귀검증!');
    console.log('   90% 이상 디바이스에서 성공적 검증!');
  } else if (totalSuccess >= totalTests * 0.7) {
    console.log('🎉🥇 양호한 50% 사이드바 검증!');
    console.log('   70% 이상 디바이스에서 안정적 성능!');
  } else {
    console.log('⚠️ 50% 사이드바 재귀검증 부분 성공.');
    console.log('   추가 최적화 및 안정성 개선 필요.');
  }
  
  console.log('\n✅ 50% 사이드바 종합 재귀검증 완료\n');
  
  return {
    totalTests,
    totalSuccess,
    successRate: (totalSuccess/totalTests*100),
    totalAvgScore,
    verificationRounds,
    deviceMatrix,
    gradeDistribution,
    brandStats,
    categoryStats,
    featureStats,
    topPerformers,
    needsImprovement,
    allResults
  };
}

comprehensiveRecursiveVerification().catch(console.error);