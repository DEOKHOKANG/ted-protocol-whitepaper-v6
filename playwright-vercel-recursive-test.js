const { chromium } = require('playwright');
const fs = require('fs').promises;

/**
 * Vercel Production Recursive Validation
 * Focus on new requirements: Box close button + Hidden whitepaper title
 */

class VercelRecursiveTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      iteration: 0,
      tests: [],
      improvements: []
    };
    
    this.vercelUrl = 'https://tedprotocol-whitepaper.vercel.app';
  }

  async runRecursiveTests(maxIterations = 5) {
    console.log('🚀 Vercel Production Recursive Testing\n');
    console.log('🎯 Focus: Box close button + Clean mobile header\n');
    console.log('=' .repeat(60) + '\n');
    
    let allTestsPassed = false;
    
    while (!allTestsPassed && this.results.iteration < maxIterations) {
      this.results.iteration++;
      console.log(`\n📍 ITERATION ${this.results.iteration}/${maxIterations}\n`);
      
      const browser = await chromium.launch({ 
        headless: false,
        slowMo: 300 
      });
      
      try {
        const testResults = await this.runComprehensiveTests(browser);
        this.results.tests.push(testResults);
        
        allTestsPassed = this.analyzeResults(testResults);
        
        if (!allTestsPassed && this.results.iteration < maxIterations) {
          console.log('\n🔧 Applying recursive improvements...\n');
          await this.applyImprovements(testResults);
          await this.rebuild();
          await this.waitForDeployment();
        }
        
      } finally {
        await browser.close();
      }
    }
    
    await this.generateFinalReport();
    return this.results;
  }

  async runComprehensiveTests(browser) {
    const results = {
      iteration: this.results.iteration,
      timestamp: new Date().toISOString(),
      devices: {}
    };
    
    console.log(`🌐 Testing VERCEL: ${this.vercelUrl}\n`);
    
    // Test on multiple mobile devices
    const devices = [
      { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
      { name: 'iPhone SE', viewport: { width: 375, height: 667 } },
      { name: 'Samsung Galaxy S21', viewport: { width: 384, height: 854 } },
      { name: 'iPad Mini', viewport: { width: 768, height: 1024 } }
    ];
    
    for (const device of devices) {
      console.log(`  📱 Testing on ${device.name}...`);
      
      const context = await browser.newContext({
        viewport: device.viewport,
        isMobile: device.name !== 'iPad Mini',
        hasTouch: true,
        userAgent: this.getMobileUserAgent(device.name)
      });
      
      const page = await context.newPage();
      
      try {
        await page.goto(this.vercelUrl, { 
          waitUntil: 'networkidle', 
          timeout: 45000 
        });
        await page.waitForTimeout(3000);
        
        const deviceResults = {};
        
        // Test 1: Whitepaper title hidden on mobile
        console.log('    • Testing whitepaper title visibility...');
        const titleTest = await this.testWhitepaperTitle(page, device);
        deviceResults.whitepaperTitle = titleTest;
        
        // Test 2: Language selector visibility
        console.log('    • Testing language selector...');
        const langTest = await this.testLanguageSelector(page);
        deviceResults.languageSelector = langTest;
        
        // Test 3: Hamburger menu and sidebar
        console.log('    • Testing hamburger menu...');
        const hamburgerTest = await this.testHamburgerMenu(page);
        deviceResults.hamburgerMenu = hamburgerTest;
        
        if (hamburgerTest.sidebarOpened) {
          // Test 4: Close button style (box with CLOSE text)
          console.log('    • Testing close button style...');
          const closeButtonTest = await this.testCloseButton(page);
          deviceResults.closeButton = closeButtonTest;
          
          // Test 5: Menu items accessibility
          console.log('    • Testing menu items...');
          const menuTest = await this.testMenuItems(page);
          deviceResults.menuItems = menuTest;
          
          // Close sidebar for next test
          await this.closeSidebar(page);
        }
        
        // Test 6: Header layout optimization
        console.log('    • Testing header layout...');
        const headerTest = await this.testHeaderLayout(page);
        deviceResults.headerLayout = headerTest;
        
        // Take screenshot
        const screenshotName = `vercel-test-${device.name.replace(/\s+/g, '-')}-iter${this.results.iteration}.png`;
        await page.screenshot({ 
          path: screenshotName,
          fullPage: false 
        });
        deviceResults.screenshot = screenshotName;
        
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

  async testWhitepaperTitle(page, device) {
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
      
      const shouldBeHidden = device.viewport.width < 997;
      const testPassed = shouldBeHidden ? !titleVisible : titleVisible;
      
      return {
        visible: titleVisible,
        text: titleText,
        shouldBeHidden,
        passed: testPassed,
        expected: shouldBeHidden ? 'hidden' : 'visible'
      };
    } catch (error) {
      return { error: error.message, passed: false };
    }
  }

  async testLanguageSelector(page) {
    try {
      const langSelector = page.locator('.navbar__items--right .dropdown').first();
      const isVisible = await langSelector.isVisible({ timeout: 5000 }).catch(() => false);
      
      let styles = null;
      if (isVisible) {
        styles = await langSelector.evaluate(el => {
          const computed = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity,
            zIndex: computed.zIndex,
            position: computed.position,
            right: computed.right,
            top: computed.top,
            width: rect.width,
            height: rect.height
          };
        });
      }
      
      return {
        visible: isVisible,
        styles,
        passed: isVisible
      };
    } catch (error) {
      return { error: error.message, passed: false };
    }
  }

  async testHamburgerMenu(page) {
    try {
      const hamburger = page.locator('.navbar__toggle');
      const hamburgerVisible = await hamburger.isVisible().catch(() => false);
      
      if (!hamburgerVisible) {
        return { visible: false, passed: false };
      }
      
      await hamburger.click();
      await page.waitForTimeout(1500);
      
      const sidebar = page.locator('.navbar-sidebar');
      const sidebarOpened = await sidebar.isVisible().catch(() => false);
      
      return {
        visible: hamburgerVisible,
        sidebarOpened,
        passed: hamburgerVisible && sidebarOpened
      };
    } catch (error) {
      return { error: error.message, passed: false };
    }
  }

  async testCloseButton(page) {
    try {
      const closeBtn = page.locator('.navbar-sidebar__close');
      const isVisible = await closeBtn.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (!isVisible) {
        return { visible: false, passed: false };
      }
      
      const buttonData = await closeBtn.evaluate(el => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        // Check for CLOSE text
        const hasCloseText = el.textContent.includes('CLOSE') || 
                           window.getComputedStyle(el, '::after').content.includes('CLOSE');
        
        return {
          width: rect.width,
          height: rect.height,
          borderRadius: computed.borderRadius,
          background: computed.background,
          textContent: el.textContent,
          hasCloseText: hasCloseText,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight
        };
      });
      
      // Check if it's box style (not circular)
      const isBoxStyle = buttonData.borderRadius !== '50%' && 
                        parseInt(buttonData.borderRadius) < 20;
      
      // Check if it has CLOSE text
      const hasCloseText = buttonData.hasCloseText || 
                          buttonData.textContent.includes('CLOSE');
      
      return {
        visible: isVisible,
        isBoxStyle,
        hasCloseText,
        dimensions: `${buttonData.width.toFixed(0)}x${buttonData.height.toFixed(0)}`,
        borderRadius: buttonData.borderRadius,
        textContent: buttonData.textContent,
        passed: isBoxStyle && hasCloseText
      };
    } catch (error) {
      return { error: error.message, passed: false };
    }
  }

  async testMenuItems(page) {
    try {
      const menuItems = await page.locator('.navbar-sidebar__item, .menu__link').count();
      const menuTexts = [];
      
      const items = await page.locator('.navbar-sidebar__item, .menu__link').all();
      for (const item of items.slice(0, 10)) {
        const text = await item.textContent();
        if (text && text.trim()) {
          menuTexts.push(text.trim());
        }
      }
      
      return {
        count: menuItems,
        texts: menuTexts,
        passed: menuItems >= 5
      };
    } catch (error) {
      return { error: error.message, passed: false };
    }
  }

  async testHeaderLayout(page) {
    try {
      const header = page.locator('.navbar');
      const headerData = await header.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const children = Array.from(el.children);
        
        return {
          width: rect.width,
          height: rect.height,
          childCount: children.length,
          hasOverflow: el.scrollWidth > el.clientWidth
        };
      });
      
      return {
        dimensions: `${headerData.width.toFixed(0)}x${headerData.height.toFixed(0)}`,
        hasOverflow: headerData.hasOverflow,
        passed: !headerData.hasOverflow
      };
    } catch (error) {
      return { error: error.message, passed: false };
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

  getMobileUserAgent(deviceName) {
    const userAgents = {
      'iPhone 12': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      'iPhone SE': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      'Samsung Galaxy S21': 'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
      'iPad Mini': 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)'
    };
    return userAgents[deviceName] || userAgents['iPhone 12'];
  }

  analyzeResults(testResults) {
    let allPassed = true;
    let failureCount = 0;
    
    console.log('\n📊 Test Results Analysis:\n');
    
    for (const [deviceName, deviceData] of Object.entries(testResults.devices)) {
      console.log(`  ${deviceName}:`);
      
      if (deviceData.error) {
        console.log(`    ❌ Device error: ${deviceData.error}`);
        allPassed = false;
        failureCount++;
        continue;
      }
      
      // Check each test
      const tests = [
        { name: 'Whitepaper Title', result: deviceData.whitepaperTitle },
        { name: 'Language Selector', result: deviceData.languageSelector },
        { name: 'Hamburger Menu', result: deviceData.hamburgerMenu },
        { name: 'Close Button', result: deviceData.closeButton },
        { name: 'Menu Items', result: deviceData.menuItems },
        { name: 'Header Layout', result: deviceData.headerLayout }
      ];
      
      for (const test of tests) {
        if (test.result) {
          const status = test.result.passed ? '✅' : '❌';
          console.log(`    ${status} ${test.name}`);
          if (!test.result.passed) {
            allPassed = false;
            failureCount++;
          }
        }
      }
    }
    
    console.log(`\n📈 Total Failures: ${failureCount}`);
    return allPassed;
  }

  async applyImprovements(testResults) {
    const improvements = [];
    
    for (const [deviceName, deviceData] of Object.entries(testResults.devices)) {
      if (deviceData.error) continue;
      
      // Fix whitepaper title visibility
      if (deviceData.whitepaperTitle && !deviceData.whitepaperTitle.passed) {
        improvements.push(`
/* Fix: Force hide whitepaper title on mobile */
@media (max-width: 996px) {
  .navbar__title,
  .navbar__brand {
    display: none !important;
    position: absolute !important;
    left: -9999px !important;
  }
}`);
      }
      
      // Fix close button style
      if (deviceData.closeButton && !deviceData.closeButton.passed) {
        improvements.push(`
/* Fix: Ensure box-style close button with CLOSE text */
@media (max-width: 996px) {
  .navbar-sidebar__close {
    width: auto !important;
    min-width: 80px !important;
    height: 36px !important;
    border-radius: 6px !important;
    background: var(--ted-royal-purple) !important;
    color: white !important;
    font-weight: 600 !important;
  }
  
  .navbar-sidebar__close::after {
    content: "CLOSE" !important;
  }
  
  .navbar-sidebar__close svg {
    display: none !important;
  }
}`);
      }
      
      // Fix language selector
      if (deviceData.languageSelector && !deviceData.languageSelector.passed) {
        improvements.push(`
/* Fix: Force language selector visibility */
@media (max-width: 996px) {
  .navbar__items--right {
    position: fixed !important;
    right: 10px !important;
    top: 20px !important;
    z-index: 999999 !important;
    display: flex !important;
  }
}`);
      }
    }
    
    if (improvements.length > 0) {
      const cssPath = 'src/css/custom.css';
      const currentCSS = await fs.readFile(cssPath, 'utf8');
      const newCSS = currentCSS + '\n\n/* VERCEL RECURSIVE IMPROVEMENTS - Iteration ' + 
                    this.results.iteration + ' */\n' + improvements.join('\n');
      
      await fs.writeFile(cssPath, newCSS);
      console.log(`  ✅ Applied ${improvements.length} improvements\n`);
      
      this.results.improvements.push(...improvements);
    }
  }

  async rebuild() {
    console.log('  🔨 Rebuilding project...\n');
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    try {
      await execPromise('npm run build');
      console.log('  ✅ Build completed\n');
      
      // Commit and push
      const commitMsg = `🔄 Vercel recursive fix - Iteration ${this.results.iteration}`;
      await execPromise(`git add src/css/custom.css && git commit -m "${commitMsg}" && git push`);
      console.log('  ✅ Deployed to Vercel\n');
      
    } catch (error) {
      console.error('  ⚠️ Build/Deploy error:', error.message);
    }
  }

  async waitForDeployment() {
    console.log('  ⏳ Waiting 45 seconds for Vercel deployment...\n');
    await new Promise(resolve => setTimeout(resolve, 45000));
  }

  async generateFinalReport() {
    console.log('\n' + '=' .repeat(60));
    console.log('\n📊 FINAL VERCEL VALIDATION REPORT\n');
    console.log('=' .repeat(60) + '\n');
    
    console.log(`Total Iterations: ${this.results.iteration}`);
    console.log(`Total Improvements: ${this.results.improvements.length}\n`);
    
    if (this.results.tests.length > 0) {
      const lastTest = this.results.tests[this.results.tests.length - 1];
      
      console.log('🎯 Final Results Summary:\n');
      for (const [device, data] of Object.entries(lastTest.devices)) {
        if (!data.error) {
          console.log(`  ${device}:`);
          console.log(`    • Whitepaper Title: ${data.whitepaperTitle?.passed ? '✅' : '❌'} (${data.whitepaperTitle?.expected})`);
          console.log(`    • Language Selector: ${data.languageSelector?.passed ? '✅' : '❌'}`);
          console.log(`    • Close Button: ${data.closeButton?.passed ? '✅ Box style' : '❌'}`);
          console.log(`    • Menu Items: ${data.menuItems?.count || 0} items\n`);
        }
      }
    }
    
    // Save report
    const reportPath = `vercel-recursive-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved: ${reportPath}\n`);
  }
}

// Run Vercel recursive tests
(async () => {
  const tester = new VercelRecursiveTester();
  await tester.runRecursiveTests(5);
})();