const { chromium } = require('playwright');

/**
 * 재귀개선 자동 검증 스위트
 * Target: https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app
 */

const PRODUCTION_URL = 'https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app';

class RecursiveTestSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      url: PRODUCTION_URL,
      tests: [],
      iteration: 1,
      status: 'pending'
    };
  }

  async runAllTests() {
    console.log('🔄 재귀개선 테스트 스위트 시작');
    console.log('━'.repeat(60));
    console.log(`📍 Target: ${PRODUCTION_URL}`);
    console.log(`🕐 Time: ${this.results.timestamp}`);
    console.log('━'.repeat(60));

    const browser = await chromium.launch({ 
      headless: false,
      viewport: { width: 375, height: 812 }
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
    });

    const page = await context.newPage();

    try {
      // Test MOB-001: Whitepaper 텍스트 제거
      await this.testWhitepaperText(page);

      // Test MOB-002: GitHub 링크 숨김
      await this.testGithubLinks(page);

      // Test MOB-003: 커스텀 햄버거 메뉴
      await this.testCustomHamburger(page);

      // Test MOB-004: 네비게이션 일관성
      await this.testNavigationConsistency(page);

      // Test MOB-005: 언어 선택기 단일화
      await this.testLanguageSelector(page);

      // PC 버전 테스트
      await this.testDesktopVersion(page);

    } catch (error) {
      console.error(`❌ 테스트 실패: ${error.message}`);
      this.results.status = 'error';
    }

    await browser.close();
    
    // 결과 분석
    this.analyzeResults();
    
    return this.results;
  }

  async testWhitepaperText(page) {
    console.log('\n📝 Test MOB-001: Whitepaper 텍스트 검증');
    
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    // 다양한 선택자로 Whitepaper 텍스트 찾기
    const selectors = [
      'text=Whitepaper',
      '.navbar__title',
      '.navbar__brand b',
      '.navbar__brand strong',
      '.navbar__brand span'
    ];

    let whitepaperCount = 0;
    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      whitepaperCount += count;
      if (count > 0) {
        console.log(`   ⚠️ Found ${count} instances with selector: ${selector}`);
      }
    }

    const passed = whitepaperCount === 0;
    const testResult = {
      id: 'MOB-001',
      name: 'Whitepaper Text Hidden',
      expected: 0,
      actual: whitepaperCount,
      passed,
      severity: 'critical'
    };

    this.results.tests.push(testResult);
    console.log(`   ${passed ? '✅' : '❌'} Result: ${passed ? 'PASSED' : `FAILED (${whitepaperCount} found)`}`);
  }

  async testGithubLinks(page) {
    console.log('\n🔗 Test MOB-002: GitHub 링크 숨김 검증');
    
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    const githubSelectors = [
      'a[href*="github"]',
      'a[href*="GitHub"]',
      '.header-github-link',
      '.navbar__link[aria-label*="GitHub"]'
    ];

    let githubCount = 0;
    for (const selector of githubSelectors) {
      const elements = await page.$$(selector);
      for (const element of elements) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          githubCount++;
          const href = await element.getAttribute('href');
          console.log(`   ⚠️ Visible GitHub link: ${href}`);
        }
      }
    }

    const passed = githubCount === 0;
    const testResult = {
      id: 'MOB-002',
      name: 'GitHub Links Hidden on Mobile',
      expected: 0,
      actual: githubCount,
      passed,
      severity: 'critical'
    };

    this.results.tests.push(testResult);
    console.log(`   ${passed ? '✅' : '❌'} Result: ${passed ? 'PASSED' : `FAILED (${githubCount} visible)`}`);
  }

  async testCustomHamburger(page) {
    console.log('\n🍔 Test MOB-003: 커스텀 햄버거 메뉴 검증');
    
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    // 커스텀 햄버거 찾기
    const customHamburger = await page.$('#mobile-hamburger-btn');
    const defaultHamburger = await page.$('.navbar__toggle');

    let passed = false;
    let message = '';

    if (customHamburger) {
      const isVisible = await customHamburger.isVisible();
      if (isVisible) {
        passed = true;
        message = '커스텀 햄버거 메뉴 표시됨';
        
        // 클릭 테스트
        await customHamburger.click();
        await page.waitForTimeout(500);
        const menuPortal = await page.$('#mobile-menu-portal');
        if (menuPortal && await menuPortal.isVisible()) {
          message += ', 메뉴 정상 작동';
        }
      }
    } else if (defaultHamburger && await defaultHamburger.isVisible()) {
      passed = false;
      message = '기본 Docusaurus 햄버거만 존재';
    }

    const testResult = {
      id: 'MOB-003',
      name: 'Custom Hamburger Menu',
      expected: 'custom hamburger visible',
      actual: message,
      passed,
      severity: 'critical'
    };

    this.results.tests.push(testResult);
    console.log(`   ${passed ? '✅' : '❌'} Result: ${message}`);
  }

  async testNavigationConsistency(page) {
    console.log('\n📊 Test MOB-004: 네비게이션 일관성 검증');
    
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    // 햄버거 메뉴 열기
    const hamburger = await page.$('.navbar__toggle') || await page.$('#mobile-hamburger-btn');
    if (hamburger) {
      await hamburger.click();
      await page.waitForTimeout(1000);
    }

    const menuItems = await page.$$('.menu__list-item');
    const itemCount = menuItems.length;
    
    const passed = itemCount > 5 && itemCount < 15;
    const testResult = {
      id: 'MOB-004',
      name: 'Navigation Consistency',
      expected: '5-15 menu items',
      actual: `${itemCount} items`,
      passed,
      severity: 'major'
    };

    this.results.tests.push(testResult);
    console.log(`   ${passed ? '✅' : '❌'} Menu items: ${itemCount}`);
  }

  async testLanguageSelector(page) {
    console.log('\n🌐 Test MOB-005: 언어 선택기 단일화 검증');
    
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    const dropdowns = await page.$$('.navbar__item.dropdown');
    const dropdownCount = dropdowns.length;

    const passed = dropdownCount <= 1;
    const testResult = {
      id: 'MOB-005',
      name: 'Language Selector Unification',
      expected: '1 dropdown',
      actual: `${dropdownCount} dropdowns`,
      passed,
      severity: 'major'
    };

    this.results.tests.push(testResult);
    console.log(`   ${passed ? '✅' : '❌'} Language selectors: ${dropdownCount}`);
  }

  async testDesktopVersion(page) {
    console.log('\n💻 Desktop Version Verification');
    
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // PC에서 GitHub 링크 표시 확인
    const githubLink = await page.$('a[href*="github"]');
    const githubVisible = githubLink && await githubLink.isVisible();

    // PC에서 햄버거 메뉴 숨김 확인
    const hamburger = await page.$('.navbar__toggle');
    const hamburgerHidden = !hamburger || !(await hamburger.isVisible());

    const passed = githubVisible && hamburgerHidden;
    const testResult = {
      id: 'DESK-001',
      name: 'Desktop Layout',
      expected: 'GitHub visible, hamburger hidden',
      actual: `GitHub: ${githubVisible ? 'visible' : 'hidden'}, Hamburger: ${hamburgerHidden ? 'hidden' : 'visible'}`,
      passed,
      severity: 'major'
    };

    this.results.tests.push(testResult);
    console.log(`   ${passed ? '✅' : '❌'} Desktop layout: ${passed ? 'correct' : 'issues found'}`);
  }

  analyzeResults() {
    console.log('\n' + '═'.repeat(60));
    console.log('📊 테스트 결과 분석');
    console.log('═'.repeat(60));

    const critical = this.results.tests.filter(t => t.severity === 'critical');
    const major = this.results.tests.filter(t => t.severity === 'major');
    
    const criticalPassed = critical.filter(t => t.passed).length;
    const majorPassed = major.filter(t => t.passed).length;
    
    console.log(`\n🔴 Critical Tests: ${criticalPassed}/${critical.length} passed`);
    critical.forEach(test => {
      const icon = test.passed ? '✅' : '❌';
      console.log(`   ${icon} ${test.id}: ${test.name}`);
      if (!test.passed) {
        console.log(`      Expected: ${test.expected}, Got: ${test.actual}`);
      }
    });

    console.log(`\n🟡 Major Tests: ${majorPassed}/${major.length} passed`);
    major.forEach(test => {
      const icon = test.passed ? '✅' : '❌';
      console.log(`   ${icon} ${test.id}: ${test.name}`);
    });

    const allPassed = this.results.tests.every(t => t.passed);
    this.results.status = allPassed ? 'passed' : 'failed';
    
    console.log('\n' + '═'.repeat(60));
    console.log(`🏁 Overall Status: ${this.results.status.toUpperCase()}`);
    
    if (!allPassed) {
      console.log('\n⚠️  재귀개선 필요: 추가 iteration 실행 권장');
    } else {
      console.log('\n✅ 모든 테스트 통과: 프로덕션 준비 완료');
    }
  }
}

// 실행
(async () => {
  const suite = new RecursiveTestSuite();
  const results = await suite.runAllTests();
  
  // 결과를 파일로 저장
  const fs = require('fs');
  fs.writeFileSync(
    'recursive-test-results.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n📁 Results saved to: recursive-test-results.json');
})();