const { chromium, devices } = require('playwright');
const fs = require('fs');

/**
 * 최고 수준 모바일 최적화 재귀 테스트
 */

class UltimateMobileOptimizer {
  constructor() {
    this.issues = [];
    this.improvements = [];
    this.testResults = [];
  }

  async run() {
    console.log('🚀 Ultimate Mobile Optimization - 재귀적 개선');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ 
      headless: false,
      devtools: true 
    });

    // 테스트할 디바이스들
    const testDevices = [
      { name: 'iPhone SE', device: devices['iPhone SE'], critical: true },
      { name: 'iPhone 12', device: devices['iPhone 12'], critical: true },
      { name: 'iPhone 13 Pro Max', device: devices['iPhone 13 Pro Max'], critical: true },
      { name: 'Galaxy S20', viewport: { width: 360, height: 800 }, critical: true },
      { name: 'iPad Mini', device: devices['iPad Mini'], critical: false }
    ];

    // 1차 테스트 - 현재 상태 분석
    console.log('\n📱 1차 테스트: 현재 상태 분석');
    console.log('-'.repeat(40));

    for (const deviceConfig of testDevices) {
      if (deviceConfig.critical) {
        await this.testDevice(browser, deviceConfig, 1);
      }
    }

    // 개선사항 생성
    if (this.issues.length > 0) {
      console.log('\n🔧 개선사항 생성 중...');
      await this.generateImprovements();
      
      // CSS 파일 업데이트
      await this.updateCSS();

      // 2차 테스트 - 개선 후
      console.log('\n📱 2차 테스트: 개선 후 검증');
      console.log('-'.repeat(40));

      this.issues = [];
      for (const deviceConfig of testDevices) {
        if (deviceConfig.critical) {
          await this.testDevice(browser, deviceConfig, 2);
        }
      }

      // 3차 테스트 - 최종 검증
      if (this.issues.length > 0) {
        console.log('\n🔧 추가 개선 진행 중...');
        await this.generateImprovements();
        await this.updateCSS();

        console.log('\n📱 3차 테스트: 최종 검증');
        console.log('-'.repeat(40));

        this.issues = [];
        for (const deviceConfig of testDevices) {
          await this.testDevice(browser, deviceConfig, 3);
        }
      }
    }

    await browser.close();
    
    // 최종 보고서
    this.generateReport();
  }

  async testDevice(browser, deviceConfig, round) {
    const context = await browser.newContext({
      ...deviceConfig.device,
      ...deviceConfig.viewport ? { viewport: deviceConfig.viewport } : {},
      locale: 'ko-KR'
    });

    const page = await context.newPage();

    try {
      console.log(`\n🔍 테스트: ${deviceConfig.name} (Round ${round})`);

      await page.goto('http://localhost:3000/ko', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      await page.waitForTimeout(1000);

      const results = {
        device: deviceConfig.name,
        round: round,
        timestamp: new Date().toISOString(),
        checks: {}
      };

      // 체크 1: 네비게이션 바 높이
      const navbarHeight = await page.$eval('.navbar', el => el.offsetHeight).catch(() => 0);
      results.checks.navbarHeight = navbarHeight;
      if (navbarHeight !== 60) {
        this.issues.push({
          device: deviceConfig.name,
          type: 'navbar-height',
          expected: 60,
          actual: navbarHeight,
          severity: 'high'
        });
      }
      console.log(`   📏 네비바 높이: ${navbarHeight}px ${navbarHeight === 60 ? '✅' : '❌'}`);

      // 체크 2: Whitepaper 텍스트
      const whitepaperCount = await page.locator('.navbar__title:visible').count();
      results.checks.whitepaperHidden = whitepaperCount === 0;
      if (whitepaperCount > 0) {
        this.issues.push({
          device: deviceConfig.name,
          type: 'whitepaper-visible',
          count: whitepaperCount,
          severity: 'critical'
        });
      }
      console.log(`   📝 Whitepaper 숨김: ${whitepaperCount === 0 ? '✅' : '❌'} (${whitepaperCount}개)`);

      // 체크 3: GitHub 링크
      const githubVisible = await page.$$eval('a[href*="github"]', links => 
        links.filter(link => {
          const style = window.getComputedStyle(link);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }).length
      );
      results.checks.githubHidden = githubVisible === 0;
      if (githubVisible > 0) {
        this.issues.push({
          device: deviceConfig.name,
          type: 'github-visible',
          count: githubVisible,
          severity: 'critical'
        });
      }
      console.log(`   🔗 GitHub 숨김: ${githubVisible === 0 ? '✅' : '❌'} (${githubVisible}개)`);

      // 체크 4: 햄버거 메뉴 크기
      const hamburgerSize = await page.$eval('.navbar__toggle', el => {
        const rect = el.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }).catch(() => ({ width: 0, height: 0 }));
      
      results.checks.hamburgerSize = hamburgerSize;
      const hamburgerOk = hamburgerSize.width >= 44 && hamburgerSize.height >= 44;
      if (!hamburgerOk) {
        this.issues.push({
          device: deviceConfig.name,
          type: 'hamburger-small',
          size: hamburgerSize,
          severity: 'high'
        });
      }
      console.log(`   🍔 햄버거 크기: ${hamburgerSize.width}x${hamburgerSize.height} ${hamburgerOk ? '✅' : '❌'}`);

      // 체크 5: 컨테이너 패딩
      const containerPadding = await page.$eval('.container', el => {
        const style = window.getComputedStyle(el);
        return parseInt(style.paddingLeft);
      }).catch(() => 0);
      
      results.checks.containerPadding = containerPadding;
      const paddingOk = containerPadding === 16;
      if (!paddingOk) {
        this.issues.push({
          device: deviceConfig.name,
          type: 'padding-incorrect',
          expected: 16,
          actual: containerPadding,
          severity: 'medium'
        });
      }
      console.log(`   📦 컨테이너 패딩: ${containerPadding}px ${paddingOk ? '✅' : '❌'}`);

      // 체크 6: 터치 타겟
      const touchTargets = await page.$$eval('button, a.button, .menu__link', elements => 
        elements.map(el => {
          const rect = el.getBoundingClientRect();
          return Math.min(rect.width, rect.height);
        }).filter(size => size < 44)
      );
      
      results.checks.touchTargets = touchTargets.length === 0;
      if (touchTargets.length > 0) {
        this.issues.push({
          device: deviceConfig.name,
          type: 'small-touch-targets',
          count: touchTargets.length,
          severity: 'high'
        });
      }
      console.log(`   👆 터치 타겟 (44px+): ${touchTargets.length === 0 ? '✅' : '❌'} (작은 것 ${touchTargets.length}개)`);

      // 체크 7: 폰트 크기
      const fontSizes = await page.$$eval('p', elements => 
        elements.slice(0, 5).map(el => parseFloat(window.getComputedStyle(el).fontSize))
      );
      
      const minFont = Math.min(...fontSizes);
      results.checks.minFontSize = minFont;
      const fontOk = minFont >= 14;
      if (!fontOk) {
        this.issues.push({
          device: deviceConfig.name,
          type: 'small-font',
          minSize: minFont,
          severity: 'medium'
        });
      }
      console.log(`   📖 최소 폰트: ${minFont}px ${fontOk ? '✅' : '❌'}`);

      // 체크 8: 가로 스크롤
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      results.checks.noHorizontalScroll = !hasHorizontalScroll;
      if (hasHorizontalScroll) {
        this.issues.push({
          device: deviceConfig.name,
          type: 'horizontal-scroll',
          severity: 'critical'
        });
      }
      console.log(`   ↔️ 가로 스크롤: ${!hasHorizontalScroll ? '✅ 없음' : '❌ 있음'}`);

      // 체크 9: 사이드바 테스트
      await page.click('.navbar__toggle').catch(() => {});
      await page.waitForTimeout(500);
      
      const sidebarWidth = await page.$eval('.navbar-sidebar', el => el.offsetWidth).catch(() => 0);
      results.checks.sidebarWidth = sidebarWidth;
      const sidebarOk = sidebarWidth >= 280 && sidebarWidth <= 300;
      console.log(`   📑 사이드바 너비: ${sidebarWidth}px ${sidebarOk ? '✅' : '⚠️'}`);

      // 스크린샷
      await page.screenshot({ 
        path: `ultimate-${deviceConfig.name.replace(/\s+/g, '-')}-round${round}.png`,
        fullPage: false 
      });

      this.testResults.push(results);

    } catch (error) {
      console.error(`   ❌ 오류: ${error.message}`);
    }

    await context.close();
  }

  async generateImprovements() {
    const improvements = [];

    for (const issue of this.issues) {
      let css = '';

      switch (issue.type) {
        case 'navbar-height':
          css = `
/* Fix navbar height for ${issue.device} */
@media screen and (max-width: 996px) {
  .navbar {
    height: 60px !important;
    min-height: 60px !important;
    max-height: 60px !important;
  }
}`;
          break;

        case 'whitepaper-visible':
          css = `
/* Force hide Whitepaper text for ${issue.device} */
@media screen and (max-width: 996px) {
  .navbar__title,
  [class*="title"]:has-text("Whitepaper") {
    display: none !important;
    visibility: hidden !important;
    font-size: 0 !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    left: -99999px !important;
  }
}`;
          break;

        case 'github-visible':
          css = `
/* Force hide GitHub links for ${issue.device} */
@media screen and (max-width: 996px) {
  a[href*="github" i],
  [class*="github" i] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    width: 0 !important;
    height: 0 !important;
  }
}`;
          break;

        case 'hamburger-small':
          css = `
/* Fix hamburger size for ${issue.device} */
@media screen and (max-width: 996px) {
  .navbar__toggle {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    min-height: 44px !important;
  }
}`;
          break;

        case 'padding-incorrect':
          css = `
/* Fix container padding for ${issue.device} */
@media screen and (max-width: 996px) {
  .container {
    padding: 0 16px !important;
  }
}`;
          break;

        case 'small-touch-targets':
          css = `
/* Fix touch target sizes for ${issue.device} */
@media screen and (max-width: 996px) {
  button, a.button, .menu__link {
    min-height: 44px !important;
    min-width: 44px !important;
    padding: 12px 16px !important;
  }
}`;
          break;

        case 'small-font':
          css = `
/* Fix font sizes for ${issue.device} */
@media screen and (max-width: 996px) {
  p, li {
    font-size: max(16px, 1rem) !important;
  }
}`;
          break;

        case 'horizontal-scroll':
          css = `
/* Fix horizontal scroll for ${issue.device} */
@media screen and (max-width: 996px) {
  html, body {
    overflow-x: hidden !important;
  }
  * {
    max-width: 100vw !important;
  }
}`;
          break;
      }

      if (css) {
        improvements.push(css);
      }
    }

    this.improvements = improvements;
  }

  async updateCSS() {
    if (this.improvements.length === 0) return;

    const cssContent = `
/**
 * Auto-generated recursive improvements
 * Generated: ${new Date().toISOString()}
 * Issues fixed: ${this.issues.length}
 */

${this.improvements.join('\n\n')}
`;

    fs.appendFileSync('src/css/mobile-ultimate.css', cssContent);
    console.log(`   ✅ CSS 업데이트 완료: ${this.improvements.length}개 개선사항 적용`);
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.testResults.length,
      issuesFound: this.issues.length,
      improvementsApplied: this.improvements.length,
      results: this.testResults,
      finalScore: this.calculateScore()
    };

    fs.writeFileSync('ultimate-mobile-report.json', JSON.stringify(report, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('📊 최종 보고서');
    console.log('='.repeat(60));
    console.log(`✅ 총 테스트: ${report.totalTests}`);
    console.log(`🔧 발견된 문제: ${report.issuesFound}`);
    console.log(`💡 적용된 개선: ${report.improvementsApplied}`);
    console.log(`⭐ 최종 점수: ${report.finalScore}%`);

    if (report.finalScore >= 95) {
      console.log('\n🎉🎉🎉 완벽한 모바일 최적화 달성! 🎉🎉🎉');
    } else if (report.finalScore >= 85) {
      console.log('\n✅ 우수한 모바일 최적화 수준입니다.');
    } else {
      console.log('\n⚠️ 추가 개선이 필요합니다.');
    }
  }

  calculateScore() {
    if (this.testResults.length === 0) return 0;

    const lastRound = Math.max(...this.testResults.map(r => r.round));
    const lastResults = this.testResults.filter(r => r.round === lastRound);

    let totalChecks = 0;
    let passedChecks = 0;

    for (const result of lastResults) {
      for (const [key, value] of Object.entries(result.checks)) {
        totalChecks++;
        if (value === true || 
            (key === 'navbarHeight' && value === 60) ||
            (key === 'containerPadding' && value === 16) ||
            (key === 'sidebarWidth' && value >= 280 && value <= 300) ||
            (key === 'minFontSize' && value >= 14)) {
          passedChecks++;
        }
      }
    }

    return totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  }
}

// 실행
const optimizer = new UltimateMobileOptimizer();
optimizer.run().catch(console.error);