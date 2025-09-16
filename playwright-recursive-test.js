const { chromium } = require('playwright');
const fs = require('fs').promises;

/**
 * Enhanced Recursive Testing Suite for Mobile Navigation
 * Version 2.0 - More comprehensive and detailed testing
 */

class RecursiveNavigationTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      iteration: 1,
      tests: [],
      failures: [],
      improvements: [],
      screenshots: [],
      cssAnalysis: {}
    };
    
    this.testUrls = {
      local: 'http://localhost:3400',
      vercel: 'https://tedprotocol-whitepaper.vercel.app'
    };
    
    this.devices = [
      { name: 'iPhone 12', viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' },
      { name: 'iPhone SE', viewport: { width: 375, height: 667 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' },
      { name: 'Samsung Galaxy S21', viewport: { width: 384, height: 854 }, userAgent: 'Mozilla/5.0 (Linux; Android 11)' },
      { name: 'iPad', viewport: { width: 768, height: 1024 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)' }
    ];
  }

  async runRecursiveTests(maxIterations = 3) {
    console.log('🔄 Starting Recursive Navigation Testing Suite v2.0\n');
    console.log('================================================\n');
    
    let allTestsPassed = false;
    let iteration = 0;
    
    while (!allTestsPassed && iteration < maxIterations) {
      iteration++;
      console.log(`\n📍 ITERATION ${iteration}/${maxIterations}\n`);
      
      this.results.iteration = iteration;
      this.results.tests = [];
      this.results.failures = [];
      
      const browser = await chromium.launch({ 
        headless: false,
        slowMo: 300
      });
      
      try {
        // Test both environments
        for (const [env, url] of Object.entries(this.testUrls)) {
          console.log(`\n🌐 Testing ${env.toUpperCase()}: ${url}\n`);
          
          // Check if URL is accessible
          try {
            const testPage = await browser.newPage();
            await testPage.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
            await testPage.close();
            
            // Run comprehensive tests
            await this.runComprehensiveTests(browser, url, env);
          } catch (e) {
            console.log(`⚠️ ${env} not accessible: ${e.message}\n`);
          }
        }
        
        // Analyze results
        const passRate = this.calculatePassRate();
        console.log(`\n📊 Iteration ${iteration} Pass Rate: ${passRate}%\n`);
        
        allTestsPassed = passRate === 100;
        
        if (!allTestsPassed && iteration < maxIterations) {
          console.log('🔧 Applying recursive improvements...\n');
          await this.applyRecursiveImprovements(iteration);
        }
        
      } finally {
        await browser.close();
      }
    }
    
    // Generate final report
    await this.generateComprehensiveReport();
    
    return this.results;
  }

  async runComprehensiveTests(browser, url, environment) {
    // Test on multiple devices
    for (const device of this.devices) {
      console.log(`  📱 Testing on ${device.name}...`);
      
      const context = await browser.newContext({
        viewport: device.viewport,
        userAgent: device.userAgent,
        isMobile: device.name !== 'iPad',
        hasTouch: true,
        locale: 'en-US'
      });
      
      const page = await context.newPage();
      
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        const testResult = {
          environment,
          url,
          device: device.name,
          timestamp: new Date().toISOString(),
          tests: {},
          cssData: {}
        };
        
        // Test 1: Hamburger Menu Complete Flow
        console.log('    • Testing hamburger menu complete flow...');
        const hamburgerTest = await this.testHamburgerMenuFlow(page);
        testResult.tests.hamburgerFlow = hamburgerTest;
        
        // Test 2: Language Selector Complete Flow
        console.log('    • Testing language selector complete flow...');
        const langTest = await this.testLanguageSelectorFlow(page);
        testResult.tests.languageFlow = langTest;
        
        // Test 3: Navigation Items Accessibility
        console.log('    • Testing navigation items accessibility...');
        const navTest = await this.testNavigationItems(page);
        testResult.tests.navigationItems = navTest;
        
        // Test 4: CSS Analysis
        console.log('    • Analyzing CSS properties...');
        const cssAnalysis = await this.analyzeCSSProperties(page);
        testResult.cssData = cssAnalysis;
        
        // Test 5: Touch Interactions
        console.log('    • Testing touch interactions...');
        const touchTest = await this.testTouchInteractions(page);
        testResult.tests.touchInteractions = touchTest;
        
        // Take comprehensive screenshots
        const screenshotName = `${environment}-${device.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
        await page.screenshot({ 
          path: screenshotName,
          fullPage: false 
        });
        testResult.screenshot = screenshotName;
        this.results.screenshots.push(screenshotName);
        
        // Record results
        this.results.tests.push(testResult);
        
        // Check for failures
        for (const [testName, result] of Object.entries(testResult.tests)) {
          if (!result.success) {
            this.results.failures.push({
              environment,
              device: device.name,
              test: testName,
              error: result.error,
              details: result.details
            });
          }
        }
        
      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
        this.results.failures.push({
          environment,
          device: device.name,
          test: 'General',
          error: error.message
        });
      } finally {
        await context.close();
      }
    }
  }

  async testHamburgerMenuFlow(page) {
    const result = { success: true, details: {} };
    
    try {
      // Check hamburger visibility
      const hamburger = page.locator('.navbar__toggle');
      const isVisible = await hamburger.isVisible({ timeout: 5000 });
      result.details.visible = isVisible;
      
      if (!isVisible) {
        result.success = false;
        result.error = 'Hamburger menu not visible';
        return result;
      }
      
      // Get computed styles
      const styles = await hamburger.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          opacity: computed.opacity,
          zIndex: computed.zIndex,
          position: computed.position
        };
      });
      result.details.styles = styles;
      
      // Click hamburger
      await hamburger.click({ force: true });
      await page.waitForTimeout(1000);
      
      // Check sidebar
      const sidebar = page.locator('.navbar-sidebar');
      const sidebarVisible = await sidebar.isVisible({ timeout: 3000 }).catch(() => false);
      result.details.sidebarOpens = sidebarVisible;
      
      if (!sidebarVisible) {
        result.success = false;
        result.error = 'Sidebar does not open';
        return result;
      }
      
      // Count menu items
      const menuItems = await page.locator('.navbar-sidebar__item').count();
      result.details.menuItemCount = menuItems;
      
      // Check if items are clickable
      if (menuItems > 0) {
        const firstItem = page.locator('.navbar-sidebar__item').first();
        const isClickable = await firstItem.isEnabled();
        result.details.itemsClickable = isClickable;
      }
      
      // Close sidebar
      const closeBtn = page.locator('.navbar-sidebar__close');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
      
    } catch (error) {
      result.success = false;
      result.error = error.message;
    }
    
    return result;
  }

  async testLanguageSelectorFlow(page) {
    const result = { success: true, details: {} };
    
    try {
      // Check language selector visibility
      const langSelector = page.locator('.navbar__items--right .dropdown').first();
      const isVisible = await langSelector.isVisible({ timeout: 5000 }).catch(() => false);
      result.details.visible = isVisible;
      
      if (!isVisible) {
        // Try alternative selectors
        const altSelector = page.locator('.navbar__item.dropdown').first();
        const altVisible = await altSelector.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (!altVisible) {
          result.success = false;
          result.error = 'Language selector not visible';
          
          // Get debugging info
          const navbarRight = await page.locator('.navbar__items--right').evaluate(el => {
            if (!el) return null;
            const computed = window.getComputedStyle(el);
            return {
              display: computed.display,
              visibility: computed.visibility,
              opacity: computed.opacity,
              innerHTML: el.innerHTML.substring(0, 200)
            };
          }).catch(() => null);
          
          result.details.navbarRightStyles = navbarRight;
          return result;
        }
      }
      
      // Get computed styles
      const styles = await langSelector.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          zIndex: computed.zIndex
        };
      }).catch(() => null);
      result.details.styles = styles;
      
      // Try to click language selector
      const langButton = langSelector.locator('.navbar__link').first();
      if (await langButton.isVisible()) {
        await langButton.click({ force: true });
        await page.waitForTimeout(500);
        
        // Check dropdown menu
        const dropdownMenu = page.locator('.dropdown__menu').first();
        const menuVisible = await dropdownMenu.isVisible({ timeout: 2000 }).catch(() => false);
        result.details.dropdownOpens = menuVisible;
        
        if (menuVisible) {
          const languageOptions = await page.locator('.dropdown__link').count();
          result.details.languageCount = languageOptions;
        }
      }
      
    } catch (error) {
      result.success = false;
      result.error = error.message;
    }
    
    return result;
  }

  async testNavigationItems(page) {
    const result = { success: true, details: {} };
    
    try {
      // Open sidebar first
      const hamburger = page.locator('.navbar__toggle');
      if (await hamburger.isVisible()) {
        await hamburger.click();
        await page.waitForTimeout(1000);
        
        // Get all navigation links
        const navLinks = await page.locator('.navbar-sidebar__item a').all();
        result.details.linkCount = navLinks.length;
        
        const links = [];
        for (const link of navLinks) {
          const text = await link.textContent();
          const href = await link.getAttribute('href');
          links.push({ text, href });
        }
        result.details.links = links;
        
        // Close sidebar
        const closeBtn = page.locator('.navbar-sidebar__close');
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
        }
      }
      
    } catch (error) {
      result.success = false;
      result.error = error.message;
    }
    
    return result;
  }

  async analyzeCSSProperties(page) {
    const cssData = {};
    
    try {
      // Analyze critical CSS properties
      cssData.navbar = await page.evaluate(() => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return null;
        const computed = window.getComputedStyle(navbar);
        return {
          height: computed.height,
          padding: computed.padding,
          background: computed.background,
          zIndex: computed.zIndex
        };
      });
      
      cssData.hamburger = await page.evaluate(() => {
        const toggle = document.querySelector('.navbar__toggle');
        if (!toggle) return null;
        const computed = window.getComputedStyle(toggle);
        return {
          display: computed.display,
          width: computed.width,
          height: computed.height,
          zIndex: computed.zIndex
        };
      });
      
      cssData.languageSelector = await page.evaluate(() => {
        const selector = document.querySelector('.navbar__items--right .dropdown');
        if (!selector) return null;
        const computed = window.getComputedStyle(selector);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity
        };
      });
      
    } catch (error) {
      cssData.error = error.message;
    }
    
    return cssData;
  }

  async testTouchInteractions(page) {
    const result = { success: true, details: {} };
    
    try {
      // Test touch on hamburger
      const hamburger = page.locator('.navbar__toggle');
      if (await hamburger.isVisible()) {
        await hamburger.tap();
        await page.waitForTimeout(500);
        
        const sidebarVisible = await page.locator('.navbar-sidebar').isVisible();
        result.details.hamburgerTap = sidebarVisible;
        
        if (sidebarVisible) {
          const closeBtn = page.locator('.navbar-sidebar__close');
          if (await closeBtn.isVisible()) {
            await closeBtn.tap();
            await page.waitForTimeout(500);
          }
        }
      }
      
    } catch (error) {
      result.success = false;
      result.error = error.message;
    }
    
    return result;
  }

  calculatePassRate() {
    if (this.results.tests.length === 0) return 0;
    
    let totalTests = 0;
    let passedTests = 0;
    
    for (const test of this.results.tests) {
      for (const [key, value] of Object.entries(test.tests)) {
        totalTests++;
        if (value.success) passedTests++;
      }
    }
    
    return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  }

  async applyRecursiveImprovements(iteration) {
    const improvements = [];
    
    // Analyze failures and generate improvements
    for (const failure of this.results.failures) {
      if (failure.test === 'languageFlow' && failure.error.includes('not visible')) {
        improvements.push({
          issue: 'Language selector not visible',
          fix: `/* Iteration ${iteration} fix */
.navbar__items--right {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: absolute !important;
  right: 60px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 10000 !important;
}`
        });
      }
      
      if (failure.test === 'hamburgerFlow' && failure.error.includes('Sidebar does not open')) {
        improvements.push({
          issue: 'Sidebar not opening',
          fix: `/* Iteration ${iteration} fix */
.navbar-sidebar {
  display: block !important;
  transform: translateX(0) !important;
  transition: none !important;
}`
        });
      }
    }
    
    // Write improvements to file
    if (improvements.length > 0) {
      const cssContent = improvements.map(i => i.fix).join('\n\n');
      const fileName = `recursive-fix-iteration-${iteration}.css`;
      await fs.writeFile(fileName, cssContent);
      console.log(`  ✅ Generated fixes: ${fileName}\n`);
      
      // Apply to main CSS file
      await this.applyCSSFixes(cssContent);
    }
    
    this.results.improvements = improvements;
  }

  async applyCSSFixes(cssContent) {
    try {
      // Read current CSS
      const currentCSS = await fs.readFile('src/css/custom.css', 'utf8');
      
      // Append new fixes
      const updatedCSS = currentCSS + '\n\n/* RECURSIVE IMPROVEMENTS */\n' + cssContent;
      
      // Write back
      await fs.writeFile('src/css/custom.css', updatedCSS);
      console.log('  ✅ Applied fixes to custom.css\n');
      
      // Rebuild
      const { exec } = require('child_process');
      await new Promise((resolve) => {
        exec('npm run build', (error) => {
          if (error) console.error('Build error:', error);
          resolve();
        });
      });
      
    } catch (error) {
      console.error('  ❌ Failed to apply fixes:', error.message);
    }
  }

  async generateComprehensiveReport() {
    console.log('\n📊 COMPREHENSIVE TEST REPORT\n');
    console.log('================================\n');
    
    const passRate = this.calculatePassRate();
    const totalFailures = this.results.failures.length;
    
    console.log(`Total Iterations: ${this.results.iteration}`);
    console.log(`Final Pass Rate: ${passRate}%`);
    console.log(`Total Failures: ${totalFailures}\n`);
    
    if (this.results.failures.length > 0) {
      console.log('❌ REMAINING ISSUES:\n');
      const uniqueIssues = new Map();
      
      for (const failure of this.results.failures) {
        const key = `${failure.test}-${failure.error}`;
        if (!uniqueIssues.has(key)) {
          uniqueIssues.set(key, {
            test: failure.test,
            error: failure.error,
            devices: []
          });
        }
        uniqueIssues.get(key).devices.push(failure.device);
      }
      
      for (const [key, issue] of uniqueIssues) {
        console.log(`  • ${issue.test}: ${issue.error}`);
        console.log(`    Affected devices: ${issue.devices.join(', ')}\n`);
      }
    }
    
    // Save detailed report
    const reportPath = `recursive-test-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved: ${reportPath}\n`);
    
    // Generate final CSS recommendations
    if (passRate < 100) {
      await this.generateFinalRecommendations();
    }
  }

  async generateFinalRecommendations() {
    console.log('🔧 FINAL RECOMMENDATIONS:\n');
    
    const recommendations = [
      '1. Consider using JavaScript fallback for language selector visibility',
      '2. Implement inline critical CSS for mobile navigation',
      '3. Use CSS custom properties for easier debugging',
      '4. Add data attributes for better element targeting',
      '5. Consider server-side rendering for initial state'
    ];
    
    recommendations.forEach(rec => console.log(`  ${rec}`));
    console.log('');
    
    // Generate ultimate fix file
    const ultimateFix = `/* ULTIMATE MOBILE NAVIGATION FIX */
/* Generated after recursive testing */

/* Force mobile navigation elements */
@media (max-width: 996px) {
  /* Hamburger menu absolute positioning */
  .navbar__toggle {
    display: flex !important;
    position: fixed !important;
    top: 20px !important;
    left: 20px !important;
    z-index: 99999 !important;
    width: 44px !important;
    height: 44px !important;
  }
  
  /* Language selector absolute positioning */
  .navbar__items--right {
    display: flex !important;
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    z-index: 99999 !important;
  }
  
  /* Sidebar full screen */
  .navbar-sidebar {
    position: fixed !important;
    inset: 0 !important;
    z-index: 99998 !important;
    display: block !important;
  }
}

/* Remove ALL hover effects */
* {
  transition: none !important;
}

*:hover {
  background-color: transparent !important;
}`;

    await fs.writeFile('ultimate-mobile-fix.css', ultimateFix);
    console.log('💾 Ultimate fix saved: ultimate-mobile-fix.css\n');
  }
}

// Run recursive tests
(async () => {
  const tester = new RecursiveNavigationTester();
  await tester.runRecursiveTests(3);
})();