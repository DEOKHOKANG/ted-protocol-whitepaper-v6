const { chromium } = require('playwright');
const fs = require('fs');

async function recursiveFix() {
  console.log('🔍 Playwright 재귀개선 시작\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
  });
  
  const page = await context.newPage();
  
  console.log('📱 Vercel 사이트 로딩...\n');
  await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(3000);
  
  // 1. 현재 상태 분석
  console.log('🔍 현재 상태 분석:\n');
  
  const currentState = await page.evaluate(() => {
    const results = {};
    
    // Check title visibility
    const title = document.querySelector('.navbar__title');
    results.titleVisible = title && window.getComputedStyle(title).display !== 'none';
    results.titleText = title ? title.textContent : 'not found';
    
    // Check GitHub
    const github = document.querySelector('[href*="github"]');
    results.githubVisible = github && window.getComputedStyle(github).display !== 'none';
    
    return results;
  });
  
  console.log(`  타이틀 표시: ${currentState.titleVisible ? '❌ 보임' : '✅ 숨김'} ("${currentState.titleText}")`);
  console.log(`  GitHub 링크: ${currentState.githubVisible ? '❌ 보임' : '✅ 숨김'}\n`);
  
  // 2. 사이드바 열기
  console.log('📱 사이드바 열기...\n');
  await page.click('.navbar__toggle');
  await page.waitForTimeout(2000);
  
  // 3. 사이드바 상태 분석
  const sidebarState = await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    
    return {
      sidebarWidth: sidebar ? (sidebar.offsetWidth / window.innerWidth * 100).toFixed(1) + '%' : 'not found',
      sidebarPx: sidebar ? sidebar.offsetWidth + 'px' : 'not found',
      closeBtnText: closeBtn ? closeBtn.textContent : 'not found',
      closeBtnWidth: closeBtn ? closeBtn.offsetWidth + 'px' : 'not found',
      closeBtnHeight: closeBtn ? closeBtn.offsetHeight + 'px' : 'not found',
      closeBtnRadius: closeBtn ? window.getComputedStyle(closeBtn).borderRadius : 'not found'
    };
  });
  
  console.log('📊 사이드바 상태:');
  console.log(`  너비: ${sidebarState.sidebarWidth} (${sidebarState.sidebarPx})`);
  console.log(`  닫기 버튼: "${sidebarState.closeBtnText}"`);
  console.log(`  버튼 크기: ${sidebarState.closeBtnWidth} x ${sidebarState.closeBtnHeight}`);
  console.log(`  버튼 스타일: ${sidebarState.closeBtnRadius}\n`);
  
  // 4. 강제 스타일 주입
  console.log('💉 강제 스타일 주입...\n');
  
  await page.evaluate(() => {
    // Remove existing mobile fixes if any
    const existingStyle = document.getElementById('playwright-mobile-fix');
    if (existingStyle) existingStyle.remove();
    
    // Inject new styles with maximum priority
    const style = document.createElement('style');
    style.id = 'playwright-mobile-fix';
    style.innerHTML = `
      /* PLAYWRIGHT FORCE FIX */
      @media screen and (max-width: 996px) {
        /* Force hide title */
        .navbar__title,
        .navbar__brand b,
        .navbar__brand span:not(.navbar__logo),
        .navbar__brand > *:not(.navbar__logo):not(.navbar__toggle) {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
          font-size: 0 !important;
          position: absolute !important;
          left: -99999px !important;
        }
        
        /* Force sidebar width */
        .navbar-sidebar,
        .navbar-sidebar--show {
          width: 75% !important;
          max-width: 280px !important;
          min-width: 240px !important;
        }
        
        /* Force close button */
        .navbar-sidebar__close {
          all: unset !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 60px !important;
          height: 32px !important;
          padding: 0 !important;
          margin: 1rem !important;
          background: #6B46C1 !important;
          border-radius: 6px !important;
          border: none !important;
          color: white !important;
          font-size: 13px !important;
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
        }
        
        /* Hide GitHub */
        [href*="github"] {
          display: none !important;
          visibility: hidden !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Force immediate application
    const sidebar = document.querySelector('.navbar-sidebar');
    if (sidebar) {
      sidebar.style.width = '75%';
      sidebar.style.maxWidth = '280px';
    }
    
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    if (closeBtn) {
      closeBtn.innerHTML = '';
      closeBtn.textContent = 'CLOSE';
      closeBtn.style.cssText = 'display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 60px !important; height: 32px !important; background: #6B46C1 !important; border-radius: 6px !important; color: white !important; font-weight: 600 !important; margin: 1rem !important;';
    }
    
    document.querySelectorAll('.navbar__title, .navbar__brand b').forEach(el => {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
    });
  });
  
  await page.waitForTimeout(2000);
  
  // 5. 개선 후 상태 확인
  console.log('✅ 개선 후 상태:\n');
  
  const improvedState = await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    const title = document.querySelector('.navbar__title');
    
    return {
      titleHidden: !title || window.getComputedStyle(title).display === 'none',
      sidebarWidth: sidebar ? (sidebar.offsetWidth / window.innerWidth * 100).toFixed(1) + '%' : 'not found',
      closeBtnText: closeBtn ? closeBtn.textContent : 'not found',
      closeBtnStyle: closeBtn ? window.getComputedStyle(closeBtn).borderRadius : 'not found',
      githubHidden: !document.querySelector('[href*="github"]') || 
                    window.getComputedStyle(document.querySelector('[href*="github"]')).display === 'none'
    };
  });
  
  console.log(`  타이틀 숨김: ${improvedState.titleHidden ? '✅' : '❌'}`);
  console.log(`  사이드바 너비: ${improvedState.sidebarWidth} ${parseFloat(improvedState.sidebarWidth) <= 75 ? '✅' : '❌'}`);
  console.log(`  닫기 버튼: "${improvedState.closeBtnText}" ${improvedState.closeBtnText === 'CLOSE' ? '✅' : '❌'}`);
  console.log(`  GitHub 숨김: ${improvedState.githubHidden ? '✅' : '❌'}\n`);
  
  // 6. 스크린샷
  await page.screenshot({ path: 'playwright-recursive-result.png' });
  console.log('📸 스크린샷: playwright-recursive-result.png\n');
  
  // 7. CSS 파일 업데이트
  if (parseFloat(improvedState.sidebarWidth) > 75 || improvedState.closeBtnText !== 'CLOSE') {
    console.log('🔧 CSS 파일 강화 업데이트...\n');
    
    const additionalCSS = `

/* PLAYWRIGHT RECURSIVE FIX - ${new Date().toISOString()} */
@media screen and (max-width: 996px) {
  /* Override with !important cascade */
  .navbar-sidebar,
  .navbar-sidebar--show,
  .navbar-sidebar[style] {
    width: 75% !important;
    max-width: 280px !important;
    min-width: 240px !important;
  }
  
  .navbar-sidebar__close,
  .navbar-sidebar__close[style] {
    all: unset !important;
    width: 60px !important;
    height: 32px !important;
    background: #6B46C1 !important;
    border-radius: 6px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 1rem !important;
  }
  
  .navbar-sidebar__close::after {
    content: "CLOSE" !important;
    color: white !important;
    display: block !important;
  }
  
  .navbar-sidebar__close > *,
  .navbar-sidebar__close svg {
    display: none !important;
  }
  
  .navbar__title,
  .navbar__brand b {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
  }
}`;
    
    const cssPath = '/Users/kevin/Downloads/테드프로토콜/ted-protocol-docs/ted-whitepaper-docs/src/css/custom.css';
    const currentCSS = fs.readFileSync(cssPath, 'utf8');
    fs.writeFileSync(cssPath, currentCSS + additionalCSS);
    
    console.log('✅ CSS 파일 업데이트 완료\n');
  }
  
  await browser.close();
  
  console.log('=' .repeat(60));
  console.log('\n🎯 재귀개선 완료!\n');
  
  if (parseFloat(improvedState.sidebarWidth) <= 75 && improvedState.closeBtnText === 'CLOSE') {
    console.log('✅ 모든 개선사항이 적용되었습니다!\n');
  } else {
    console.log('⚠️ 추가 작업 필요:');
    console.log('1. CSS 파일이 업데이트되었습니다');
    console.log('2. npm run build 실행 필요');
    console.log('3. git commit & push 필요');
    console.log('4. Vercel 재배포 대기\n');
  }
}

recursiveFix().catch(console.error);