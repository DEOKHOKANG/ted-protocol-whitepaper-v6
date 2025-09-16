const { chromium } = require('playwright');

async function verifyDeployment(url) {
  console.log(`\n🔍 Verifying deployment at: ${url}\n`);
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    console.log('⏳ Loading page...');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const tests = [];
    
    // 1. Check title is hidden
    const titleHidden = await page.evaluate(() => {
      const title = document.querySelector('.navbar__title');
      if (!title) return true;
      const style = window.getComputedStyle(title);
      return style.display === 'none' || style.visibility === 'hidden';
    });
    tests.push({ name: 'Title hidden on mobile', passed: titleHidden });
    
    // 2. Open sidebar
    console.log('📱 Opening mobile sidebar...');
    await page.locator('.navbar__toggle').click();
    await page.waitForTimeout(1500);
    
    // 3. Check sidebar width
    const sidebarWidth = await page.evaluate(() => {
      const sidebar = document.querySelector('.navbar-sidebar');
      if (!sidebar) return '0%';
      const width = (sidebar.offsetWidth / window.innerWidth) * 100;
      return width.toFixed(1) + '%';
    });
    const widthOK = parseFloat(sidebarWidth) <= 90 && parseFloat(sidebarWidth) >= 80;
    tests.push({ 
      name: 'Sidebar width (should be ~85%)', 
      passed: widthOK, 
      value: sidebarWidth 
    });
    
    // 4. Check close button
    const closeButton = await page.evaluate(() => {
      const btn = document.querySelector('.navbar-sidebar__close');
      if (!btn) return { text: '', isBox: false };
      const style = window.getComputedStyle(btn);
      return {
        text: btn.textContent.trim(),
        borderRadius: style.borderRadius,
        isBox: !style.borderRadius.includes('50%'),
        width: btn.offsetWidth,
        height: btn.offsetHeight
      };
    });
    const buttonOK = closeButton.isBox && closeButton.text === 'CLOSE';
    tests.push({ 
      name: 'Close button style', 
      passed: buttonOK, 
      value: `"${closeButton.text}" ${closeButton.isBox ? 'Box' : 'Circle'} ${closeButton.width}x${closeButton.height}px`
    });
    
    // 5. Check GitHub hidden
    const githubHidden = await page.evaluate(() => {
      const github = document.querySelector('.navbar [href*="github"]');
      if (!github) return true;
      const style = window.getComputedStyle(github);
      return style.display === 'none' || style.visibility === 'hidden';
    });
    tests.push({ name: 'GitHub hidden on mobile', passed: githubHidden });
    
    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const screenshotName = `deployment-verify-${timestamp}.png`;
    await page.screenshot({ path: screenshotName });
    console.log(`\n📸 Screenshot saved: ${screenshotName}\n`);
    
    // Print results
    console.log('📊 Test Results:\n');
    tests.forEach(test => {
      const status = test.passed ? '✅' : '❌';
      const value = test.value ? ` (${test.value})` : '';
      console.log(`  ${status} ${test.name}${value}`);
    });
    
    const allPassed = tests.every(t => t.passed);
    console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed'}\n`);
    
    return allPassed;
    
  } finally {
    await browser.close();
  }
}

// Main execution
(async () => {
  const urls = [
    'https://tedprotocol-whitepaper.vercel.app/',
    'https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/'
  ];
  
  console.log('🚀 Vercel Deployment Verification Tool');
  console.log('=====================================\n');
  console.log('Waiting 30 seconds for deployment to complete...\n');
  
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  for (const url of urls) {
    try {
      await verifyDeployment(url);
    } catch (error) {
      console.log(`❌ Error checking ${url}: ${error.message}\n`);
    }
  }
  
  console.log('=' .repeat(60));
  console.log('\n✅ Verification complete\n');
})();