const { chromium } = require('playwright');

/**
 * Final Verification - Latest Deployment
 * Quick test of all user requirements
 */

(async () => {
  console.log('🎯 FINAL VERIFICATION - LATEST DEPLOYMENT\n');
  console.log('URL: https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }, // iPhone 12
      isMobile: true,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    console.log('⏳ Waiting 60 seconds for deployment...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    console.log('🌐 Loading latest deployment...');
    await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', { 
      waitUntil: 'networkidle',
      timeout: 45000 
    });
    
    await page.waitForTimeout(3000);
    
    // Test 1: Whitepaper title hidden
    console.log('\n📱 Test 1: Whitepaper title visibility...');
    const titleSelectors = ['.navbar__title', '.navbar__brand .navbar__title'];
    let titleVisible = false;
    
    for (const selector of titleSelectors) {
      if (await page.locator(selector).isVisible().catch(() => false)) {
        titleVisible = true;
        break;
      }
    }
    
    console.log(`   Result: ${!titleVisible ? '✅' : '❌'} Title ${titleVisible ? 'visible' : 'hidden'}`);
    
    // Test 2: Hamburger menu and sidebar
    console.log('\n📱 Test 2: Hamburger menu functionality...');
    const hamburger = page.locator('.navbar__toggle');
    await hamburger.click();
    await page.waitForTimeout(1500);
    
    const sidebar = page.locator('.navbar-sidebar');
    const sidebarVisible = await sidebar.isVisible().catch(() => false);
    console.log(`   Result: ${sidebarVisible ? '✅' : '❌'} Sidebar ${sidebarVisible ? 'opened' : 'failed to open'}`);
    
    if (sidebarVisible) {
      // Test 3: Sidebar width
      console.log('\n📱 Test 3: Sidebar width optimization...');
      const sidebarWidth = await sidebar.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        return {
          width: rect.width,
          percentage: ((rect.width / viewportWidth) * 100).toFixed(1)
        };
      });
      
      const isOptimized = parseFloat(sidebarWidth.percentage) <= 90;
      console.log(`   Result: ${isOptimized ? '✅' : '❌'} Width: ${sidebarWidth.percentage}% (${Math.round(sidebarWidth.width)}px)`);
      
      // Test 4: Close button style
      console.log('\n📱 Test 4: Close button style...');
      const closeBtn = page.locator('.navbar-sidebar__close');
      const buttonData = await closeBtn.evaluate(el => {
        const computed = window.getComputedStyle(el);
        const afterContent = window.getComputedStyle(el, '::after').content;
        
        return {
          borderRadius: computed.borderRadius,
          hasCloseText: afterContent.includes('CLOSE'),
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height
        };
      });
      
      const isBoxStyle = !buttonData.borderRadius.includes('50%');
      const isCorrectSize = buttonData.width >= 70 && buttonData.height >= 30;
      
      console.log(`   Result: ${isBoxStyle && buttonData.hasCloseText && isCorrectSize ? '✅' : '❌'} Box style: ${isBoxStyle}, CLOSE text: ${buttonData.hasCloseText}, Size: ${Math.round(buttonData.width)}x${Math.round(buttonData.height)}`);
      
      // Close sidebar
      await closeBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Test 5: Language selector
    console.log('\n📱 Test 5: Language selector visibility...');
    const langSelector = page.locator('.navbar__items--right .dropdown');
    const langVisible = await langSelector.isVisible().catch(() => false);
    console.log(`   Result: ${langVisible ? '✅' : '❌'} Language selector ${langVisible ? 'visible' : 'hidden'}`);
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'final-verification-latest-deployment.png',
      fullPage: false 
    });
    
    console.log('\n📸 Screenshot saved: final-verification-latest-deployment.png');
    
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Final verification completed!');
})();