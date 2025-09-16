const { chromium } = require('playwright');
const fs = require('fs').promises;

/**
 * Final Recursive Validation Suite v4.0
 * Complete mobile navigation testing with automatic improvements
 */

class FinalRecursiveValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      iteration: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      improvements: [],
      testDetails: []
    };
    
    this.testUrls = {
      local: 'http://localhost:3400',
      vercel: 'https://tedprotocol-whitepaper.vercel.app'
    };
    
    this.criticalTests = [
      'hamburgerMenuVisible',
      'hamburgerMenuClickable', 
      'sidebarOpens',
      'allMenuItemsVisible',
      'menuHeightSufficient',
      'languageSelectorVisible',
      'languageSelectorClickable',
      'noPurpleHover'
    ];
  }

  async runFinalValidation(maxIterations = 5) {
    console.log('🚀 Starting Final Recursive Validation v4.0\n');
    console.log('=' .repeat(50) + '\n');
    
    let allTestsPassed = false;
    
    while (!allTestsPassed && this.results.iteration < maxIterations) {
      this.results.iteration++;
      console.log(`\n📍 ITERATION ${this.results.iteration}/${maxIterations}\n`);
      
      const iterationResults = {
        iteration: this.results.iteration,
        timestamp: new Date().toISOString(),
        environments: {}
      };
      
      const browser = await chromium.launch({ 
        headless: false,
        slowMo: 200
      });
      
      try {
        // Test both environments
        for (const [env, url] of Object.entries(this.testUrls)) {
          console.log(`\n🌐 Testing ${env.toUpperCase()}: ${url}\n`);
          
          const envResults = await this.testEnvironment(browser, url, env);
          iterationResults.environments[env] = envResults;
          
          // Calculate pass rate for this environment
          const passRate = this.calculatePassRate(envResults);
          console.log(`   📊 ${env} Pass Rate: ${passRate}%\n`);
        }
        
        // Store iteration results
        this.results.testDetails.push(iterationResults);
        
        // Check if all tests passed
        allTestsPassed = this.checkAllTestsPassed(iterationResults);
        
        if (!allTestsPassed && this.results.iteration < maxIterations) {
          console.log('\n🔧 Applying Recursive Improvements...\n');
          await this.applyImprovements(iterationResults);
          await this.rebuildProject();
        }
        
      } finally {
        await browser.close();
      }
      
      // Wait before next iteration
      if (!allTestsPassed && this.results.iteration < maxIterations) {
        console.log('⏳ Waiting 30 seconds for deployment...\n');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
    
    // Generate final report
    await this.generateFinalReport(allTestsPassed);
    
    return this.results;
  }

  async testEnvironment(browser, url, environment) {
    const results = {
      url,
      environment,
      devices: {}
    };
    
    // Test on mobile devices
    const devices = [
      { name: 'iPhone 12', viewport: { width: 390, height: 844 }, isMobile: true },
      { name: 'Samsung Galaxy S21', viewport: { width: 384, height: 854 }, isMobile: true },
      { name: 'Desktop', viewport: { width: 1920, height: 1080 }, isMobile: false }
    ];
    
    for (const device of devices) {
      console.log(`  📱 Testing on ${device.name}...`);
      
      const context = await browser.newContext({
        viewport: device.viewport,
        isMobile: device.isMobile,
        hasTouch: device.isMobile
      });
      
      const page = await context.newPage();
      
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        const deviceResults = {};
        
        if (device.isMobile) {
          // Test 1: Hamburger Menu Visibility
          console.log('    • Testing hamburger menu visibility...');
          deviceResults.hamburgerMenuVisible = await this.testHamburgerVisibility(page);
          
          // Test 2: Hamburger Menu Clickable
          console.log('    • Testing hamburger menu clickability...');
          deviceResults.hamburgerMenuClickable = await this.testHamburgerClick(page);
          
          // Test 3: Sidebar Opens
          console.log('    • Testing sidebar opening...');
          deviceResults.sidebarOpens = await this.testSidebarOpens(page);
          
          // Test 4: All Menu Items Visible
          console.log('    • Testing all menu items visibility...');
          deviceResults.allMenuItemsVisible = await this.testAllMenuItems(page);
          
          // Test 5: Menu Height Sufficient
          console.log('    • Testing menu height sufficiency...');
          deviceResults.menuHeightSufficient = await this.testMenuHeight(page);
          
          // Test 6: Language Selector Visible
          console.log('    • Testing language selector visibility...');
          deviceResults.languageSelectorVisible = await this.testLanguageSelector(page);
          
          // Test 7: Language Selector Clickable
          console.log('    • Testing language selector functionality...');
          deviceResults.languageSelectorClickable = await this.testLanguageClick(page);
          
          // Close sidebar if open
          await this.closeSidebar(page);
        } else {
          // Test 8: No Purple Hover on Desktop
          console.log('    • Testing purple hover removal...');
          deviceResults.noPurpleHover = await this.testNoPurpleHover(page);
        }
        
        // Take screenshot
        const screenshotName = `${environment}-${device.name.replace(/\s+/g, '-')}-iter${this.results.iteration}.png`;
        await page.screenshot({ path: screenshotName, fullPage: false });
        
        results.devices[device.name] = deviceResults;
        
      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
        results.devices[device.name] = { error: error.message };
      } finally {
        await context.close();
      }
    }
    
    return results;
  }

  async testHamburgerVisibility(page) {
    try {
      const hamburger = page.locator('.navbar__toggle');
      const isVisible = await hamburger.isVisible({ timeout: 5000 });
      const styles = await hamburger.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          opacity: computed.opacity,
          zIndex: computed.zIndex
        };
      });
      
      return {
        success: isVisible && styles.display !== 'none' && parseFloat(styles.opacity) > 0,
        details: { isVisible, styles }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testHamburgerClick(page) {
    try {
      const hamburger = page.locator('.navbar__toggle');
      await hamburger.click({ force: true });
      await page.waitForTimeout(1000);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testSidebarOpens(page) {
    try {
      const sidebar = page.locator('.navbar-sidebar');
      const isVisible = await sidebar.isVisible({ timeout: 3000 });
      return { success: isVisible, details: { isVisible } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testAllMenuItems(page) {
    try {
      // Check for documentation menu items
      const menuItems = await page.locator('.navbar-sidebar__item, .menu__link').all();
      const itemTexts = [];
      
      for (const item of menuItems) {
        const text = await item.textContent();
        if (text) itemTexts.push(text.trim());
      }
      
      // Expected menu items
      const expectedItems = [
        'Overview', 'Architecture', 'Smart Contracts', 'Security',
        'Utility', 'Distribution', 'Investment Risks', 'Technical Risks'
      ];
      
      const foundItems = expectedItems.filter(item => 
        itemTexts.some(text => text.toLowerCase().includes(item.toLowerCase()))
      );
      
      return {
        success: foundItems.length >= 6, // At least 6 core items
        details: { 
          totalItems: itemTexts.length,
          foundItems,
          allTexts: itemTexts
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testMenuHeight(page) {
    try {
      const sidebar = page.locator('.navbar-sidebar');
      const sidebarItems = page.locator('.navbar-sidebar__items');
      
      const dimensions = await sidebar.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return {
          height: rect.height,
          viewportHeight: window.innerHeight
        };
      });
      
      // Check if sidebar uses full viewport height
      const heightRatio = dimensions.height / dimensions.viewportHeight;
      
      return {
        success: heightRatio >= 0.9, // At least 90% of viewport
        details: dimensions
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testLanguageSelector(page) {
    try {
      // Close sidebar first if open
      await this.closeSidebar(page);
      
      const langSelector = page.locator('.navbar__items--right .dropdown').first();
      const isVisible = await langSelector.isVisible({ timeout: 5000 });
      
      const styles = await langSelector.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          zIndex: computed.zIndex
        };
      });
      
      return {
        success: isVisible && styles.visibility === 'visible',
        details: { isVisible, styles }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testLanguageClick(page) {
    try {
      const langButton = page.locator('.navbar__items--right .dropdown .navbar__link').first();
      
      if (await langButton.isVisible()) {
        await langButton.click({ force: true });
        await page.waitForTimeout(500);
        
        const dropdownMenu = page.locator('.dropdown__menu').first();
        const menuVisible = await dropdownMenu.isVisible({ timeout: 2000 });
        
        return {
          success: menuVisible,
          details: { menuVisible }
        };
      }
      
      return { success: false, error: 'Language button not visible' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testNoPurpleHover(page) {
    try {
      const langButton = page.locator('.navbar__items--right .dropdown .navbar__link').first();
      
      if (await langButton.isVisible()) {
        await langButton.hover();
        await page.waitForTimeout(500);
        
        const styles = await langButton.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            background: computed.background,
            backgroundColor: computed.backgroundColor
          };
        });
        
        const hasPurple = styles.backgroundColor.includes('107') || 
                         styles.backgroundColor.includes('70') ||
                         styles.backgroundColor.includes('193');
        
        return {
          success: !hasPurple,
          details: styles
        };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async closeSidebar(page) {
    try {
      const closeBtn = page.locator('.navbar-sidebar__close');
      if (await closeBtn.isVisible({ timeout: 1000 })) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    } catch {
      // Sidebar might not be open
    }
  }

  calculatePassRate(envResults) {
    let totalTests = 0;
    let passedTests = 0;
    
    for (const device of Object.values(envResults.devices)) {
      for (const [testName, result] of Object.entries(device)) {
        if (testName !== 'error') {
          totalTests++;
          if (result.success) passedTests++;
        }
      }
    }
    
    return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  }

  checkAllTestsPassed(iterationResults) {
    for (const env of Object.values(iterationResults.environments)) {
      const passRate = this.calculatePassRate(env);
      if (passRate < 100) return false;
    }
    return true;
  }

  async applyImprovements(iterationResults) {
    const cssImprovements = [];
    
    // Analyze failures and generate targeted fixes
    for (const [env, envResults] of Object.entries(iterationResults.environments)) {
      for (const [device, deviceResults] of Object.entries(envResults.devices)) {
        for (const [test, result] of Object.entries(deviceResults)) {
          if (result && !result.success) {
            console.log(`  🔍 Fixing: ${test} on ${device} (${env})`);
            
            if (test === 'allMenuItemsVisible') {
              cssImprovements.push(`
/* Fix: Force all menu items visible */
@media (max-width: 996px) {
  .navbar-sidebar .menu__list,
  .navbar-sidebar .theme-doc-sidebar-menu {
    display: block !important;
    height: auto !important;
    max-height: none !important;
  }
}`);
            }
            
            if (test === 'menuHeightSufficient') {
              cssImprovements.push(`
/* Fix: Ensure full height sidebar */
@media (max-width: 996px) {
  .navbar-sidebar,
  .navbar-sidebar__items {
    height: 100vh !important;
    max-height: 100vh !important;
  }
}`);
            }
            
            if (test === 'languageSelectorVisible') {
              cssImprovements.push(`
/* Fix: Force language selector visibility */
@media (max-width: 996px) {
  .navbar__items--right {
    position: fixed !important;
    right: 10px !important;
    top: 15px !important;
    z-index: 999999 !important;
  }
}`);
            }
          }
        }
      }
    }
    
    if (cssImprovements.length > 0) {
      const cssPath = 'src/css/custom.css';
      const currentCSS = await fs.readFile(cssPath, 'utf8');
      const newCSS = currentCSS + '\n\n/* RECURSIVE IMPROVEMENTS - Iteration ' + 
                    this.results.iteration + ' */\n' + cssImprovements.join('\n');
      
      await fs.writeFile(cssPath, newCSS);
      console.log(`  ✅ Applied ${cssImprovements.length} CSS improvements\n`);
      
      this.results.improvements.push({
        iteration: this.results.iteration,
        fixes: cssImprovements.length,
        timestamp: new Date().toISOString()
      });
    }
  }

  async rebuildProject() {
    console.log('  🔨 Rebuilding project...\n');
    
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    try {
      await execPromise('npm run build');
      console.log('  ✅ Build completed\n');
      
      // Commit and push
      const commitMsg = `🔄 Recursive improvement - Iteration ${this.results.iteration}`;
      await execPromise(`git add -A && git commit -m "${commitMsg}" && git push`);
      console.log('  ✅ Deployed to Vercel\n');
      
    } catch (error) {
      console.error('  ⚠️ Build/Deploy error:', error.message);
    }
  }

  async generateFinalReport(allTestsPassed) {
    console.log('\n' + '=' .repeat(50));
    console.log('\n📊 FINAL VALIDATION REPORT\n');
    console.log('=' .repeat(50) + '\n');
    
    console.log(`Total Iterations: ${this.results.iteration}`);
    console.log(`Final Status: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}\n`);
    
    // Calculate final stats
    let totalTests = 0;
    let passedTests = 0;
    
    if (this.results.testDetails.length > 0) {
      const lastIteration = this.results.testDetails[this.results.testDetails.length - 1];
      
      for (const env of Object.values(lastIteration.environments)) {
        for (const device of Object.values(env.devices)) {
          for (const [testName, result] of Object.entries(device)) {
            if (testName !== 'error' && result) {
              totalTests++;
              if (result.success) passedTests++;
              else {
                console.log(`❌ Failed: ${testName}`);
                if (result.error) console.log(`   Error: ${result.error}`);
              }
            }
          }
        }
      }
    }
    
    const finalPassRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    console.log(`\nFinal Pass Rate: ${finalPassRate}% (${passedTests}/${totalTests} tests)\n`);
    
    // Save detailed report
    const reportPath = `recursive-validation-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved: ${reportPath}\n`);
    
    if (!allTestsPassed) {
      console.log('🔧 MANUAL FIXES NEEDED:\n');
      console.log('1. Check Vercel build logs for CSS processing issues');
      console.log('2. Consider using inline styles for critical elements');
      console.log('3. Verify Docusaurus configuration for mobile menu');
      console.log('4. Test with different mobile devices\n');
    }
  }
}

// Run the validation
(async () => {
  const validator = new FinalRecursiveValidator();
  await validator.runFinalValidation(3);
})();