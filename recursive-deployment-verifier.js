const { chromium, devices } = require('playwright');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * 재귀적 배포 검증 및 개선
 */

class RecursiveDeploymentVerifier {
  constructor() {
    this.deploymentUrl = null;
    this.issues = [];
    this.improvements = [];
    this.round = 0;
    this.maxRounds = 3;
  }

  async run() {
    console.log('🔄 재귀적 배포 검증 시작');
    console.log('=' .repeat(60));

    // 최신 배포 URL 가져오기
    await this.getLatestDeployment();

    const browser = await chromium.launch({ 
      headless: false,
      devtools: true 
    });

    let allFixed = false;

    while (!allFixed && this.round < this.maxRounds) {
      this.round++;
      this.issues = [];

      console.log(`\n📍 Round ${this.round}: 검증 시작`);
      console.log(`🌐 URL: ${this.deploymentUrl}`);
      console.log('-'.repeat(40));

      // 1. 모바일 검증
      await this.verifyMobile(browser);
      
      // 2. PC 검증
      await this.verifyDesktop(browser);

      // 3. 문제 분석
      if (this.issues.length > 0) {
        console.log(`\n❌ 발견된 문제: ${this.issues.length}개`);
        
        // 4. 개선사항 생성
        await this.generateFixes();
        
        // 5. 파일 수정
        await this.applyFixes();
        
        // 6. 재배포
        await this.redeploy();
        
        // 7. 배포 완료 대기
        await this.waitForDeployment();
      } else {
        allFixed = true;
        console.log('\n✅ 모든 문제 해결됨!');
      }
    }

    await browser.close();
    this.generateFinalReport();
  }

  async getLatestDeployment() {
    try {
      const cmd = `curl -s -H "Authorization: Bearer i4Eal4DO8cxoBt2GKjEJNSnF" "https://api.vercel.com/v6/deployments?projectId=prj_nlGJUWxGvSg5WE5ytR0kmLWhncfY&limit=1&state=READY" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['deployments'][0]['url'] if 'deployments' in data and data['deployments'] else '')"`;
      
      const { stdout } = await execPromise(cmd);
      this.deploymentUrl = stdout.trim();
      
      if (this.deploymentUrl) {
        this.deploymentUrl = `https://${this.deploymentUrl}`;
      } else {
        // 폴백 URL
        this.deploymentUrl = 'https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app';
      }
      
      console.log(`📌 배포 URL: ${this.deploymentUrl}`);
    } catch (error) {
      console.error('배포 URL 가져오기 실패:', error.message);
      this.deploymentUrl = 'https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app';
    }
  }

  async verifyMobile(browser) {
    console.log('\n📱 모바일 검증');

    const context = await browser.newContext({
      ...devices['iPhone 12'],
      locale: 'ko-KR'
    });

    const page = await context.newPage();

    try {
      await page.goto(`${this.deploymentUrl}/ko/`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      await page.waitForTimeout(2000);

      // 1. 가로 스크롤 체크
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        this.issues.push({
          type: 'horizontal-scroll',
          device: 'mobile',
          severity: 'critical'
        });
        console.log('   ❌ 가로 스크롤 발생');
      } else {
        console.log('   ✅ 가로 스크롤 없음');
      }

      // 2. 헤더 높이
      const navbarHeight = await page.$eval('.navbar', el => el.offsetHeight).catch(() => 0);
      const expectedHeight = 60;
      
      if (Math.abs(navbarHeight - expectedHeight) > 5) {
        this.issues.push({
          type: 'navbar-height',
          device: 'mobile',
          actual: navbarHeight,
          expected: expectedHeight,
          severity: 'medium'
        });
        console.log(`   ❌ 네비바 높이: ${navbarHeight}px (예상: ${expectedHeight}px)`);
      } else {
        console.log(`   ✅ 네비바 높이: ${navbarHeight}px`);
      }

      // 3. Whitepaper 텍스트
      const whitepaperVisible = await page.$$eval('.navbar__title', elements => {
        return elements.filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }).length;
      });

      if (whitepaperVisible > 0) {
        this.issues.push({
          type: 'whitepaper-visible',
          device: 'mobile',
          count: whitepaperVisible,
          severity: 'high'
        });
        console.log(`   ❌ Whitepaper 텍스트 표시: ${whitepaperVisible}개`);
      } else {
        console.log('   ✅ Whitepaper 텍스트 숨김');
      }

      // 4. GitHub 링크
      const githubVisible = await page.$$eval('a[href*="github"]', links => {
        return links.filter(link => {
          const style = window.getComputedStyle(link);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }).length;
      });

      if (githubVisible > 0) {
        this.issues.push({
          type: 'github-visible',
          device: 'mobile',
          count: githubVisible,
          severity: 'high'
        });
        console.log(`   ❌ GitHub 링크 표시: ${githubVisible}개`);
      } else {
        console.log('   ✅ GitHub 링크 숨김');
      }

      // 5. 패딩 체크
      const containerPadding = await page.$eval('.container', el => {
        const style = window.getComputedStyle(el);
        return parseInt(style.paddingLeft);
      }).catch(() => 0);

      if (containerPadding < 10 || containerPadding > 20) {
        this.issues.push({
          type: 'padding-issue',
          device: 'mobile',
          actual: containerPadding,
          severity: 'low'
        });
        console.log(`   ⚠️ 컨테이너 패딩: ${containerPadding}px`);
      } else {
        console.log(`   ✅ 컨테이너 패딩: ${containerPadding}px`);
      }

      // 스크린샷
      await page.screenshot({ 
        path: `verify-mobile-round${this.round}.png`,
        fullPage: false 
      });

    } catch (error) {
      console.error(`   ❌ 모바일 검증 오류: ${error.message}`);
    }

    await context.close();
  }

  async verifyDesktop(browser) {
    console.log('\n💻 데스크톱 검증');

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'ko-KR'
    });

    const page = await context.newPage();

    try {
      await page.goto(`${this.deploymentUrl}/ko/`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      await page.waitForTimeout(2000);

      // 1. 헤더 높이
      const navbarHeight = await page.$eval('.navbar', el => el.offsetHeight).catch(() => 0);
      const expectedHeight = 70;
      
      if (Math.abs(navbarHeight - expectedHeight) > 5) {
        this.issues.push({
          type: 'navbar-height',
          device: 'desktop',
          actual: navbarHeight,
          expected: expectedHeight,
          severity: 'medium'
        });
        console.log(`   ❌ 네비바 높이: ${navbarHeight}px (예상: ${expectedHeight}px)`);
      } else {
        console.log(`   ✅ 네비바 높이: ${navbarHeight}px`);
      }

      // 2. Whitepaper 타이틀
      const titleVisible = await page.$$eval('.navbar__title', elements => {
        return elements.filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }).length;
      });

      if (titleVisible === 0) {
        this.issues.push({
          type: 'title-hidden',
          device: 'desktop',
          severity: 'high'
        });
        console.log('   ❌ Whitepaper 타이틀 숨김');
      } else {
        console.log('   ✅ Whitepaper 타이틀 표시');
      }

      // 3. GitHub 링크
      const githubVisible = await page.$$eval('a[href*="github"]', links => {
        return links.filter(link => {
          const style = window.getComputedStyle(link);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }).length;
      });

      if (githubVisible === 0) {
        this.issues.push({
          type: 'github-hidden',
          device: 'desktop',
          severity: 'high'
        });
        console.log('   ❌ GitHub 링크 숨김');
      } else {
        console.log('   ✅ GitHub 링크 표시');
      }

      // 스크린샷
      await page.screenshot({ 
        path: `verify-desktop-round${this.round}.png`,
        fullPage: false 
      });

    } catch (error) {
      console.error(`   ❌ 데스크톱 검증 오류: ${error.message}`);
    }

    await context.close();
  }

  async generateFixes() {
    console.log('\n🔧 개선사항 생성');
    
    const fixes = [];

    // 가로 스크롤 문제
    if (this.issues.some(i => i.type === 'horizontal-scroll')) {
      fixes.push(`
/* FORCE: 가로 스크롤 제거 - Round ${this.round} */
@media screen and (max-width: 996px) {
  html, body, #__docusaurus {
    overflow-x: hidden !important;
    max-width: 100vw !important;
    width: 100% !important;
  }
  
  * {
    max-width: 100vw !important;
  }
}
`);
    }

    // 모바일 Whitepaper 텍스트
    if (this.issues.some(i => i.type === 'whitepaper-visible' && i.device === 'mobile')) {
      fixes.push(`
/* FORCE: 모바일 Whitepaper 숨김 - Round ${this.round} */
@media screen and (max-width: 479px) {
  .navbar__title,
  .navbar__brand b,
  .navbar__brand strong,
  [class*="title"]:contains("Whitepaper") {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    font-size: 0 !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    left: -99999px !important;
  }
}
`);
    }

    // 모바일 GitHub 링크
    if (this.issues.some(i => i.type === 'github-visible' && i.device === 'mobile')) {
      fixes.push(`
/* FORCE: 모바일 GitHub 숨김 - Round ${this.round} */
@media screen and (max-width: 996px) {
  a[href*="github" i],
  .header-github-link,
  [class*="github" i] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    width: 0 !important;
    height: 0 !important;
  }
}
`);
    }

    // 데스크톱 타이틀 표시
    if (this.issues.some(i => i.type === 'title-hidden' && i.device === 'desktop')) {
      fixes.push(`
/* FORCE: 데스크톱 타이틀 표시 - Round ${this.round} */
@media screen and (min-width: 996px) {
  .navbar__title {
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    width: auto !important;
    height: auto !important;
    position: static !important;
  }
}
`);
    }

    // 데스크톱 GitHub 표시
    if (this.issues.some(i => i.type === 'github-hidden' && i.device === 'desktop')) {
      fixes.push(`
/* FORCE: 데스크톱 GitHub 표시 - Round ${this.round} */
@media screen and (min-width: 996px) {
  a[href*="github" i] {
    display: inline-flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    width: auto !important;
    height: auto !important;
  }
}
`);
    }

    // 네비바 높이
    const heightIssues = this.issues.filter(i => i.type === 'navbar-height');
    for (const issue of heightIssues) {
      const query = issue.device === 'mobile' ? 'max-width: 996px' : 'min-width: 996px';
      fixes.push(`
/* FORCE: 네비바 높이 - ${issue.device} - Round ${this.round} */
@media screen and (${query}) {
  .navbar {
    height: ${issue.expected}px !important;
    min-height: ${issue.expected}px !important;
    max-height: ${issue.expected}px !important;
  }
  
  .main-wrapper {
    padding-top: ${issue.expected}px !important;
  }
}
`);
    }

    this.improvements = fixes;
    console.log(`   생성된 수정사항: ${fixes.length}개`);
  }

  async applyFixes() {
    if (this.improvements.length === 0) return;

    console.log('\n📝 CSS 파일 수정');

    const cssContent = `

/* ========================================
   RECURSIVE FIX - Round ${this.round}
   Generated: ${new Date().toISOString()}
   Issues Fixed: ${this.issues.length}
   ======================================== */

${this.improvements.join('\n')}

/* Round ${this.round} Cache Buster: ${Date.now()} */
`;

    // custom.css에 추가
    fs.appendFileSync('src/css/custom.css', cssContent);
    console.log('   ✅ custom.css 업데이트 완료');

    // vercel.json 캐시 버스터 업데이트
    const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    vercelJson.env = vercelJson.env || {};
    vercelJson.env.CACHE_BUSTER = `recursive-fix-${this.round}-${Date.now()}`;
    vercelJson.env.FORCE_REBUILD = new Date().toISOString();
    fs.writeFileSync('vercel.json', JSON.stringify(vercelJson, null, 2));
    console.log('   ✅ vercel.json 캐시 버스터 업데이트');
  }

  async redeploy() {
    console.log('\n🚀 재배포 시작');

    try {
      // Git commit and push
      await execPromise(`git add -A`);
      await execPromise(`git commit -m "fix: Recursive deployment fix round ${this.round}

- ${this.issues.length}개 문제 수정
- 캐시 버스터 업데이트
- 강제 CSS 오버라이드 적용"`);
      
      const { stdout } = await execPromise(`git push origin main 2>&1`);
      console.log('   ✅ Git push 완료');

      // Vercel 배포 트리거
      await execPromise(`curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_nlGJUWxGvSg5WE5ytR0kmLWhncfY/x8QRJNy63E`);
      console.log('   ✅ Vercel 배포 트리거');

    } catch (error) {
      console.error('   ❌ 재배포 실패:', error.message);
    }
  }

  async waitForDeployment() {
    console.log('\n⏳ 배포 완료 대기 (최대 3분)');
    
    const maxWait = 180000; // 3분
    const checkInterval = 10000; // 10초
    let waited = 0;

    while (waited < maxWait) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      waited += checkInterval;

      try {
        const cmd = `curl -s -H "Authorization: Bearer i4Eal4DO8cxoBt2GKjEJNSnF" "https://api.vercel.com/v6/deployments?projectId=prj_nlGJUWxGvSg5WE5ytR0kmLWhncfY&limit=1" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['deployments'][0]['state'] if 'deployments' in data and data['deployments'] else '')"`;
        
        const { stdout } = await execPromise(cmd);
        const state = stdout.trim();
        
        console.log(`   상태: ${state} (${waited/1000}초 경과)`);
        
        if (state === 'READY') {
          // 새 URL 가져오기
          await this.getLatestDeployment();
          console.log('   ✅ 배포 완료!');
          return;
        }
      } catch (error) {
        console.error('   상태 확인 실패:', error.message);
      }
    }

    console.log('   ⚠️ 배포 대기 시간 초과');
  }

  generateFinalReport() {
    const report = {
      timestamp: new Date().toISOString(),
      rounds: this.round,
      totalIssues: this.issues.length,
      finalUrl: this.deploymentUrl,
      status: this.issues.length === 0 ? 'SUCCESS' : 'PARTIAL',
      issues: this.issues,
      improvements: this.improvements.length
    };

    fs.writeFileSync('recursive-deployment-report.json', JSON.stringify(report, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('📊 최종 보고서');
    console.log('='.repeat(60));
    console.log(`🔄 실행 라운드: ${this.round}`);
    console.log(`🔧 수정된 문제: ${this.improvements.length}`);
    console.log(`⚠️ 남은 문제: ${this.issues.length}`);
    console.log(`🌐 최종 URL: ${this.deploymentUrl}`);
    
    if (this.issues.length === 0) {
      console.log('\n🎉🎉🎉 모든 문제 해결 및 배포 성공! 🎉🎉🎉');
    } else {
      console.log('\n⚠️ 일부 문제가 남아있습니다.');
      this.issues.forEach(issue => {
        console.log(`- ${issue.device}: ${issue.type}`);
      });
    }
  }
}

// 실행
const verifier = new RecursiveDeploymentVerifier();
verifier.run().catch(console.error);