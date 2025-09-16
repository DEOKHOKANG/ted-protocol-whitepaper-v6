const { chromium, devices } = require('playwright');

/**
 * 하이브리드 반응형 테스트 - PC 광폭부터 모바일까지
 */

class HybridResponsiveTester {
  constructor() {
    this.testConfigs = [
      // Mobile Devices
      { name: 'iPhone SE (320px)', viewport: { width: 320, height: 568 }, type: 'mobile' },
      { name: 'iPhone 12 (390px)', device: devices['iPhone 12'], type: 'mobile' },
      { name: 'iPhone 13 Pro Max', device: devices['iPhone 13 Pro Max'], type: 'mobile' },
      { name: 'Galaxy S20 (360px)', viewport: { width: 360, height: 800 }, type: 'mobile' },
      
      // Tablets
      { name: 'iPad Mini Portrait', device: devices['iPad Mini'], type: 'tablet' },
      { name: 'iPad Pro 11 Portrait', viewport: { width: 834, height: 1194 }, type: 'tablet' },
      { name: 'iPad Landscape', viewport: { width: 1024, height: 768 }, type: 'tablet' },
      
      // Desktop
      { name: 'Desktop HD (1280px)', viewport: { width: 1280, height: 720 }, type: 'desktop' },
      { name: 'Desktop FHD (1920px)', viewport: { width: 1920, height: 1080 }, type: 'desktop' },
      { name: 'Desktop QHD (2560px)', viewport: { width: 2560, height: 1440 }, type: 'desktop' },
      { name: 'Desktop 4K (3840px)', viewport: { width: 3840, height: 2160 }, type: 'desktop' }
    ];

    this.results = [];
  }

  async run() {
    console.log('🚀 하이브리드 반응형 테스트 시작');
    console.log('=' .repeat(80));
    console.log('📱 Mobile → 📱 Tablet → 💻 Desktop → 🖥️ Wide Screen');
    console.log('=' .repeat(80));

    const browser = await chromium.launch({ 
      headless: false,
      devtools: true 
    });

    for (const config of this.testConfigs) {
      await this.testDevice(browser, config);
    }

    await browser.close();
    this.generateReport();
  }

  async testDevice(browser, config) {
    const context = await browser.newContext({
      ...config.device,
      ...config.viewport ? { viewport: config.viewport } : {},
      locale: 'ko-KR'
    });

    const page = await context.newPage();

    console.log(`\n${this.getEmoji(config.type)} 테스트: ${config.name}`);
    console.log('-'.repeat(60));

    try {
      await page.goto('http://localhost:3000/ko', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      await page.waitForTimeout(1000);

      const viewport = config.viewport || config.device?.viewport;
      const width = viewport?.width || 0;

      const result = {
        name: config.name,
        type: config.type,
        width: width,
        tests: {}
      };

      // 1. 네비게이션 바 테스트
      const navbar = await page.$eval('.navbar', el => ({
        height: el.offsetHeight,
        padding: window.getComputedStyle(el).padding,
        position: window.getComputedStyle(el).position
      })).catch(() => null);

      result.tests.navbar = navbar;
      const expectedNavHeight = width < 600 ? 56 : width < 996 ? 70 : width < 1440 ? 80 : width < 1920 ? 90 : width < 2560 ? 100 : 120;
      console.log(`   📏 네비바: ${navbar?.height}px (예상 ${expectedNavHeight}px) ${navbar?.height === expectedNavHeight ? '✅' : '⚠️'}`);

      // 2. 컨테이너 너비 테스트
      const container = await page.$eval('.container', el => ({
        width: el.offsetWidth,
        maxWidth: window.getComputedStyle(el).maxWidth,
        padding: window.getComputedStyle(el).padding
      })).catch(() => null);

      result.tests.container = container;
      const expectedMaxWidth = width < 600 ? '100%' : 
                              width < 768 ? '640px' :
                              width < 996 ? '800px' :
                              width < 1280 ? '1024px' :
                              width < 1440 ? '1200px' :
                              width < 1920 ? '1320px' :
                              width < 2560 ? '1600px' : '2000px';
      console.log(`   📦 컨테이너: ${container?.width}px / ${container?.maxWidth} (예상 ${expectedMaxWidth})`);

      // 3. 타이포그래피 스케일
      const h1Size = await page.$eval('h1', el => 
        parseFloat(window.getComputedStyle(el).fontSize)
      ).catch(() => 0);

      result.tests.h1Size = h1Size;
      const minH1Size = width < 600 ? 24 : width < 996 ? 32 : width < 1440 ? 48 : 56;
      console.log(`   📝 H1 크기: ${h1Size}px (최소 ${minH1Size}px) ${h1Size >= minH1Size ? '✅' : '⚠️'}`);

      // 4. Whitepaper/GitHub 표시 테스트 (디바이스별 다르게)
      if (width < 996) {
        // 모바일/태블릿: 숨김
        const whitepaperVisible = await page.locator('.navbar__title:visible').count();
        const githubVisible = await page.locator('a[href*="github"]:visible').count();
        
        result.tests.whitepaperHidden = whitepaperVisible === 0;
        result.tests.githubHidden = githubVisible === 0;
        
        console.log(`   🚫 Whitepaper 숨김: ${whitepaperVisible === 0 ? '✅' : '❌'} (${whitepaperVisible}개)`);
        console.log(`   🚫 GitHub 숨김: ${githubVisible === 0 ? '✅' : '❌'} (${githubVisible}개)`);
      } else {
        // 데스크톱: 표시
        const whitepaperVisible = await page.locator('.navbar__title:visible').count();
        const githubVisible = await page.locator('a[href*="github"]:visible').count();
        
        result.tests.whitepaperVisible = whitepaperVisible > 0;
        result.tests.githubVisible = githubVisible > 0;
        
        console.log(`   ✨ Whitepaper 표시: ${whitepaperVisible > 0 ? '✅' : '❌'}`);
        console.log(`   ✨ GitHub 표시: ${githubVisible > 0 ? '✅' : '❌'}`);
      }

      // 5. 그리드 시스템 테스트
      const gridCols = await page.$$eval('.col', cols => cols.length);
      const expectedCols = width < 600 ? 1 : width < 768 ? 2 : width < 1280 ? 3 : width < 1920 ? 4 : 5;
      result.tests.gridColumns = gridCols;
      console.log(`   🏗️ 그리드 컬럼: ${gridCols}개 표시 가능`);

      // 6. 반응형 패딩 테스트
      const articlePadding = await page.$eval('article', el => {
        const style = window.getComputedStyle(el);
        return parseInt(style.paddingTop) + parseInt(style.paddingBottom);
      }).catch(() => 0);

      result.tests.articlePadding = articlePadding;
      const expectedPadding = width < 600 ? 32 : width < 768 ? 64 : width < 996 ? 96 : width < 1440 ? 120 : 160;
      console.log(`   📐 Article 패딩: ${articlePadding}px (예상 ${expectedPadding}px)`);

      // 7. 사이드바 테스트 (데스크톱)
      if (width >= 768) {
        const sidebar = await page.$('.doc-sidebar');
        if (sidebar) {
          const sidebarWidth = await sidebar.evaluate(el => el.offsetWidth);
          result.tests.sidebarWidth = sidebarWidth;
          const expectedSidebarWidth = width < 996 ? 240 : width < 1440 ? 280 : 320;
          console.log(`   📚 사이드바: ${sidebarWidth}px (예상 ${expectedSidebarWidth}px)`);
        }
      }

      // 8. 가로 스크롤 체크
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      result.tests.noHorizontalScroll = !hasHorizontalScroll;
      console.log(`   ↔️ 가로 스크롤: ${!hasHorizontalScroll ? '✅ 없음' : '❌ 있음'}`);

      // 9. 성능 점수 계산
      let score = 0;
      let total = 0;

      for (const [key, value] of Object.entries(result.tests)) {
        total++;
        if (value === true || 
            (key === 'navbar' && value?.height === expectedNavHeight) ||
            (key === 'noHorizontalScroll' && value === true) ||
            (key.includes('Hidden') && value === true && width < 996) ||
            (key.includes('Visible') && value === true && width >= 996)) {
          score++;
        }
      }

      result.score = Math.round((score / total) * 100);
      console.log(`   ⭐ 점수: ${result.score}%`);

      // 스크린샷
      await page.screenshot({ 
        path: `hybrid-${config.name.replace(/[\s()]/g, '-')}.png`,
        fullPage: false 
      });

      this.results.push(result);

    } catch (error) {
      console.error(`   ❌ 오류: ${error.message}`);
    }

    await context.close();
  }

  getEmoji(type) {
    switch(type) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      case 'desktop': return '💻';
      default: return '🖥️';
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 하이브리드 반응형 테스트 결과');
    console.log('='.repeat(80));

    // 디바이스 타입별 그룹화
    const byType = {
      mobile: this.results.filter(r => r.type === 'mobile'),
      tablet: this.results.filter(r => r.type === 'tablet'),
      desktop: this.results.filter(r => r.type === 'desktop')
    };

    for (const [type, results] of Object.entries(byType)) {
      if (results.length === 0) continue;

      const avgScore = Math.round(
        results.reduce((sum, r) => sum + r.score, 0) / results.length
      );

      console.log(`\n${this.getEmoji(type)} ${type.toUpperCase()}: 평균 점수 ${avgScore}%`);
      
      results.forEach(r => {
        const status = r.score >= 90 ? '✅' : r.score >= 70 ? '⚠️' : '❌';
        console.log(`   ${status} ${r.name}: ${r.score}%`);
      });
    }

    // 전체 평균
    const totalScore = Math.round(
      this.results.reduce((sum, r) => sum + r.score, 0) / this.results.length
    );

    console.log('\n' + '='.repeat(80));
    console.log(`🏆 전체 평균 점수: ${totalScore}%`);
    
    if (totalScore >= 90) {
      console.log('🎉 완벽한 하이브리드 반응형 구현!');
    } else if (totalScore >= 75) {
      console.log('✅ 우수한 반응형 구현입니다.');
    } else {
      console.log('⚠️ 개선이 필요한 부분이 있습니다.');
    }

    console.log('\n📱 Mobile (320-996px): Whitepaper/GitHub 숨김, 터치 최적화');
    console.log('💻 Desktop (996px+): 모든 요소 표시, 호버 효과, 넓은 레이아웃');
    console.log('🖥️ Wide (1920px+): 초광폭 레이아웃, 멀티 컬럼, 대형 타이포그래피');
  }
}

// 실행
const tester = new HybridResponsiveTester();
tester.run().catch(console.error);