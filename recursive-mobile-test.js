const { chromium } = require('playwright');

async function testMobileFixes() {
  console.log('\n🔄 모바일 재귀개선 테스트\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 
  });
  
  try {
    // Test on mobile viewport
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    
    // Test locally first
    console.log('📱 로컬 서버 테스트...\n');
    await page.goto('http://localhost:3400/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    }).catch(async () => {
      console.log('로컬 서버 없음, Vercel 테스트로 전환...\n');
      await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
        waitUntil: 'networkidle'
      });
    });
    
    await page.waitForTimeout(2000);
    
    // Test 1: Whitepaper text hidden
    console.log('테스트 1: Whitepaper 텍스트 숨김');
    const titleVisible = await page.evaluate(() => {
      const title = document.querySelector('.navbar__title');
      if (!title) return false;
      const rect = title.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    console.log(`  결과: ${!titleVisible ? '✅ 숨겨짐' : '❌ 여전히 보임'}\n`);
    
    // Test 2: Open sidebar
    console.log('테스트 2: 사이드바 열기');
    await page.click('.navbar__toggle');
    await page.waitForTimeout(1500);
    
    // Test 3: Sidebar width
    const sidebarWidth = await page.evaluate(() => {
      const sidebar = document.querySelector('.navbar-sidebar');
      if (!sidebar) return 0;
      return (sidebar.offsetWidth / window.innerWidth) * 100;
    });
    console.log(`  사이드바 너비: ${sidebarWidth.toFixed(1)}%`);
    console.log(`  결과: ${sidebarWidth <= 75 ? '✅ 최적화됨' : '❌ 너무 넓음'}\n`);
    
    // Test 4: Close button
    console.log('테스트 4: 닫기 버튼 스타일');
    const closeButton = await page.evaluate(() => {
      const btn = document.querySelector('.navbar-sidebar__close');
      if (!btn) return null;
      return {
        text: btn.textContent.trim(),
        width: btn.offsetWidth,
        height: btn.offsetHeight,
        borderRadius: window.getComputedStyle(btn).borderRadius,
        background: window.getComputedStyle(btn).backgroundColor
      };
    });
    
    if (closeButton) {
      console.log(`  텍스트: "${closeButton.text}"`);
      console.log(`  크기: ${closeButton.width}x${closeButton.height}px`);
      console.log(`  스타일: ${closeButton.borderRadius}`);
      const isOptimized = closeButton.text === 'CLOSE' && 
                          closeButton.width <= 80 && 
                          closeButton.height <= 40;
      console.log(`  결과: ${isOptimized ? '✅ 최적화됨' : '❌ 개선 필요'}\n`);
    }
    
    // Test 5: GitHub hidden
    console.log('테스트 5: GitHub 링크 숨김');
    const githubVisible = await page.evaluate(() => {
      const github = document.querySelector('.navbar [href*="github"]');
      if (!github) return false;
      const rect = github.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    console.log(`  결과: ${!githubVisible ? '✅ 숨겨짐' : '❌ 여전히 보임'}\n`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'mobile-recursive-test.png',
      fullPage: false 
    });
    console.log('📸 스크린샷 저장: mobile-recursive-test.png\n');
    
    // Summary
    const allPassed = !titleVisible && 
                     sidebarWidth <= 75 && 
                     closeButton?.text === 'CLOSE' &&
                     !githubVisible;
    
    if (allPassed) {
      console.log('🎉 모든 모바일 최적화 성공!\n');
    } else {
      console.log('⚠️ 일부 최적화 추가 필요\n');
      console.log('다음 단계:');
      console.log('1. npm run build 실행');
      console.log('2. git commit & push');
      console.log('3. Vercel 재배포 대기\n');
    }
    
  } finally {
    await browser.close();
  }
  
  console.log('=' .repeat(60));
  console.log('\n✅ 테스트 완료\n');
}

testMobileFixes().catch(console.error);