const { chromium } = require('playwright');

async function nuclearOptionVerification() {
  console.log('\n💥 NUCLEAR OPTION 재귀개선 검증\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  // 핵심 디바이스에서 Nuclear Option 테스트
  const devices = [
    { name: 'iPhone 12 Pro', width: 390, height: 844, priority: 'critical' },
    { name: 'Samsung Galaxy S21', width: 360, height: 800, priority: 'critical' },
    { name: 'iPhone SE', width: 320, height: 568, priority: 'compact' },
    { name: 'Google Pixel 5', width: 393, height: 851, priority: 'standard' }
  ];
  
  const nuclearResults = [];
  
  for (const device of devices) {
    console.log(`💥 ${device.name} (${device.width}x${device.height}) - ${device.priority}`);
    
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: device.width < 800,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    // 콘솔 로그 모니터링
    page.on('console', msg => {
      if (msg.text().includes('NUCLEAR')) {
        console.log(`    🚀 ${msg.text()}`);
      }
    });
    
    try {
      await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // Nuclear Option 스크립트 로딩 대기
      await page.waitForTimeout(5000);
      
      console.log(`  🔍 Nuclear Option 스크립트 분석...`);
      
      // Nuclear Option 적용 상태 확인
      const nuclearStatus = await page.evaluate(() => {
        // 인라인 스크립트 존재 확인
        const nuclearScript = Array.from(document.querySelectorAll('script')).find(script => 
          script.innerHTML && script.innerHTML.includes('NUCLEAR OPTION')
        );
        
        const nuclearCSS = Array.from(document.querySelectorAll('style')).find(style =>
          style.innerHTML && style.innerHTML.includes('NUCLEAR OPTION')
        );
        
        return {
          nuclearScriptLoaded: !!nuclearScript,
          nuclearCSSLoaded: !!nuclearCSS,
          nuclearScriptLength: nuclearScript ? nuclearScript.innerHTML.length : 0,
          nuclearCSSLength: nuclearCSS ? nuclearCSS.innerHTML.length : 0,
          consoleMessages: window.console ? 'available' : 'unavailable'
        };
      });
      
      console.log(`    💻 Nuclear Script: ${nuclearStatus.nuclearScriptLoaded ? '✅' : '❌'} (${nuclearStatus.nuclearScriptLength} chars)`);
      console.log(`    🎨 Nuclear CSS: ${nuclearStatus.nuclearCSSLoaded ? '✅' : '❌'} (${nuclearStatus.nuclearCSSLength} chars)`);
      
      console.log(`  🍔 사이드바 활성화...`);
      await page.click('.navbar__toggle');
      await page.waitForTimeout(3000);
      
      // Nuclear Option 결과 측정
      const measurement = await page.evaluate(() => {
        const sidebar = document.querySelector('.navbar-sidebar');
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        const screenWidth = window.innerWidth;
        
        if (!sidebar) return { error: 'Sidebar not found' };
        
        const sidebarRect = sidebar.getBoundingClientRect();
        const sidebarWidth = sidebarRect.width;
        const sidebarPercent = (sidebarWidth / screenWidth * 100).toFixed(1);
        
        // Nuclear Option 적용 확인
        const nuclearApplied = {
          hasDataNuclear: sidebar.hasAttribute('data-nuclear'),
          hasInlineWidth: sidebar.style.width === '50%' || sidebar.style.cssText.includes('50%'),
          hasGradientBg: sidebar.style.background.includes('gradient') || 
                        window.getComputedStyle(sidebar).background.includes('gradient'),
          hasBlurFilter: sidebar.style.backdropFilter.includes('blur') ||
                        window.getComputedStyle(sidebar).backdropFilter.includes('blur'),
          actualWidth50: Math.abs(parseFloat(sidebarPercent) - 50) <= 3
        };
        
        const nuclearSuccess = nuclearApplied.hasDataNuclear || 
                              nuclearApplied.hasInlineWidth || 
                              nuclearApplied.actualWidth50;
        
        return {
          basic: {
            screenWidth,
            sidebarWidth,
            sidebarPercent: parseFloat(sidebarPercent),
            contentArea: screenWidth - sidebarWidth
          },
          nuclear: nuclearApplied,
          closeButton: closeBtn ? {
            text: closeBtn.textContent.trim(),
            hasEnhancedText: closeBtn.textContent.includes('✕'),
            hasGradientBg: closeBtn.style.background.includes('gradient') ||
                          window.getComputedStyle(closeBtn).background.includes('gradient')
          } : null,
          compliance: {
            nuclearSuccess: nuclearSuccess,
            is50Percent: Math.abs(parseFloat(sidebarPercent) - 50) <= 3,
            hasPremiumDesign: nuclearApplied.hasGradientBg && nuclearApplied.hasBlurFilter,
            hasEnhancedCloseBtn: closeBtn ? closeBtn.textContent.includes('✕') : false
          }
        };
      });
      
      if (measurement.error) {
        console.log(`  ❌ ${measurement.error}`);
        nuclearResults.push({
          device: device.name,
          error: measurement.error,
          success: false,
          nuclearSuccess: false,
          score: 0,
          grade: 'F'
        });
      } else {
        // Nuclear Option 점수 계산
        let score = 100;
        
        // Nuclear Option 성공 (50점)
        if (!measurement.compliance.nuclearSuccess) score -= 50;
        
        // 50% 사이드바 달성 (25점)
        if (!measurement.compliance.is50Percent) score -= 25;
        
        // 프리미엄 디자인 (15점)
        if (!measurement.compliance.hasPremiumDesign) score -= 15;
        
        // 향상된 닫기 버튼 (10점)
        if (!measurement.compliance.hasEnhancedCloseBtn) score -= 10;
        
        const finalScore = Math.max(0, score);
        
        const result = {
          device: device.name,
          priority: device.priority,
          viewport: { width: device.width, height: device.height },
          measurement,
          nuclearStatus,
          score: finalScore,
          grade: finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 60 ? 'C' : 'D',
          success: finalScore >= 70,
          nuclearSuccess: measurement.compliance.nuclearSuccess,
          timestamp: new Date().toISOString()
        };
        
        nuclearResults.push(result);
        
        const status = result.success ? '✅' : '⚠️';
        const nuclearIcon = result.nuclearSuccess ? '💥' : '🚫';
        const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : result.grade === 'C' ? '🥉' : '🔻';
        
        console.log(`  ${status} ${nuclearIcon} ${gradeEmoji} ${result.grade}등급 (${finalScore}점)`);
        console.log(`      📐 사이드바: ${measurement.basic.sidebarWidth}px (${measurement.basic.sidebarPercent}%)`);
        console.log(`      💥 Nuclear 적용: ${measurement.compliance.nuclearSuccess ? '✅ 성공' : '❌ 실패'}`);
        console.log(`      🎯 50% 달성: ${measurement.compliance.is50Percent ? '✅' : '❌'}`);
        console.log(`      🎨 프리미엄 디자인: ${measurement.compliance.hasPremiumDesign ? '✅' : '❌'}`);
        console.log(`      🔘 향상된 닫기버튼: ${measurement.compliance.hasEnhancedCloseBtn ? '✅' : '❌'} "${measurement.closeButton?.text}"`);
        
        console.log(`\n      💥 Nuclear Option 상세:`);
        console.log(`        📍 Data Attribute: ${measurement.nuclear.hasDataNuclear ? '✅' : '❌'}`);
        console.log(`        📝 Inline Width 50%: ${measurement.nuclear.hasInlineWidth ? '✅' : '❌'}`);
        console.log(`        🎨 Gradient Background: ${measurement.nuclear.hasGradientBg ? '✅' : '❌'}`);
        console.log(`        🌀 Blur Filter: ${measurement.nuclear.hasBlurFilter ? '✅' : '❌'}`);
        console.log(`        📏 Actual 50% Width: ${measurement.nuclear.actualWidth50 ? '✅' : '❌'}`);
        console.log();
      }
      
      // Nuclear Option 스크린샷
      await page.screenshot({ 
        path: `nuclear-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`,
        fullPage: false
      });
      
    } catch (error) {
      console.log(`  ❌ 오류: ${error.message}`);
      nuclearResults.push({
        device: device.name,
        error: error.message,
        success: false,
        nuclearSuccess: false,
        score: 0,
        grade: 'F'
      });
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // Nuclear Option 최종 보고서
  console.log('\n' + '=' .repeat(60));
  console.log('\n💥 NUCLEAR OPTION 재귀개선 최종 보고서\n');
  
  const successCount = nuclearResults.filter(r => r.success).length;
  const nuclearSuccessCount = nuclearResults.filter(r => r.nuclearSuccess).length;
  const totalCount = nuclearResults.length;
  const avgScore = nuclearResults.reduce((sum, r) => sum + (r.score || 0), 0) / totalCount;
  
  console.log(`🎯 전체 성공률: ${successCount}/${totalCount} (${(successCount/totalCount*100).toFixed(1)}%)`);
  console.log(`💥 Nuclear Option 성공률: ${nuclearSuccessCount}/${totalCount} (${(nuclearSuccessCount/totalCount*100).toFixed(1)}%)`);
  console.log(`📊 평균 점수: ${avgScore.toFixed(1)}/100`);
  console.log();
  
  console.log('💥 디바이스별 Nuclear Option 결과:');
  nuclearResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.device}: ${result.error}`);
    } else {
      const status = result.success ? '✅' : '⚠️';
      const nuclearIcon = result.nuclearSuccess ? '💥' : '🚫';
      const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : result.grade === 'C' ? '🥉' : '🔻';
      
      console.log(`${status} ${nuclearIcon} ${result.device}: ${gradeEmoji} ${result.grade}등급 (${result.score}점)`);
      console.log(`    📐 사이드바: ${result.measurement.basic.sidebarPercent}% (${result.measurement.basic.sidebarWidth}px)`);
      console.log(`    💥 Nuclear: ${result.nuclearSuccess ? '성공' : '실패'}`);
      console.log(`    🎯 50% 달성: ${result.measurement.compliance.is50Percent ? '✅' : '❌'}`);
      console.log(`    🎨 프리미엄: ${result.measurement.compliance.hasPremiumDesign ? '✅' : '❌'}`);
    }
    console.log();
  });
  
  // 최종 판정
  if (nuclearSuccessCount === totalCount && avgScore >= 90) {
    console.log('🎉💥 NUCLEAR OPTION 완전 성공!');
    console.log('   모든 디바이스에서 50% 사이드바 Nuclear 강제 적용 성공!');
  } else if (nuclearSuccessCount >= totalCount * 0.75) {
    console.log('🎉💥 NUCLEAR OPTION 대부분 성공!');
    console.log('   대부분 디바이스에서 Nuclear 강제 적용이 작동!');
  } else if (nuclearSuccessCount > 0) {
    console.log('⚡ NUCLEAR OPTION 부분 성공!');
    console.log('   일부 디바이스에서 Nuclear 강제 적용 확인됨!');
  } else {
    console.log('🚫 NUCLEAR OPTION 실패 - 추가 극단적 조치 필요');
  }
  
  console.log('\n✅ NUCLEAR OPTION 재귀개선 검증 완료\n');
  
  return {
    totalDevices: totalCount,
    successfulDevices: successCount,
    nuclearSuccessDevices: nuclearSuccessCount,
    successRate: (successCount/totalCount*100),
    nuclearSuccessRate: (nuclearSuccessCount/totalCount*100),
    averageScore: avgScore,
    results: nuclearResults
  };
}

nuclearOptionVerification().catch(console.error);