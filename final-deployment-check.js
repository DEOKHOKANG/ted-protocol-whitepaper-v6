const { chromium } = require('playwright');

(async () => {
  console.log('\n🚀 Final Deployment Check\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  try {
    // Mobile context
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    
    // Check main deployment
    console.log('📱 Checking main deployment...\n');
    await page.goto('https://tedprotocol-whitepaper.vercel.app/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Check for JavaScript injection
    const hasJSFix = await page.evaluate(() => {
      return document.querySelector('script[src*="mobile-fix.js"]') !== null;
    });
    console.log(`JavaScript mobile-fix.js loaded: ${hasJSFix ? '✅' : '❌'}`);
    
    // Check package name in page source
    const packageName = await page.evaluate(() => {
      const metas = Array.from(document.querySelectorAll('meta'));
      const generatorMeta = metas.find(m => m.name === 'generator');
      return generatorMeta ? generatorMeta.content : 'unknown';
    });
    console.log(`Package info: ${packageName}\n`);
    
    // Open hamburger menu
    console.log('📱 Opening hamburger menu...');
    await page.locator('.navbar__toggle').click();
    await page.waitForTimeout(2000);
    
    // Check all mobile fixes
    const checks = await page.evaluate(() => {
      const results = {};
      
      // Title visibility
      const title = document.querySelector('.navbar__title');
      results.titleHidden = !title || window.getComputedStyle(title).display === 'none';
      
      // Sidebar width
      const sidebar = document.querySelector('.navbar-sidebar');
      if (sidebar) {
        results.sidebarWidth = ((sidebar.offsetWidth / window.innerWidth) * 100).toFixed(1) + '%';
      }
      
      // Close button
      const closeBtn = document.querySelector('.navbar-sidebar__close');
      if (closeBtn) {
        const style = window.getComputedStyle(closeBtn);
        results.closeButton = {
          text: closeBtn.textContent.trim(),
          width: closeBtn.offsetWidth,
          height: closeBtn.offsetHeight,
          borderRadius: style.borderRadius,
          background: style.background || style.backgroundColor
        };
      }
      
      // GitHub visibility
      const github = document.querySelector('.navbar [href*="github"]');
      results.githubHidden = !github || window.getComputedStyle(github).display === 'none';
      
      return results;
    });
    
    console.log('📊 Mobile Fix Results:\n');
    console.log(`  Title Hidden: ${checks.titleHidden ? '✅' : '❌'}`);
    console.log(`  Sidebar Width: ${checks.sidebarWidth} ${parseFloat(checks.sidebarWidth) <= 90 ? '✅' : '❌'}`);
    if (checks.closeButton) {
      const isBox = !checks.closeButton.borderRadius.includes('50%');
      const hasCloseText = checks.closeButton.text === 'CLOSE';
      console.log(`  Close Button:`);
      console.log(`    - Style: ${isBox ? '✅ Box' : '❌ Circle'}`);
      console.log(`    - Text: "${checks.closeButton.text}" ${hasCloseText ? '✅' : '❌'}`);
      console.log(`    - Size: ${checks.closeButton.width}x${checks.closeButton.height}px`);
    }
    console.log(`  GitHub Hidden: ${checks.githubHidden ? '✅' : '❌'}`);
    
    // Take screenshot
    await page.screenshot({ path: 'final-deployment-state.png' });
    console.log('\n📸 Screenshot: final-deployment-state.png');
    
    // Summary
    const allFixed = checks.titleHidden && 
                    parseFloat(checks.sidebarWidth) <= 90 && 
                    checks.closeButton?.text === 'CLOSE' &&
                    !checks.closeButton?.borderRadius.includes('50%') &&
                    checks.githubHidden;
    
    console.log(`\n${allFixed ? '🎉 All fixes are working!' : '⚠️ Some fixes not applied yet'}`);
    
    if (!allFixed) {
      console.log('\n💡 Deployment may still be building. Try again in 2-3 minutes.');
      console.log('   Or check: https://vercel.com/tedprotocols-projects/ted-whitepaper-fixed');
    }
    
  } finally {
    await browser.close();
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('\n✅ Check complete\n');
})();