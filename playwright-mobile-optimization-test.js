const { chromium } = require('playwright');
const fs = require('fs').promises;

/**
 * Mobile Sidebar Optimization Test
 * Tests sidebar width, close button shape, and overall UX
 */

class MobileSidebarOptimizationTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      iteration: 0,
      tests: [],
      improvements: []
    };
  }

  async runRecursiveTests(maxIterations = 3) {
    console.log('🔍 Mobile Sidebar Optimization Testing\n');
    console.log('=' .repeat(50) + '\n');
    
    let allTestsPassed = false;
    
    while (!allTestsPassed && this.results.iteration < maxIterations) {
      this.results.iteration++;
      console.log(`\n📍 ITERATION ${this.results.iteration}/${maxIterations}\n`);
      
      const browser = await chromium.launch({ 
        headless: false,
        slowMo: 300 
      });
      
      try {
        const testResults = await this.runTests(browser);
        this.results.tests.push(testResults);
        
        allTestsPassed = this.analyzeResults(testResults);
        
        if (!allTestsPassed && this.results.iteration < maxIterations) {
          console.log('\n🔧 Applying recursive improvements...\n');
          await this.applyImprovements(testResults);
          await this.rebuild();
        }
        
      } finally {
        await browser.close();
      }
    }
    
    await this.generateReport();
    return this.results;
  }

  async runTests(browser) {
    const results = {
      iteration: this.results.iteration,
      environments: {}
    };
    
    const urls = {
      local: 'http://localhost:3400',
      vercel: 'https://tedprotocol-whitepaper.vercel.app'
    };
    
    for (const [env, url] of Object.entries(urls)) {
      console.log(`\n🌐 Testing ${env.toUpperCase()}: ${url}\n`);
      
      results.environments[env] = {
        url,
        devices: {}
      };
      
      // Test on mobile devices
      const devices = [
        { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
        { name: 'iPhone SE', viewport: { width: 375, height: 667 } },
        { name: 'Samsung Galaxy S21', viewport: { width: 384, height: 854 } }
      ];
      
      for (const device of devices) {
        console.log(`  📱 Testing on ${device.name}...`);
        
        const context = await browser.newContext({
          viewport: device.viewport,
          isMobile: true,
          hasTouch: true
        });
        
        const page = await context.newPage();
        
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(2000);
          
          const deviceResults = {};
          
          // Test 1: Hamburger menu clickable
          console.log('    • Testing hamburger menu...');
          const hamburger = page.locator('.navbar__toggle');
          const hamburgerVisible = await hamburger.isVisible().catch(() => false);
          deviceResults.hamburgerVisible = hamburgerVisible;
          
          if (hamburgerVisible) {
            await hamburger.click();
            await page.waitForTimeout(1000);
            
            // Test 2: Sidebar width optimization
            console.log('    • Testing sidebar width...');
            const sidebar = page.locator('.navbar-sidebar');
            const sidebarDimensions = await sidebar.evaluate(el => {
              const rect = el.getBoundingClientRect();
              const computed = window.getComputedStyle(el);
              return {
                width: rect.width,
                viewportWidth: window.innerWidth,
                widthRatio: rect.width / window.innerWidth,
                maxWidth: computed.maxWidth,
                transform: computed.transform
              };
            }).catch(() => null);
            
            deviceResults.sidebarWidth = sidebarDimensions;
            
            // Check if width is optimized (not full screen)
            if (sidebarDimensions) {
              const isOptimized = sidebarDimensions.widthRatio < 0.9 && 
                                 sidebarDimensions.widthRatio > 0.6;
              deviceResults.sidebarWidthOptimized = isOptimized;
              console.log(`      Width ratio: ${(sidebarDimensions.widthRatio * 100).toFixed(1)}% ${isOptimized ? '✅' : '❌'}`);
            }
            
            // Test 3: Close button shape
            console.log('    • Testing close button shape...');
            const closeBtn = page.locator('.navbar-sidebar__close');
            const closeBtnDimensions = await closeBtn.evaluate(el => {
              const rect = el.getBoundingClientRect();
              const computed = window.getComputedStyle(el);
              return {
                width: rect.width,
                height: rect.height,
                isSquare: Math.abs(rect.width - rect.height) < 2,
                borderRadius: computed.borderRadius,
                background: computed.background
              };
            }).catch(() => null);
            
            deviceResults.closeButton = closeBtnDimensions;
            
            if (closeBtnDimensions) {
              const isCircular = closeBtnDimensions.isSquare && 
                                closeBtnDimensions.borderRadius === '50%';
              deviceResults.closeButtonCircular = isCircular;
              console.log(`      Button shape: ${closeBtnDimensions.width}x${closeBtnDimensions.height} ${isCircular ? '✅ Circular' : '❌ Oval'}`);
            }
            
            // Test 4: Menu items visibility
            console.log('    • Testing menu items...');
            const menuItems = await page.locator('.navbar-sidebar__item, .menu__link').count();
            deviceResults.menuItemCount = menuItems;
            console.log(`      Menu items: ${menuItems}`);
            
            // Test 5: Backdrop blur effect
            console.log('    • Testing backdrop...');
            const backdrop = page.locator('.navbar-sidebar__backdrop');
            const backdropVisible = await backdrop.isVisible().catch(() => false);
            deviceResults.backdropVisible = backdropVisible;
            
            // Take screenshot
            await page.screenshot({ 
              path: `mobile-sidebar-${env}-${device.name.replace(/\s+/g, '-')}-iter${this.results.iteration}.png` 
            });
            
            // Close sidebar
            if (await closeBtn.isVisible()) {
              await closeBtn.click();
              await page.waitForTimeout(500);
            }
          }
          
          results.environments[env].devices[device.name] = deviceResults;
          
        } catch (error) {
          console.error(`    ❌ Error: ${error.message}`);
          results.environments[env].devices[device.name] = { error: error.message };
        } finally {
          await context.close();
        }
      }
    }
    
    return results;
  }

  analyzeResults(testResults) {
    let allPassed = true;
    
    for (const env of Object.values(testResults.environments)) {
      for (const device of Object.values(env.devices)) {
        if (device.error) {
          allPassed = false;
          continue;
        }
        
        // Check all criteria
        if (!device.sidebarWidthOptimized) {
          console.log('  ❌ Sidebar width not optimized');
          allPassed = false;
        }
        
        if (!device.closeButtonCircular) {
          console.log('  ❌ Close button not circular');
          allPassed = false;
        }
        
        if (device.menuItemCount < 5) {
          console.log('  ❌ Not enough menu items visible');
          allPassed = false;
        }
      }
    }
    
    return allPassed;
  }

  async applyImprovements(testResults) {
    const improvements = [];
    
    for (const env of Object.values(testResults.environments)) {
      for (const [deviceName, device] of Object.entries(env.devices)) {
        if (device.sidebarWidthOptimized === false) {
          improvements.push(`
/* Fix: Optimize sidebar width for ${deviceName} */
@media (max-width: 996px) {
  .navbar-sidebar {
    width: 80% !important;
    max-width: 300px !important;
  }
}`);
        }
        
        if (device.closeButtonCircular === false) {
          improvements.push(`
/* Fix: Ensure circular close button */
@media (max-width: 996px) {
  .navbar-sidebar__close {
    width: 44px !important;
    height: 44px !important;
    aspect-ratio: 1 / 1 !important;
  }
}`);
        }
      }
    }
    
    if (improvements.length > 0) {
      const cssPath = 'src/css/custom.css';
      const currentCSS = await fs.readFile(cssPath, 'utf8');
      const newCSS = currentCSS + '\n\n/* RECURSIVE IMPROVEMENTS - Iteration ' + 
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
    } catch (error) {
      console.error('  ⚠️ Build error:', error.message);
    }
  }

  async generateReport() {
    console.log('\n' + '=' .repeat(50));
    console.log('\n📊 FINAL REPORT\n');
    console.log('=' .repeat(50) + '\n');
    
    console.log(`Total Iterations: ${this.results.iteration}`);
    console.log(`Total Improvements Applied: ${this.results.improvements.length}\n`);
    
    // Analyze final results
    if (this.results.tests.length > 0) {
      const lastTest = this.results.tests[this.results.tests.length - 1];
      
      console.log('📱 Final Test Results:\n');
      for (const [env, envData] of Object.entries(lastTest.environments)) {
        console.log(`  ${env.toUpperCase()}:`);
        for (const [device, deviceData] of Object.entries(envData.devices)) {
          if (!deviceData.error) {
            console.log(`    ${device}:`);
            console.log(`      • Sidebar optimized: ${deviceData.sidebarWidthOptimized ? '✅' : '❌'}`);
            console.log(`      • Close button circular: ${deviceData.closeButtonCircular ? '✅' : '❌'}`);
            console.log(`      • Menu items: ${deviceData.menuItemCount || 0}`);
          }
        }
      }
    }
    
    // Save report
    const reportPath = `mobile-optimization-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved: ${reportPath}\n`);
  }
}

// Run recursive tests
(async () => {
  const tester = new MobileSidebarOptimizationTester();
  await tester.runRecursiveTests(3);
})();