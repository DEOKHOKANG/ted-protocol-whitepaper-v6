const { chromium } = require('playwright');

async function testVercelProduction() {
  console.log('🔍 Testing ACTUAL Vercel Production Site\n');
  console.log('URL: https://tedprotocol-whitepaper.vercel.app\n');
  console.log('=' .repeat(50) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  try {
    // Test on mobile
    console.log('📱 Testing Mobile View...\n');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    });
    
    const mobilePage = await mobileContext.newPage();
    
    console.log('  Loading page...');
    await mobilePage.goto('https://tedprotocol-whitepaper.vercel.app', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await mobilePage.waitForTimeout(3000);
    
    console.log('  Checking hamburger menu...');
    const hamburger = mobilePage.locator('.navbar__toggle');
    const hamburgerVisible = await hamburger.isVisible().catch(() => false);
    console.log(`  Hamburger visible: ${hamburgerVisible ? '✅' : '❌'}`);
    
    if (hamburgerVisible) {
      console.log('  Clicking hamburger...');
      await hamburger.click();
      await mobilePage.waitForTimeout(2000);
      
      // Check sidebar
      const sidebar = mobilePage.locator('.navbar-sidebar');
      const sidebarVisible = await sidebar.isVisible().catch(() => false);
      console.log(`  Sidebar opens: ${sidebarVisible ? '✅' : '❌'}`);
      
      // Count menu items
      const menuItems = await mobilePage.locator('.navbar-sidebar__item, .menu__link').all();
      console.log(`  Menu items found: ${menuItems.length}`);
      
      // Get menu text
      const menuTexts = [];
      for (const item of menuItems.slice(0, 10)) {
        const text = await item.textContent();
        if (text) menuTexts.push(text.trim());
      }
      console.log(`  Menu items: ${menuTexts.join(', ')}`);
      
      // Close sidebar
      const closeBtn = mobilePage.locator('.navbar-sidebar__close');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
    
    console.log('\n  Checking language selector...');
    const langSelector = mobilePage.locator('.navbar__items--right .dropdown').first();
    const langVisible = await langSelector.isVisible().catch(() => false);
    console.log(`  Language selector visible: ${langVisible ? '✅' : '❌'}`);
    
    if (!langVisible) {
      // Try to find it with more specific selectors
      const altSelectors = [
        '.navbar__items--right',
        '.dropdown',
        '[class*="language"]',
        '.navbar__item.dropdown'
      ];
      
      for (const selector of altSelectors) {
        const element = mobilePage.locator(selector).first();
        const visible = await element.isVisible().catch(() => false);
        if (visible) {
          console.log(`  Found with selector: ${selector}`);
          break;
        }
      }
    }
    
    console.log('\n  Checking GitHub icon...');
    const githubIcon = mobilePage.locator('a[href*="github"]').first();
    const githubVisible = await githubIcon.isVisible().catch(() => false);
    console.log(`  GitHub icon visible: ${githubVisible ? '❌ (should be hidden)' : '✅ (correctly hidden)'}`);
    
    // Check CSS loading
    console.log('\n  Checking CSS styles...');
    const navbarStyles = await mobilePage.locator('.navbar').evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background.substring(0, 50),
        height: computed.height
      };
    });
    console.log(`  Navbar styles: ${JSON.stringify(navbarStyles)}`);
    
    // Take screenshot
    await mobilePage.screenshot({ 
      path: 'vercel-production-mobile-actual.png',
      fullPage: false 
    });
    console.log('\n  Screenshot saved: vercel-production-mobile-actual.png');
    
    await mobileContext.close();
    
    // Test on desktop
    console.log('\n🖥️ Testing Desktop View...\n');
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto('https://tedprotocol-whitepaper.vercel.app', { 
      waitUntil: 'networkidle' 
    });
    
    await desktopPage.waitForTimeout(2000);
    
    const desktopGithub = desktopPage.locator('a[href*="github"]').first();
    const desktopGithubVisible = await desktopGithub.isVisible().catch(() => false);
    console.log(`  GitHub icon visible: ${desktopGithubVisible ? '✅' : '❌'}`);
    
    // Check hover effect
    const langButtonDesktop = desktopPage.locator('.navbar__items--right .dropdown .navbar__link').first();
    if (await langButtonDesktop.isVisible()) {
      await langButtonDesktop.hover();
      await desktopPage.waitForTimeout(500);
      
      const hoverStyles = await langButtonDesktop.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          background: computed.background,
          backgroundColor: computed.backgroundColor
        };
      });
      
      const hasPurple = hoverStyles.backgroundColor.includes('107') || 
                       hoverStyles.backgroundColor.includes('purple');
      console.log(`  Purple hover effect: ${hasPurple ? '❌ (should be removed)' : '✅ (correctly removed)'}`);
    }
    
    await desktopPage.screenshot({ 
      path: 'vercel-production-desktop-actual.png' 
    });
    console.log('\n  Screenshot saved: vercel-production-desktop-actual.png');
    
    await desktopContext.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('\n⚠️ IMPORTANT: Check the screenshots to verify actual state\n');
}

testVercelProduction();