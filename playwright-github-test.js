const { chromium } = require('playwright');
const fs = require('fs').promises;

/**
 * GitHub Icon Responsive Test
 * Validates GitHub icon visibility based on device type
 */

class GitHubIconTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      improvements: []
    };
  }

  async runTests() {
    console.log('🔍 Testing GitHub Icon Responsive Display\n');
    console.log('=' .repeat(50) + '\n');
    
    const browser = await chromium.launch({ 
      headless: false,
      slowMo: 200 
    });
    
    try {
      // Test URLs
      const urls = {
        local: 'http://localhost:3400',
        vercel: 'https://tedprotocol-whitepaper.vercel.app'
      };
      
      for (const [env, url] of Object.entries(urls)) {
        console.log(`\n🌐 Testing ${env.toUpperCase()}: ${url}\n`);
        
        // Test on mobile devices (should NOT show GitHub icon)
        const mobileDevices = [
          { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
          { name: 'Samsung Galaxy S21', viewport: { width: 384, height: 854 } }
        ];
        
        for (const device of mobileDevices) {
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
            
            // Check GitHub icon visibility
            const githubVisible = await this.checkGitHubIcon(page);
            
            const result = {
              environment: env,
              device: device.name,
              githubIconVisible: githubVisible,
              expected: false, // Should NOT be visible on mobile
              passed: githubVisible === false
            };
            
            this.results.tests.push(result);
            
            if (githubVisible) {
              console.log(`    ❌ GitHub icon is visible (should be hidden)`);
            } else {
              console.log(`    ✅ GitHub icon is hidden (correct)`);
            }
            
            // Take screenshot
            await page.screenshot({ 
              path: `github-test-${env}-${device.name.replace(/\s+/g, '-')}.png` 
            });
            
          } catch (error) {
            console.error(`    ❌ Error: ${error.message}`);
          } finally {
            await context.close();
          }
        }
        
        // Test on desktop (should SHOW GitHub icon)
        console.log(`  🖥️ Testing on Desktop...`);
        
        const desktopContext = await browser.newContext({
          viewport: { width: 1920, height: 1080 },
          isMobile: false
        });
        
        const desktopPage = await desktopContext.newPage();
        
        try {
          await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          await desktopPage.waitForTimeout(2000);
          
          const githubVisible = await this.checkGitHubIcon(desktopPage);
          
          const result = {
            environment: env,
            device: 'Desktop',
            githubIconVisible: githubVisible,
            expected: true, // Should be visible on desktop
            passed: githubVisible === true
          };
          
          this.results.tests.push(result);
          
          if (githubVisible) {
            console.log(`    ✅ GitHub icon is visible (correct)`);
          } else {
            console.log(`    ❌ GitHub icon is hidden (should be visible)`);
          }
          
          await desktopPage.screenshot({ 
            path: `github-test-${env}-desktop.png` 
          });
          
        } catch (error) {
          console.error(`    ❌ Error: ${error.message}`);
        } finally {
          await desktopContext.close();
        }
      }
      
    } finally {
      await browser.close();
    }
    
    // Generate report
    await this.generateReport();
    
    // Apply improvements if needed
    const failedTests = this.results.tests.filter(t => !t.passed);
    if (failedTests.length > 0) {
      console.log('\n🔧 Applying Recursive Improvements...\n');
      await this.applyImprovements(failedTests);
    }
    
    return this.results;
  }

  async checkGitHubIcon(page) {
    try {
      // Check multiple possible GitHub icon selectors
      const selectors = [
        'a[href*="github"]',
        '.navbar__item[href*="github"]',
        '.navbar__link[href*="github"]',
        '[aria-label*="GitHub"]',
        '.header-github-link',
        'svg[class*="github"]'
      ];
      
      for (const selector of selectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            // Double-check it's in the navbar, not sidebar
            const isInNavbar = await element.evaluate(el => {
              const navbar = el.closest('.navbar');
              const sidebar = el.closest('.navbar-sidebar');
              return navbar && !sidebar;
            });
            
            if (isInNavbar) {
              return true;
            }
          }
        } catch {
          // Element not found or not visible
        }
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  async generateReport() {
    console.log('\n' + '=' .repeat(50));
    console.log('\n📊 TEST REPORT\n');
    console.log('=' .repeat(50) + '\n');
    
    const passedTests = this.results.tests.filter(t => t.passed).length;
    const totalTests = this.results.tests.length;
    const passRate = Math.round((passedTests / totalTests) * 100);
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Pass Rate: ${passRate}%\n`);
    
    // Show failed tests
    const failedTests = this.results.tests.filter(t => !t.passed);
    if (failedTests.length > 0) {
      console.log('❌ Failed Tests:\n');
      failedTests.forEach(test => {
        console.log(`  • ${test.environment} - ${test.device}`);
        console.log(`    Expected: GitHub ${test.expected ? 'visible' : 'hidden'}`);
        console.log(`    Actual: GitHub ${test.githubIconVisible ? 'visible' : 'hidden'}\n`);
      });
    }
    
    // Save detailed report
    const reportPath = `github-icon-test-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved: ${reportPath}\n`);
  }

  async applyImprovements(failedTests) {
    const improvements = [];
    
    // Check if mobile devices are showing GitHub icon when they shouldn't
    const mobileShowingGitHub = failedTests.filter(t => 
      t.device !== 'Desktop' && t.githubIconVisible
    );
    
    if (mobileShowingGitHub.length > 0) {
      improvements.push(`
/* Additional fix: Force hide GitHub icon on mobile */
@media (max-width: 996px) {
  .navbar__items a[href*="github"],
  .navbar__items [href*="github"],
  .navbar [aria-label*="GitHub"] {
    display: none !important;
    position: absolute !important;
    left: -9999px !important;
  }
}`);
    }
    
    // Check if desktop is NOT showing GitHub icon when it should
    const desktopNotShowingGitHub = failedTests.filter(t => 
      t.device === 'Desktop' && !t.githubIconVisible
    );
    
    if (desktopNotShowingGitHub.length > 0) {
      improvements.push(`
/* Additional fix: Ensure GitHub icon visible on desktop */
@media (min-width: 997px) {
  .navbar__items a[href*="github"] {
    display: inline-flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: auto !important;
    height: auto !important;
  }
}`);
    }
    
    if (improvements.length > 0) {
      const cssPath = 'src/css/custom.css';
      const currentCSS = await fs.readFile(cssPath, 'utf8');
      const newCSS = currentCSS + '\n\n/* RECURSIVE GITHUB ICON IMPROVEMENTS */\n' + 
                    improvements.join('\n');
      
      await fs.writeFile(cssPath, newCSS);
      console.log(`✅ Applied ${improvements.length} improvements to custom.css\n`);
      
      this.results.improvements = improvements;
    }
  }
}

// Run tests
(async () => {
  const tester = new GitHubIconTester();
  await tester.runTests();
})();