const { chromium } = require('playwright');

async function quick50SidebarTest() {
  console.log('\n⚡ 빠른 50% 사이드바 테스트\n');
  console.log('=' .repeat(50) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  
  const testDevice = { name: 'iPhone 12 Pro', width: 390, height: 844 };
  
  console.log(`📱 ${testDevice.name} (${testDevice.width}x${testDevice.height})`);
  
  const context = await browser.newContext({
    viewport: { width: testDevice.width, height: testDevice.height },
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  try {
    console.log(`  🌐 로컬 서버 접속...`);
    await page.goto('http://localhost:3105/', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    await page.waitForTimeout(3000);
    console.log(`  🍔 사이드바 활성화...`);
    
    // 햄버거 메뉴 클릭
    const hamburger = await page.waitForSelector('.navbar__toggle', { timeout: 5000 });
    await hamburger.click();
    await page.waitForTimeout(3000);
    
    // 측정 및 JavaScript 강제 적용 확인
    const result = await page.evaluate(() => {
      const sidebar = document.querySelector('.navbar-sidebar');
      const closeBtn = document.querySelector('.navbar-sidebar__close');
      const screenWidth = window.innerWidth;
      
      if (!sidebar) return { error: 'Sidebar not found' };
      
      const sidebarRect = sidebar.getBoundingClientRect();
      const sidebarWidth = sidebarRect.width;
      const sidebarPercent = (sidebarWidth / screenWidth * 100).toFixed(1);
      
      // Style 분석
      const computedStyle = window.getComputedStyle(sidebar);
      const inlineStyle = sidebar.style.cssText;
      
      // JavaScript 강제 스크립트 작동 여부 확인
      const jsScriptLoaded = !!document.querySelector('script[src="/force-50-sidebar.js"]');
      const hasInlineWidth = inlineStyle.includes('width') && inlineStyle.includes('50%');
      const hasGradientBg = computedStyle.background.includes('gradient');
      const hasBlurFilter = computedStyle.backdropFilter.includes('blur');
      
      return {
        basic: {
          screenWidth,
          sidebarWidth,
          sidebarPercent: parseFloat(sidebarPercent),
          sidebarVisible: sidebar.style.display !== 'none'
        },
        styles: {
          inlineStyle: inlineStyle,
          computedBackground: computedStyle.background,
          computedBackdropFilter: computedStyle.backdropFilter,
          computedWidth: computedStyle.width,
          computedBorderRadius: computedStyle.borderRadius
        },
        jsStatus: {
          scriptLoaded: jsScriptLoaded,
          hasInlineWidth: hasInlineWidth,
          hasGradientBg: hasGradientBg,
          hasBlurFilter: hasBlurFilter
        },
        closeButton: closeBtn ? {
          text: closeBtn.textContent.trim(),
          hasEnhancedText: closeBtn.textContent.includes('✕'),
          background: window.getComputedStyle(closeBtn).background,
          hasGradient: window.getComputedStyle(closeBtn).background.includes('gradient')
        } : null,
        compliance: {
          is50Percent: Math.abs(parseFloat(sidebarPercent) - 50) <= 3,
          hasPremiumDesign: hasGradientBg && hasBlurFilter,
          jsWorking: hasInlineWidth || hasGradientBg
        }
      };
    });
    
    if (result.error) {
      console.log(`  ❌ ${result.error}`);
    } else {
      console.log(`  📐 사이드바: ${result.basic.sidebarWidth}px (${result.basic.sidebarPercent}%)`);
      console.log(`  🚀 JS스크립트: ${result.jsStatus.scriptLoaded ? '✅ 로드됨' : '❌ 미로드'}`);
      console.log(`  💻 인라인스타일: ${result.jsStatus.hasInlineWidth ? '✅ 50% 적용' : '❌ 미적용'}`);
      console.log(`  🎨 그라데이션: ${result.jsStatus.hasGradientBg ? '✅' : '❌'}`);
      console.log(`  🌀 블러효과: ${result.jsStatus.hasBlurFilter ? '✅' : '❌'}`);
      console.log(`  🔘 닫기버튼: "${result.closeButton?.text}" (${result.closeButton?.hasEnhancedText ? '✅ 향상됨' : '❌ 기본'})`);
      console.log(`  🎯 50% 달성: ${result.compliance.is50Percent ? '✅' : '❌'}`);
      console.log(`  🏆 JS작동: ${result.compliance.jsWorking ? '✅' : '❌'}`);
      
      console.log('\n  📝 상세 스타일 정보:');
      console.log(`    인라인: ${result.styles.inlineStyle.substring(0, 100)}...`);
      console.log(`    배경: ${result.styles.computedBackground.substring(0, 100)}...`);
      console.log(`    필터: ${result.styles.computedBackdropFilter}`);
    }
    
    // 스크린샷
    await page.screenshot({ 
      path: `quick-50-sidebar-test.png`,
      fullPage: false
    });
    
    console.log(`\n  📸 스크린샷 저장: quick-50-sidebar-test.png`);
    
  } catch (error) {
    console.log(`  ❌ 오류: ${error.message}`);
  }
  
  await context.close();
  await browser.close();
  console.log('\n✅ 빠른 테스트 완료\n');
}

quick50SidebarTest().catch(console.error);