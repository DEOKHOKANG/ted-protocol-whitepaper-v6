const { chromium } = require('playwright');

async function testEnhanced50SidebarLocal() {
  console.log('\n🎨 향상된 50% 사이드바 로컬 테스트\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  // 프리미엄 디바이스 테스트
  const devices = [
    { name: 'iPhone 14 Pro Max', width: 430, height: 932, category: 'premium' },
    { name: 'Samsung Galaxy S23 Ultra', width: 412, height: 915, category: 'premium' },
    { name: 'iPhone SE 3rd Gen', width: 375, height: 667, category: 'compact' },
    { name: 'Google Pixel 7 Pro', width: 412, height: 892, category: 'premium' }
  ];
  
  const testResults = [];
  
  for (const device of devices) {
    console.log(`📱 ${device.name} (${device.width}x${device.height}) - ${device.category}`);
    
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: device.width < 800,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    try {
      // 로컬 서버에서 테스트
      await page.goto('http://localhost:3105/', {
        waitUntil: 'networkidle',
        timeout: 20000
      });
      
      await page.waitForTimeout(2000);
      
      console.log(`  🍔 사이드바 활성화...`);
      await page.click('.navbar__toggle');
      await page.waitForTimeout(3000);
      
      // JavaScript 강제 적용 스크립트가 작동하는지 확인
      const measurement = await page.evaluate(() => {
        const sidebar = document.querySelector('.navbar-sidebar');
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        const screenWidth = window.innerWidth;
        
        if (!sidebar) return null;
        
        const sidebarRect = sidebar.getBoundingClientRect();
        const sidebarWidth = sidebarRect.width;
        const sidebarPercent = (sidebarWidth / screenWidth * 100).toFixed(1);
        const contentArea = screenWidth - sidebarWidth;
        
        const sidebarStyle = window.getComputedStyle(sidebar);
        
        // JavaScript 강제 적용 검증
        const jsForceApplied = sidebar.style.width === '50%' || 
                              sidebar.style.width.includes('50%') ||
                              sidebarWidth <= screenWidth * 0.52; // 50% + 2% tolerance
        
        return {
          basic: {
            screenWidth,
            sidebarWidth,
            sidebarPercent: parseFloat(sidebarPercent),
            contentArea
          },
          design: {
            background: sidebarStyle.background,
            backdropFilter: sidebarStyle.backdropFilter,
            borderRadius: sidebarStyle.borderRadius,
            boxShadow: sidebarStyle.boxShadow,
            hasGradient: sidebarStyle.background.includes('gradient'),
            hasBlur: sidebarStyle.backdropFilter.includes('blur'),
            hasRoundedCorners: sidebarStyle.borderRadius !== '0px'
          },
          closeButton: closeBtn ? {
            text: closeBtn.textContent.trim(),
            background: window.getComputedStyle(closeBtn).background,
            hasEnhancedText: closeBtn.textContent.includes('✕'),
            hasGradientBg: window.getComputedStyle(closeBtn).background.includes('gradient')
          } : null,
          jsForceStatus: {
            applied: jsForceApplied,
            inlineStyles: sidebar.style.cssText,
            computedWidth: sidebarStyle.width
          },
          compliance: {
            is50Percent: Math.abs(parseFloat(sidebarPercent) - 50) <= 3, // 50% ±3% 허용
            hasPremiumDesign: sidebarStyle.background.includes('gradient') && sidebarStyle.backdropFilter.includes('blur'),
            hasEnhancedCloseBtn: closeBtn ? closeBtn.textContent.includes('✕') : false,
            jsForceWorking: jsForceApplied
          }
        };
      });
      
      if (measurement) {
        // 향상된 점수 계산
        let score = 100;
        
        // 50% 달성 (40점)
        if (!measurement.compliance.is50Percent) score -= 40;
        
        // JavaScript 강제 적용 확인 (25점)
        if (!measurement.compliance.jsForceWorking) score -= 25;
        
        // 프리미엄 디자인 (20점)
        if (!measurement.compliance.hasPremiumDesign) score -= 20;
        
        // 향상된 닫기 버튼 (15점)
        if (!measurement.compliance.hasEnhancedCloseBtn) score -= 15;
        
        const finalScore = Math.max(0, score);
        
        const result = {
          device: device.name,
          category: device.category,
          viewport: { width: device.width, height: device.height },
          measurement,
          score: finalScore,
          grade: finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 60 ? 'C' : 'D',
          success: finalScore >= 80,
          jsForceWorking: measurement.compliance.jsForceWorking,
          timestamp: new Date().toISOString()
        };
        
        testResults.push(result);
        
        const status = result.success ? '✅' : '⚠️';
        const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : result.grade === 'C' ? '🥉' : '🔻';
        
        console.log(`  ${status} ${gradeEmoji} ${result.grade}등급 (${finalScore}점)`);
        console.log(`      📐 사이드바: ${measurement.basic.sidebarWidth}px (${measurement.basic.sidebarPercent}%)`);
        console.log(`      📱 콘텐츠: ${measurement.basic.contentArea}px`);
        console.log(`      🚀 JS강제적용: ${measurement.compliance.jsForceWorking ? '✅' : '❌'}`);
        console.log(`      🎨 프리미엄 디자인: ${measurement.compliance.hasPremiumDesign ? '✅' : '❌'}`);
        console.log(`      🔘 향상된 닫기버튼: ${measurement.compliance.hasEnhancedCloseBtn ? '✅' : '❌'} "${measurement.closeButton?.text}"`);
        console.log(`      🎯 50% 달성: ${measurement.compliance.is50Percent ? '✅' : '❌'}`);
        console.log();
      }
      
      // 스크린샷
      await page.screenshot({ 
        path: `enhanced-50-local-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`,
        fullPage: false
      });
      
    } catch (error) {
      console.log(`  ❌ 오류: ${error.message}`);
      testResults.push({
        device: device.name,
        error: error.message,
        success: false,
        score: 0,
        grade: 'F'
      });
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // 최종 보고서
  console.log('\n' + '=' .repeat(60));
  console.log('\n🎨 향상된 50% 사이드바 로컬 테스트 보고서\n');
  
  const successCount = testResults.filter(r => r.success).length;
  const totalCount = testResults.length;
  const avgScore = testResults.reduce((sum, r) => sum + (r.score || 0), 0) / testResults.length;
  const jsForceWorkingCount = testResults.filter(r => r.jsForceWorking).length;
  
  console.log(`🎯 50% 사이드바 성공률: ${successCount}/${totalCount} (${(successCount/totalCount*100).toFixed(1)}%)`);
  console.log(`🚀 JavaScript 강제적용 성공률: ${jsForceWorkingCount}/${totalCount} (${(jsForceWorkingCount/totalCount*100).toFixed(1)}%)`);
  console.log(`📊 평균 점수: ${avgScore.toFixed(1)}/100`);
  console.log();
  
  // 카테고리별 분석
  const categoryStats = testResults.reduce((stats, result) => {
    if (!result.error && result.category) {
      if (!stats[result.category]) stats[result.category] = { total: 0, success: 0, avgScore: 0 };
      stats[result.category].total++;
      if (result.success) stats[result.category].success++;
      stats[result.category].avgScore += result.score || 0;
    }
    return stats;
  }, {});
  
  console.log('📊 카테고리별 성과:');
  Object.entries(categoryStats).forEach(([category, stat]) => {
    const successRate = (stat.success / stat.total * 100).toFixed(1);
    const avgScore = (stat.avgScore / stat.total).toFixed(1);
    console.log(`  ${category}: ${stat.success}/${stat.total} (${successRate}%) - 평균 ${avgScore}점`);
  });
  console.log();
  
  // 종합 평가
  if (successCount === totalCount && avgScore >= 90) {
    console.log('🎉🏆 완벽한 50% 사이드바 구현!');
    console.log('   모든 디바이스에서 JavaScript 강제 적용과 프리미엄 디자인 성공!');
  } else if (jsForceWorkingCount >= totalCount * 0.8) {
    console.log('🎉🚀 JavaScript 강제 적용 성공!');
    console.log('   대부분 디바이스에서 50% 사이드바가 올바르게 작동!');
  } else {
    console.log('⚠️ JavaScript 강제 적용 부분 성공. 추가 디버깅 필요.');
  }
  
  console.log('\n✅ 향상된 50% 사이드바 로컬 테스트 완료\n');
  
  return {
    totalDevices: totalCount,
    successfulDevices: successCount,
    successRate: (successCount/totalCount*100),
    jsForceWorkingDevices: jsForceWorkingCount,
    jsForceSuccessRate: (jsForceWorkingCount/totalCount*100),
    averageScore: avgScore,
    categoryStats,
    results: testResults
  };
}

testEnhanced50SidebarLocal().catch(console.error);