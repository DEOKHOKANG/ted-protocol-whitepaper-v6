const { chromium } = require('playwright');
const fs = require('fs').promises;

// Test configuration
const TEST_URLS = {
  local: 'http://localhost:3400',
  vercel: 'https://tedprotocol-whitepaper.vercel.app'
};

const LANGUAGES = ['en', 'ko', 'zh-CN', 'ja'];

// Mobile devices to test
const MOBILE_DEVICES = [
  { name: 'iPhone 12', viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' },
  { name: 'Samsung Galaxy S21', viewport: { width: 384, height: 854 }, userAgent: 'Mozilla/5.0 (Linux; Android 11; Samsung Galaxy S21)' }
];

// Desktop viewport for PC testing
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };

class MobileNavigationTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      failures: [],
      improvements: []
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Playwright Mobile Navigation Tests...\n');
    
    const browser = await chromium.launch({ 
      headless: false,
      slowMo: 500 
    });

    try {
      // Test Vercel deployment
      await this.testSite(browser, TEST_URLS.vercel, 'Vercel');
      
      // Test local if available
      try {
        const response = await fetch(TEST_URLS.local);
        if (response.ok) {
          await this.testSite(browser, TEST_URLS.local, 'Local');
        }
      } catch (e) {
        console.log('⚠️ Local server not running, skipping local tests\n');
      }

    } finally {
      await browser.close();
      await this.generateReport();
    }
  }

  async testSite(browser, url, siteName) {
    console.log(`\n📱 Testing ${siteName}: ${url}\n`);
    
    // Test mobile devices
    for (const device of MOBILE_DEVICES) {
      console.log(`  Testing on ${device.name}...`);
      await this.testMobileDevice(browser, url, device);
    }
    
    // Test desktop
    console.log(`  Testing on Desktop...`);
    await this.testDesktop(browser, url);
  }

  async testMobileDevice(browser, url, device) {
    const context = await browser.newContext({
      viewport: device.viewport,
      userAgent: device.userAgent,
      isMobile: true,
      hasTouch: true
    });

    const page = await context.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const testResult = {
        url,
        device: device.name,
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test 1: Hamburger menu visibility
      console.log('    ✓ Testing hamburger menu visibility...');
      const hamburgerVisible = await page.locator('.navbar__toggle').isVisible();
      testResult.tests.hamburgerVisible = hamburgerVisible;
      
      if (!hamburgerVisible) {
        this.results.failures.push({
          device: device.name,
          test: 'Hamburger menu visibility',
          error: 'Hamburger menu not visible'
        });
        this.results.improvements.push({
          issue: 'Hamburger menu not visible on mobile',
          fix: 'Add display: flex !important; to .navbar__toggle'
        });
      }

      // Test 2: Hamburger menu clickability
      if (hamburgerVisible) {
        console.log('    ✓ Testing hamburger menu click...');
        try {
          await page.locator('.navbar__toggle').click({ timeout: 5000 });
          await page.waitForTimeout(1000);
          
          const sidebarVisible = await page.locator('.navbar-sidebar').isVisible();
          testResult.tests.hamburgerClickable = sidebarVisible;
          
          if (!sidebarVisible) {
            this.results.failures.push({
              device: device.name,
              test: 'Hamburger menu click',
              error: 'Sidebar does not open on click'
            });
            this.results.improvements.push({
              issue: 'Sidebar not opening on hamburger click',
              fix: 'Check JavaScript event handlers and z-index'
            });
          } else {
            // Test sidebar menu items
            console.log('    ✓ Testing sidebar menu items...');
            const menuItems = await page.locator('.navbar-sidebar__item').count();
            testResult.tests.sidebarMenuItems = menuItems;
            
            if (menuItems === 0) {
              this.results.failures.push({
                device: device.name,
                test: 'Sidebar menu items',
                error: 'No menu items in sidebar'
              });
            }
            
            // Close sidebar
            const closeButton = page.locator('.navbar-sidebar__close');
            if (await closeButton.isVisible()) {
              await closeButton.click();
              await page.waitForTimeout(500);
            }
          }
        } catch (error) {
          testResult.tests.hamburgerClickable = false;
          this.results.failures.push({
            device: device.name,
            test: 'Hamburger menu interaction',
            error: error.message
          });
        }
      }

      // Test 3: Language selector visibility
      console.log('    ✓ Testing language selector...');
      const langSelector = page.locator('.navbar__items--right .dropdown');
      const langSelectorVisible = await langSelector.isVisible();
      testResult.tests.languageSelectorVisible = langSelectorVisible;
      
      if (!langSelectorVisible) {
        this.results.failures.push({
          device: device.name,
          test: 'Language selector visibility',
          error: 'Language selector not visible'
        });
        this.results.improvements.push({
          issue: 'Language selector not visible on mobile',
          fix: 'Ensure .navbar__items--right has display: flex !important;'
        });
      } else {
        // Test language dropdown
        try {
          await langSelector.locator('.navbar__link').click();
          await page.waitForTimeout(500);
          
          const dropdownMenu = await page.locator('.dropdown__menu').isVisible();
          testResult.tests.languageDropdownWorks = dropdownMenu;
          
          if (!dropdownMenu) {
            this.results.failures.push({
              device: device.name,
              test: 'Language dropdown',
              error: 'Dropdown menu does not appear'
            });
          }
        } catch (error) {
          testResult.tests.languageDropdownWorks = false;
        }
      }

      // Take screenshot
      const screenshotName = `mobile-${device.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
      await page.screenshot({ 
        path: screenshotName,
        fullPage: false 
      });
      testResult.screenshot = screenshotName;

      this.results.tests.push(testResult);

    } catch (error) {
      console.error(`    ❌ Error testing ${device.name}: ${error.message}`);
      this.results.failures.push({
        device: device.name,
        test: 'General',
        error: error.message
      });
    } finally {
      await context.close();
    }
  }

  async testDesktop(browser, url) {
    const context = await browser.newContext({
      viewport: DESKTOP_VIEWPORT
    });

    const page = await context.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const testResult = {
        url,
        device: 'Desktop',
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test: No purple hover on language selector
      console.log('    ✓ Testing PC hover effects...');
      const langSelector = page.locator('.navbar__items--right .dropdown > .navbar__link');
      
      if (await langSelector.isVisible()) {
        await langSelector.hover();
        await page.waitForTimeout(500);
        
        const backgroundColor = await langSelector.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        const hasBackground = backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                             backgroundColor !== 'transparent' &&
                             !backgroundColor.includes('0, 0, 0, 0');
        
        testResult.tests.noPurpleHover = !hasBackground;
        
        if (hasBackground) {
          this.results.failures.push({
            device: 'Desktop',
            test: 'Purple hover removal',
            error: `Background color found: ${backgroundColor}`
          });
          this.results.improvements.push({
            issue: 'Purple hover still present on PC',
            fix: 'Add stronger CSS override with !important'
          });
        }
      }

      // Take screenshot
      const screenshotName = `desktop-${Date.now()}.png`;
      await page.screenshot({ 
        path: screenshotName,
        fullPage: false 
      });
      testResult.screenshot = screenshotName;

      this.results.tests.push(testResult);

    } catch (error) {
      console.error(`    ❌ Error testing Desktop: ${error.message}`);
      this.results.failures.push({
        device: 'Desktop',
        test: 'General',
        error: error.message
      });
    } finally {
      await context.close();
    }
  }

  async generateReport() {
    console.log('\n📊 Generating test report...\n');
    
    // Summary
    const totalTests = this.results.tests.length;
    const totalFailures = this.results.failures.length;
    const successRate = totalTests > 0 ? 
      ((totalTests - totalFailures) / totalTests * 100).toFixed(1) : 0;
    
    console.log('=================================');
    console.log('   MOBILE NAVIGATION TEST REPORT');
    console.log('=================================\n');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Failures: ${totalFailures}`);
    console.log(`Success Rate: ${successRate}%\n`);
    
    if (this.results.failures.length > 0) {
      console.log('❌ FAILURES:');
      this.results.failures.forEach(failure => {
        console.log(`  - ${failure.device}: ${failure.test}`);
        console.log(`    Error: ${failure.error}`);
      });
      console.log('');
    }
    
    if (this.results.improvements.length > 0) {
      console.log('🔧 SUGGESTED IMPROVEMENTS:');
      const uniqueImprovements = [...new Map(
        this.results.improvements.map(item => [item.issue, item])
      ).values()];
      
      uniqueImprovements.forEach(improvement => {
        console.log(`  - Issue: ${improvement.issue}`);
        console.log(`    Fix: ${improvement.fix}`);
      });
      console.log('');
    }
    
    // Save detailed report
    const reportPath = `playwright-test-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}\n`);
    
    // Generate CSS fixes if needed
    if (this.results.improvements.length > 0) {
      await this.generateCSSFixes();
    }
    
    return this.results;
  }

  async generateCSSFixes() {
    console.log('🔧 Generating CSS fixes...\n');
    
    const cssFixesContent = `/* AUTOMATED CSS FIXES - Generated by Playwright Tests */
/* Timestamp: ${new Date().toISOString()} */

/* Mobile Navigation Fixes */
@media (max-width: 996px) {
  /* Ensure hamburger is always visible */
  .navbar__toggle {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
    z-index: 10000 !important;
  }
  
  /* Ensure language selector is always visible */
  .navbar__items--right {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  /* Ensure sidebar opens properly */
  .navbar-sidebar--show,
  .navbar-sidebar[aria-hidden="false"] {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    transform: translateX(0) !important;
  }
}

/* Remove ALL hover effects on PC */
@media (min-width: 997px) {
  .dropdown > .navbar__link,
  .dropdown > .navbar__link:hover,
  .navbar__items--right .dropdown > .navbar__link,
  .navbar__items--right .dropdown > .navbar__link:hover {
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
  }
}`;

    const fixesPath = 'css-fixes-generated.css';
    await fs.writeFile(fixesPath, cssFixesContent);
    console.log(`✅ CSS fixes saved to: ${fixesPath}\n`);
  }
}

// Run tests
(async () => {
  const tester = new MobileNavigationTester();
  await tester.runAllTests();
})();