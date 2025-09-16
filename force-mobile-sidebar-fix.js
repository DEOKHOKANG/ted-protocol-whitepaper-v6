const { chromium } = require('playwright');

async function forceMobileSidebarFix() {
  console.log('\n🔧 실제 모바일 환경 사이드바 폭 대폭 축소\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  console.log('📱 Vercel 사이트 접속...');
  await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(2000);
  
  console.log('\n💉 극단적 사이드바 축소 적용...\n');
  
  // 극단적으로 사이드바 폭 축소
  await page.evaluate(() => {
    // 기존 스타일 제거
    document.querySelectorAll('#extreme-mobile-fix').forEach(el => el.remove());
    
    // 극단적 모바일 최적화 스타일
    const extremeStyle = document.createElement('style');
    extremeStyle.id = 'extreme-mobile-fix';
    extremeStyle.innerHTML = `
      /* EXTREME MOBILE SIDEBAR OPTIMIZATION */
      @media screen and (max-width: 996px) {
        /* 사이드바 극단적 축소 - 50% 너비로 변경 */
        .navbar-sidebar,
        .navbar-sidebar--show,
        .navbar-sidebar[style] {
          width: 50% !important;
          max-width: 200px !important;
          min-width: 180px !important;
        }
        
        /* 백그라운드 어둡게 처리 */
        .navbar-sidebar__backdrop {
          background: rgba(0, 0, 0, 0.7) !important;
        }
        
        /* 사이드바 내용 최적화 */
        .navbar-sidebar .menu__list {
          padding: 0.25rem !important;
          font-size: 13px !important;
        }
        
        .navbar-sidebar .menu__link {
          padding: 0.5rem 0.75rem !important;
          font-size: 13px !important;
          line-height: 1.3 !important;
        }
        
        .navbar-sidebar .menu__list-item {
          margin: 0.125rem 0 !important;
        }
        
        /* 헤더 타이틀 완전 제거 */
        .navbar__title,
        .navbar__brand b,
        .navbar__brand span:not(.navbar__logo) {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          font-size: 0 !important;
          opacity: 0 !important;
          position: absolute !important;
          left: -99999px !important;
        }
        
        /* 닫기 버튼 더 작게 */
        .navbar-sidebar__close {
          all: unset !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 50px !important;
          height: 28px !important;
          margin: 0.5rem !important;
          background: #6B46C1 !important;
          border-radius: 4px !important;
          color: white !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
        }
        
        .navbar-sidebar__close * {
          display: none !important;
        }
        
        .navbar-sidebar__close::after {
          content: "CLOSE" !important;
          display: block !important;
          color: white !important;
          font-size: 11px !important;
        }
        
        /* 사이드바 헤더 축소 */
        .navbar-sidebar__brand {
          padding: 0.5rem !important;
        }
        
        /* 언어 드롭다운 축소 */
        .dropdown__menu {
          font-size: 12px !important;
          min-width: 100px !important;
        }
        
        /* GitHub 완전 제거 */
        [href*="github"] {
          display: none !important;
          visibility: hidden !important;
        }
      }
    `;
    document.head.appendChild(extremeStyle);
  });
  
  console.log('✅ 극단적 축소 스타일 주입 완료\n');
  await page.waitForTimeout(1000);
  
  // 햄버거 메뉴 클릭
  console.log('🍔 햄버거 메뉴 열기...');
  await page.click('.navbar__toggle');
  await page.waitForTimeout(2000);
  
  // JavaScript로도 강제 적용
  await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    if (sidebar) {
      sidebar.style.cssText = `
        width: 50% !important;
        max-width: 200px !important;
        min-width: 180px !important;
      `;
    }
    
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    if (closeBtn) {
      closeBtn.innerHTML = '';
      closeBtn.textContent = 'CLOSE';
      closeBtn.style.cssText = `
        all: unset !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 50px !important;
        height: 28px !important;
        background: #6B46C1 !important;
        border-radius: 4px !important;
        color: white !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        margin: 0.5rem !important;
        cursor: pointer !important;
      `;
    }
    
    // 타이틀 완전 제거
    document.querySelectorAll('.navbar__title, .navbar__brand b').forEach(el => {
      el.style.cssText = 'display: none !important; visibility: hidden !important; width: 0 !important; height: 0 !important;';
      el.textContent = '';
    });
  });
  
  console.log('✅ JavaScript 강제 적용 완료\n');
  await page.waitForTimeout(1000);
  
  // 검증
  const results = await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    const title = document.querySelector('.navbar__title');
    const screenWidth = window.innerWidth;
    
    return {
      screenWidth,
      sidebarWidth: sidebar ? sidebar.offsetWidth : 0,
      sidebarPercent: sidebar ? (sidebar.offsetWidth / screenWidth * 100).toFixed(1) : 0,
      sidebarVisible: sidebar && sidebar.offsetWidth > 0,
      closeText: closeBtn ? closeBtn.textContent : '',
      closeSize: closeBtn ? `${closeBtn.offsetWidth}x${closeBtn.offsetHeight}` : '',
      titleHidden: !title || window.getComputedStyle(title).display === 'none',
      contentVisible: screenWidth - (sidebar ? sidebar.offsetWidth : 0)
    };
  });
  
  console.log('📊 극단적 축소 결과:');
  console.log(`  화면 너비: ${results.screenWidth}px`);
  console.log(`  사이드바: ${results.sidebarWidth}px (${results.sidebarPercent}%)`);
  console.log(`  남은 콘텐츠 영역: ${results.contentVisible}px`);
  console.log(`  닫기 버튼: "${results.closeText}" (${results.closeSize})`);
  console.log(`  타이틀 숨김: ${results.titleHidden ? '✅' : '❌'}\n`);
  
  const optimized = parseFloat(results.sidebarPercent) <= 55 && results.contentVisible >= 190;
  console.log(`극단적 최적화: ${optimized ? '✅ 성공' : '❌ 추가 필요'}\n`);
  
  // 스크린샷
  await page.screenshot({ path: 'extreme-mobile-sidebar.png' });
  console.log('📸 스크린샷: extreme-mobile-sidebar.png\n');
  
  if (optimized) {
    console.log('🎉 사이드바가 극단적으로 축소되어 콘텐츠가 보입니다!');
    console.log('이제 백서 내용이 사이드바에 완전히 가려지지 않습니다.');
  } else {
    console.log('⚠️ 더 극단적인 축소가 필요할 수 있습니다.');
  }
  
  await browser.close();
  console.log('\n✅ 극단적 모바일 최적화 완료\n');
}

forceMobileSidebarFix().catch(console.error);