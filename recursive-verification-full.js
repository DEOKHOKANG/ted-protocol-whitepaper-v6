const { chromium } = require('playwright');
const fs = require('fs').promises;

/**
 * Full Recursive Verification System
 * Comprehensive testing with automatic improvement detection
 */

class RecursiveVerificationSystem {
  constructor() {
    this.deploymentUrl = 'https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/';
    this.localUrl = 'http://localhost:3400';
    this.results = {
      timestamp: new Date().toISOString(),
      iteration: 0,
      tests: [],
      improvements: [],
      finalStatus: {}
    };
  }

  async runRecursiveVerification(maxIterations = 3) {
    console.log('🔄 재귀 검증 시스템 시작\n');
    console.log('=' .repeat(70) + '\n');
    
    let allTestsPassed = false;
    
    while (!allTestsPassed && this.results.iteration < maxIterations) {
      this.results.iteration++;
      console.log(`\n📍 반복 ${this.results.iteration}/${maxIterations}\n`);
      
      const browser = await chromium.launch({ 
        headless: false,
        slowMo: 200 
      });
      
      try {
        const testResults = await this.runComprehensiveTests(browser);
        this.results.tests.push(testResults);
        
        allTestsPassed = this.analyzeAndReport(testResults);
        
        if (!allTestsPassed && this.results.iteration < maxIterations) {
          console.log('\n🔧 개선사항 적용중...\n');
          const improved = await this.applyImprovements(testResults);
          
          if (improved) {
            await this.rebuild();
            await this.waitForDeployment();
          } else {
            console.log('⚠️ 더 이상 개선할 수 없음 - 수동 개입 필요\n');
            break;
          }
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
      environments: {}
    };
    
    // Test both local and deployment
    const urls = {
      'LOCAL': this.localUrl,
      'VERCEL': this.deploymentUrl
    };
    
    for (const [env, url] of Object.entries(urls)) {
      console.log(`\n🌐 테스트 환경: ${env}\n`);
      console.log(`   URL: ${url}\n`);
      
      results.environments[env] = {
        url,
        devices: {}
      };
      
      // Test on multiple devices
      const devices = [
        { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
        { name: 'Samsung S21', viewport: { width: 384, height: 854 } },
        { name: 'Desktop', viewport: { width: 1280, height: 800 } }
      ];
      
      for (const device of devices) {
        console.log(`   📱 디바이스: ${device.name}`);
        
        const context = await browser.newContext({
          viewport: device.viewport,
          isMobile: device.name !== 'Desktop',
          hasTouch: device.name !== 'Desktop',
          userAgent: this.getUserAgent(device.name)
        });
        
        const page = await context.newPage();
        
        try {
          // Skip localhost if not available
          if (env === 'LOCAL') {
            const isLocalAvailable = await this.checkLocalServer(page);
            if (!isLocalAvailable) {
              console.log(`      ⏭️ 로컬 서버 사용 불가 - 건너뜀`);
              results.environments[env].devices[device.name] = { skipped: true };
              await context.close();
              continue;
            }
          }
          
          await page.goto(url, { 
            waitUntil: 'networkidle', 
            timeout: 30000 
          });
          
          await page.waitForTimeout(2000);
          
          const deviceResults = {};
          
          // Run all tests
          if (device.name !== 'Desktop') {
            // Mobile-only tests
            deviceResults.hamburgerMenu = await this.testHamburgerMenu(page);
            
            if (deviceResults.hamburgerMenu.sidebarOpened) {
              deviceResults.sidebarWidth = await this.testSidebarWidth(page);
              deviceResults.closeButton = await this.testCloseButton(page);
              deviceResults.menuItems = await this.testMenuItems(page);
              
              // Close sidebar
              await this.closeSidebar(page);
            }
            
            deviceResults.whitepaperTitle = await this.testWhitepaperTitle(page, device);
            deviceResults.githubIcon = await this.testGitHubIcon(page);
          } else {
            // Desktop-only tests
            deviceResults.whitepaperTitle = await this.testWhitepaperTitle(page, device);
            deviceResults.githubIcon = await this.testGitHubIcon(page);
          }
          
          deviceResults.languageSelector = await this.testLanguageSelector(page);
          deviceResults.headerLayout = await this.testHeaderLayout(page);
          
          // Take screenshot
          const screenshotName = `recursive-${env.toLowerCase()}-${device.name.replace(/\s+/g, '-')}-iter${this.results.iteration}.png`;
          await page.screenshot({ 
            path: screenshotName,
            fullPage: false 
          });
          deviceResults.screenshot = screenshotName;
          
          results.environments[env].devices[device.name] = deviceResults;
          
          // Print immediate results
          this.printTestResults(deviceResults);
          
        } catch (error) {
          console.error(`      ❌ 에러: ${error.message}`);
          results.environments[env].devices[device.name] = { error: error.message };
        } finally {
          await context.close();
        }
      }
    }
    
    return results;
  }

  async checkLocalServer(page) {
    try {
      await page.goto(this.localUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async testHamburgerMenu(page) {
    try {
      const hamburger = page.locator('.navbar__toggle');
      const visible = await hamburger.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!visible) return { passed: false, visible: false };
      
      await hamburger.click();
      await page.waitForTimeout(1000);
      
      const sidebar = page.locator('.navbar-sidebar');
      const sidebarOpened = await sidebar.isVisible({ timeout: 2000 }).catch(() => false);
      
      return {
        passed: visible && sidebarOpened,
        visible,
        sidebarOpened
      };
    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  async testSidebarWidth(page) {
    try {
      const sidebar = page.locator('.navbar-sidebar');
      const data = await sidebar.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        const viewport = window.innerWidth;
        
        return {
          width: rect.width,
          viewport,
          percentage: (rect.width / viewport * 100).toFixed(1),
          maxWidth: computed.maxWidth,
          computedWidth: computed.width
        };
      });
      
      // Target: 85% and max 320px
      const isOptimal = parseFloat(data.percentage) >= 80 && 
                       parseFloat(data.percentage) <= 90 && 
                       data.width <= 340;
      
      return {
        passed: isOptimal,
        width: Math.round(data.width),
        percentage: data.percentage,
        maxWidth: data.maxWidth,
        target: '85%, max 320px'
      };
    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  async testCloseButton(page) {
    try {
      const closeBtn = page.locator('.navbar-sidebar__close');
      const visible = await closeBtn.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!visible) return { passed: false, visible: false };
      
      const data = await closeBtn.evaluate(el => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const after = window.getComputedStyle(el, '::after');
        
        return {
          width: rect.width,
          height: rect.height,
          borderRadius: computed.borderRadius,
          afterContent: after.content,
          textContent: el.textContent,
          innerHTML: el.innerHTML
        };
      });
      
      const isBoxStyle = !data.borderRadius.includes('50%') && 
                        parseInt(data.borderRadius) <= 20;
      
      const hasCloseText = data.afterContent.includes('CLOSE') || 
                          data.textContent.includes('CLOSE') ||
                          data.innerHTML.includes('CLOSE');
      
      const correctSize = data.width >= 70 && data.height >= 30 && data.height <= 50;
      
      return {
        passed: isBoxStyle && hasCloseText && correctSize,
        isBoxStyle,
        hasCloseText,
        correctSize,
        dimensions: `${Math.round(data.width)}x${Math.round(data.height)}`,
        borderRadius: data.borderRadius
      };
    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  async testMenuItems(page) {
    try {
      const items = await page.locator('.navbar-sidebar__item, .menu__link').count();
      
      return {
        passed: items >= 5,
        count: items
      };
    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  async testWhitepaperTitle(page, device) {
    try {
      const selectors = [
        '.navbar__title',
        '.navbar__brand .navbar__title',
        '.navbar__brand-text'
      ];
      
      let visible = false;
      let text = '';
      
      for (const selector of selectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
          visible = true;
          text = await element.textContent();
          break;
        }
      }
      
      // Should be hidden on mobile, visible on desktop
      const isMobile = device.viewport.width < 997;
      const shouldBeHidden = isMobile;
      const passed = shouldBeHidden ? !visible : visible;
      
      return {
        passed,
        visible,
        text,
        expected: shouldBeHidden ? 'hidden' : 'visible'
      };
    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  async testGitHubIcon(page) {
    try {
      const selectors = [
        '.navbar__item[href*="github"]',
        '.navbar__link[href*="github"]',
        '.header-github-link'
      ];
      
      let visible = false;
      
      for (const selector of selectors) {
        if (await page.locator(selector).isVisible({ timeout: 1000 }).catch(() => false)) {
          visible = true;
          break;
        }
      }
      
      // Should be hidden on mobile
      const viewport = await page.viewportSize();
      const isMobile = viewport.width < 997;
      const passed = isMobile ? !visible : visible;
      
      return {
        passed,
        visible,
        expected: isMobile ? 'hidden' : 'visible'
      };
    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  async testLanguageSelector(page) {
    try {
      const selector = '.navbar__items--right .dropdown';
      const visible = await page.locator(selector).isVisible({ timeout: 2000 }).catch(() => false);
      
      return {
        passed: visible,
        visible
      };
    } catch (error) {
      return { passed: false, error: error.message };
    }
  }

  async testHeaderLayout(page) {
    try {
      const header = page.locator('.navbar');
      const data = await header.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          hasOverflow: el.scrollWidth > el.clientWidth
        };
      });
      
      return {
        passed: !data.hasOverflow,
        hasOverflow: data.hasOverflow,
        dimensions: `${Math.round(data.width)}x${Math.round(data.height)}`
      };
    } catch (error) {
      return { passed: false, error: error.message };
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
      // Ignore
    }
  }

  getUserAgent(deviceName) {
    const agents = {
      'iPhone 12': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      'Samsung S21': 'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
      'Desktop': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    };
    return agents[deviceName] || agents['iPhone 12'];
  }

  printTestResults(results) {
    const tests = [
      { key: 'hamburgerMenu', name: '햄버거 메뉴' },
      { key: 'sidebarWidth', name: '사이드바 너비' },
      { key: 'closeButton', name: '닫기 버튼' },
      { key: 'menuItems', name: '메뉴 항목' },
      { key: 'whitepaperTitle', name: '제목 숨김' },
      { key: 'githubIcon', name: 'GitHub 아이콘' },
      { key: 'languageSelector', name: '언어 선택기' },
      { key: 'headerLayout', name: '헤더 레이아웃' }
    ];
    
    for (const test of tests) {
      if (results[test.key]) {
        const result = results[test.key];
        const status = result.passed ? '✅' : '❌';
        let detail = '';
        
        if (test.key === 'sidebarWidth' && result.percentage) {
          detail = ` (${result.percentage}%, ${result.width}px)`;
        } else if (test.key === 'closeButton' && result.dimensions) {
          detail = ` (${result.dimensions}, ${result.isBoxStyle ? 'box' : 'circle'})`;
        }
        
        console.log(`      ${status} ${test.name}${detail}`);
      }
    }
  }

  analyzeAndReport(testResults) {
    let allPassed = true;
    const failures = [];
    
    console.log('\n📊 테스트 결과 분석:\n');
    
    for (const [env, envData] of Object.entries(testResults.environments)) {
      console.log(`  ${env}:`);
      
      for (const [device, deviceData] of Object.entries(envData.devices)) {
        if (deviceData.skipped) continue;
        if (deviceData.error) {
          console.log(`    ${device}: ❌ 에러 - ${deviceData.error}`);
          allPassed = false;
          continue;
        }
        
        let devicePassed = true;
        const deviceFailures = [];
        
        for (const [testName, testResult] of Object.entries(deviceData)) {
          if (testName === 'screenshot') continue;
          if (testResult && !testResult.passed) {
            devicePassed = false;
            deviceFailures.push(testName);
          }
        }
        
        if (devicePassed) {
          console.log(`    ${device}: ✅ 모든 테스트 통과`);
        } else {
          console.log(`    ${device}: ❌ 실패 - ${deviceFailures.join(', ')}`);
          failures.push({ env, device, failures: deviceFailures });
          allPassed = false;
        }
      }
    }
    
    this.results.finalStatus = { allPassed, failures };
    return allPassed;
  }

  async applyImprovements(testResults) {
    const improvements = [];
    const cssPath = 'src/css/custom.css';
    
    // Analyze failures and generate fixes
    for (const [env, envData] of Object.entries(testResults.environments)) {
      if (env !== 'VERCEL') continue; // Focus on deployment issues
      
      for (const [device, deviceData] of Object.entries(envData.devices)) {
        if (deviceData.skipped || deviceData.error) continue;
        
        // Fix sidebar width
        if (deviceData.sidebarWidth && !deviceData.sidebarWidth.passed) {
          if (parseFloat(deviceData.sidebarWidth.percentage) > 90) {
            improvements.push({
              issue: 'Sidebar too wide',
              fix: `
/* Fix: Force 85% sidebar width */
@media (max-width: 996px) {
  .navbar-sidebar {
    width: 85% !important;
    max-width: 320px !important;
    min-width: 280px !important;
  }
}`
            });
          }
        }
        
        // Fix close button
        if (deviceData.closeButton && !deviceData.closeButton.passed) {
          if (!deviceData.closeButton.isBoxStyle || !deviceData.closeButton.hasCloseText) {
            improvements.push({
              issue: 'Close button not box style or missing CLOSE text',
              fix: `
/* Fix: Box-style close button with CLOSE text */
@media (max-width: 996px) {
  .navbar-sidebar__close {
    width: auto !important;
    min-width: 80px !important;
    height: 36px !important;
    border-radius: 6px !important;
    background: #6B46C1 !important;
    color: white !important;
    font-weight: 600 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .navbar-sidebar__close::after {
    content: "CLOSE" !important;
    display: block !important;
  }
  
  .navbar-sidebar__close svg {
    display: none !important;
  }
}`
            });
          }
        }
        
        // Fix title visibility
        if (deviceData.whitepaperTitle && !deviceData.whitepaperTitle.passed) {
          if (deviceData.whitepaperTitle.visible && device !== 'Desktop') {
            improvements.push({
              issue: 'Title visible on mobile',
              fix: `
/* Fix: Hide title on mobile */
@media (max-width: 996px) {
  .navbar__title,
  .navbar__brand .navbar__title {
    display: none !important;
    visibility: hidden !important;
  }
}`
            });
          }
        }
      }
    }
    
    if (improvements.length > 0) {
      console.log(`\n🔧 ${improvements.length}개 개선사항 발견:\n`);
      improvements.forEach(imp => {
        console.log(`  • ${imp.issue}`);
      });
      
      // Apply fixes
      try {
        const currentCSS = await fs.readFile(cssPath, 'utf8');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newCSS = currentCSS + `\n\n/* Recursive Improvements - ${timestamp} */\n` +
                      improvements.map(imp => imp.fix).join('\n');
        
        await fs.writeFile(cssPath, newCSS);
        this.results.improvements.push(...improvements);
        
        console.log('\n  ✅ 개선사항 적용 완료\n');
        return true;
      } catch (error) {
        console.error(`  ❌ CSS 적용 실패: ${error.message}\n`);
        return false;
      }
    }
    
    return false;
  }

  async rebuild() {
    console.log('  🔨 프로젝트 빌드중...\n');
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    try {
      await execPromise('npm run build');
      console.log('  ✅ 빌드 완료\n');
      
      // Commit and push
      const msg = `🔄 재귀 개선 - 반복 ${this.results.iteration}`;
      await execPromise(`git add . && git commit -m "${msg}" && git push`);
      console.log('  ✅ 배포 완료\n');
      
      return true;
    } catch (error) {
      console.error(`  ⚠️ 빌드/배포 오류: ${error.message}\n`);
      return false;
    }
  }

  async waitForDeployment() {
    console.log('  ⏳ 배포 대기중 (45초)...\n');
    await new Promise(resolve => setTimeout(resolve, 45000));
  }

  async generateFinalReport() {
    console.log('\n' + '=' .repeat(70));
    console.log('\n📊 재귀 검증 최종 보고서\n');
    console.log('=' .repeat(70) + '\n');
    
    console.log(`총 반복 횟수: ${this.results.iteration}`);
    console.log(`총 개선사항: ${this.results.improvements.length}\n`);
    
    if (this.results.finalStatus.allPassed) {
      console.log('🎉 모든 테스트 통과!\n');
    } else {
      console.log('⚠️ 일부 테스트 실패:\n');
      this.results.finalStatus.failures.forEach(f => {
        console.log(`  • ${f.env} - ${f.device}: ${f.failures.join(', ')}`);
      });
    }
    
    // Save report
    const reportPath = `recursive-verification-report-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 상세 보고서 저장: ${reportPath}\n`);
  }
}

// Run recursive verification
(async () => {
  const verifier = new RecursiveVerificationSystem();
  await verifier.runRecursiveVerification(3);
})();