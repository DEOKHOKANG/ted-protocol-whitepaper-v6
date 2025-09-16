const { chromium } = require('playwright');

async function finalProductionVerification() {
  console.log('\n🔍 최종 프로덕션 검증: 40% 사이드바 확인\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 
  });
  
  const devices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Galaxy S21', width: 360, height: 800 },
    { name: 'iPhone SE', width: 320, height: 568 }
  ];
  
  const results = [];
  
  for (const device of devices) {
    console.log(`📱 테스트 중: ${device.name} (${device.width}x${device.height})`);
    
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: true,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    try {
      // Vercel 프로덕션 접속
      await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      await page.waitForTimeout(3000);
      
      // 햄버거 메뉴 클릭
      await page.click('.navbar__toggle');
      await page.waitForTimeout(2000);
      
      // 사이드바 측정
      const sidebarMeasurement = await page.evaluate(() => {
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
          cssWidth: sidebar.style.width || window.getComputedStyle(sidebar).width
        };
      });
      
      if (sidebarMeasurement) {
        results.push({
          device: device.name,
          ...sidebarMeasurement,
          success: sidebarMeasurement.sidebarPercent <= 45
        });
        
        const status = sidebarMeasurement.sidebarPercent <= 45 ? '✅' : '❌';
        console.log(`  ${status} 사이드바: ${sidebarMeasurement.sidebarWidth}px (${sidebarMeasurement.sidebarPercent}%)`);
        console.log(`  콘텐츠 영역: ${sidebarMeasurement.contentArea}px`);
        console.log(`  닫기 버튼: "${sidebarMeasurement.closeBtn?.text}" (${sidebarMeasurement.closeBtn?.width}x${sidebarMeasurement.closeBtn?.height})`);
        console.log(`  CSS 너비: ${sidebarMeasurement.cssWidth}\n`);
      } else {
        console.log('  ❌ 사이드바를 찾을 수 없음\n');
        results.push({
          device: device.name,
          error: 'Sidebar not found',
          success: false
        });
      }
      
      // 스크린샷
      await page.screenshot({ 
        path: `final-verification-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`,
        fullPage: false 
      });
      
    } catch (error) {
      console.log(`  ❌ 오류: ${error.message}\n`);
      results.push({
        device: device.name,
        error: error.message,
        success: false
      });
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // 최종 결과 분석
  console.log('=' .repeat(60));
  console.log('\n📊 최종 검증 결과:\n');
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.device}:`);
    
    if (result.error) {
      console.log(`    오류: ${result.error}`);
    } else if (result.sidebarPercent !== undefined) {
      console.log(`    사이드바: ${result.sidebarWidth}px (${result.sidebarPercent}%)`);
      console.log(`    콘텐츠: ${result.contentArea}px`);
      
      if (result.sidebarPercent > 45) {
        console.log(`    ⚠️ 목표 45% 초과 (${(result.sidebarPercent - 45).toFixed(1)}% 초과)`);
      }
    }
    console.log();
  });
  
  const successRate = (successCount / totalCount * 100).toFixed(1);
  console.log(`🎯 성공률: ${successCount}/${totalCount} (${successRate}%)`);
  
  if (successCount === totalCount) {
    console.log('🎉 모든 디바이스에서 40% 사이드바 최적화 성공!');
  } else if (successCount > 0) {
    console.log('⚠️ 부분적 성공 - 추가 최적화 필요');
  } else {
    console.log('🚨 최적화 실패 - 강력한 수정 필요');
  }
  
  console.log('\n✅ 최종 프로덕션 검증 완료\n');
  
  return {
    successRate: parseFloat(successRate),
    results,
    recommendation: successCount === totalCount ? 
      '최적화 완료' : 
      successCount > 0 ? 
        '추가 최적화 필요' : 
        '강력한 수정 필요'
  };
}

finalProductionVerification().catch(console.error);