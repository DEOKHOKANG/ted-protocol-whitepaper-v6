const { chromium } = require('playwright');

async function finalMasterOptimization() {
  console.log('\n🚀 최종 마스터 최적화 시스템\n');
  console.log('=' .repeat(70) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 
  });
  
  // 완전한 디바이스 커버리지
  const allDevices = [
    { name: 'iPhone 12 Pro', width: 390, height: 844, category: 'premium' },
    { name: 'iPhone SE', width: 320, height: 568, category: 'compact' },
    { name: 'Samsung Galaxy S21', width: 360, height: 800, category: 'standard' },
    { name: 'Samsung Galaxy Note', width: 412, height: 869, category: 'large' },
    { name: 'iPad Mini', width: 768, height: 1024, category: 'tablet' },
    { name: 'Google Pixel 5', width: 393, height: 851, category: 'premium' },
    { name: 'iPhone 13 Mini', width: 375, height: 812, category: 'compact' },
    { name: 'OnePlus 9', width: 384, height: 854, category: 'premium' }
  ];
  
  const masterResults = [];
  
  console.log(`📊 ${allDevices.length}개 디바이스에서 마스터 최적화 실행\n`);
  
  for (const device of allDevices) {
    console.log(`📱 ${device.name} (${device.width}x${device.height}) - ${device.category} 카테고리`);
    
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: device.width < 800,
      hasTouch: true,
      userAgent: `Mozilla/5.0 (Mobile; ${device.name}) Mobile/15E148`
    });
    
    const page = await context.newPage();
    
    try {
      await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      await page.waitForTimeout(2000);
      
      console.log(`  ⚡ 마스터 최적화 CSS 주입...`);
      
      // 디바이스 카테고리별 최적화 설정
      const getOptimization = (category, width) => {
        switch (category) {
          case 'compact': // 320-375px
            return {
              sidebarWidth: '35%',
              maxWidth: Math.min(130, width * 0.4) + 'px',
              minWidth: Math.min(110, width * 0.32) + 'px',
              closeButton: { width: '35px', height: '20px', fontSize: '9px' },
              menu: { padding: '2px 5px', fontSize: '11px' },
              brand: { padding: '0.2rem' }
            };
          case 'standard': // 360-384px  
            return {
              sidebarWidth: '36%',
              maxWidth: Math.min(140, width * 0.38) + 'px',
              minWidth: Math.min(125, width * 0.34) + 'px',
              closeButton: { width: '40px', height: '22px', fontSize: '10px' },
              menu: { padding: '3px 6px', fontSize: '12px' },
              brand: { padding: '0.3rem' }
            };
          case 'premium': // 390-412px
            return {
              sidebarWidth: '38%',
              maxWidth: Math.min(160, width * 0.4) + 'px',
              minWidth: Math.min(140, width * 0.36) + 'px',
              closeButton: { width: '45px', height: '24px', fontSize: '10px' },
              menu: { padding: '4px 8px', fontSize: '12px' },
              brand: { padding: '0.4rem' }
            };
          case 'large': // 412px+
            return {
              sidebarWidth: '35%',
              maxWidth: Math.min(160, width * 0.38) + 'px',
              minWidth: Math.min(140, width * 0.34) + 'px',
              closeButton: { width: '50px', height: '26px', fontSize: '11px' },
              menu: { padding: '4px 8px', fontSize: '13px' },
              brand: { padding: '0.4rem' }
            };
          case 'tablet': // 768px+
            return {
              sidebarWidth: '25%',
              maxWidth: Math.min(200, width * 0.28) + 'px',
              minWidth: Math.min(180, width * 0.23) + 'px',
              closeButton: { width: '60px', height: '30px', fontSize: '12px' },
              menu: { padding: '6px 10px', fontSize: '14px' },
              brand: { padding: '0.5rem' }
            };
          default:
            return {
              sidebarWidth: '38%',
              maxWidth: '160px',
              minWidth: '140px',
              closeButton: { width: '45px', height: '24px', fontSize: '10px' },
              menu: { padding: '4px 8px', fontSize: '12px' },
              brand: { padding: '0.4rem' }
            };
        }
      };
      
      const opt = getOptimization(device.category, device.width);
      
      // 마스터 최적화 CSS 주입
      await page.addStyleTag({
        content: `
          /* ${device.name} 마스터 최적화 (${device.category}) */
          
          /* 최고 우선순위 사이드바 설정 */
          html body .navbar-sidebar,
          html body div.navbar-sidebar,
          html body aside.navbar-sidebar,
          html body .navbar-sidebar[style],
          html body .navbar-sidebar[class*="show"],
          html body .navbar-sidebar[data-*] {
            width: ${opt.sidebarWidth} !important;
            max-width: ${opt.maxWidth} !important;
            min-width: ${opt.minWidth} !important;
            flex-basis: ${opt.sidebarWidth} !important;
            flex-shrink: 0 !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(15px) !important;
            border-radius: 0 8px 8px 0 !important;
            box-shadow: 2px 0 20px rgba(0,0,0,0.12) !important;
            z-index: 9999 !important;
            transform: translateX(0) !important;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          
          /* 강화된 백드롭 */
          .navbar-sidebar__backdrop {
            background: rgba(0, 0, 0, 0.7) !important;
            backdrop-filter: blur(5px) !important;
            z-index: 9998 !important;
          }
          
          /* 완벽한 닫기 버튼 */
          .navbar-sidebar__close {
            all: unset !important;
            position: absolute !important;
            top: 0.5rem !important;
            right: 0.5rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: ${opt.closeButton.width} !important;
            height: ${opt.closeButton.height} !important;
            background: linear-gradient(135deg, #6B46C1, #8B5CF6) !important;
            border-radius: 4px !important;
            color: white !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif !important;
            font-weight: 700 !important;
            font-size: ${opt.closeButton.fontSize} !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            cursor: pointer !important;
            z-index: 10000 !important;
            box-shadow: 0 2px 8px rgba(107, 70, 193, 0.4) !important;
            transition: all 0.2s ease !important;
            user-select: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          .navbar-sidebar__close:hover {
            background: linear-gradient(135deg, #553C9A, #7C3AED) !important;
            transform: scale(0.98) !important;
            box-shadow: 0 4px 12px rgba(107, 70, 193, 0.5) !important;
          }
          
          .navbar-sidebar__close:active {
            transform: scale(0.95) !important;
          }
          
          .navbar-sidebar__close * {
            display: none !important;
            visibility: hidden !important;
          }
          
          .navbar-sidebar__close::before {
            display: none !important;
          }
          
          .navbar-sidebar__close::after {
            content: "CLOSE" !important;
            display: block !important;
            color: white !important;
            font-size: ${opt.closeButton.fontSize} !important;
            font-weight: 700 !important;
            letter-spacing: 0.5px !important;
            pointer-events: none !important;
          }
          
          /* 사이드바 브랜드 영역 */
          .navbar-sidebar__brand {
            padding: ${opt.brand.padding} !important;
            border-bottom: 1px solid rgba(0,0,0,0.06) !important;
            margin-bottom: 0.25rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
          }
          
          .navbar-sidebar__brand .navbar__logo {
            max-width: 24px !important;
            height: auto !important;
            margin-right: 0.5rem !important;
          }
          
          /* 사이드바 아이템 컨테이너 */
          .navbar-sidebar__items {
            padding: 0.25rem !important;
            overflow-y: auto !important;
            max-height: calc(100vh - 60px) !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          .navbar-sidebar__items::-webkit-scrollbar {
            display: none !important;
          }
          
          /* 메뉴 최적화 */
          .navbar-sidebar .menu__list {
            padding: 0.25rem !important;
            margin: 0 !important;
            list-style: none !important;
          }
          
          .navbar-sidebar .menu__list-item {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .navbar-sidebar .menu__link {
            display: block !important;
            padding: ${opt.menu.padding} !important;
            font-size: ${opt.menu.fontSize} !important;
            line-height: 1.2 !important;
            border-radius: 4px !important;
            margin: 1px 0 !important;
            color: #374151 !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
            font-weight: 500 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          
          .navbar-sidebar .menu__link:hover {
            background: rgba(107, 70, 193, 0.08) !important;
            color: #6B46C1 !important;
            transform: translateX(2px) !important;
          }
          
          .navbar-sidebar .menu__link--active {
            background: rgba(107, 70, 193, 0.12) !important;
            color: #6B46C1 !important;
            font-weight: 600 !important;
            border-left: 3px solid #6B46C1 !important;
            padding-left: calc(${opt.menu.padding.split(' ')[1]} - 3px) !important;
          }
          
          /* 언어 드롭다운 최적화 */
          .navbar-sidebar .dropdown {
            margin: 0.25rem 0 !important;
          }
          
          .navbar-sidebar .dropdown__menu {
            min-width: 80px !important;
            font-size: 11px !important;
            padding: 0.25rem !important;
            border-radius: 4px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          }
          
          .navbar-sidebar .dropdown__link {
            padding: 0.25rem 0.5rem !important;
            font-size: 11px !important;
            border-radius: 3px !important;
          }
          
          /* Back to main menu 최적화 */
          .navbar-sidebar__back {
            padding: 0.25rem 0.5rem !important;
            font-size: 10px !important;
            color: #6B7280 !important;
            border-top: 1px solid rgba(0,0,0,0.06) !important;
            margin-top: 0.25rem !important;
            text-align: center !important;
            background: rgba(0,0,0,0.02) !important;
          }
          
          /* 완전한 타이틀 제거 */
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
            font-size: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            position: absolute !important;
            left: -99999px !important;
            top: -99999px !important;
          }
          
          /* GitHub 링크 완전 제거 */
          [href*="github"],
          .navbar__item[href*="github"],
          .navbar__items--right [href*="github"],
          .navbar [href*="github"],
          a[href*="github.com"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            left: -99999px !important;
            top: -99999px !important;
          }
          
          /* 반응형 미세 조정 */
          @media screen and (max-width: 320px) {
            .navbar-sidebar {
              width: 40% !important;
              max-width: 130px !important;
            }
          }
          
          @media screen and (min-width: 768px) {
            .navbar-sidebar {
              width: 25% !important;
              max-width: 200px !important;
            }
          }
          
          /* 터치 최적화 */
          .navbar-sidebar .menu__link {
            min-height: 32px !important;
            display: flex !important;
            align-items: center !important;
          }
          
          /* 성능 최적화 */
          .navbar-sidebar {
            will-change: transform !important;
            contain: layout style paint !important;
          }
          
          .navbar-sidebar * {
            box-sizing: border-box !important;
          }
        `
      });
      
      await page.waitForTimeout(1000);
      
      // 햄버거 메뉴 클릭
      console.log('  🍔 마스터 최적화 테스트...');
      await page.click('.navbar__toggle');
      await page.waitForTimeout(2000);
      
      // JavaScript 마스터 적용
      console.log('  ⚡ JavaScript 마스터 적용...');
      await page.evaluate((deviceData) => {
        const device = deviceData.device;
        const opt = deviceData.opt;
        
        const sidebar = document.querySelector('.navbar-sidebar');
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        
        if (sidebar) {
          // 사이드바 완벽 설정
          const styles = [
            `width: ${opt.sidebarWidth}`,
            `max-width: ${opt.maxWidth}`,
            `min-width: ${opt.minWidth}`,
            `flex-basis: ${opt.sidebarWidth}`,
            `flex-shrink: 0`,
            `position: fixed`,
            `left: 0`,
            `top: 0`,
            `bottom: 0`,
            `height: 100vh`,
            `background: rgba(255, 255, 255, 0.98)`,
            `backdrop-filter: blur(15px)`,
            `border-radius: 0 8px 8px 0`,
            `box-shadow: 2px 0 20px rgba(0,0,0,0.12)`,
            `z-index: 9999`,
            `transform: translateX(0)`,
            `transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
          ];
          
          styles.forEach(style => {
            const [prop, value] = style.split(': ');
            sidebar.style.setProperty(prop, value, 'important');
          });
        }
        
        if (closeBtn) {
          // 닫기 버튼 완벽 설정
          closeBtn.innerHTML = '';
          closeBtn.textContent = 'CLOSE';
          
          const btnStyles = `
            all: unset !important;
            position: absolute !important;
            top: 0.5rem !important;
            right: 0.5rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: ${opt.closeButton.width} !important;
            height: ${opt.closeButton.height} !important;
            background: linear-gradient(135deg, #6B46C1, #8B5CF6) !important;
            border-radius: 4px !important;
            color: white !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif !important;
            font-weight: 700 !important;
            font-size: ${opt.closeButton.fontSize} !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            cursor: pointer !important;
            z-index: 10000 !important;
            box-shadow: 0 2px 8px rgba(107, 70, 193, 0.4) !important;
            user-select: none !important;
            -webkit-tap-highlight-color: transparent !important;
          `;
          
          closeBtn.style.cssText = btnStyles;
        }
        
        // 타이틀 완전 제거
        const titleSelectors = [
          '.navbar__title',
          '.navbar__brand b',
          '.navbar__brand strong', 
          '.navbar__brand span:not(.navbar__logo)',
          '.navbar__brand > :not(.navbar__logo):not(.navbar__toggle)',
          '.navbar__inner .navbar__title'
        ];
        
        titleSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -99999px !important;';
            el.textContent = '';
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
        });
        
        // GitHub 링크 완전 제거
        const githubSelectors = [
          '[href*="github"]',
          '.navbar__item[href*="github"]',
          '.navbar__items--right [href*="github"]',
          '.navbar [href*="github"]',
          'a[href*="github.com"]'
        ];
        
        githubSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important; left: -99999px !important;';
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
        });
        
        // 메뉴 아이템 최적화
        document.querySelectorAll('.navbar-sidebar .menu__link').forEach(link => {
          link.style.cssText += `
            padding: ${opt.menu.padding} !important;
            font-size: ${opt.menu.fontSize} !important;
            line-height: 1.2 !important;
            border-radius: 4px !important;
            margin: 1px 0 !important;
            color: #374151 !important;
            font-weight: 500 !important;
            min-height: 32px !important;
            display: flex !important;
            align-items: center !important;
          `;
        });
        
      }, { device: device, opt: opt });
      
      await page.waitForTimeout(1000);
      
      // 최종 측정
      const finalMeasurement = await page.evaluate(() => {
        const sidebar = document.querySelector('.navbar-sidebar');
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        const menuItems = document.querySelectorAll('.navbar-sidebar .menu__link');
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        if (!sidebar) return null;
        
        const sidebarRect = sidebar.getBoundingClientRect();
        const sidebarWidth = sidebarRect.width;
        const sidebarPercent = (sidebarWidth / screenWidth * 100).toFixed(1);
        const contentArea = screenWidth - sidebarWidth;
        const contentPercent = (contentArea / screenWidth * 100).toFixed(1);
        
        // 상세 분석
        const analysis = {
          screen: { width: screenWidth, height: screenHeight },
          sidebar: {
            width: sidebarWidth,
            percent: parseFloat(sidebarPercent),
            position: sidebarRect.left,
            visible: window.getComputedStyle(sidebar).display !== 'none'
          },
          content: {
            area: contentArea,
            percent: parseFloat(contentPercent)
          },
          closeBtn: closeBtn ? {
            text: closeBtn.textContent.trim(),
            width: closeBtn.offsetWidth,
            height: closeBtn.offsetHeight,
            visible: closeBtn.textContent.includes('CLOSE'),
            position: closeBtn.getBoundingClientRect()
          } : null,
          menu: {
            itemCount: menuItems.length,
            avgHeight: menuItems.length > 0 ? 
              Array.from(menuItems).reduce((sum, item) => sum + item.offsetHeight, 0) / menuItems.length : 0,
            firstItemHeight: menuItems[0] ? menuItems[0].offsetHeight : 0
          },
          compliance: {
            githubHidden: document.querySelectorAll('[href*="github"]:not([style*="display: none"])').length === 0,
            titleHidden: document.querySelectorAll('.navbar__title:not([style*="display: none"])').length === 0,
            sidebarInBounds: parseFloat(sidebarPercent) <= 45,
            contentAdequate: contentArea >= 200
          }
        };
        
        return analysis;
      });
      
      if (finalMeasurement) {
        // 종합 UX 점수 계산 (더 정교한 알고리즘)
        let uxScore = 100;
        
        // 사이드바 폭 점수 (40점 배점)
        const sidebarPercent = finalMeasurement.sidebar.percent;
        if (sidebarPercent > 50) uxScore -= 35;
        else if (sidebarPercent > 45) uxScore -= 25;
        else if (sidebarPercent > 40) uxScore -= 15;
        else if (sidebarPercent > 35) uxScore -= 8;
        else if (sidebarPercent > 30) uxScore -= 3;
        
        // 콘텐츠 영역 점수 (25점 배점)
        const contentArea = finalMeasurement.content.area;
        if (contentArea < 150) uxScore -= 25;
        else if (contentArea < 180) uxScore -= 20;
        else if (contentArea < 200) uxScore -= 12;
        else if (contentArea < 220) uxScore -= 6;
        else if (contentArea < 240) uxScore -= 3;
        
        // 닫기 버튼 점수 (15점 배점)
        if (!finalMeasurement.closeBtn?.visible) uxScore -= 15;
        else if (finalMeasurement.closeBtn.width > 70) uxScore -= 10;
        else if (finalMeasurement.closeBtn.width > 55) uxScore -= 5;
        else if (finalMeasurement.closeBtn.width > 50) uxScore -= 2;
        
        // 메뉴 최적화 점수 (10점 배점)
        if (finalMeasurement.menu.avgHeight > 55) uxScore -= 10;
        else if (finalMeasurement.menu.avgHeight > 45) uxScore -= 6;
        else if (finalMeasurement.menu.avgHeight > 40) uxScore -= 3;
        
        // 컴플라이언스 점수 (10점 배점)
        if (!finalMeasurement.compliance.githubHidden) uxScore -= 3;
        if (!finalMeasurement.compliance.titleHidden) uxScore -= 3;
        if (!finalMeasurement.compliance.sidebarInBounds) uxScore -= 2;
        if (!finalMeasurement.compliance.contentAdequate) uxScore -= 2;
        
        const finalScore = Math.max(0, uxScore);
        const isExcellent = finalScore >= 90;
        const isGood = finalScore >= 80;
        const isPassing = finalScore >= 70;
        
        const result = {
          device: device.name,
          category: device.category,
          viewport: { width: device.width, height: device.height },
          measurement: finalMeasurement,
          uxScore: finalScore,
          grade: isExcellent ? 'A+' : isGood ? 'A' : isPassing ? 'B' : 'C',
          success: finalScore >= 80,
          timestamp: new Date().toISOString()
        };
        
        masterResults.push(result);
        
        const status = result.success ? '✅' : result.uxScore >= 70 ? '⚠️' : '❌';
        const gradeEmoji = isExcellent ? '🏆' : isGood ? '🥇' : isPassing ? '🥈' : '🥉';
        
        console.log(`  ${status} ${gradeEmoji} 등급 ${result.grade} (${finalScore}점)`);
        console.log(`      사이드바: ${finalMeasurement.sidebar.width}px (${finalMeasurement.sidebar.percent}%)`);
        console.log(`      콘텐츠: ${finalMeasurement.content.area}px (${finalMeasurement.content.percent}%)`);
        console.log(`      닫기버튼: "${finalMeasurement.closeBtn?.text}" (${finalMeasurement.closeBtn?.width}x${finalMeasurement.closeBtn?.height})`);
        console.log(`      메뉴: ${finalMeasurement.menu.itemCount}개, 평균 ${finalMeasurement.menu.avgHeight.toFixed(1)}px`);
        console.log();
      }
      
      // 마스터 스크린샷
      await page.screenshot({ 
        path: `master-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`,
        fullPage: false
      });
      
    } catch (error) {
      console.log(`  ❌ 오류: ${error.message}`);
      masterResults.push({
        device: device.name,
        category: device.category,
        error: error.message,
        success: false,
        uxScore: 0,
        grade: 'F'
      });
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // 최종 마스터 보고서
  console.log('\n' + '=' .repeat(70));
  console.log('\n🏆 최종 마스터 최적화 보고서\n');
  
  const successfulDevices = masterResults.filter(r => r.success).length;
  const totalDevices = masterResults.length;
  const averageScore = masterResults.reduce((sum, r) => sum + (r.uxScore || 0), 0) / masterResults.length;
  const gradeDistribution = {
    'A+': masterResults.filter(r => r.grade === 'A+').length,
    'A': masterResults.filter(r => r.grade === 'A').length,
    'B': masterResults.filter(r => r.grade === 'B').length,
    'C': masterResults.filter(r => r.grade === 'C').length,
    'F': masterResults.filter(r => r.grade === 'F').length
  };
  
  console.log(`🎯 전체 성공률: ${successfulDevices}/${totalDevices} (${(successfulDevices/totalDevices*100).toFixed(1)}%)`);
  console.log(`📊 평균 UX 점수: ${averageScore.toFixed(1)}/100`);
  console.log();
  
  console.log('📈 등급 분포:');
  Object.entries(gradeDistribution).forEach(([grade, count]) => {
    if (count > 0) {
      const emoji = grade === 'A+' ? '🏆' : grade === 'A' ? '🥇' : grade === 'B' ? '🥈' : grade === 'C' ? '🥉' : '❌';
      console.log(`  ${emoji} ${grade}등급: ${count}개 디바이스`);
    }
  });
  console.log();
  
  console.log('📱 디바이스별 최종 결과:');
  masterResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.device}: ${result.error}`);
    } else {
      const status = result.success ? '✅' : result.uxScore >= 70 ? '⚠️' : '❌';
      const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : '🥉';
      
      console.log(`${status} ${result.device} (${result.category}): ${gradeEmoji} ${result.grade}등급 (${result.uxScore}점)`);
      
      if (result.measurement) {
        console.log(`    사이드바: ${result.measurement.sidebar.percent}% (${result.measurement.sidebar.width}px)`);
        console.log(`    콘텐츠: ${result.measurement.content.percent}% (${result.measurement.content.area}px)`);
        
        if (result.success) {
          console.log(`    🎉 최적화 완료!`);
        } else if (result.uxScore >= 70) {
          console.log(`    ⚠️ 양호하지만 개선 여지 있음`);
        } else {
          console.log(`    ❌ 추가 최적화 필요`);
        }
      }
    }
    console.log();
  });
  
  // 성과 평가
  if (successfulDevices === totalDevices) {
    console.log('🎉🎉🎉 완벽한 마스터 최적화 달성! 모든 디바이스에서 80점 이상!');
  } else if (successfulDevices >= totalDevices * 0.8) {
    console.log('🎉 우수한 마스터 최적화! 대부분 디바이스에서 목표 달성!');
  } else if (successfulDevices >= totalDevices * 0.6) {
    console.log('👍 양호한 마스터 최적화! 절반 이상 디바이스에서 성공!');
  } else {
    console.log('⚠️ 마스터 최적화 부분 성공. 추가 개선 필요.');
  }
  
  console.log('\n✅ 최종 마스터 최적화 완료\n');
  
  return {
    totalDevices,
    successfulDevices,
    successRate: (successfulDevices/totalDevices*100),
    averageScore,
    gradeDistribution,
    results: masterResults,
    timestamp: new Date().toISOString()
  };
}

finalMasterOptimization().catch(console.error);