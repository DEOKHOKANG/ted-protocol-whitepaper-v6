const { chromium } = require('playwright');

async function ultimateDesignFix() {
  console.log('\n🎨 궁극의 모바일 디자인 최적화\n');
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
  
  console.log('📱 Vercel 사이트 접속 및 디자인 개선...');
  await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(2000);
  
  // 궁극의 디자인 개선 적용
  console.log('\n🎯 궁극의 디자인 최적화 적용...\n');
  
  await page.evaluate(() => {
    // 기존 스타일 제거
    document.querySelectorAll('#ultimate-design-fix').forEach(el => el.remove());
    
    // 궁극의 디자인 스타일
    const ultimateStyle = document.createElement('style');
    ultimateStyle.id = 'ultimate-design-fix';
    ultimateStyle.innerHTML = `
      /* ULTIMATE MOBILE DESIGN OPTIMIZATION */
      @media screen and (max-width: 996px) {
        /* 1. 사이드바 극단적 축소 - 40% */
        .navbar-sidebar,
        .navbar-sidebar--show,
        .navbar-sidebar[style] {
          width: 40% !important;
          max-width: 160px !important;
          min-width: 140px !important;
          background: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(20px) !important;
          border-radius: 0 12px 12px 0 !important;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15) !important;
        }
        
        /* 2. 백드롭 강화 */
        .navbar-sidebar__backdrop {
          background: rgba(0, 0, 0, 0.75) !important;
          backdrop-filter: blur(4px) !important;
        }
        
        /* 3. 닫기 버튼 초소형화 */
        .navbar-sidebar__close {
          all: unset !important;
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 32px !important;
          height: 20px !important;
          padding: 0 !important;
          margin: 0 !important;
          background: #6B46C1 !important;
          border-radius: 10px !important;
          color: white !important;
          font-size: 9px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          cursor: pointer !important;
          z-index: 1000 !important;
          box-shadow: 0 2px 8px rgba(107, 70, 193, 0.3) !important;
        }
        
        .navbar-sidebar__close * {
          display: none !important;
        }
        
        .navbar-sidebar__close::after {
          content: "×" !important;
          display: block !important;
          color: white !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          line-height: 1 !important;
        }
        
        /* 4. 메뉴 아이템 초압축 */
        .navbar-sidebar .menu__list {
          padding: 8px 4px !important;
          margin: 0 !important;
        }
        
        .navbar-sidebar .menu__link {
          padding: 6px 8px !important;
          font-size: 11px !important;
          line-height: 1.2 !important;
          border-radius: 6px !important;
          margin: 1px 0 !important;
          color: #374151 !important;
          text-decoration: none !important;
          display: block !important;
          transition: all 0.2s ease !important;
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
        
        /* 5. 헤더 브랜드 영역 최적화 */
        .navbar-sidebar__brand {
          padding: 8px !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
          margin-bottom: 4px !important;
        }
        
        /* 6. 언어 드롭다운 압축 */
        .navbar-sidebar .dropdown__menu {
          min-width: 80px !important;
          font-size: 10px !important;
          padding: 4px !important;
        }
        
        .navbar-sidebar .dropdown__link {
          padding: 4px 6px !important;
          font-size: 10px !important;
        }
        
        /* 7. 스크롤바 숨김 */
        .navbar-sidebar {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        .navbar-sidebar::-webkit-scrollbar {
          display: none !important;
        }
        
        /* 8. 타이틀 완전 제거 */
        .navbar__title,
        .navbar__brand b,
        .navbar__brand span:not(.navbar__logo) {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
        }
        
        /* 9. GitHub 링크 제거 */
        [href*="github"] {
          display: none !important;
        }
        
        /* 10. 사이드바 애니메이션 개선 */
        .navbar-sidebar {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        /* 11. 로고 크기 최적화 */
        .navbar-sidebar .navbar__logo {
          max-width: 24px !important;
          height: auto !important;
        }
        
        /* 12. Back to main menu 스타일링 */
        .navbar-sidebar__back {
          padding: 4px 8px !important;
          font-size: 9px !important;
          color: #6B7280 !important;
          border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
          margin-top: 4px !important;
          text-align: center !important;
        }
      }
      
      /* 추가 최적화 - 작은 화면용 */
      @media screen and (max-width: 360px) {
        .navbar-sidebar {
          width: 45% !important;
          max-width: 180px !important;
        }
      }
    `;
    document.head.appendChild(ultimateStyle);
  });
  
  console.log('✅ 궁극의 디자인 스타일 주입 완료\n');
  await page.waitForTimeout(1000);
  
  // 햄버거 메뉴 열기
  console.log('🍔 최적화된 사이드바 테스트...');
  await page.click('.navbar__toggle');
  await page.waitForTimeout(2000);
  
  // JavaScript로 추가 최적화
  await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    if (sidebar) {
      sidebar.style.cssText += `
        width: 40% !important;
        max-width: 160px !important;
        min-width: 140px !important;
        background: rgba(255, 255, 255, 0.98) !important;
        border-radius: 0 12px 12px 0 !important;
      `;
    }
    
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    if (closeBtn) {
      closeBtn.innerHTML = '';
      closeBtn.textContent = '×';
      closeBtn.style.cssText = `
        position: absolute !important;
        top: 8px !important;
        right: 8px !important;
        width: 32px !important;
        height: 20px !important;
        background: #6B46C1 !important;
        border-radius: 10px !important;
        color: white !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        z-index: 1000 !important;
      `;
    }
    
    // 메뉴 아이템 최적화
    document.querySelectorAll('.navbar-sidebar .menu__link').forEach(link => {
      link.style.cssText += `
        padding: 6px 8px !important;
        font-size: 11px !important;
        line-height: 1.2 !important;
        margin: 1px 0 !important;
      `;
    });
    
    // 타이틀 완전 제거
    document.querySelectorAll('.navbar__title, .navbar__brand b').forEach(el => {
      el.style.display = 'none';
      el.textContent = '';
    });
  });
  
  console.log('✅ JavaScript 추가 최적화 완료\n');
  await page.waitForTimeout(1000);
  
  // 최종 검증
  const finalAnalysis = await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    const menuItems = document.querySelectorAll('.navbar-sidebar .menu__link');
    const screenWidth = window.innerWidth;
    
    return {
      screenWidth,
      sidebarWidth: sidebar ? sidebar.offsetWidth : 0,
      sidebarPercent: sidebar ? (sidebar.offsetWidth / screenWidth * 100).toFixed(1) : 0,
      contentArea: screenWidth - (sidebar ? sidebar.offsetWidth : 0),
      closeBtn: closeBtn ? {
        width: closeBtn.offsetWidth,
        height: closeBtn.offsetHeight,
        text: closeBtn.textContent,
        position: closeBtn.getBoundingClientRect()
      } : null,
      menuItemCount: menuItems.length,
      avgMenuHeight: menuItems.length > 0 ? 
        Array.from(menuItems).reduce((sum, item) => sum + item.offsetHeight, 0) / menuItems.length : 0
    };
  });
  
  console.log('📊 궁극의 최적화 결과:');
  console.log(`  화면 너비: ${finalAnalysis.screenWidth}px`);
  console.log(`  사이드바: ${finalAnalysis.sidebarWidth}px (${finalAnalysis.sidebarPercent}%)`);
  console.log(`  콘텐츠 영역: ${finalAnalysis.contentArea}px`);
  console.log(`  닫기 버튼: "${finalAnalysis.closeBtn?.text}" (${finalAnalysis.closeBtn?.width}x${finalAnalysis.closeBtn?.height}px)`);
  console.log(`  메뉴 아이템: ${finalAnalysis.menuItemCount}개, 평균 높이 ${finalAnalysis.avgMenuHeight?.toFixed(1)}px\n`);
  
  // UX 점수 재계산
  let newScore = 100;
  
  const widthPercent = parseFloat(finalAnalysis.sidebarPercent);
  if (widthPercent > 45) newScore -= 30;
  else if (widthPercent > 40) newScore -= 15;
  else if (widthPercent > 35) newScore -= 5;
  
  if (finalAnalysis.avgMenuHeight > 45) newScore -= 20;
  else if (finalAnalysis.avgMenuHeight > 35) newScore -= 10;
  else if (finalAnalysis.avgMenuHeight > 30) newScore -= 5;
  
  if (finalAnalysis.closeBtn?.width > 50 || finalAnalysis.closeBtn?.height > 30) newScore -= 15;
  
  if (finalAnalysis.contentArea < 200) newScore -= 25;
  else if (finalAnalysis.contentArea < 230) newScore -= 10;
  
  console.log('=' .repeat(60));
  console.log(`\n📊 개선된 모바일 UX 점수: ${Math.max(0, newScore)}/100`);
  
  if (newScore >= 90) console.log('🎉 최우수 모바일 디자인!');
  else if (newScore >= 80) console.log('🏆 우수한 모바일 디자인!');
  else if (newScore >= 70) console.log('👍 양호한 모바일 디자인');
  else console.log('⚠️ 추가 개선 필요');
  
  const improvement = newScore - 45; // 이전 점수 45점
  console.log(`\n📈 개선도: +${improvement}점 (${((improvement/45) * 100).toFixed(1)}% 향상)\n`);
  
  // 스크린샷
  await page.screenshot({ path: 'ultimate-mobile-design.png' });
  console.log('📸 최종 디자인: ultimate-mobile-design.png\n');
  
  await browser.close();
  console.log('✅ 궁극의 디자인 최적화 완료\n');
  
  return newScore;
}

ultimateDesignFix().catch(console.error);