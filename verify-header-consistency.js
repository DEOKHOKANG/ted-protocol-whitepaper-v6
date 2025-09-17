const { chromium, devices } = require('playwright');
const fs = require('fs');

/**
 * 모바일/PC 상단 헤더 일관성 검증
 */

class HeaderConsistencyVerifier {
  constructor() {
    this.pcHeader = {};
    this.mobileHeader = {};
    this.differences = [];
  }

  async verify() {
    console.log('🔍 상단 헤더 일관성 검증 시작');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ 
      headless: false,
      devtools: true 
    });

    // 1. PC 환경 헤더 분석
    await this.analyzePCHeader(browser);
    
    // 2. 모바일 환경 헤더 분석
    await this.analyzeMobileHeader(browser);
    
    // 3. 차이점 비교
    this.compareHeaders();
    
    // 4. 개선사항 제안
    this.generateImprovements();

    await browser.close();
  }

  async analyzePCHeader(browser) {
    console.log('\n💻 PC 환경 헤더 분석');
    console.log('-'.repeat(40));

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'ko-KR'
    });

    const page = await context.newPage();

    try {
      // 프로덕션 또는 로컬 테스트
      const url = 'https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app/ko/';
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
        .catch(async () => {
          await page.goto('http://localhost:3000/ko', { waitUntil: 'networkidle' });
        });

      await page.waitForTimeout(1000);

      // 네비게이션 바 분석
      this.pcHeader.navbar = await page.$eval('.navbar', el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          height: rect.height,
          background: style.background || style.backgroundColor,
          padding: style.padding,
          position: style.position,
          boxShadow: style.boxShadow,
          borderBottom: style.borderBottom
        };
      }).catch(() => null);

      console.log('📏 네비바 높이:', this.pcHeader.navbar?.height, 'px');
      console.log('🎨 배경:', this.pcHeader.navbar?.background);
      console.log('📐 패딩:', this.pcHeader.navbar?.padding);

      // 로고 분석
      this.pcHeader.logo = await page.$eval('.navbar__logo', el => {
        const rect = el.getBoundingClientRect();
        const img = el.querySelector('img');
        return {
          width: rect.width,
          height: rect.height,
          src: img?.src,
          alt: img?.alt
        };
      }).catch(() => null);

      console.log('🏷️ 로고:', this.pcHeader.logo?.width, 'x', this.pcHeader.logo?.height);

      // 타이틀 표시 여부
      this.pcHeader.title = await page.$eval('.navbar__title', el => {
        const style = window.getComputedStyle(el);
        return {
          text: el.textContent,
          display: style.display,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          color: style.color,
          visible: style.display !== 'none' && style.visibility !== 'hidden'
        };
      }).catch(() => ({ visible: false }));

      console.log('📝 타이틀 표시:', this.pcHeader.title?.visible ? '✅' : '❌', this.pcHeader.title?.text);

      // 메뉴 아이템
      this.pcHeader.menuItems = await page.$$eval('.navbar__item', items => {
        return items.map(item => {
          const style = window.getComputedStyle(item);
          const link = item.querySelector('a');
          return {
            text: item.textContent?.trim(),
            href: link?.href,
            display: style.display,
            visible: style.display !== 'none'
          };
        });
      }).catch(() => []);

      console.log('📋 메뉴 아이템:', this.pcHeader.menuItems.length, '개');
      this.pcHeader.menuItems.forEach(item => {
        if (item.visible) {
          console.log(`   - ${item.text}`);
        }
      });

      // GitHub 링크
      this.pcHeader.githubLink = await page.$eval('a[href*="github"]', el => {
        const style = window.getComputedStyle(el);
        return {
          href: el.href,
          visible: style.display !== 'none' && style.visibility !== 'hidden',
          display: style.display
        };
      }).catch(() => ({ visible: false }));

      console.log('🔗 GitHub 링크:', this.pcHeader.githubLink?.visible ? '✅ 표시' : '❌ 숨김');

      // 언어 선택기
      this.pcHeader.langSelector = await page.$eval('.navbar__item.dropdown', el => {
        const style = window.getComputedStyle(el);
        return {
          text: el.textContent?.trim(),
          visible: style.display !== 'none',
          position: el.getBoundingClientRect()
        };
      }).catch(() => ({ visible: false }));

      console.log('🌐 언어 선택기:', this.pcHeader.langSelector?.visible ? '✅' : '❌');

      // 스크린샷
      await page.screenshot({ 
        path: 'header-pc.png',
        clip: { x: 0, y: 0, width: 1440, height: 120 }
      });

    } catch (error) {
      console.error('❌ PC 헤더 분석 오류:', error.message);
    }

    await context.close();
  }

  async analyzeMobileHeader(browser) {
    console.log('\n📱 모바일 환경 헤더 분석');
    console.log('-'.repeat(40));

    const context = await browser.newContext({
      ...devices['iPhone 12'],
      locale: 'ko-KR'
    });

    const page = await context.newPage();

    try {
      const url = 'https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app/ko/';
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
        .catch(async () => {
          await page.goto('http://localhost:3000/ko', { waitUntil: 'networkidle' });
        });

      await page.waitForTimeout(1000);

      // 네비게이션 바 분석
      this.mobileHeader.navbar = await page.$eval('.navbar', el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          height: rect.height,
          background: style.background || style.backgroundColor,
          padding: style.padding,
          position: style.position,
          boxShadow: style.boxShadow,
          borderBottom: style.borderBottom
        };
      }).catch(() => null);

      console.log('📏 네비바 높이:', this.mobileHeader.navbar?.height, 'px');
      console.log('🎨 배경:', this.mobileHeader.navbar?.background);
      console.log('📐 패딩:', this.mobileHeader.navbar?.padding);

      // 로고 분석
      this.mobileHeader.logo = await page.$eval('.navbar__logo', el => {
        const rect = el.getBoundingClientRect();
        const img = el.querySelector('img');
        return {
          width: rect.width,
          height: rect.height,
          src: img?.src,
          alt: img?.alt
        };
      }).catch(() => null);

      console.log('🏷️ 로고:', this.mobileHeader.logo?.width, 'x', this.mobileHeader.logo?.height);

      // 타이틀 표시 여부
      this.mobileHeader.title = await page.$eval('.navbar__title', el => {
        const style = window.getComputedStyle(el);
        return {
          text: el.textContent,
          display: style.display,
          fontSize: style.fontSize,
          visible: style.display !== 'none' && style.visibility !== 'hidden'
        };
      }).catch(() => ({ visible: false }));

      console.log('📝 타이틀 표시:', this.mobileHeader.title?.visible ? '✅' : '❌', this.mobileHeader.title?.text);

      // 햄버거 메뉴
      this.mobileHeader.hamburger = await page.$eval('.navbar__toggle', el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          width: rect.width,
          height: rect.height,
          visible: style.display !== 'none',
          display: style.display
        };
      }).catch(() => ({ visible: false }));

      console.log('🍔 햄버거 메뉴:', this.mobileHeader.hamburger?.visible ? '✅' : '❌', 
                  `(${this.mobileHeader.hamburger?.width}x${this.mobileHeader.hamburger?.height})`);

      // GitHub 링크
      this.mobileHeader.githubLink = await page.$eval('a[href*="github"]', el => {
        const style = window.getComputedStyle(el);
        return {
          href: el.href,
          visible: style.display !== 'none' && style.visibility !== 'hidden',
          display: style.display
        };
      }).catch(() => ({ visible: false }));

      console.log('🔗 GitHub 링크:', this.mobileHeader.githubLink?.visible ? '✅ 표시' : '❌ 숨김');

      // 언어 선택기
      this.mobileHeader.langSelector = await page.$eval('.navbar__item.dropdown', el => {
        const style = window.getComputedStyle(el);
        return {
          text: el.textContent?.trim(),
          visible: style.display !== 'none',
          position: el.getBoundingClientRect()
        };
      }).catch(() => ({ visible: false }));

      console.log('🌐 언어 선택기:', this.mobileHeader.langSelector?.visible ? '✅' : '❌');

      // 사이드바 열기
      await page.click('.navbar__toggle').catch(() => {});
      await page.waitForTimeout(500);

      // 사이드바 메뉴 분석
      this.mobileHeader.sidebarMenu = await page.$$eval('.navbar-sidebar .menu__link', links => {
        return links.map(link => ({
          text: link.textContent?.trim(),
          href: link.href
        }));
      }).catch(() => []);

      console.log('📑 사이드바 메뉴:', this.mobileHeader.sidebarMenu.length, '개 항목');

      // 스크린샷
      await page.screenshot({ 
        path: 'header-mobile.png',
        clip: { x: 0, y: 0, width: 390, height: 120 }
      });

      await page.screenshot({ 
        path: 'header-mobile-sidebar.png',
        fullPage: false
      });

    } catch (error) {
      console.error('❌ 모바일 헤더 분석 오류:', error.message);
    }

    await context.close();
  }

  compareHeaders() {
    console.log('\n⚖️ PC vs 모바일 헤더 비교');
    console.log('=' .repeat(60));

    // 1. 높이 비교
    const heightDiff = Math.abs((this.pcHeader.navbar?.height || 0) - (this.mobileHeader.navbar?.height || 0));
    if (heightDiff > 20) {
      this.differences.push({
        type: 'height',
        pc: this.pcHeader.navbar?.height,
        mobile: this.mobileHeader.navbar?.height,
        severity: 'medium'
      });
      console.log(`❌ 높이 차이: PC ${this.pcHeader.navbar?.height}px vs Mobile ${this.mobileHeader.navbar?.height}px`);
    } else {
      console.log(`✅ 높이 일관성: PC ${this.pcHeader.navbar?.height}px vs Mobile ${this.mobileHeader.navbar?.height}px`);
    }

    // 2. 배경색 비교
    if (this.pcHeader.navbar?.background !== this.mobileHeader.navbar?.background) {
      this.differences.push({
        type: 'background',
        pc: this.pcHeader.navbar?.background,
        mobile: this.mobileHeader.navbar?.background,
        severity: 'low'
      });
      console.log('⚠️ 배경색 차이 발견');
    } else {
      console.log('✅ 배경색 일치');
    }

    // 3. 로고 크기 비교
    const logoRatio = (this.pcHeader.logo?.height || 1) / (this.mobileHeader.logo?.height || 1);
    if (logoRatio > 1.5 || logoRatio < 0.67) {
      this.differences.push({
        type: 'logo-size',
        pc: this.pcHeader.logo?.height,
        mobile: this.mobileHeader.logo?.height,
        severity: 'medium'
      });
      console.log(`❌ 로고 크기 차이: PC ${this.pcHeader.logo?.height}px vs Mobile ${this.mobileHeader.logo?.height}px`);
    } else {
      console.log('✅ 로고 크기 비례 적절');
    }

    // 4. 타이틀 표시
    if (this.pcHeader.title?.visible !== this.mobileHeader.title?.visible) {
      console.log(`📝 타이틀: PC ${this.pcHeader.title?.visible ? '표시' : '숨김'} vs Mobile ${this.mobileHeader.title?.visible ? '표시' : '숨김'}`);
    }

    // 5. GitHub 링크
    if (this.pcHeader.githubLink?.visible !== this.mobileHeader.githubLink?.visible) {
      console.log(`🔗 GitHub: PC ${this.pcHeader.githubLink?.visible ? '표시' : '숨김'} vs Mobile ${this.mobileHeader.githubLink?.visible ? '표시' : '숨김'}`);
    }

    // 6. 위치 속성
    if (this.pcHeader.navbar?.position !== this.mobileHeader.navbar?.position) {
      this.differences.push({
        type: 'position',
        pc: this.pcHeader.navbar?.position,
        mobile: this.mobileHeader.navbar?.position,
        severity: 'high'
      });
      console.log(`❌ 위치 속성: PC ${this.pcHeader.navbar?.position} vs Mobile ${this.mobileHeader.navbar?.position}`);
    }
  }

  generateImprovements() {
    console.log('\n🔧 개선사항 제안');
    console.log('=' .repeat(60));

    if (this.differences.length === 0) {
      console.log('✅ 헤더가 일관성 있게 구현되어 있습니다!');
      return;
    }

    const cssImprovements = [];

    // 높이 일관성
    const heightIssue = this.differences.find(d => d.type === 'height');
    if (heightIssue) {
      cssImprovements.push(`
/* 헤더 높이 일관성 */
@media screen and (max-width: 996px) {
  .navbar {
    height: 60px !important; /* PC와 유사한 높이 */
    min-height: 60px !important;
  }
}`);
    }

    // 배경 일관성
    const bgIssue = this.differences.find(d => d.type === 'background');
    if (bgIssue) {
      cssImprovements.push(`
/* 헤더 배경 일관성 */
.navbar {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
}`);
    }

    // 위치 일관성
    const posIssue = this.differences.find(d => d.type === 'position');
    if (posIssue) {
      cssImprovements.push(`
/* 헤더 위치 일관성 */
.navbar {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 999 !important;
}`);
    }

    // 로고 크기 비례
    const logoIssue = this.differences.find(d => d.type === 'logo-size');
    if (logoIssue) {
      cssImprovements.push(`
/* 로고 크기 비례 조정 */
@media screen and (max-width: 996px) {
  .navbar__logo {
    height: 32px !important; /* PC 대비 적절한 비율 */
  }
}`);
    }

    if (cssImprovements.length > 0) {
      console.log('📝 권장 CSS 수정사항:');
      cssImprovements.forEach(css => console.log(css));
      
      // CSS 파일로 저장
      const cssContent = `
/**
 * 헤더 일관성 개선
 * Generated: ${new Date().toISOString()}
 */

${cssImprovements.join('\n\n')}
`;
      
      fs.writeFileSync('header-consistency-fix.css', cssContent);
      console.log('\n✅ header-consistency-fix.css 파일 생성됨');
    }

    // 보고서 생성
    const report = {
      timestamp: new Date().toISOString(),
      pcHeader: this.pcHeader,
      mobileHeader: this.mobileHeader,
      differences: this.differences,
      improvements: cssImprovements.length
    };

    fs.writeFileSync('header-consistency-report.json', JSON.stringify(report, null, 2));
    console.log('✅ header-consistency-report.json 보고서 생성됨');
  }
}

// 실행
const verifier = new HeaderConsistencyVerifier();
verifier.verify().catch(console.error);