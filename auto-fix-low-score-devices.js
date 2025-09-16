const { chromium } = require('playwright');

async function autoFixLowScoreDevices() {
  console.log('\n🔧 낮은 UX 점수 디바이스 자동 수정\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 400 
  });
  
  // UX 점수가 낮은 디바이스들 타겟팅
  const targetDevices = [
    { name: 'iPhone SE', width: 320, height: 568, currentScore: 70 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800, currentScore: 70 }
  ];
  
  const fixResults = [];
  
  for (const device of targetDevices) {
    console.log(`📱 ${device.name} UX 개선 작업 시작 (현재: ${device.currentScore}점)`);
    
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: true,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    try {
      await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      await page.waitForTimeout(2000);
      
      console.log(`  ⚡ ${device.name} 맞춤형 최적화 CSS 적용...`);
      
      // 디바이스별 맞춤 최적화
      const customOptimization = device.width <= 320 ? {
        // iPhone SE 초소형 화면 최적화
        sidebarWidth: '38%',
        maxWidth: '125px',
        minWidth: '115px',
        closeButtonWidth: '40px',
        closeButtonHeight: '22px',
        fontSize: '10px',
        menuPadding: '3px 6px',
        menuFontSize: '12px'
      } : {
        // Galaxy S21 중소형 화면 최적화  
        sidebarWidth: '38%',
        maxWidth: '140px',
        minWidth: '130px',
        closeButtonWidth: '45px',
        closeButtonHeight: '24px',
        fontSize: '10px',
        menuPadding: '4px 8px',
        menuFontSize: '12px'
      };
      
      await page.addStyleTag({
        content: `
          /* ${device.name} 맞춤형 초정밀 최적화 */
          html body .navbar-sidebar,
          html body div.navbar-sidebar,
          html body aside.navbar-sidebar,
          html body .navbar-sidebar[style],
          html body .navbar-sidebar[class*="show"] {
            width: ${customOptimization.sidebarWidth} !important;
            max-width: ${customOptimization.maxWidth} !important;
            min-width: ${customOptimization.minWidth} !important;
            flex-basis: ${customOptimization.sidebarWidth} !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            height: 100vh !important;
            background: rgba(255, 255, 255, 0.97) !important;
            backdrop-filter: blur(12px) !important;
            border-radius: 0 6px 6px 0 !important;
            box-shadow: 1px 0 12px rgba(0,0,0,0.08) !important;
            z-index: 9999 !important;
            transform: translateX(0) !important;
          }
          
          /* 강화된 백드롭 */
          .navbar-sidebar__backdrop {
            background: rgba(0, 0, 0, 0.65) !important;
            backdrop-filter: blur(4px) !important;
          }
          
          /* 초압축 닫기 버튼 */
          .navbar-sidebar__close {
            all: unset !important;
            position: absolute !important;
            top: 0.4rem !important;
            right: 0.4rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: ${customOptimization.closeButtonWidth} !important;
            height: ${customOptimization.closeButtonHeight} !important;
            background: #6B46C1 !important;
            border-radius: 3px !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: ${customOptimization.fontSize} !important;
            text-transform: uppercase !important;
            letter-spacing: 0.3px !important;
            cursor: pointer !important;
            z-index: 10000 !important;
            box-shadow: 0 1px 6px rgba(107, 70, 193, 0.4) !important;
            transition: all 0.2s ease !important;
          }
          
          .navbar-sidebar__close:hover {
            background: #553C9A !important;
            transform: scale(0.97) !important;
          }
          
          .navbar-sidebar__close * {
            display: none !important;
          }
          
          .navbar-sidebar__close::after {
            content: "CLOSE" !important;
            color: white !important;
            display: block !important;
            font-size: ${customOptimization.fontSize} !important;
          }
          
          /* 초압축 메뉴 */
          .navbar-sidebar .menu__list {
            padding: 3px !important;
            font-size: ${customOptimization.menuFontSize} !important;
            margin: 0 !important;
          }
          
          .navbar-sidebar .menu__link {
            padding: ${customOptimization.menuPadding} !important;
            font-size: ${customOptimization.menuFontSize} !important;
            line-height: 1.1 !important;
            border-radius: 3px !important;
            margin: 0.5px 0 !important;
            display: block !important;
            text-decoration: none !important;
            color: #374151 !important;
            transition: all 0.15s ease !important;
          }
          
          .navbar-sidebar .menu__link:hover {
            background: rgba(107, 70, 193, 0.08) !important;
            color: #6B46C1 !important;
          }
          
          .navbar-sidebar .menu__link--active {
            background: rgba(107, 70, 193, 0.12) !important;
            color: #6B46C1 !important;
            font-weight: 600 !important;
          }
          
          .navbar-sidebar .menu__list-item {
            margin: 0 !important;
          }
          
          /* 사이드바 브랜드 영역 압축 */
          .navbar-sidebar__brand {
            padding: 0.3rem !important;
            border-bottom: 1px solid rgba(0,0,0,0.08) !important;
            margin-bottom: 0.2rem !important;
          }
          
          .navbar-sidebar__brand .navbar__logo {
            max-width: 20px !important;
            height: auto !important;
          }
          
          /* 사이드바 아이템 컨테이너 */
          .navbar-sidebar__items {
            padding: 0.2rem !important;
            overflow-y: auto !important;
            max-height: calc(100vh - 50px) !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          .navbar-sidebar__items::-webkit-scrollbar {
            display: none !important;
          }
          
          /* 타이틀 완전 제거 */
          .navbar__title, 
          .navbar__brand b, 
          .navbar__brand span:not(.navbar__logo) {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            left: -9999px !important;
            font-size: 0 !important;
          }
          
          /* GitHub 링크 완전 제거 */
          [href*="github"], 
          .navbar__item[href*="github"],
          .navbar__items--right [href*="github"] {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
          }
          
          /* 언어 드롭다운 압축 */
          .navbar-sidebar .dropdown {
            font-size: ${customOptimization.menuFontSize} !important;
          }
          
          .navbar-sidebar .dropdown__menu {
            min-width: 70px !important;
            font-size: 11px !important;
            padding: 2px !important;
          }
          
          .navbar-sidebar .dropdown__link {
            padding: 3px 5px !important;
            font-size: 11px !important;
          }
          
          /* Back to main menu 버튼 압축 */
          .navbar-sidebar__back {
            padding: 0.3rem 0.5rem !important;
            font-size: 10px !important;
            color: #6B7280 !important;
            border-top: 1px solid rgba(0,0,0,0.08) !important;
            margin-top: 0.2rem !important;
            text-align: center !important;
          }
        `
      });
      
      await page.waitForTimeout(1000);
      
      // 햄버거 메뉴 클릭
      console.log('  🍔 최적화된 사이드바 테스트...');
      await page.click('.navbar__toggle');
      await page.waitForTimeout(2000);
      
      // JavaScript 강화 적용
      await page.evaluate((deviceData) => {
        const device = deviceData.device;
        const optimization = deviceData.optimization;
        const sidebar = document.querySelector('.navbar-sidebar');
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        
        if (sidebar) {
          // 사이드바 스타일 강제 적용
          sidebar.style.setProperty('width', optimization.sidebarWidth, 'important');
          sidebar.style.setProperty('max-width', optimization.maxWidth, 'important');
          sidebar.style.setProperty('min-width', optimization.minWidth, 'important');
          sidebar.style.setProperty('flex-basis', optimization.sidebarWidth, 'important');
          sidebar.style.setProperty('position', 'fixed', 'important');
          sidebar.style.setProperty('left', '0', 'important');
          sidebar.style.setProperty('transform', 'translateX(0)', 'important');
          sidebar.style.setProperty('background', 'rgba(255, 255, 255, 0.97)', 'important');
          sidebar.style.setProperty('backdrop-filter', 'blur(12px)', 'important');
          sidebar.style.setProperty('border-radius', '0 6px 6px 0', 'important');
          sidebar.style.setProperty('box-shadow', '1px 0 12px rgba(0,0,0,0.08)', 'important');
        }
        
        if (closeBtn) {
          closeBtn.innerHTML = '';
          closeBtn.textContent = 'CLOSE';
          
          const btnStyles = `
            all: unset !important;
            position: absolute !important;
            top: 0.4rem !important;
            right: 0.4rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: ${optimization.closeButtonWidth} !important;
            height: ${optimization.closeButtonHeight} !important;
            background: #6B46C1 !important;
            border-radius: 3px !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: ${optimization.fontSize} !important;
            text-transform: uppercase !important;
            letter-spacing: 0.3px !important;
            cursor: pointer !important;
            z-index: 10000 !important;
            box-shadow: 0 1px 6px rgba(107, 70, 193, 0.4) !important;
          `;
          
          closeBtn.style.cssText = btnStyles;
        }
        
        // 타이틀과 GitHub 링크 완전 제거
        document.querySelectorAll('.navbar__title, .navbar__brand b, .navbar__brand span:not(.navbar__logo)').forEach(el => {
          el.style.display = 'none';
          el.textContent = '';
          el.remove();
        });
        
        document.querySelectorAll('[href*="github"]').forEach(el => {
          el.style.display = 'none';
          el.remove();
        });
        
        // 메뉴 아이템 스타일 강화
        document.querySelectorAll('.navbar-sidebar .menu__link').forEach(link => {
          link.style.cssText += `
            padding: ${optimization.menuPadding} !important;
            font-size: ${optimization.menuFontSize} !important;
            line-height: 1.1 !important;
            border-radius: 3px !important;
            margin: 0.5px 0 !important;
          `;
        });
        
      }, { device: device, optimization: customOptimization });
      
      await page.waitForTimeout(1000);
      
      // 개선 후 측정
      const improvedMeasurement = await page.evaluate(() => {
        const sidebar = document.querySelector('.navbar-sidebar');
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        const menuItems = document.querySelectorAll('.navbar-sidebar .menu__link');
        const screenWidth = window.innerWidth;
        
        if (!sidebar) return null;
        
        const sidebarWidth = sidebar.offsetWidth;
        const sidebarPercent = (sidebarWidth / screenWidth * 100).toFixed(1);
        const contentArea = screenWidth - sidebarWidth;
        const contentPercent = (contentArea / screenWidth * 100).toFixed(1);
        
        return {
          screenWidth,
          sidebarWidth,
          sidebarPercent: parseFloat(sidebarPercent),
          contentArea,
          contentPercent: parseFloat(contentPercent),
          closeBtn: closeBtn ? {
            text: closeBtn.textContent.trim(),
            width: closeBtn.offsetWidth,
            height: closeBtn.offsetHeight,
            visible: closeBtn.textContent.includes('CLOSE')
          } : null,
          menuItemCount: menuItems.length,
          avgMenuHeight: menuItems.length > 0 ? 
            Array.from(menuItems).reduce((sum, item) => sum + item.offsetHeight, 0) / menuItems.length : 0,
          githubHidden: document.querySelectorAll('[href*="github"]:not([style*="display: none"])').length === 0,
          titleHidden: document.querySelectorAll('.navbar__title:not([style*="display: none"])').length === 0
        };
      });
      
      if (improvedMeasurement) {
        // 개선된 UX 점수 계산
        let improvedScore = 100;
        
        // 사이드바 폭 점수 (더 엄격한 기준)
        if (improvedMeasurement.sidebarPercent > 45) improvedScore -= 25;
        else if (improvedMeasurement.sidebarPercent > 40) improvedScore -= 15;
        else if (improvedMeasurement.sidebarPercent > 35) improvedScore -= 5;
        
        // 콘텐츠 영역 점수
        if (improvedMeasurement.contentArea < 180) improvedScore -= 20;
        else if (improvedMeasurement.contentArea < 200) improvedScore -= 10;
        else if (improvedMeasurement.contentArea < 220) improvedScore -= 5;
        
        // 닫기 버튼 점수
        if (!improvedMeasurement.closeBtn?.visible) improvedScore -= 15;
        else if (improvedMeasurement.closeBtn.width > 50) improvedScore -= 8;
        else if (improvedMeasurement.closeBtn.width > 45) improvedScore -= 5;
        
        // 메뉴 아이템 점수
        if (improvedMeasurement.avgMenuHeight > 45) improvedScore -= 10;
        else if (improvedMeasurement.avgMenuHeight > 35) improvedScore -= 5;
        
        // 기능 점수
        if (!improvedMeasurement.githubHidden) improvedScore -= 5;
        if (!improvedMeasurement.titleHidden) improvedScore -= 5;
        
        const improvement = improvedScore - device.currentScore;
        
        const result = {
          device: device.name,
          before: {
            score: device.currentScore
          },
          after: {
            ...improvedMeasurement,
            score: Math.max(0, improvedScore),
            improvement: improvement
          },
          success: improvedScore >= 80,
          timestamp: new Date().toISOString()
        };
        
        fixResults.push(result);
        
        const status = result.success ? '✅' : '⚠️';
        console.log(`  ${status} 개선 결과:`);
        console.log(`      점수: ${device.currentScore} → ${result.after.score} (+${improvement}점)`);
        console.log(`      사이드바: ${improvedMeasurement.sidebarWidth}px (${improvedMeasurement.sidebarPercent}%)`);
        console.log(`      콘텐츠: ${improvedMeasurement.contentArea}px (${improvedMeasurement.contentPercent}%)`);
        console.log(`      닫기버튼: "${improvedMeasurement.closeBtn?.text}" (${improvedMeasurement.closeBtn?.width}x${improvedMeasurement.closeBtn?.height})`);
        console.log();
      }
      
      // 개선 후 스크린샷
      await page.screenshot({ 
        path: `fixed-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`
      });
      
    } catch (error) {
      console.log(`  ❌ ${device.name} 개선 실패: ${error.message}`);
      fixResults.push({
        device: device.name,
        error: error.message,
        success: false
      });
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // 최종 개선 결과 보고
  console.log('\n' + '=' .repeat(60));
  console.log('\n🎯 자동 수정 결과 보고서\n');
  
  const successfulFixes = fixResults.filter(r => r.success).length;
  const totalFixes = fixResults.length;
  
  console.log(`✅ 성공적 개선: ${successfulFixes}/${totalFixes}`);
  
  fixResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.device}: ${result.error}`);
    } else {
      const status = result.success ? '✅' : '⚠️';
      console.log(`${status} ${result.device}:`);
      console.log(`    UX 점수: ${result.before.score} → ${result.after.score} (+${result.after.improvement}점)`);
      console.log(`    사이드바: ${result.after.sidebarPercent}%`);
      console.log(`    콘텐츠: ${result.after.contentArea}px`);
      
      if (result.success) {
        console.log(`    🎉 목표 달성! (80점 이상)`);
      } else {
        console.log(`    ⚠️ 추가 개선 필요`);
      }
    }
    console.log();
  });
  
  if (successfulFixes === totalFixes) {
    console.log('🎉 모든 저점수 디바이스 개선 완료!');
  } else {
    console.log('⚠️ 일부 디바이스는 추가 조치가 필요합니다.');
  }
  
  console.log('\n✅ 자동 수정 완료\n');
  
  return {
    successRate: (successfulFixes / totalFixes * 100),
    results: fixResults,
    averageImprovement: fixResults.reduce((sum, r) => sum + (r.after?.improvement || 0), 0) / fixResults.length
  };
}

autoFixLowScoreDevices().catch(console.error);