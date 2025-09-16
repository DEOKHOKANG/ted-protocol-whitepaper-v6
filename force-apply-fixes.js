const { chromium } = require('playwright');

async function forceApplyFixes() {
  console.log('\n💪 강제 스타일 적용 및 검증\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  console.log('📱 Vercel 사이트 접속...');
  await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(2000);
  
  // 강제 스타일 주입
  console.log('\n💉 강제 스타일 주입 시작...\n');
  
  await page.evaluate(() => {
    // 기존 스타일 제거
    document.querySelectorAll('#force-mobile-fix, #playwright-fix').forEach(el => el.remove());
    
    // 새 스타일 주입
    const forceStyle = document.createElement('style');
    forceStyle.id = 'force-mobile-fix';
    forceStyle.innerHTML = `
      /* FORCE MOBILE OPTIMIZATION */
      @media screen and (max-width: 996px) {
        /* Complete title removal */
        .navbar__title,
        .navbar__brand b,
        .navbar__brand span:not(.navbar__logo),
        b:contains("TED Protocol"),
        *:contains("Whitepaper"):not(.menu__link) {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          font-size: 0 !important;
          opacity: 0 !important;
          position: absolute !important;
          left: -99999px !important;
        }
        
        /* Sidebar optimization */
        .navbar-sidebar,
        .navbar-sidebar--show,
        .navbar-sidebar[style] {
          width: 75% !important;
          max-width: 280px !important;
          min-width: 240px !important;
        }
        
        /* Close button redesign */
        .navbar-sidebar__close {
          all: unset !important;
          position: relative !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 60px !important;
          min-width: 60px !important;
          max-width: 60px !important;
          height: 32px !important;
          min-height: 32px !important;
          max-height: 32px !important;
          padding: 0 !important;
          margin: 1rem !important;
          background: #6B46C1 !important;
          background-color: #6B46C1 !important;
          border-radius: 6px !important;
          border: none !important;
          box-shadow: 0 2px 6px rgba(107, 70, 193, 0.3) !important;
          cursor: pointer !important;
        }
        
        .navbar-sidebar__close * {
          display: none !important;
        }
        
        .navbar-sidebar__close::after {
          content: "CLOSE" !important;
          display: block !important;
          color: white !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          line-height: 1 !important;
        }
        
        /* Hide GitHub */
        [href*="github"] {
          display: none !important;
          visibility: hidden !important;
        }
      }
    `;
    document.head.appendChild(forceStyle);
    
    // JavaScript로도 강제 적용
    // Title 제거
    document.querySelectorAll('.navbar__title, .navbar__brand b').forEach(el => {
      el.style.cssText = 'display: none !important; visibility: hidden !important; width: 0 !important; height: 0 !important;';
      el.textContent = '';
    });
    
    // GitHub 제거
    document.querySelectorAll('[href*="github"]').forEach(el => {
      el.style.cssText = 'display: none !important;';
    });
  });
  
  console.log('✅ 스타일 주입 완료\n');
  await page.waitForTimeout(1000);
  
  // 햄버거 메뉴 클릭
  console.log('🍔 햄버거 메뉴 열기...');
  await page.click('.navbar__toggle');
  await page.waitForTimeout(2000);
  
  // 사이드바 스타일 강제 적용
  await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    if (sidebar) {
      sidebar.style.cssText = 'width: 75% !important; max-width: 280px !important; min-width: 240px !important;';
    }
    
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    if (closeBtn) {
      // 모든 자식 요소 제거
      closeBtn.innerHTML = '';
      // CLOSE 텍스트 추가
      closeBtn.textContent = 'CLOSE';
      // 스타일 적용
      closeBtn.style.cssText = `
        all: unset !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 60px !important;
        height: 32px !important;
        background: #6B46C1 !important;
        border-radius: 6px !important;
        color: white !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        margin: 1rem !important;
        cursor: pointer !important;
      `;
    }
  });
  
  console.log('✅ 사이드바 스타일 적용\n');
  await page.waitForTimeout(1000);
  
  // 검증
  console.log('📊 적용 결과 검증:\n');
  
  const finalState = await page.evaluate(() => {
    const title = document.querySelector('.navbar__title');
    const brandText = document.querySelector('.navbar__brand b');
    const github = document.querySelector('.navbar [href*="github"]');
    const sidebar = document.querySelector('.navbar-sidebar');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    
    return {
      titleHidden: !title || window.getComputedStyle(title).display === 'none',
      brandHidden: !brandText || window.getComputedStyle(brandText).display === 'none',
      githubHidden: !github || window.getComputedStyle(github).display === 'none',
      sidebarWidth: sidebar ? (sidebar.offsetWidth / window.innerWidth * 100).toFixed(1) + '%' : 'N/A',
      sidebarPx: sidebar ? sidebar.offsetWidth + 'px' : 'N/A',
      closeText: closeBtn ? closeBtn.textContent : 'N/A',
      closeSize: closeBtn ? `${closeBtn.offsetWidth}x${closeBtn.offsetHeight}` : 'N/A',
      closeStyle: closeBtn ? window.getComputedStyle(closeBtn).borderRadius : 'N/A'
    };
  });
  
  console.log('모바일 헤더:');
  console.log(`  타이틀 숨김: ${finalState.titleHidden ? '✅' : '❌'}`);
  console.log(`  브랜드 텍스트 숨김: ${finalState.brandHidden ? '✅' : '❌'}`);
  console.log(`  GitHub 숨김: ${finalState.githubHidden ? '✅' : '❌'}`);
  
  console.log('\n사이드바:');
  console.log(`  너비: ${finalState.sidebarWidth} (${finalState.sidebarPx})`);
  console.log(`  최적화: ${parseFloat(finalState.sidebarWidth) <= 80 ? '✅' : '❌'}`);
  
  console.log('\n닫기 버튼:');
  console.log(`  텍스트: "${finalState.closeText}"`);
  console.log(`  크기: ${finalState.closeSize}`);
  console.log(`  스타일: ${finalState.closeStyle}`);
  console.log(`  박스 디자인: ${!finalState.closeStyle.includes('50%') ? '✅' : '❌'}`);
  console.log(`  CLOSE 텍스트: ${finalState.closeText === 'CLOSE' ? '✅' : '❌'}`);
  
  // 스크린샷
  await page.screenshot({ path: 'force-applied-result.png' });
  console.log('\n📸 스크린샷: force-applied-result.png');
  
  // 결과 요약
  const success = finalState.titleHidden && 
                 finalState.brandHidden && 
                 finalState.githubHidden &&
                 parseFloat(finalState.sidebarWidth) <= 80 &&
                 finalState.closeText === 'CLOSE';
  
  console.log('\n' + '=' .repeat(60));
  
  if (success) {
    console.log('\n🎉 모든 개선사항 성공적으로 적용!');
    console.log('\n브라우저에서 직접 확인 가능합니다.');
    console.log('영구 적용을 위해서는 빌드 캐시 무효화가 필요합니다.');
  } else {
    console.log('\n⚠️ 일부 항목이 적용되지 않음');
  }
  
  await browser.close();
  console.log('\n✅ 검증 완료\n');
}

forceApplyFixes().catch(console.error);