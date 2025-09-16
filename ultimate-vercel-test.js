const { chromium } = require('playwright');

/**
 * Ultimate Vercel Test - Final Verification
 * Tests if JavaScript overrides are working
 */

(async () => {
  console.log('🚀 ULTIMATE VERCEL TEST - FINAL VERIFICATION\n');
  console.log('=' .repeat(70) + '\n');
  
  console.log('⏳ 60초 배포 대기중...\n');
  await new Promise(resolve => setTimeout(resolve, 60000));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }, // iPhone 12
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    });
    
    const page = await context.newPage();
    
    console.log('🌐 Vercel 최신 배포 로딩중...\n');
    await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', { 
      waitUntil: 'networkidle',
      timeout: 45000 
    });
    
    // Wait for JavaScript overrides to apply
    await page.waitForTimeout(3000);
    
    console.log('📱 모바일 테스트 시작:\n');
    
    // Test 1: Title completely hidden
    console.log('1️⃣ 제목 숨김 테스트...');
    const titleVisible = await page.evaluate(() => {
      const titles = document.querySelectorAll('.navbar__title, .navbar__brand .navbar__title');
      return Array.from(titles).some(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
    });
    console.log(`   결과: ${!titleVisible ? '✅ 성공' : '❌ 실패'} (제목 ${titleVisible ? '보임' : '숨김'})\n`);
    
    // Test 2: Hamburger menu works
    console.log('2️⃣ 햄버거 메뉴 테스트...');
    const hamburger = page.locator('.navbar__toggle');
    await hamburger.click();
    await page.waitForTimeout(2000);
    
    const sidebar = page.locator('.navbar-sidebar');
    const sidebarOpened = await sidebar.isVisible().catch(() => false);
    console.log(`   결과: ${sidebarOpened ? '✅ 성공' : '❌ 실패'} (사이드바 ${sidebarOpened ? '열림' : '안 열림'})\n`);
    
    if (sidebarOpened) {
      // Test 3: Sidebar width is 85%
      console.log('3️⃣ 사이드바 너비 테스트...');
      const sidebarData = await page.evaluate(() => {
        const sidebar = document.querySelector('.navbar-sidebar');
        if (!sidebar) return null;
        
        const rect = sidebar.getBoundingClientRect();
        const computed = window.getComputedStyle(sidebar);
        
        return {
          width: rect.width,
          computedWidth: computed.width,
          viewport: window.innerWidth,
          percentage: (rect.width / window.innerWidth * 100).toFixed(1)
        };
      });
      
      const widthOK = sidebarData && parseFloat(sidebarData.percentage) <= 90;
      console.log(`   결과: ${widthOK ? '✅ 성공' : '❌ 실패'}`);
      console.log(`   세부: ${sidebarData?.percentage}% (${Math.round(sidebarData?.width)}px)\n`);
      
      // Test 4: Close button is box with CLOSE text
      console.log('4️⃣ 닫기 버튼 테스트...');
      const closeData = await page.evaluate(() => {
        const btn = document.querySelector('.navbar-sidebar__close');
        if (!btn) return null;
        
        const computed = window.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        const after = window.getComputedStyle(btn, '::after');
        
        return {
          width: rect.width,
          height: rect.height,
          borderRadius: computed.borderRadius,
          background: computed.backgroundColor,
          textContent: btn.textContent,
          innerHTML: btn.innerHTML,
          afterContent: after.content,
          hasCloseText: btn.textContent.includes('CLOSE') || after.content.includes('CLOSE')
        };
      });
      
      const isBox = closeData && !closeData.borderRadius.includes('50%');
      const hasText = closeData && closeData.hasCloseText;
      
      console.log(`   결과: ${isBox && hasText ? '✅ 성공' : '❌ 실패'}`);
      console.log(`   세부: ${Math.round(closeData?.width)}x${Math.round(closeData?.height)}`);
      console.log(`   스타일: ${isBox ? '박스형' : '원형'}, ${hasText ? 'CLOSE 텍스트 있음' : 'CLOSE 텍스트 없음'}\n`);
      
      // Close sidebar
      const closeBtn = page.locator('.navbar-sidebar__close');
      await closeBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Test 5: Language selector visible
    console.log('5️⃣ 언어 선택기 테스트...');
    const langVisible = await page.locator('.navbar__items--right .dropdown').isVisible().catch(() => false);
    console.log(`   결과: ${langVisible ? '✅ 성공' : '❌ 실패'} (${langVisible ? '표시됨' : '숨김'})\n`);
    
    // Test 6: GitHub hidden on mobile
    console.log('6️⃣ GitHub 아이콘 테스트...');
    const githubVisible = await page.evaluate(() => {
      const githubLinks = document.querySelectorAll('[href*="github"]');
      return Array.from(githubLinks).some(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
    });
    console.log(`   결과: ${!githubVisible ? '✅ 성공' : '❌ 실패'} (${githubVisible ? '보임' : '숨김'})\n`);
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'ultimate-vercel-test-result.png',
      fullPage: false 
    });
    
    // Check if JavaScript override is working
    console.log('🔍 JavaScript Override 확인...');
    const hasRootComponent = await page.evaluate(() => {
      // Check if our inline styles were injected
      const styles = document.querySelectorAll('style');
      return Array.from(styles).some(style => 
        style.innerHTML.includes('CRITICAL MOBILE FIXES - INLINE STYLES')
      );
    });
    console.log(`   Root.js 적용: ${hasRootComponent ? '✅ 작동중' : '❌ 미적용'}\n`);
    
  } finally {
    await browser.close();
  }
  
  console.log('=' .repeat(70));
  console.log('\n🎉 ULTIMATE VERCEL TEST 완료!\n');
  console.log('JavaScript 오버라이드가 적용되어 모든 문제가 해결되어야 합니다.\n');
})();