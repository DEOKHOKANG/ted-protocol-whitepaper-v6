const { chromium } = require('playwright');

async function final50SidebarVerification() {
  console.log('\n🎨 최종 50% 사이드바 UX/UI 검증\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 
  });
  
  // 주요 디바이스 검증
  const devices = [
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    { name: 'iPhone SE', width: 320, height: 568 },
    { name: 'Google Pixel 5', width: 393, height: 851 }
  ];
  
  const verificationResults = [];
  
  for (const device of devices) {
    console.log(`📱 ${device.name} (${device.width}x${device.height}) 검증`);
    
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: device.width < 800,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    try {
      await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      await page.waitForTimeout(3000);
      
      // 햄버거 메뉴 클릭
      console.log(`  🍔 사이드바 테스트...`);
      await page.click('.navbar__toggle');
      await page.waitForTimeout(2000);
      
      // 상세 측정
      const measurement = await page.evaluate(() => {
        const sidebar = document.querySelector('.navbar-sidebar');
        const closeBtn = document.querySelector('.navbar-sidebar__close');
        const menuItems = document.querySelectorAll('.navbar-sidebar .menu__link');
        const backdrop = document.querySelector('.navbar-sidebar__backdrop');
        const screenWidth = window.innerWidth;
        
        if (!sidebar) return null;
        
        const sidebarRect = sidebar.getBoundingClientRect();
        const sidebarWidth = sidebarRect.width;
        const sidebarPercent = (sidebarWidth / screenWidth * 100).toFixed(1);
        const contentArea = screenWidth - sidebarWidth;
        const contentPercent = (contentArea / screenWidth * 100).toFixed(1);
        
        const sidebarStyle = window.getComputedStyle(sidebar);
        const backdropStyle = backdrop ? window.getComputedStyle(backdrop) : null;
        const closeBtnStyle = closeBtn ? window.getComputedStyle(closeBtn) : null;
        
        return {
          basic: {
            screenWidth,
            sidebarWidth,
            sidebarPercent: parseFloat(sidebarPercent),
            contentArea,
            contentPercent: parseFloat(contentPercent)
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
            width: closeBtn.offsetWidth,
            height: closeBtn.offsetHeight,
            background: closeBtnStyle.background,
            borderRadius: closeBtnStyle.borderRadius,
            boxShadow: closeBtnStyle.boxShadow,
            hasEnhancedText: closeBtn.textContent.includes('✕'),
            hasGradientBg: closeBtnStyle.background.includes('gradient'),
            hasShadow: closeBtnStyle.boxShadow !== 'none'
          } : null,
          backdrop: backdrop ? {
            background: backdropStyle.background,
            backdropFilter: backdropStyle.backdropFilter,
            hasRadialGradient: backdropStyle.background.includes('radial-gradient'),
            hasBlur: backdropStyle.backdropFilter.includes('blur')
          } : null,
          menu: {
            itemCount: menuItems.length,
            avgHeight: menuItems.length > 0 ? 
              Array.from(menuItems).reduce((sum, item) => sum + item.offsetHeight, 0) / menuItems.length : 0,
            firstItemStyle: menuItems[0] ? {
              background: window.getComputedStyle(menuItems[0]).background,
              borderRadius: window.getComputedStyle(menuItems[0]).borderRadius,
              hasBackground: window.getComputedStyle(menuItems[0]).background !== 'rgba(0, 0, 0, 0)'
            } : null
          },
          compliance: {
            is50Percent: Math.abs(parseFloat(sidebarPercent) - 50) <= 2, // 50% ±2% 허용
            hasMinContent: contentArea >= 160, // 최소 콘텐츠 영역
            hasPremiumDesign: sidebarStyle.background.includes('gradient') && sidebarStyle.backdropFilter.includes('blur'),
            hasEnhancedCloseBtn: closeBtn ? closeBtn.textContent.includes('✕') && closeBtnStyle.background.includes('gradient') : false,
            githubHidden: document.querySelectorAll('[href*="github"]:not([style*="display: none"])').length === 0,
            titleHidden: document.querySelectorAll('.navbar__title:not([style*="display: none"])').length === 0
          }
        };
      });
      
      if (measurement) {
        // 50% 사이드바 전용 점수 계산
        let score = 100;
        
        // 50% 달성 점수 (30점)
        if (!measurement.compliance.is50Percent) score -= 30;
        
        // 프리미엄 디자인 점수 (25점)
        if (!measurement.compliance.hasPremiumDesign) score -= 25;
        
        // 향상된 닫기 버튼 점수 (20점)
        if (!measurement.compliance.hasEnhancedCloseBtn) score -= 20;
        
        // 콘텐츠 가시성 점수 (15점)
        if (!measurement.compliance.hasMinContent) score -= 15;
        
        // 기본 컴플라이언스 점수 (10점)
        if (!measurement.compliance.githubHidden) score -= 5;
        if (!measurement.compliance.titleHidden) score -= 5;
        
        const finalScore = Math.max(0, score);
        
        const result = {
          device: device.name,
          viewport: { width: device.width, height: device.height },
          measurement,
          score: finalScore,
          grade: finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : 'C',
          success: finalScore >= 80,
          features: {
            width50Percent: measurement.compliance.is50Percent,
            premiumDesign: measurement.compliance.hasPremiumDesign,
            enhancedCloseBtn: measurement.compliance.hasEnhancedCloseBtn,
            contentVisibility: measurement.compliance.hasMinContent
          },
          timestamp: new Date().toISOString()
        };
        
        verificationResults.push(result);
        
        const status = result.success ? '✅' : '⚠️';
        const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : '🥉';
        
        console.log(`  ${status} ${gradeEmoji} ${result.grade}등급 (${finalScore}점)`);
        console.log(`      📐 사이드바: ${measurement.basic.sidebarWidth}px (${measurement.basic.sidebarPercent}%) - 50% 목표`);
        console.log(`      📱 콘텐츠: ${measurement.basic.contentArea}px (${measurement.basic.contentPercent}%)`);
        console.log(`      🎨 프리미엄 디자인: ${measurement.compliance.hasPremiumDesign ? '✅' : '❌'}`);
        console.log(`      🔘 향상된 닫기버튼: ${measurement.compliance.hasEnhancedCloseBtn ? '✅' : '❌'} "${measurement.closeButton?.text}"`);
        console.log(`      🎯 50% 달성: ${measurement.compliance.is50Percent ? '✅' : '❌'}`);
        
        // 디자인 상세 정보
        console.log(`      🌈 그라데이션: ${measurement.design.hasGradient ? '✅' : '❌'}`);
        console.log(`      🌀 블러 효과: ${measurement.design.hasBlur ? '✅' : '❌'}`);
        console.log(`      🔵 둥근 모서리: ${measurement.design.hasRoundedCorners ? '✅' : '❌'}`);
        console.log();
      }
      
      // 스크린샷
      await page.screenshot({ 
        path: `final-50-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`
      });
      
    } catch (error) {
      console.log(`  ❌ 오류: ${error.message}`);
      verificationResults.push({
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
  console.log('\n🎨 최종 50% 사이드바 검증 보고서\n');
  
  const successCount = verificationResults.filter(r => r.success).length;
  const totalCount = verificationResults.length;
  const avgScore = verificationResults.reduce((sum, r) => sum + (r.score || 0), 0) / verificationResults.length;
  
  console.log(`🎯 50% 사이드바 성공률: ${successCount}/${totalCount} (${(successCount/totalCount*100).toFixed(1)}%)`);
  console.log(`📊 평균 점수: ${avgScore.toFixed(1)}/100`);
  console.log();
  
  console.log('📱 디바이스별 상세 결과:');
  verificationResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.device}: ${result.error}`);
    } else {
      const status = result.success ? '✅' : '⚠️';
      const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : '🥉';
      
      console.log(`${status} ${result.device}: ${gradeEmoji} ${result.grade}등급 (${result.score}점)`);
      
      if (result.measurement) {
        console.log(`    📐 사이드바: ${result.measurement.basic.sidebarPercent}% (${result.measurement.basic.sidebarWidth}px)`);
        console.log(`    📱 콘텐츠: ${result.measurement.basic.contentPercent}% (${result.measurement.basic.contentArea}px)`);
        console.log(`    🎨 프리미엄 디자인: ${result.features.premiumDesign ? '✅' : '❌'}`);
        console.log(`    🎯 50% 달성: ${result.features.width50Percent ? '✅' : '❌'}`);
        console.log(`    🔘 향상된 버튼: ${result.features.enhancedCloseBtn ? '✅' : '❌'}`);
      }
    }
    console.log();
  });
  
  // 기능별 달성률
  const featureStats = verificationResults.reduce((stats, result) => {
    if (result.features) {
      stats.width50Percent += result.features.width50Percent ? 1 : 0;
      stats.premiumDesign += result.features.premiumDesign ? 1 : 0;
      stats.enhancedCloseBtn += result.features.enhancedCloseBtn ? 1 : 0;
      stats.contentVisibility += result.features.contentVisibility ? 1 : 0;
    }
    return stats;
  }, { width50Percent: 0, premiumDesign: 0, enhancedCloseBtn: 0, contentVisibility: 0 });
  
  console.log('🎯 기능별 달성률:');
  console.log(`  📐 50% 사이드바: ${featureStats.width50Percent}/${totalCount} (${(featureStats.width50Percent/totalCount*100).toFixed(1)}%)`);
  console.log(`  🎨 프리미엄 디자인: ${featureStats.premiumDesign}/${totalCount} (${(featureStats.premiumDesign/totalCount*100).toFixed(1)}%)`);
  console.log(`  🔘 향상된 닫기버튼: ${featureStats.enhancedCloseBtn}/${totalCount} (${(featureStats.enhancedCloseBtn/totalCount*100).toFixed(1)}%)`);
  console.log(`  📱 콘텐츠 가시성: ${featureStats.contentVisibility}/${totalCount} (${(featureStats.contentVisibility/totalCount*100).toFixed(1)}%)`);
  console.log();
  
  // 종합 평가
  if (successCount === totalCount && avgScore >= 90) {
    console.log('🎉🎨 완벽한 50% 사이드바 UX/UI 구현!');
    console.log('   모든 디바이스에서 프리미엄 디자인과 최적 사용성 달성!');
  } else if (successCount >= totalCount * 0.8) {
    console.log('🎉 우수한 50% 사이드바 구현!');
    console.log('   대부분 디바이스에서 향상된 디자인 제공!');
  } else {
    console.log('⚠️ 50% 사이드바 부분 성공. 추가 최적화 권장.');
  }
  
  console.log('\n✅ 최종 50% 사이드바 검증 완료\n');
  
  return {
    totalDevices: totalCount,
    successfulDevices: successCount,
    successRate: (successCount/totalCount*100),
    averageScore: avgScore,
    featureStats,
    results: verificationResults
  };
}

final50SidebarVerification().catch(console.error);