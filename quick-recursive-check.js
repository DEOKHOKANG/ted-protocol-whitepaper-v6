const { chromium } = require('playwright');

/**
 * Quick Recursive Check
 * Fast verification of current deployment status
 */

(async () => {
  console.log('🔄 빠른 재귀 검증 시작\n');
  console.log('=' .repeat(60) + '\n');
  
  const urls = {
    'LOCAL': 'http://localhost:3400',
    'VERCEL': 'https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/'
  };
  
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  
  for (const [env, url] of Object.entries(urls)) {
    console.log(`\n📍 환경: ${env}`);
    console.log(`   URL: ${url}\n`);
    
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }, // iPhone 12
      isMobile: true,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    try {
      // Skip localhost if not running
      if (env === 'LOCAL') {
        try {
          await page.goto(url, { timeout: 5000, waitUntil: 'domcontentloaded' });
        } catch {
          console.log('   ⏭️ 로컬 서버 사용 불가 - 건너뜀\n');
          await context.close();
          continue;
        }
      } else {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      }
      
      await page.waitForTimeout(2000);
      
      // Test 1: Title hidden
      const titleVisible = await page.locator('.navbar__title').isVisible().catch(() => false);
      console.log(`   제목 숨김: ${!titleVisible ? '✅' : '❌'}`);
      
      // Test 2: Hamburger menu
      const hamburger = page.locator('.navbar__toggle');
      await hamburger.click();
      await page.waitForTimeout(1500);
      
      const sidebar = page.locator('.navbar-sidebar');
      const sidebarOpened = await sidebar.isVisible().catch(() => false);
      console.log(`   햄버거 메뉴: ${sidebarOpened ? '✅' : '❌'}`);
      
      if (sidebarOpened) {
        // Test 3: Sidebar width
        const sidebarWidth = await sidebar.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return {
            width: rect.width,
            percentage: (rect.width / window.innerWidth * 100).toFixed(1)
          };
        });
        
        const widthOptimal = parseFloat(sidebarWidth.percentage) <= 90;
        console.log(`   사이드바 너비: ${widthOptimal ? '✅' : '❌'} (${sidebarWidth.percentage}%)`);
        
        // Test 4: Close button
        const closeBtn = page.locator('.navbar-sidebar__close');
        const buttonData = await closeBtn.evaluate(el => {
          const computed = window.getComputedStyle(el);
          const after = window.getComputedStyle(el, '::after');
          const rect = el.getBoundingClientRect();
          
          return {
            borderRadius: computed.borderRadius,
            hasCloseText: after.content.includes('CLOSE'),
            width: rect.width,
            height: rect.height
          };
        });
        
        const isBoxStyle = !buttonData.borderRadius.includes('50%');
        const hasCloseText = buttonData.hasCloseText;
        
        console.log(`   닫기 버튼: ${isBoxStyle && hasCloseText ? '✅' : '❌'} (${Math.round(buttonData.width)}x${Math.round(buttonData.height)}, ${isBoxStyle ? 'box' : 'circle'})`);
        
        // Close sidebar
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
      
      // Test 5: Language selector
      const langVisible = await page.locator('.navbar__items--right .dropdown').isVisible().catch(() => false);
      console.log(`   언어 선택기: ${langVisible ? '✅' : '❌'}`);
      
      // Test 6: GitHub icon hidden
      const githubVisible = await page.locator('[href*="github"]').isVisible().catch(() => false);
      console.log(`   GitHub 숨김: ${!githubVisible ? '✅' : '❌'}`);
      
      // Take screenshot
      await page.screenshot({ 
        path: `quick-check-${env.toLowerCase()}.png`,
        fullPage: false 
      });
      
    } catch (error) {
      console.error(`   ❌ 에러: ${error.message}`);
    } finally {
      await context.close();
    }
  }
  
  await browser.close();
  
  console.log('\n' + '=' .repeat(60));
  console.log('\n✅ 빠른 재귀 검증 완료\n');
})();