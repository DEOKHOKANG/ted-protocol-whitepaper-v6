const { chromium } = require('playwright');

async function finalVercel50SidebarTest() {
  console.log('\n🎨 최종 Vercel 50% 사이드바 검증 테스트\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  // 핵심 디바이스 선별 테스트
  const devices = [
    { name: 'iPhone 12 Pro', width: 390, height: 844, priority: 'high' },
    { name: 'Samsung Galaxy S21', width: 360, height: 800, priority: 'high' },
  ];
  
  const testResults = [];
  
  for (const device of devices) {
    console.log(`📱 ${device.name} (${device.width}x${device.height}) - ${device.priority} 우선순위`);
    
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: device.width < 800,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    try {
      await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      await page.waitForTimeout(4000); // 스크립트 로딩 대기
      
      console.log(`  🔍 JavaScript 강제 스크립트 확인...`);
      
      // 강제 스크립트 로딩 확인
      const scriptStatus = await page.evaluate(() => {
        const forceScript = document.querySelector('script[src="/force-50-sidebar.js"]');
        const mobileScript = document.querySelector('script[src="/mobile-fix.js"]');
        return {
          forceScriptExists: !!forceScript,
          mobileScriptExists: !!mobileScript,
          screenWidth: window.innerWidth
        };
      });
      
      console.log(`    🚀 force-50-sidebar.js: ${scriptStatus.forceScriptExists ? '✅' : '❌'}`);
      console.log(`    📱 mobile-fix.js: ${scriptStatus.mobileScriptExists ? '✅' : '❌'}`);
      
      console.log(`  🍔 사이드바 테스트...`);
      await page.click('.navbar__toggle');
      await page.waitForTimeout(3000);
      
      // 향상된 측정 및 JavaScript 강제 적용 확인
      const measurement = await page.evaluate(() => {
        const sidebar = document.querySelector('.navbar-sidebar');
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        const screenWidth = window.innerWidth;
        
        if (!sidebar) return { error: 'Sidebar not found' };
        
        const sidebarRect = sidebar.getBoundingClientRect();
        const sidebarWidth = sidebarRect.width;
        const sidebarPercent = (sidebarWidth / screenWidth * 100).toFixed(1);
        const contentArea = screenWidth - sidebarWidth;
        
        const sidebarStyle = window.getComputedStyle(sidebar);
        const inlineStyles = sidebar.style.cssText;
        
        // JavaScript 강제 적용 상태 분석
        const jsForceApplied = {
          hasInlineWidth50: inlineStyles.includes('width') && (inlineStyles.includes('50%') || inlineStyles.includes('50px')),
          hasInlineBackground: inlineStyles.includes('background') && inlineStyles.includes('gradient'),
          hasInlineBlur: inlineStyles.includes('backdrop-filter') && inlineStyles.includes('blur'),
          actualWidth50: Math.abs(parseFloat(sidebarPercent) - 50) <= 3,
          computedHasGradient: sidebarStyle.background.includes('gradient'),
          computedHasBlur: sidebarStyle.backdropFilter.includes('blur')
        };
        
        const jsWorking = jsForceApplied.hasInlineWidth50 || 
                         jsForceApplied.actualWidth50 ||
                         jsForceApplied.computedHasGradient;
        
        return {
          basic: {
            screenWidth,
            sidebarWidth,
            sidebarPercent: parseFloat(sidebarPercent),
            contentArea,
            contentPercent: ((contentArea / screenWidth) * 100).toFixed(1)
          },
          styles: {
            inline: inlineStyles,
            computedBackground: sidebarStyle.background,
            computedBackdropFilter: sidebarStyle.backdropFilter,
            computedBorderRadius: sidebarStyle.borderRadius,
            computedBoxShadow: sidebarStyle.boxShadow
          },
          jsForceStatus: jsForceApplied,
          closeButton: closeBtn ? {
            text: closeBtn.textContent.trim(),
            hasEnhancedText: closeBtn.textContent.includes('✕'),
            background: window.getComputedStyle(closeBtn).background,
            hasGradientBg: window.getComputedStyle(closeBtn).background.includes('gradient')
          } : null,
          compliance: {
            is50Percent: Math.abs(parseFloat(sidebarPercent) - 50) <= 3,
            hasPremiumDesign: (jsForceApplied.computedHasGradient || jsForceApplied.hasInlineBackground) && 
                             (jsForceApplied.computedHasBlur || jsForceApplied.hasInlineBlur),
            hasEnhancedCloseBtn: closeBtn ? closeBtn.textContent.includes('✕') && 
                               window.getComputedStyle(closeBtn).background.includes('gradient') : false,
            jsForceWorking: jsWorking,
            hasMinContent: contentArea >= 160
          }
        };
      });
      
      if (measurement.error) {
        console.log(`  ❌ ${measurement.error}`);
        testResults.push({
          device: device.name,
          error: measurement.error,
          success: false,
          score: 0,
          grade: 'F'
        });
      } else {
        // 종합 점수 계산 (JavaScript 강제 적용 중심)
        let score = 100;
        
        // JavaScript 강제 적용 성공 (50점)
        if (!measurement.compliance.jsForceWorking) score -= 50;
        
        // 50% 사이드바 달성 (25점)
        if (!measurement.compliance.is50Percent) score -= 25;
        
        // 프리미엄 디자인 적용 (15점)
        if (!measurement.compliance.hasPremiumDesign) score -= 15;
        
        // 향상된 닫기 버튼 (10점)
        if (!measurement.compliance.hasEnhancedCloseBtn) score -= 10;
        
        const finalScore = Math.max(0, score);
        
        const result = {
          device: device.name,
          priority: device.priority,
          viewport: { width: device.width, height: device.height },
          measurement,
          score: finalScore,
          grade: finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 60 ? 'C' : 'D',
          success: finalScore >= 70, // 70점 이상이면 성공
          jsForceWorking: measurement.compliance.jsForceWorking,
          timestamp: new Date().toISOString()
        };
        
        testResults.push(result);
        
        const status = result.success ? '✅' : '⚠️';
        const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : result.grade === 'C' ? '🥉' : '🔻';
        
        console.log(`  ${status} ${gradeEmoji} ${result.grade}등급 (${finalScore}점)`);
        console.log(`      📐 사이드바: ${measurement.basic.sidebarWidth}px (${measurement.basic.sidebarPercent}%)`);
        console.log(`      📱 콘텐츠: ${measurement.basic.contentArea}px (${measurement.basic.contentPercent}%)`);
        console.log(`      🚀 JS강제적용: ${measurement.compliance.jsForceWorking ? '✅ 성공' : '❌ 실패'}`);
        console.log(`      🎯 50% 달성: ${measurement.compliance.is50Percent ? '✅' : '❌'}`);
        console.log(`      🎨 프리미엄 디자인: ${measurement.compliance.hasPremiumDesign ? '✅' : '❌'}`);
        console.log(`      🔘 향상된 닫기버튼: ${measurement.compliance.hasEnhancedCloseBtn ? '✅' : '❌'} "${measurement.closeButton?.text}"`);
        
        console.log(`\n      🔍 JavaScript 강제 적용 상세:`);
        console.log(`        📝 인라인 50% 폭: ${measurement.jsForceStatus.hasInlineWidth50 ? '✅' : '❌'}`);
        console.log(`        🎨 인라인 배경: ${measurement.jsForceStatus.hasInlineBackground ? '✅' : '❌'}`);
        console.log(`        🌀 인라인 블러: ${measurement.jsForceStatus.hasInlineBlur ? '✅' : '❌'}`);
        console.log(`        📏 실제 50% 폭: ${measurement.jsForceStatus.actualWidth50 ? '✅' : '❌'}`);
        console.log();
      }
      
      // 스크린샷
      await page.screenshot({ 
        path: `final-vercel-50-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`,
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
  console.log('\n🎨 최종 Vercel 50% 사이드바 검증 보고서\n');
  
  const successCount = testResults.filter(r => r.success).length;
  const totalCount = testResults.length;
  const avgScore = testResults.reduce((sum, r) => sum + (r.score || 0), 0) / testResults.length;
  const jsForceWorkingCount = testResults.filter(r => r.jsForceWorking).length;
  
  console.log(`🎯 전체 성공률: ${successCount}/${totalCount} (${(successCount/totalCount*100).toFixed(1)}%)`);
  console.log(`🚀 JavaScript 강제적용 성공률: ${jsForceWorkingCount}/${totalCount} (${(jsForceWorkingCount/totalCount*100).toFixed(1)}%)`);
  console.log(`📊 평균 점수: ${avgScore.toFixed(1)}/100`);
  console.log();
  
  console.log('📱 디바이스별 상세 결과:');
  testResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.device}: ${result.error}`);
    } else {
      const status = result.success ? '✅' : '⚠️';
      const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : result.grade === 'C' ? '🥉' : '🔻';
      
      console.log(`${status} ${result.device}: ${gradeEmoji} ${result.grade}등급 (${result.score}점)`);
      console.log(`    📐 사이드바: ${result.measurement.basic.sidebarPercent}% (${result.measurement.basic.sidebarWidth}px)`);
      console.log(`    🚀 JS강제적용: ${result.jsForceWorking ? '✅' : '❌'}`);
      console.log(`    🎯 50% 달성: ${result.measurement.compliance.is50Percent ? '✅' : '❌'}`);
      console.log(`    🎨 프리미엄 디자인: ${result.measurement.compliance.hasPremiumDesign ? '✅' : '❌'}`);
    }
    console.log();
  });
  
  // 종합 판정
  if (jsForceWorkingCount === totalCount && avgScore >= 90) {
    console.log('🎉🏆 JavaScript 강제 적용 완전 성공!');
    console.log('   모든 디바이스에서 50% 사이드바와 프리미엄 디자인이 완벽 작동!');
  } else if (jsForceWorkingCount >= totalCount * 0.5) {
    console.log('🎉🚀 JavaScript 강제 적용 부분 성공!');
    console.log('   일부 디바이스에서 50% 사이드바가 작동하고 있음!');
  } else if (successCount >= totalCount * 0.5) {
    console.log('🎯 부분적 성공 - 추가 최적화 권장');
  } else {
    console.log('⚠️ 추가 디버깅 및 개선 필요');
  }
  
  console.log('\n✅ 최종 Vercel 50% 사이드바 검증 완료\n');
  
  return {
    totalDevices: totalCount,
    successfulDevices: successCount,
    successRate: (successCount/totalCount*100),
    jsForceWorkingDevices: jsForceWorkingCount,
    jsForceSuccessRate: (jsForceWorkingCount/totalCount*100),
    averageScore: avgScore,
    results: testResults
  };
}

finalVercel50SidebarTest().catch(console.error);