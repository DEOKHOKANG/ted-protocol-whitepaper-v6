const { chromium } = require('playwright');

/**
 * Final Vercel Production Verification
 * Tests all user requirements on live production site
 */

class VercelFinalVerification {
  constructor() {
    this.vercelUrl = 'https://tedprotocol-whitepaper.vercel.app';
    this.results = {
      timestamp: new Date().toISOString(),
      success: false,
      tests: {}
    };
  }

  async runVerification() {
    console.log('🚀 FINAL VERCEL PRODUCTION VERIFICATION\n');
    console.log('🎯 Testing all user requirements on production\n');
    console.log('=' .repeat(60) + '\n');
    
    const browser = await chromium.launch({ 
      headless: false,
      slowMo: 500 
    });
    
    try {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 }, // iPhone 12
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      });
      
      const page = await context.newPage();
      
      console.log(`🌐 Loading: ${this.vercelUrl}`);
      await page.goto(this.vercelUrl, { 
        waitUntil: 'networkidle',
        timeout: 45000 
      });
      
      // Wait for page to fully load
      await page.waitForTimeout(3000);
      
      // Test 1: Hamburger menu functionality
      console.log('\n📱 Test 1: Hamburger menu functionality...');
      const hamburgerTest = await this.testHamburgerMenu(page);
      this.results.tests.hamburgerMenu = hamburgerTest;
      console.log(`   Result: ${hamburgerTest.passed ? '✅' : '❌'} ${hamburgerTest.message}`);
      
      if (hamburgerTest.sidebarOpened) {
        // Test 2: Close button style (box with CLOSE text)
        console.log('\n📱 Test 2: Close button style...');
        const closeButtonTest = await this.testCloseButton(page);
        this.results.tests.closeButton = closeButtonTest;
        console.log(`   Result: ${closeButtonTest.passed ? '✅' : '❌'} ${closeButtonTest.message}`);
        
        // Test 3: Sidebar width optimization
        console.log('\n📱 Test 3: Sidebar width optimization...');
        const sidebarTest = await this.testSidebarWidth(page);
        this.results.tests.sidebarWidth = sidebarTest;
        console.log(`   Result: ${sidebarTest.passed ? '✅' : '❌'} ${sidebarTest.message}`);
        
        // Close sidebar
        await this.closeSidebar(page);
      }
      
      // Test 4: Whitepaper title hidden on mobile
      console.log('\n📱 Test 4: Whitepaper title visibility...');
      const titleTest = await this.testWhitepaperTitle(page);
      this.results.tests.whitepaperTitle = titleTest;
      console.log(`   Result: ${titleTest.passed ? '✅' : '❌'} ${titleTest.message}`);
      
      // Test 5: Language selector visibility
      console.log('\n📱 Test 5: Language selector visibility...');
      const langTest = await this.testLanguageSelector(page);
      this.results.tests.languageSelector = langTest;
      console.log(`   Result: ${langTest.passed ? '✅' : '❌'} ${langTest.message}`);
      
      // Test 6: GitHub icon hidden on mobile
      console.log('\n📱 Test 6: GitHub icon visibility...');
      const githubTest = await this.testGitHubIcon(page);
      this.results.tests.githubIcon = githubTest;
      console.log(`   Result: ${githubTest.passed ? '✅' : '❌'} ${githubTest.message}`);
      
      // Take final screenshot
      await page.screenshot({ 
        path: 'vercel-final-verification.png',
        fullPage: false 
      });
      console.log('\n📸 Screenshot saved: vercel-final-verification.png');
      
      // Determine overall success
      const allPassed = Object.values(this.results.tests).every(test => test.passed);
      this.results.success = allPassed;
      
      this.printFinalReport();
      
      return this.results;
      
    } finally {
      await browser.close();
    }
  }

  async testHamburgerMenu(page) {
    try {
      const hamburger = page.locator('.navbar__toggle');
      const isVisible = await hamburger.isVisible().catch(() => false);
      
      if (!isVisible) {
        return { passed: false, message: 'Hamburger button not visible' };
      }
      
      await hamburger.click();
      await page.waitForTimeout(1500);
      
      const sidebar = page.locator('.navbar-sidebar');
      const sidebarOpened = await sidebar.isVisible().catch(() => false);
      
      return {
        passed: sidebarOpened,
        sidebarOpened,
        message: sidebarOpened ? 'Hamburger menu opens sidebar' : 'Sidebar did not open'
      };
    } catch (error) {
      return { passed: false, message: `Error: ${error.message}` };
    }
  }

  async testCloseButton(page) {
    try {
      const closeBtn = page.locator('.navbar-sidebar__close');
      const isVisible = await closeBtn.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (!isVisible) {
        return { passed: false, message: 'Close button not visible' };
      }
      
      const buttonData = await closeBtn.evaluate(el => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        // Check for CLOSE text via ::after pseudo-element
        const afterContent = window.getComputedStyle(el, '::after').content;
        const hasCloseText = afterContent.includes('CLOSE') || el.textContent.includes('CLOSE');
        
        return {
          width: rect.width,
          height: rect.height,
          borderRadius: computed.borderRadius,
          hasCloseText: hasCloseText,
          afterContent: afterContent
        };
      });
      
      // Check if it's box style (border-radius < 20px, not 50%)
      const isBoxStyle = !buttonData.borderRadius.includes('50%') && 
                        parseInt(buttonData.borderRadius) <= 20;
      
      const isOptimal = isBoxStyle && buttonData.hasCloseText;
      
      return {
        passed: isOptimal,
        isBoxStyle,
        hasCloseText: buttonData.hasCloseText,
        dimensions: `${buttonData.width.toFixed(0)}x${buttonData.height.toFixed(0)}`,
        borderRadius: buttonData.borderRadius,
        message: isOptimal ? 'Box-style button with CLOSE text' : 
                `Missing: ${!isBoxStyle ? 'box-style' : ''} ${!buttonData.hasCloseText ? 'CLOSE text' : ''}`
      };
    } catch (error) {
      return { passed: false, message: `Error: ${error.message}` };
    }
  }

  async testSidebarWidth(page) {
    try {
      const sidebar = page.locator('.navbar-sidebar');
      const sidebarData = await sidebar.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const widthRatio = rect.width / viewportWidth;
        
        return {
          width: rect.width,
          viewportWidth,
          widthRatio,
          percentage: (widthRatio * 100).toFixed(1)
        };
      });
      
      // Should be around 85% and max 320px
      const isOptimized = sidebarData.widthRatio >= 0.8 && 
                         sidebarData.widthRatio <= 0.9 && 
                         sidebarData.width <= 320;
      
      return {
        passed: isOptimized,
        widthRatio: sidebarData.widthRatio,
        percentage: sidebarData.percentage,
        actualWidth: sidebarData.width,
        message: isOptimized ? 
                `Optimized width: ${sidebarData.percentage}% (${sidebarData.width}px)` :
                `Width not optimized: ${sidebarData.percentage}% (${sidebarData.width}px)`
      };
    } catch (error) {
      return { passed: false, message: `Error: ${error.message}` };
    }
  }

  async testWhitepaperTitle(page) {
    try {
      const selectors = [
        '.navbar__title',
        '.navbar__brand .navbar__title',
        '.navbar__brand-text'
      ];
      
      let titleVisible = false;
      let titleText = '';
      
      for (const selector of selectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          titleVisible = true;
          titleText = await element.textContent();
          break;
        }
      }
      
      // Should be hidden on mobile
      const shouldBeHidden = true; // We're testing mobile
      const testPassed = !titleVisible; // Should NOT be visible
      
      return {
        passed: testPassed,
        titleVisible,
        titleText,
        message: testPassed ? 'Title correctly hidden on mobile' : 
                `Title still visible: "${titleText}"`
      };
    } catch (error) {
      return { passed: false, message: `Error: ${error.message}` };
    }
  }

  async testLanguageSelector(page) {
    try {
      const langSelector = page.locator('.navbar__items--right .dropdown').first();
      const isVisible = await langSelector.isVisible({ timeout: 5000 }).catch(() => false);
      
      let position = null;
      if (isVisible) {
        position = await langSelector.evaluate(el => {
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          return {
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity,
            zIndex: computed.zIndex,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          };
        });
      }
      
      return {
        passed: isVisible,
        position,
        message: isVisible ? 'Language selector visible and accessible' : 
                'Language selector not visible'
      };
    } catch (error) {
      return { passed: false, message: `Error: ${error.message}` };
    }
  }

  async testGitHubIcon(page) {
    try {
      const githubSelectors = [
        '.navbar__item[href*="github"]',
        '.navbar__link[href*="github"]',
        '.header-github-link',
        '[class*="github" i]',
        '[aria-label*="GitHub" i]'
      ];
      
      let githubVisible = false;
      
      for (const selector of githubSelectors) {
        const elements = await page.locator(selector).all();
        for (const element of elements) {
          if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
            githubVisible = true;
            break;
          }
        }
        if (githubVisible) break;
      }
      
      // Should be hidden on mobile
      const testPassed = !githubVisible;
      
      return {
        passed: testPassed,
        githubVisible,
        message: testPassed ? 'GitHub icon correctly hidden on mobile' : 
                'GitHub icon still visible on mobile'
      };
    } catch (error) {
      return { passed: false, message: `Error: ${error.message}` };
    }
  }

  async closeSidebar(page) {
    try {
      const closeBtn = page.locator('.navbar-sidebar__close');
      if (await closeBtn.isVisible({ timeout: 1000 })) {
        await closeBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch {
      // Ignore errors
    }
  }

  printFinalReport() {
    console.log('\n' + '=' .repeat(60));
    console.log('\n🎯 FINAL VERIFICATION REPORT');
    console.log('=' .repeat(60) + '\n');
    
    const { tests, success } = this.results;
    
    console.log(`Overall Status: ${success ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}\n`);
    
    Object.entries(tests).forEach(([testName, result]) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${testName}: ${result.message}`);
    });
    
    console.log(`\n📊 Summary: ${Object.values(tests).filter(t => t.passed).length}/${Object.keys(tests).length} tests passed`);
    
    if (success) {
      console.log('\n🎉 SUCCESS: All mobile UX requirements implemented correctly!');
      console.log('   • Hamburger menu works properly');
      console.log('   • Close button is box-style with CLOSE text');
      console.log('   • Sidebar width optimized (85%, max 320px)');
      console.log('   • Whitepaper title hidden on mobile');
      console.log('   • Language selector visible and accessible');
      console.log('   • GitHub icon hidden on mobile');
    } else {
      console.log('\n⚠️  Some issues remain - check failed tests above');
    }
    
    console.log('\n📄 Report saved with timestamp:', this.results.timestamp);
  }
}

// Run verification
(async () => {
  console.log('⏳ Waiting 30 seconds for Vercel deployment...\n');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  const verifier = new VercelFinalVerification();
  await verifier.runVerification();
})();