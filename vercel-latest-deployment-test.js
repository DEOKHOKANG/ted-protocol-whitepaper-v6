const { chromium } = require('playwright');
const fs = require('fs').promises;

/**
 * Latest Vercel Deployment Recursive Testing
 * URL: https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/
 * Focus: All mobile UX requirements with recursive improvements
 */

class LatestVercelRecursiveTester {
  constructor() {
    this.deploymentUrl = 'https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/';
    this.results = {
      timestamp: new Date().toISOString(),
      iteration: 0,
      tests: [],
      improvements: []
    };
  }

  async runRecursiveTests(maxIterations = 5) {
    console.log('🚀 LATEST VERCEL DEPLOYMENT RECURSIVE TESTING\n');
    console.log(`🌐 Testing: ${this.deploymentUrl}\n`);
    console.log('🎯 All mobile UX requirements with recursive improvements\n');
    console.log('=' .repeat(70) + '\n');
    
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
    
    console.log(`🌐 Testing LATEST DEPLOYMENT: ${this.deploymentUrl}\n`);
    
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
        await page.goto(this.deploymentUrl, { 
          waitUntil: 'networkidle', 
          timeout: 45000 
        });
        await page.waitForTimeout(3000);
        
        const deviceResults = {};
        
        // Test 1: Hamburger menu functionality
        console.log('    • Testing hamburger menu...');
        const hamburgerTest = await this.testHamburgerMenu(page);
        deviceResults.hamburgerMenu = hamburgerTest;
        
        if (hamburgerTest.sidebarOpened) {
          // Test 2: Sidebar width optimization (85%, max 320px)
          console.log('    • Testing sidebar width...');
          const sidebarTest = await this.testSidebarWidth(page);
          deviceResults.sidebarWidth = sidebarTest;
          
          // Test 3: Close button style (box with CLOSE text)
          console.log('    • Testing close button...');
          const closeButtonTest = await this.testCloseButton(page);
          deviceResults.closeButton = closeButtonTest;
          
          // Test 4: Menu items visibility and accessibility
          console.log('    • Testing menu items...');
          const menuTest = await this.testMenuItems(page);
          deviceResults.menuItems = menuTest;
          
          // Close sidebar for next tests
          await this.closeSidebar(page);
        }
        
        // Test 5: Whitepaper title hidden on mobile
        console.log('    • Testing whitepaper title visibility...');
        const titleTest = await this.testWhitepaperTitle(page, device);
        deviceResults.whitepaperTitle = titleTest;
        
        // Test 6: Language selector visibility
        console.log('    • Testing language selector...');
        const langTest = await this.testLanguageSelector(page);
        deviceResults.languageSelector = langTest;
        
        // Test 7: GitHub icon hidden on mobile
        console.log('    • Testing GitHub icon visibility...');
        const githubTest = await this.testGitHubIcon(page);
        deviceResults.githubIcon = githubTest;
        
        // Test 8: Header layout optimization
        console.log('    • Testing header layout...');
        const headerTest = await this.testHeaderLayout(page);
        deviceResults.headerLayout = headerTest;
        
        // Take screenshot
        const screenshotName = `latest-vercel-${device.name.replace(/\s+/g, '-')}-iter${this.results.iteration}.png`;
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

  async testHamburgerMenu(page) {
    try {
      const hamburger = page.locator('.navbar__toggle');
      const hamburgerVisible = await hamburger.isVisible().catch(() => false);
      
      if (!hamburgerVisible) {
        return { visible: false, passed: false, sidebarOpened: false };
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
      return { error: error.message, passed: false, sidebarOpened: false };
    }
  }

  async testSidebarWidth(page) {
    try {
      const sidebar = page.locator('.navbar-sidebar');
      const sidebarData = await sidebar.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        const viewportWidth = window.innerWidth;
        const widthRatio = rect.width / viewportWidth;
        
        return {
          width: rect.width,
          viewportWidth,
          widthRatio,
          percentage: (widthRatio * 100).toFixed(1),
          maxWidth: computed.maxWidth,
          computedWidth: computed.width
        };
      });
      
      // Target: 85% width and max 320px
      const isOptimized = sidebarData.widthRatio >= 0.75 && 
                         sidebarData.widthRatio <= 0.9 && 
                         sidebarData.width <= 340; // Allow small tolerance
      
      return {
        passed: isOptimized,
        widthRatio: sidebarData.widthRatio,
        percentage: sidebarData.percentage,
        actualWidth: Math.round(sidebarData.width),
        maxWidth: sidebarData.maxWidth,
        target: '85% width, max 320px'
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
        
        // Check for CLOSE text via pseudo-element
        const afterContent = window.getComputedStyle(el, '::after').content;
        const hasCloseText = afterContent.includes('CLOSE') || 
                           el.textContent.includes('CLOSE') ||
                           el.innerHTML.includes('CLOSE');
        
        return {
          width: rect.width,
          height: rect.height,
          borderRadius: computed.borderRadius,
          background: computed.backgroundColor,
          textContent: el.textContent,
          innerHTML: el.innerHTML,
          afterContent: afterContent,
          hasCloseText: hasCloseText,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight
        };
      });
      
      // Check if it's box style (not 50% border-radius)
      const isBoxStyle = !buttonData.borderRadius.includes('50%') && 
                        parseInt(buttonData.borderRadius) <= 20;
      
      const hasCloseText = buttonData.hasCloseText || 
                          buttonData.afterContent.includes('CLOSE');
      
      const isCorrectSize = buttonData.width >= 70 && buttonData.height >= 30;
      
      return {
        visible: isVisible,
        isBoxStyle,
        hasCloseText,
        isCorrectSize,
        dimensions: `${Math.round(buttonData.width)}x${Math.round(buttonData.height)}`,
        borderRadius: buttonData.borderRadius,
        textContent: buttonData.textContent,
        afterContent: buttonData.afterContent,
        passed: isBoxStyle && hasCloseText && isCorrectSize
      };
    } catch (error) {
      return { error: error.message, passed: false };
    }
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
      
      // Should be hidden on mobile (width < 997px)
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
      
      let selectorData = null;
      if (isVisible) {
        selectorData = await langSelector.evaluate(el => {
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
            height: rect.height,
            x: rect.x,
            y: rect.y
          };
        });
      }
      
      return {
        visible: isVisible,
        selectorData,
        passed: isVisible
      };
    } catch (error) {
      return { error: error.message, passed: false };
    }
  }

  async testGitHubIcon(page) {
    try {
      const githubSelectors = [
        '.navbar__item[href*="github"]',
        '.navbar__link[href*="github"]',
        '.header-github-link',
        '[class*="github" i]'
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
        expected: 'hidden on mobile'
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
      for (const item of items.slice(0, 15)) {
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
        return {
          width: rect.width,
          height: rect.height,
          hasOverflow: el.scrollWidth > el.clientWidth
        };
      });
      
      return {
        dimensions: `${Math.round(headerData.width)}x${Math.round(headerData.height)}`,
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
        { name: 'Hamburger Menu', result: deviceData.hamburgerMenu },
        { name: 'Sidebar Width', result: deviceData.sidebarWidth },
        { name: 'Close Button', result: deviceData.closeButton },
        { name: 'Menu Items', result: deviceData.menuItems },
        { name: 'Whitepaper Title', result: deviceData.whitepaperTitle },
        { name: 'Language Selector', result: deviceData.languageSelector },
        { name: 'GitHub Icon', result: deviceData.githubIcon },
        { name: 'Header Layout', result: deviceData.headerLayout }
      ];
      
      for (const test of tests) {
        if (test.result) {
          const status = test.result.passed ? '✅' : '❌';
          console.log(`    ${status} ${test.name}`);
          if (!test.result.passed) {
            allPassed = false;
            failureCount++;
            
            // Log specific details for failed tests
            if (test.name === 'Close Button' && test.result.dimensions) {
              console.log(`      Details: ${test.result.dimensions}, border-radius: ${test.result.borderRadius}`);
            }
            if (test.name === 'Sidebar Width' && test.result.percentage) {
              console.log(`      Details: ${test.result.percentage}% (${test.result.actualWidth}px)`);
            }
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
/* Fix: Force hide whitepaper title on mobile - LATEST DEPLOYMENT */
@media (max-width: 996px) {
  .navbar__title,
  .navbar__brand .navbar__title,
  .navbar__brand-text {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    position: absolute !important;
    left: -9999px !important;
    width: 0 !important;
    height: 0 !important;
  }
}`);
      }
      
      // Fix close button style
      if (deviceData.closeButton && !deviceData.closeButton.passed) {
        improvements.push(`
/* Fix: Ensure box-style close button with CLOSE text - LATEST DEPLOYMENT */
@media (max-width: 996px) {
  .navbar-sidebar__close {
    width: auto !important;
    min-width: 80px !important;
    height: 36px !important;
    border-radius: 6px !important;
    background: var(--ted-royal-purple) !important;
    color: white !important;
    font-weight: 600 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 14px !important;
    text-transform: uppercase !important;
  }
  
  .navbar-sidebar__close::after {
    content: "CLOSE" !important;
    display: block !important;
  }
  
  .navbar-sidebar__close svg,
  .navbar-sidebar__close span {
    display: none !important;
  }
}`);
      }
      
      // Fix sidebar width
      if (deviceData.sidebarWidth && !deviceData.sidebarWidth.passed) {
        improvements.push(`
/* Fix: Optimize sidebar width - LATEST DEPLOYMENT */
@media (max-width: 996px) {
  .navbar-sidebar {
    width: 85% !important;
    max-width: 320px !important;
    min-width: 280px !important;
  }
}`);
      }
      
      // Fix language selector
      if (deviceData.languageSelector && !deviceData.languageSelector.passed) {
        improvements.push(`
/* Fix: Force language selector visibility - LATEST DEPLOYMENT */
@media (max-width: 996px) {
  .navbar__items--right {
    position: fixed !important;
    right: 10px !important;
    top: 15px !important;
    z-index: 999999 !important;
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .navbar__items--right .dropdown {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
}`);
      }
    }
    
    if (improvements.length > 0) {
      const cssPath = 'src/css/custom.css';
      const currentCSS = await fs.readFile(cssPath, 'utf8');
      const newCSS = currentCSS + '\n\n/* LATEST DEPLOYMENT RECURSIVE IMPROVEMENTS - Iteration ' + 
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
      const commitMsg = `🔄 Latest deployment recursive fix - Iteration ${this.results.iteration}`;
      await execPromise(`git add src/css/custom.css && git commit -m "${commitMsg}" && git push`);
      console.log('  ✅ Deployed to production\n');
      
    } catch (error) {
      console.error('  ⚠️ Build/Deploy error:', error.message);
    }
  }

  async waitForDeployment() {
    console.log('  ⏳ Waiting 45 seconds for deployment...\n');
    await new Promise(resolve => setTimeout(resolve, 45000));
  }

  async generateFinalReport() {
    console.log('\n' + '=' .repeat(70));
    console.log('\n📊 LATEST DEPLOYMENT FINAL REPORT\n');
    console.log('=' .repeat(70) + '\n');
    
    console.log(`Deployment URL: ${this.deploymentUrl}`);
    console.log(`Total Iterations: ${this.results.iteration}`);
    console.log(`Total Improvements: ${this.results.improvements.length}\n`);
    
    if (this.results.tests.length > 0) {
      const lastTest = this.results.tests[this.results.tests.length - 1];
      
      console.log('🎯 Final Results Summary:\n');
      for (const [device, data] of Object.entries(lastTest.devices)) {
        if (!data.error) {
          console.log(`  ${device}:`);
          console.log(`    • Hamburger Menu: ${data.hamburgerMenu?.passed ? '✅' : '❌'}`);
          console.log(`    • Sidebar Width: ${data.sidebarWidth?.passed ? '✅' : '❌'} ${data.sidebarWidth?.percentage || ''}%`);
          console.log(`    • Close Button: ${data.closeButton?.passed ? '✅ Box style' : '❌'} ${data.closeButton?.dimensions || ''}`);
          console.log(`    • Title Hidden: ${data.whitepaperTitle?.passed ? '✅' : '❌'} ${data.whitepaperTitle?.expected || ''}`);
          console.log(`    • Language Selector: ${data.languageSelector?.passed ? '✅' : '❌'}`);
          console.log(`    • GitHub Hidden: ${data.githubIcon?.passed ? '✅' : '❌'}`);
          console.log(`    • Menu Items: ${data.menuItems?.count || 0} items\n`);
        }
      }
    }
    
    // Save detailed report
    const reportPath = `latest-deployment-recursive-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved: ${reportPath}\n`);
  }
}

// Run Latest Deployment recursive tests
(async () => {
  const tester = new LatestVercelRecursiveTester();
  await tester.runRecursiveTests(5);
})();