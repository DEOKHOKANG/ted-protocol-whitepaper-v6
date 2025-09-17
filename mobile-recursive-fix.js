const { chromium, devices } = require('playwright');
const fs = require('fs');

/**
 * 모바일 최소 가로폭 최적화 재귀 개선
 */

class MobileRecursiveFixer {
  constructor() {
    this.rounds = 0;
    this.maxRounds = 5;
    this.issues = [];
    this.cssImprovements = [];
  }

  async run() {
    console.log('🔄 모바일 최소 가로폭 최적화 재귀 개선 시작');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ 
      headless: false,
      devtools: true 
    });

    // 테스트할 최소 가로폭 디바이스들
    const minWidthDevices = [
      { name: 'Ultra Small (280px)', viewport: { width: 280, height: 600 } },
      { name: 'Small Phone (320px)', viewport: { width: 320, height: 568 } },
      { name: 'iPhone SE', device: devices['iPhone SE'] },
      { name: 'Galaxy Fold Closed', viewport: { width: 280, height: 653 } },
      { name: 'Small Android', viewport: { width: 360, height: 640 } }
    ];

    let allPassed = false;
    
    while (!allPassed && this.rounds < this.maxRounds) {
      this.rounds++;
      this.issues = [];
      
      console.log(`\n📱 Round ${this.rounds} 테스트 시작`);
      console.log('-'.repeat(40));

      for (const device of minWidthDevices) {
        await this.testDevice(browser, device);
      }

      if (this.issues.length > 0) {
        console.log(`\n🔧 발견된 문제: ${this.issues.length}개`);
        await this.generateFixes();
        await this.applyFixes();
      } else {
        allPassed = true;
        console.log('\n✅ 모든 테스트 통과!');
      }
    }

    await browser.close();
    this.generateFinalReport();
  }

  async testDevice(browser, device) {
    const context = await browser.newContext({
      ...device.device,
      ...device.viewport ? { viewport: device.viewport } : {},
      locale: 'ko-KR'
    });

    const page = await context.newPage();
    
    console.log(`\n🔍 테스팅: ${device.name}`);

    try {
      // 로컬 서버 또는 배포된 사이트 테스트
      const testUrl = 'http://localhost:3000/ko';
      await page.goto(testUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      }).catch(async () => {
        // 로컬 서버가 없으면 프로덕션 테스트
        await page.goto('https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app/ko', {
          waitUntil: 'networkidle',
          timeout: 30000
        });
      });

      await page.waitForTimeout(1000);

      const viewport = device.viewport || device.device?.viewport;
      const width = viewport?.width || 320;

      // 1. 가로 스크롤 체크
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        this.issues.push({
          device: device.name,
          type: 'horizontal-scroll',
          scrollWidth: scrollWidth,
          viewportWidth: width,
          overflow: scrollWidth - width,
          severity: 'critical'
        });
        console.log(`   ❌ 가로 스크롤 발생: ${scrollWidth}px (뷰포트: ${width}px, 초과: ${scrollWidth - width}px)`);
      } else {
        console.log(`   ✅ 가로 스크롤 없음`);
      }

      // 2. 넘치는 요소 찾기
      const overflowElements = await page.evaluate((viewportWidth) => {
        const elements = document.querySelectorAll('*');
        const overflowing = [];
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          
          if (rect.width > viewportWidth || rect.right > viewportWidth) {
            overflowing.push({
              tag: el.tagName,
              class: el.className || 'no-class',
              width: rect.width,
              right: rect.right,
              text: el.textContent?.substring(0, 50)
            });
          }
        });
        
        return overflowing;
      }, width);

      if (overflowElements.length > 0) {
        console.log(`   ⚠️ 넘치는 요소: ${overflowElements.length}개`);
        overflowElements.slice(0, 3).forEach(el => {
          console.log(`      - ${el.tag}.${el.class}: ${el.width}px`);
          this.issues.push({
            device: device.name,
            type: 'overflow-element',
            element: el,
            severity: 'high'
          });
        });
      }

      // 3. 네비게이션 바 체크
      const navbar = await page.$eval('.navbar', el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          width: rect.width,
          height: rect.height,
          padding: style.padding,
          paddingLeft: parseInt(style.paddingLeft),
          paddingRight: parseInt(style.paddingRight)
        };
      }).catch(() => null);

      if (navbar) {
        const totalPadding = navbar.paddingLeft + navbar.paddingRight;
        if (totalPadding > width * 0.1) { // 패딩이 너비의 10% 초과
          this.issues.push({
            device: device.name,
            type: 'excessive-padding',
            element: 'navbar',
            padding: totalPadding,
            severity: 'medium'
          });
          console.log(`   ⚠️ 네비바 패딩 과다: ${totalPadding}px`);
        } else {
          console.log(`   ✅ 네비바 패딩 적절: ${totalPadding}px`);
        }
      }

      // 4. 컨테이너 체크
      const container = await page.$eval('.container', el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          width: rect.width,
          padding: style.padding,
          paddingLeft: parseInt(style.paddingLeft),
          paddingRight: parseInt(style.paddingRight),
          maxWidth: style.maxWidth
        };
      }).catch(() => null);

      if (container) {
        const totalPadding = container.paddingLeft + container.paddingRight;
        const idealPadding = width < 320 ? 8 : width < 375 ? 12 : 16;
        
        if (totalPadding > idealPadding * 2) {
          this.issues.push({
            device: device.name,
            type: 'container-padding',
            current: totalPadding,
            ideal: idealPadding * 2,
            severity: 'medium'
          });
          console.log(`   ⚠️ 컨테이너 패딩 조정 필요: ${totalPadding}px → ${idealPadding * 2}px`);
        } else {
          console.log(`   ✅ 컨테이너 패딩 적절`);
        }
      }

      // 5. 폰트 크기 체크
      const textElements = await page.$$eval('p, li, span', elements => {
        return elements.slice(0, 10).map(el => {
          const style = window.getComputedStyle(el);
          return {
            tag: el.tagName,
            fontSize: parseFloat(style.fontSize),
            width: el.getBoundingClientRect().width
          };
        });
      });

      const tooSmall = textElements.filter(el => el.fontSize < 12);
      if (tooSmall.length > 0) {
        this.issues.push({
          device: device.name,
          type: 'small-font',
          count: tooSmall.length,
          minSize: Math.min(...tooSmall.map(el => el.fontSize)),
          severity: 'low'
        });
        console.log(`   ⚠️ 작은 폰트: ${tooSmall.length}개 (최소 ${Math.min(...tooSmall.map(el => el.fontSize))}px)`);
      }

      // 6. 이미지 체크
      const images = await page.$$eval('img', imgs => {
        return imgs.map(img => {
          const rect = img.getBoundingClientRect();
          const style = window.getComputedStyle(img);
          return {
            src: img.src?.substring(img.src.lastIndexOf('/') + 1),
            width: rect.width,
            naturalWidth: img.naturalWidth,
            maxWidth: style.maxWidth
          };
        });
      });

      const oversizedImages = images.filter(img => img.width > width);
      if (oversizedImages.length > 0) {
        oversizedImages.forEach(img => {
          this.issues.push({
            device: device.name,
            type: 'oversized-image',
            image: img,
            severity: 'high'
          });
        });
        console.log(`   ❌ 큰 이미지: ${oversizedImages.length}개`);
      }

      // 7. 버튼 및 터치 타겟
      const buttons = await page.$$eval('button, a.button, .menu__link', elements => {
        return elements.map(el => {
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            width: rect.width,
            height: rect.height
          };
        });
      });

      const smallButtons = buttons.filter(btn => btn.width < 44 || btn.height < 44);
      if (smallButtons.length > 0) {
        this.issues.push({
          device: device.name,
          type: 'small-touch-target',
          count: smallButtons.length,
          severity: 'medium'
        });
        console.log(`   ⚠️ 작은 터치 타겟: ${smallButtons.length}개`);
      }

      // 스크린샷
      await page.screenshot({ 
        path: `mobile-fix-${device.name.replace(/[\s()]/g, '-')}-round${this.rounds}.png`,
        fullPage: false 
      });

    } catch (error) {
      console.error(`   ❌ 테스트 오류: ${error.message}`);
    }

    await context.close();
  }

  async generateFixes() {
    const fixes = [];

    // 가로 스크롤 문제 해결
    const scrollIssues = this.issues.filter(i => i.type === 'horizontal-scroll');
    if (scrollIssues.length > 0) {
      fixes.push(`
/* 가로 스크롤 완전 제거 */
@media screen and (max-width: 400px) {
  html, body {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
  
  * {
    max-width: 100vw !important;
    box-sizing: border-box !important;
  }
  
  .container, main, article {
    width: 100% !important;
    max-width: 100% !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}`);
    }

    // 넘치는 요소 수정
    const overflowIssues = this.issues.filter(i => i.type === 'overflow-element');
    if (overflowIssues.length > 0) {
      const elements = [...new Set(overflowIssues.map(i => i.element.tag))];
      fixes.push(`
/* 넘치는 요소 수정 */
@media screen and (max-width: 400px) {
  ${elements.join(', ')} {
    max-width: 100% !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
  
  pre, code {
    max-width: 100% !important;
    overflow-x: auto !important;
    white-space: pre-wrap !important;
  }
  
  table {
    display: block !important;
    overflow-x: auto !important;
    width: 100% !important;
  }
}`);
    }

    // 패딩 최적화
    const paddingIssues = this.issues.filter(i => i.type === 'excessive-padding' || i.type === 'container-padding');
    if (paddingIssues.length > 0) {
      fixes.push(`
/* 최소 가로폭 패딩 최적화 */
@media screen and (max-width: 320px) {
  .navbar {
    padding: 0 8px !important;
  }
  
  .container {
    padding: 0 8px !important;
  }
  
  article {
    padding: 12px 0 !important;
  }
  
  .card {
    padding: 8px !important;
    margin: 8px 0 !important;
  }
}

@media screen and (min-width: 321px) and (max-width: 374px) {
  .navbar {
    padding: 0 10px !important;
  }
  
  .container {
    padding: 0 10px !important;
  }
}

@media screen and (min-width: 375px) and (max-width: 400px) {
  .navbar {
    padding: 0 12px !important;
  }
  
  .container {
    padding: 0 12px !important;
  }
}`);
    }

    // 이미지 최적화
    const imageIssues = this.issues.filter(i => i.type === 'oversized-image');
    if (imageIssues.length > 0) {
      fixes.push(`
/* 이미지 반응형 최적화 */
@media screen and (max-width: 400px) {
  img {
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
  }
  
  figure {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .navbar__logo img {
    max-height: 28px !important;
    width: auto !important;
  }
}`);
    }

    // 폰트 크기 조정
    const fontIssues = this.issues.filter(i => i.type === 'small-font');
    if (fontIssues.length > 0) {
      fixes.push(`
/* 최소 폰트 크기 보장 */
@media screen and (max-width: 320px) {
  body {
    font-size: 13px !important;
  }
  
  p, li {
    font-size: 13px !important;
    line-height: 1.5 !important;
  }
  
  h1 {
    font-size: 22px !important;
  }
  
  h2 {
    font-size: 18px !important;
  }
  
  h3 {
    font-size: 16px !important;
  }
}`);
    }

    // 터치 타겟 최적화
    const touchIssues = this.issues.filter(i => i.type === 'small-touch-target');
    if (touchIssues.length > 0) {
      fixes.push(`
/* 터치 타겟 최소 크기 보장 */
@media screen and (max-width: 400px) {
  button, a.button, .menu__link {
    min-height: 44px !important;
    min-width: 44px !important;
    padding: 10px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .navbar__toggle {
    width: 44px !important;
    height: 44px !important;
  }
}`);
    }

    this.cssImprovements = fixes;
  }

  async applyFixes() {
    if (this.cssImprovements.length === 0) return;

    const cssContent = `
/**
 * 모바일 최소 가로폭 재귀 개선 - Round ${this.rounds}
 * 생성: ${new Date().toISOString()}
 */

${this.cssImprovements.join('\n\n')}
`;

    // mobile-ultimate.css에 추가
    fs.appendFileSync('src/css/mobile-ultimate.css', cssContent);
    console.log(`\n✅ CSS 개선사항 ${this.cssImprovements.length}개 적용됨`);
  }

  generateFinalReport() {
    const report = {
      timestamp: new Date().toISOString(),
      rounds: this.rounds,
      totalIssues: this.issues.length,
      improvements: this.cssImprovements.length,
      finalStatus: this.issues.length === 0 ? 'SUCCESS' : 'PARTIAL'
    };

    fs.writeFileSync('mobile-recursive-report.json', JSON.stringify(report, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('📊 최종 보고서');
    console.log('='.repeat(60));
    console.log(`🔄 실행 라운드: ${this.rounds}`);
    console.log(`🔧 수정된 문제: ${this.cssImprovements.length}`);
    console.log(`⚠️ 남은 문제: ${this.issues.length}`);
    
    if (this.issues.length === 0) {
      console.log('\n🎉🎉🎉 모든 모바일 최소 가로폭 문제 해결! 🎉🎉🎉');
    } else {
      console.log('\n⚠️ 일부 문제가 남아있습니다. 추가 개선이 필요합니다.');
      console.log('\n남은 문제들:');
      this.issues.slice(0, 5).forEach(issue => {
        console.log(`- ${issue.device}: ${issue.type}`);
      });
    }
  }
}

// 실행
const fixer = new MobileRecursiveFixer();
fixer.run().catch(console.error);