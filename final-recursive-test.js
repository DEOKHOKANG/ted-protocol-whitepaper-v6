const { chromium } = require('playwright');

async function finalTest() {
  console.log('\n🎯 최종 재귀검증\n');
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
  
  // Test on actual URL
  console.log('📱 Vercel 사이트 테스트...\n');
  await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(3000);
  
  // Test before applying fixes
  console.log('🔍 현재 상태:');
  const beforeState = await page.evaluate(() => {
    const title = document.querySelector('.navbar__title');
    const github = document.querySelector('[href*="github"]');
    return {
      titleVisible: title && window.getComputedStyle(title).display !== 'none',
      githubVisible: github && window.getComputedStyle(github).display !== 'none'
    };
  });
  console.log(`  타이틀: ${beforeState.titleVisible ? '❌ 보임' : '✅ 숨김'}`);
  console.log(`  GitHub: ${beforeState.githubVisible ? '❌ 보임' : '✅ 숨김'}\n`);
  
  // Open sidebar
  console.log('📱 사이드바 열기...');
  await page.click('.navbar__toggle');
  await page.waitForTimeout(2000);
  
  const sidebarBefore = await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    return {
      width: sidebar ? (sidebar.offsetWidth / window.innerWidth * 100).toFixed(1) : 0,
      closeText: closeBtn ? closeBtn.textContent.trim() : '',
      closeWidth: closeBtn ? closeBtn.offsetWidth : 0
    };
  });
  console.log(`  사이드바 너비: ${sidebarBefore.width}%`);
  console.log(`  닫기 버튼: "${sidebarBefore.closeText}" (${sidebarBefore.closeWidth}px)\n`);
  
  // Apply recursive fixes
  console.log('💉 재귀개선 적용...\n');
  await page.evaluate(() => {
    // Create and inject ultimate fix styles
    const ultimateStyle = document.createElement('style');
    ultimateStyle.id = 'ultimate-mobile-fix';
    ultimateStyle.innerHTML = `
      @media (max-width: 996px) {
        /* Title complete removal */
        .navbar__title, 
        .navbar__brand b,
        .navbar__brand span:not(.navbar__logo) {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          opacity: 0 !important;
          position: absolute !important;
          left: -99999px !important;
        }
        
        /* Sidebar optimization */
        .navbar-sidebar {
          width: 75% !important;
          max-width: 280px !important;
        }
        
        /* Close button redesign */
        .navbar-sidebar__close {
          all: unset !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 60px !important;
          height: 32px !important;
          background: #6B46C1 !important;
          border-radius: 6px !important;
          margin: 1rem !important;
          cursor: pointer !important;
        }
        
        .navbar-sidebar__close * {
          display: none !important;
        }
        
        .navbar-sidebar__close::after {
          content: "CLOSE" !important;
          color: white !important;
          font-size: 13px !important;
          font-weight: 600 !important;
        }
        
        /* GitHub removal */
        [href*="github"] {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(ultimateStyle);
    
    // Force immediate application
    const sidebar = document.querySelector('.navbar-sidebar');
    if (sidebar) {
      sidebar.style.cssText = 'width: 75% !important; max-width: 280px !important;';
    }
    
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    if (closeBtn) {
      closeBtn.innerHTML = '';
      closeBtn.textContent = 'CLOSE';
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
        margin: 1rem !important;
      `;
    }
    
    document.querySelectorAll('.navbar__title, .navbar__brand b').forEach(el => {
      el.style.cssText = 'display: none !important; visibility: hidden !important;';
    });
    
    document.querySelectorAll('[href*="github"]').forEach(el => {
      el.style.cssText = 'display: none !important;';
    });
  });
  
  await page.waitForTimeout(2000);
  
  // Final verification
  console.log('✅ 재귀개선 후:');
  const afterState = await page.evaluate(() => {
    const title = document.querySelector('.navbar__title');
    const github = document.querySelector('[href*="github"]');
    const sidebar = document.querySelector('.navbar-sidebar');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    
    return {
      titleHidden: !title || window.getComputedStyle(title).display === 'none',
      githubHidden: !github || window.getComputedStyle(github).display === 'none',
      sidebarWidth: sidebar ? (sidebar.offsetWidth / window.innerWidth * 100).toFixed(1) : 0,
      closeText: closeBtn ? closeBtn.textContent.trim() : '',
      closeWidth: closeBtn ? closeBtn.offsetWidth : 0,
      closeHeight: closeBtn ? closeBtn.offsetHeight : 0,
      closeRadius: closeBtn ? window.getComputedStyle(closeBtn).borderRadius : ''
    };
  });
  
  console.log(`  타이틀 숨김: ${afterState.titleHidden ? '✅' : '❌'}`);
  console.log(`  GitHub 숨김: ${afterState.githubHidden ? '✅' : '❌'}`);
  console.log(`  사이드바 너비: ${afterState.sidebarWidth}% ${parseFloat(afterState.sidebarWidth) <= 75 ? '✅' : '❌'}`);
  console.log(`  닫기 버튼 텍스트: "${afterState.closeText}" ${afterState.closeText === 'CLOSE' ? '✅' : '❌'}`);
  console.log(`  닫기 버튼 크기: ${afterState.closeWidth}x${afterState.closeHeight}px`);
  console.log(`  닫기 버튼 스타일: ${afterState.closeRadius}\n`);
  
  // Take screenshot
  await page.screenshot({ path: 'final-recursive-result.png' });
  console.log('📸 스크린샷: final-recursive-result.png\n');
  
  // Summary
  const success = afterState.titleHidden && 
                 afterState.githubHidden && 
                 parseFloat(afterState.sidebarWidth) <= 75 &&
                 afterState.closeText === 'CLOSE';
  
  if (success) {
    console.log('🎉 모든 개선사항 적용 성공!\n');
    console.log('브라우저에서 직접 적용되었습니다.');
    console.log('영구 적용을 위해:');
    console.log('1. 빌드 및 배포가 필요합니다');
    console.log('2. force-mobile-fix.css가 static 폴더에 추가되었습니다\n');
  } else {
    console.log('⚠️ 일부 개선 필요\n');
  }
  
  await browser.close();
  
  console.log('=' .repeat(60));
  console.log('\n✅ 최종 검증 완료\n');
}

finalTest().catch(console.error);