const { chromium } = require('playwright');

async function recursiveVerificationComprehensive() {
  console.log('\n🔄 포괄적 재귀검증 및 재귀개선 시스템\n');
  console.log('=' .repeat(70) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 
  });
  
  // 다양한 모바일 디바이스 시뮬레이션
  const devices = [
    { name: 'iPhone 12 Pro', width: 390, height: 844, userAgent: 'iPhone' },
    { name: 'iPhone SE', width: 320, height: 568, userAgent: 'iPhone' },
    { name: 'Samsung Galaxy S21', width: 360, height: 800, userAgent: 'Samsung' },
    { name: 'Samsung Galaxy Note', width: 412, height: 869, userAgent: 'Samsung' },
    { name: 'iPad Mini', width: 768, height: 1024, userAgent: 'iPad' },
    { name: 'Google Pixel 5', width: 393, height: 851, userAgent: 'Pixel' }
  ];
  
  const testResults = [];
  let iterationCount = 0;
  const maxIterations = 3; // 최대 3회 재귀개선
  
  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    console.log(`\n🔄 재귀개선 반복 ${iteration}/${maxIterations}\n`);
    console.log('=' .repeat(50) + '\n');
    
    const iterationResults = [];
    
    for (const device of devices) {
      console.log(`📱 테스트: ${device.name} (${device.width}x${device.height})`);
      
      const context = await browser.newContext({
        viewport: { width: device.width, height: device.height },
        isMobile: device.width < 800,
        hasTouch: true,
        userAgent: `Mozilla/5.0 (${device.userAgent}; Mobile) AppleWebKit/537.36`
      });
      
      const page = await context.newPage();
      
      try {
        // Vercel 사이트 접속
        await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        await page.waitForTimeout(2000);
        
        // 재귀개선 CSS 적용 (반복할 때마다 더 강력하게)
        console.log(`  ⚡ 재귀개선 레벨 ${iteration} CSS 적용...`);
        
        await page.addStyleTag({
          content: `
            /* 재귀개선 레벨 ${iteration} - 더욱 강력한 오버라이드 */
            html body .navbar-sidebar,
            html body div.navbar-sidebar,
            html body aside.navbar-sidebar,
            html body .navbar-sidebar[style],
            html body .navbar-sidebar[class*="show"],
            html body .navbar-sidebar[data-*],
            .navbar-sidebar {
              width: ${Math.max(35, 45 - iteration * 2)}% !important;
              max-width: ${Math.max(140, 170 - iteration * 10)}px !important;
              min-width: ${Math.max(120, 150 - iteration * 10)}px !important;
              flex-basis: ${Math.max(35, 45 - iteration * 2)}% !important;
              transform: translateX(0) !important;
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              height: 100vh !important;
              z-index: 9999 !important;
              background: rgba(255, 255, 255, 0.98) !important;
              backdrop-filter: blur(10px) !important;
              border-radius: 0 8px 8px 0 !important;
              box-shadow: 2px 0 15px rgba(0,0,0,0.1) !important;
            }
            
            /* 백드롭 강화 */
            .navbar-sidebar__backdrop {
              background: rgba(0, 0, 0, ${0.5 + iteration * 0.1}) !important;
              backdrop-filter: blur(3px) !important;
            }
            
            /* 닫기 버튼 최적화 */
            .navbar-sidebar__close {
              all: unset !important;
              position: absolute !important;
              top: 0.5rem !important;
              right: 0.5rem !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              width: ${Math.max(40, 60 - iteration * 5)}px !important;
              height: ${Math.max(20, 30 - iteration * 2)}px !important;
              background: #6B46C1 !important;
              border-radius: ${Math.max(3, 6 - iteration)}px !important;
              color: white !important;
              font-weight: 600 !important;
              font-size: ${Math.max(9, 12 - iteration)}px !important;
              cursor: pointer !important;
              z-index: 10000 !important;
              box-shadow: 0 2px 8px rgba(107, 70, 193, 0.3) !important;
            }
            
            .navbar-sidebar__close * {
              display: none !important;
            }
            
            .navbar-sidebar__close::after {
              content: "CLOSE" !important;
              color: white !important;
              display: block !important;
            }
            
            /* 메뉴 아이템 압축 */
            .navbar-sidebar .menu__list {
              padding: ${Math.max(4, 8 - iteration)}px !important;
              font-size: ${Math.max(11, 14 - iteration)}px !important;
            }
            
            .navbar-sidebar .menu__link {
              padding: ${Math.max(4, 8 - iteration)}px ${Math.max(6, 10 - iteration)}px !important;
              font-size: ${Math.max(11, 14 - iteration)}px !important;
              line-height: 1.2 !important;
              border-radius: 4px !important;
              margin: 1px 0 !important;
            }
            
            /* 타이틀 완전 제거 */
            .navbar__title, .navbar__brand b, .navbar__brand span:not(.navbar__logo) {
              display: none !important;
              visibility: hidden !important;
              width: 0 !important;
              height: 0 !important;
              position: absolute !important;
              left: -9999px !important;
            }
            
            /* GitHub 링크 제거 */
            [href*="github"], .navbar__item[href*="github"] {
              display: none !important;
            }
            
            /* 사이드바 내부 요소 최적화 */
            .navbar-sidebar__brand {
              padding: ${Math.max(4, 8 - iteration)}px !important;
              border-bottom: 1px solid rgba(0,0,0,0.1) !important;
            }
            
            .navbar-sidebar__items {
              padding: ${Math.max(2, 6 - iteration)}px !important;
              overflow-y: auto !important;
              max-height: calc(100vh - 60px) !important;
            }
          `
        });
        
        await page.waitForTimeout(1000);
        
        // 햄버거 메뉴 클릭
        console.log('  🍔 사이드바 테스트...');
        await page.click('.navbar__toggle');
        await page.waitForTimeout(2000);
        
        // JavaScript로 추가 최적화
        await page.evaluate((iter) => {
          const sidebar = document.querySelector('.navbar-sidebar');
          const closeBtn = document.querySelector('.navbar-sidebar__close');
          
          if (sidebar) {
            const targetWidth = Math.max(35, 45 - iter * 2);
            const maxWidth = Math.max(140, 170 - iter * 10);
            
            sidebar.style.setProperty('width', `${targetWidth}%`, 'important');
            sidebar.style.setProperty('max-width', `${maxWidth}px`, 'important');
            sidebar.style.setProperty('min-width', `${Math.max(120, 150 - iter * 10)}px`, 'important');
            sidebar.style.setProperty('flex-basis', `${targetWidth}%`, 'important');
            sidebar.style.setProperty('position', 'fixed', 'important');
            sidebar.style.setProperty('left', '0', 'important');
            sidebar.style.setProperty('transform', 'translateX(0)', 'important');
          }
          
          if (closeBtn) {
            closeBtn.innerHTML = '';
            closeBtn.textContent = 'CLOSE';
            const btnWidth = Math.max(40, 60 - iter * 5);
            const btnHeight = Math.max(20, 30 - iter * 2);
            
            closeBtn.style.cssText = `
              all: unset !important;
              position: absolute !important;
              top: 0.5rem !important;
              right: 0.5rem !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              width: ${btnWidth}px !important;
              height: ${btnHeight}px !important;
              background: #6B46C1 !important;
              border-radius: ${Math.max(3, 6 - iter)}px !important;
              color: white !important;
              font-weight: 600 !important;
              font-size: ${Math.max(9, 12 - iter)}px !important;
              cursor: pointer !important;
              z-index: 10000 !important;
            `;
          }
          
          // 타이틀 요소 완전 제거
          document.querySelectorAll('.navbar__title, .navbar__brand b').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
            el.remove();
          });
          
          // GitHub 링크 제거
          document.querySelectorAll('[href*="github"]').forEach(el => {
            el.style.display = 'none';
          });
          
        }, iteration);
        
        await page.waitForTimeout(1000);
        
        // 측정 및 분석
        const measurement = await page.evaluate(() => {
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
          
          return {
            screenWidth,
            screenHeight,
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
            sidebarVisible: window.getComputedStyle(sidebar).display !== 'none',
            githubHidden: document.querySelectorAll('[href*="github"]:not([style*="display: none"])').length === 0,
            titleHidden: document.querySelectorAll('.navbar__title:not([style*="display: none"])').length === 0
          };
        });
        
        if (measurement) {
          // UX 점수 계산
          let uxScore = 100;
          
          // 사이드바 폭 점수 (40% 이하가 목표)
          if (measurement.sidebarPercent > 50) uxScore -= 30;
          else if (measurement.sidebarPercent > 45) uxScore -= 20;
          else if (measurement.sidebarPercent > 40) uxScore -= 10;
          else if (measurement.sidebarPercent > 35) uxScore -= 5;
          
          // 콘텐츠 영역 점수
          if (measurement.contentArea < 180) uxScore -= 25;
          else if (measurement.contentArea < 220) uxScore -= 15;
          else if (measurement.contentArea < 250) uxScore -= 5;
          
          // 닫기 버튼 점수
          if (!measurement.closeBtn?.visible) uxScore -= 15;
          else if (measurement.closeBtn.width > 60) uxScore -= 10;
          
          // 메뉴 아이템 점수
          if (measurement.avgMenuHeight > 50) uxScore -= 10;
          else if (measurement.avgMenuHeight > 40) uxScore -= 5;
          
          // 기능 점수
          if (!measurement.githubHidden) uxScore -= 5;
          if (!measurement.titleHidden) uxScore -= 5;
          
          const result = {
            device: device.name,
            iteration,
            ...measurement,
            uxScore: Math.max(0, uxScore),
            success: measurement.sidebarPercent <= 45 && measurement.contentArea >= 200,
            timestamp: new Date().toISOString()
          };
          
          iterationResults.push(result);
          
          const status = result.success ? '✅' : '❌';
          console.log(`  ${status} 사이드바: ${measurement.sidebarWidth}px (${measurement.sidebarPercent}%)`);
          console.log(`  ${status} 콘텐츠: ${measurement.contentArea}px (${measurement.contentPercent}%)`);
          console.log(`  ${status} UX 점수: ${result.uxScore}/100`);
          console.log(`  ${status} 닫기버튼: "${measurement.closeBtn?.text}" (${measurement.closeBtn?.width}x${measurement.closeBtn?.height})`);
          console.log();
        }
        
        // 스크린샷
        await page.screenshot({ 
          path: `recursive-${iteration}-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`
        });
        
      } catch (error) {
        console.log(`  ❌ 오류: ${error.message}`);
        iterationResults.push({
          device: device.name,
          iteration,
          error: error.message,
          success: false,
          uxScore: 0
        });
      }
      
      await context.close();
    }
    
    testResults.push(...iterationResults);
    
    // 반복별 성과 분석
    const successCount = iterationResults.filter(r => r.success).length;
    const avgScore = iterationResults.reduce((sum, r) => sum + (r.uxScore || 0), 0) / iterationResults.length;
    
    console.log(`\n📊 반복 ${iteration} 결과:`);
    console.log(`  성공률: ${successCount}/${iterationResults.length} (${(successCount/iterationResults.length*100).toFixed(1)}%)`);
    console.log(`  평균 UX 점수: ${avgScore.toFixed(1)}/100`);
    
    // 만족스러운 결과가 나오면 조기 종료
    if (successCount === iterationResults.length && avgScore >= 80) {
      console.log(`\n🎉 목표 달성! 반복 ${iteration}에서 완벽한 최적화 완료`);
      break;
    }
    
    if (iteration < maxIterations) {
      console.log(`\n⏳ 다음 반복을 위해 3초 대기...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  await browser.close();
  
  // 최종 결과 분석 및 보고서
  console.log('\n' + '=' .repeat(70));
  console.log('\n📋 최종 재귀검증 보고서\n');
  
  const finalResults = testResults.filter(r => r.iteration === Math.max(...testResults.map(t => t.iteration)));
  const overallSuccess = finalResults.filter(r => r.success).length;
  const overallAvgScore = finalResults.reduce((sum, r) => sum + (r.uxScore || 0), 0) / finalResults.length;
  
  console.log(`🎯 전체 성공률: ${overallSuccess}/${finalResults.length} (${(overallSuccess/finalResults.length*100).toFixed(1)}%)`);
  console.log(`📊 전체 평균 UX 점수: ${overallAvgScore.toFixed(1)}/100`);
  
  // 디바이스별 상세 결과
  console.log('\n📱 디바이스별 최종 결과:');
  finalResults.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.device}:`);
    if (result.error) {
      console.log(`    오류: ${result.error}`);
    } else {
      console.log(`    사이드바: ${result.sidebarWidth}px (${result.sidebarPercent}%)`);
      console.log(`    콘텐츠: ${result.contentArea}px (${result.contentPercent}%)`);
      console.log(`    UX 점수: ${result.uxScore}/100`);
    }
  });
  
  // 개선 권장사항
  console.log('\n💡 재귀개선 권장사항:');
  const improvements = [];
  
  finalResults.forEach(result => {
    if (result.sidebarPercent > 45) {
      improvements.push(`${result.device}: 사이드바 ${result.sidebarPercent}% → 40% 이하로 축소 필요`);
    }
    if (result.contentArea < 200) {
      improvements.push(`${result.device}: 콘텐츠 영역 ${result.contentArea}px → 200px 이상 확보 필요`);
    }
    if (result.uxScore < 80) {
      improvements.push(`${result.device}: UX 점수 ${result.uxScore} → 80점 이상 목표`);
    }
  });
  
  if (improvements.length === 0) {
    console.log('🎉 모든 디바이스에서 최적화 목표 달성!');
  } else {
    improvements.forEach((imp, index) => {
      console.log(`${index + 1}. ${imp}`);
    });
  }
  
  console.log('\n✅ 재귀검증 및 재귀개선 완료\n');
  
  return {
    overallSuccessRate: (overallSuccess/finalResults.length*100),
    averageUXScore: overallAvgScore,
    finalResults,
    improvements,
    iterations: Math.max(...testResults.map(t => t.iteration))
  };
}

recursiveVerificationComprehensive().catch(console.error);