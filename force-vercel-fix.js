const { chromium } = require('playwright');

async function forceVercelFix() {
  console.log('\n🚀 Vercel 배포 버전 강제 사이드바 수정\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  console.log('📱 Vercel 프로덕션 사이트 접속...');
  await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(3000);
  
  console.log('\n💪 극강 CSS 강제 주입...');
  
  // 가장 강력한 CSS 주입
  await page.addStyleTag({
    content: `
      /* ULTIMATE FORCE OVERRIDE - 절대 우선순위 */
      html body .navbar-sidebar,
      html body div.navbar-sidebar,
      html body aside.navbar-sidebar,
      html body .navbar-sidebar[style],
      html body .navbar-sidebar[class*="show"],
      .navbar-sidebar,
      div.navbar-sidebar,
      aside.navbar-sidebar {
        width: 40% !important;
        max-width: 160px !important;
        min-width: 140px !important;
        flex-basis: 40% !important;
        flex-shrink: 0 !important;
      }
      
      /* 모든 미디어 쿼리에서 강제 적용 */
      @media screen and (max-width: 996px) {
        html body .navbar-sidebar {
          width: 40% !important;
          max-width: 160px !important;
          min-width: 140px !important;
        }
      }
      
      @media screen and (max-width: 768px) {
        html body .navbar-sidebar {
          width: 40% !important;
          max-width: 160px !important;
        }
      }
      
      @media screen and (max-width: 480px) {
        html body .navbar-sidebar {
          width: 45% !important;
          max-width: 180px !important;
        }
      }
      
      /* 닫기 버튼 최적화 */
      .navbar-sidebar__close {
        all: unset !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 50px !important;
        height: 28px !important;
        background: #6B46C1 !important;
        border-radius: 4px !important;
        color: white !important;
        font-weight: 600 !important;
        margin: 0.5rem !important;
      }
      
      .navbar-sidebar__close::after {
        content: "CLOSE" !important;
        color: white !important;
        font-size: 11px !important;
      }
      
      .navbar-sidebar__close * {
        display: none !important;
      }
      
      /* GitHub 아이콘 숨김 */
      [href*="github"] {
        display: none !important;
      }
      
      /* 타이틀 숨김 */
      .navbar__title, .navbar__brand b {
        display: none !important;
      }
    `
  });
  
  console.log('✅ 극강 CSS 주입 완료');
  await page.waitForTimeout(1000);
  
  console.log('\n🍔 햄버거 메뉴 클릭...');
  await page.click('.navbar__toggle');
  await page.waitForTimeout(2000);
  
  console.log('\n⚡ JavaScript 직접 조작...');
  
  // JavaScript로 직접 DOM 조작
  await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    
    if (sidebar) {
      // 모든 스타일 속성 직접 설정
      sidebar.style.setProperty('width', '40%', 'important');
      sidebar.style.setProperty('max-width', '160px', 'important');
      sidebar.style.setProperty('min-width', '140px', 'important');
      sidebar.style.setProperty('flex-basis', '40%', 'important');
      sidebar.style.setProperty('flex-shrink', '0', 'important');
      
      // CSS Text로도 적용
      sidebar.style.cssText += `
        width: 40% !important;
        max-width: 160px !important;
        min-width: 140px !important;
        flex-basis: 40% !important;
      `;
      
      // 클래스 재설정
      sidebar.className = sidebar.className + ' force-40-percent';
      
      console.log('✅ 사이드바 40% 폭 강제 적용 완료');
    }
    
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
        font-weight: 600 !important;
        font-size: 11px !important;
        margin: 0.5rem !important;
        cursor: pointer !important;
      `;
      
      console.log('✅ 닫기 버튼 CLOSE 텍스트 적용 완료');
    }
    
    // 타이틀 완전 제거
    document.querySelectorAll('.navbar__title, .navbar__brand b').forEach(el => {
      el.style.display = 'none';
      el.textContent = '';
    });
    
    // GitHub 링크 숨김
    document.querySelectorAll('[href*="github"]').forEach(el => {
      el.style.display = 'none';
    });
  });
  
  console.log('✅ JavaScript 직접 조작 완료');
  await page.waitForTimeout(1000);
  
  // 최종 검증
  const finalResult = await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    const screenWidth = window.innerWidth;
    
    if (!sidebar) return null;
    
    const sidebarWidth = sidebar.offsetWidth;
    const sidebarPercent = (sidebarWidth / screenWidth * 100).toFixed(1);
    const contentArea = screenWidth - sidebarWidth;
    
    return {
      screenWidth,
      sidebarWidth,
      sidebarPercent: parseFloat(sidebarPercent),
      contentArea,
      closeBtn: closeBtn ? {
        text: closeBtn.textContent.trim(),
        width: closeBtn.offsetWidth,
        height: closeBtn.offsetHeight
      } : null,
      cssWidth: sidebar.style.width,
      computedWidth: window.getComputedStyle(sidebar).width
    };
  });
  
  console.log('\n📊 강제 수정 결과:');
  if (finalResult) {
    const status = finalResult.sidebarPercent <= 45 ? '✅' : '❌';
    console.log(`${status} 화면 너비: ${finalResult.screenWidth}px`);
    console.log(`${status} 사이드바: ${finalResult.sidebarWidth}px (${finalResult.sidebarPercent}%)`);
    console.log(`${status} 콘텐츠 영역: ${finalResult.contentArea}px`);
    console.log(`${status} 닫기 버튼: "${finalResult.closeBtn?.text}" (${finalResult.closeBtn?.width}x${finalResult.closeBtn?.height})`);
    console.log(`${status} CSS 너비: ${finalResult.cssWidth}`);
    console.log(`${status} 계산된 너비: ${finalResult.computedWidth}`);
    
    if (finalResult.sidebarPercent <= 45) {
      console.log('\n🎉 40% 사이드바 강제 적용 성공!');
    } else {
      console.log('\n⚠️ 추가 조치 필요');
    }
  } else {
    console.log('❌ 사이드바를 찾을 수 없음');
  }
  
  // 스크린샷
  await page.screenshot({ 
    path: 'vercel-force-fixed.png',
    fullPage: false 
  });
  console.log('\n📸 강제 수정 결과: vercel-force-fixed.png');
  
  console.log('\n⏰ 10초 대기 (수정사항 확인)...');
  await page.waitForTimeout(10000);
  
  await browser.close();
  console.log('\n✅ Vercel 강제 수정 완료\n');
  
  return finalResult;
}

forceVercelFix().catch(console.error);