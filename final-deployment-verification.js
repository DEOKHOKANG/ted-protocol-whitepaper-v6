const { chromium } = require('playwright');

/**
 * 최종 배포 검증 스크립트
 * Success Standard v6.0.1 검증
 */

const URLS = [
  'https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app',
  'https://ted-protocol-whitepaper.vercel.app'
];

async function finalVerification() {
  console.log('🎯 최종 배포 검증 시작');
  console.log('📅 시간: ' + new Date().toISOString());
  console.log('📦 버전: v6.0.1-deployment-standard');
  console.log('━'.repeat(60));

  const browser = await chromium.launch({ 
    headless: false,
    viewport: { width: 375, height: 812 }
  });

  let bestUrl = null;
  let bestScore = 0;

  for (const url of URLS) {
    console.log(`\n🔍 검증 중: ${url}`);
    console.log('-'.repeat(50));

    const page = await browser.newPage();
    
    try {
      // 캐시 무시하고 페이지 로드
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000,
        bypassCSP: true 
      });

      // 강제 새로고침
      await page.reload({ waitUntil: 'networkidle' });
      
      // 모바일 뷰 설정
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(3000);

      // 성공 지표 체크
      const metrics = {
        whitepaperText: 0,
        githubLinks: 0,
        customHamburger: false,
        mobilePortal: false,
        rootJs: false
      };

      // 1. Whitepaper 텍스트 카운트
      metrics.whitepaperText = await page.locator('text=Whitepaper').count();
      console.log(`  📝 Whitepaper 텍스트: ${metrics.whitepaperText}개`);

      // 2. GitHub 링크 체크
      const githubVisible = await page.$$eval('a[href*="github"]', links => 
        links.filter(link => {
          const style = window.getComputedStyle(link);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }).length
      );
      metrics.githubLinks = githubVisible;
      console.log(`  🔗 GitHub 링크: ${metrics.githubLinks}개`);

      // 3. 커스텀 햄버거 메뉴
      const customHamburger = await page.$('#mobile-hamburger-btn');
      metrics.customHamburger = customHamburger !== null;
      console.log(`  🍔 커스텀 햄버거: ${metrics.customHamburger ? '✅' : '❌'}`);

      // 4. 모바일 메뉴 포털
      const mobilePortal = await page.$('#mobile-menu-portal');
      metrics.mobilePortal = mobilePortal !== null;
      console.log(`  📱 모바일 포털: ${metrics.mobilePortal ? '✅' : '❌'}`);

      // 5. Root.js 스크립트 체크
      const hasRootScript = await page.evaluate(() => {
        return typeof window.createMobileHamburgerMenu === 'function' ||
               document.querySelector('#mobile-hamburger-btn') !== null;
      });
      metrics.rootJs = hasRootScript;
      console.log(`  📜 Root.js: ${metrics.rootJs ? '✅' : '❌'}`);

      // 점수 계산
      let score = 0;
      if (metrics.whitepaperText === 0) score += 2;  // 가장 중요
      if (metrics.githubLinks === 0) score += 2;      // 가장 중요
      if (metrics.customHamburger) score += 1;
      if (metrics.mobilePortal) score += 1;
      if (metrics.rootJs) score += 1;

      console.log(`  ⭐ 점수: ${score}/7`);

      if (score > bestScore) {
        bestScore = score;
        bestUrl = url;
      }

      // 성공 판정
      if (score >= 5) {
        console.log(`  ✅ 배포 성공! 개선사항이 반영되었습니다.`);
        
        // 스크린샷 저장
        await page.screenshot({ 
          path: `success-mobile-${Date.now()}.png`,
          fullPage: false 
        });
        
        // PC 버전도 확인
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(2000);
        
        const pcGithub = await page.$('a[href*="github"]:visible');
        console.log(`  💻 PC GitHub 링크: ${pcGithub ? '✅' : '❌'}`);
        
        await page.screenshot({ 
          path: `success-desktop-${Date.now()}.png`,
          fullPage: false 
        });
      } else if (score > 0) {
        console.log(`  ⚠️ 부분 배포: 일부 개선사항만 반영`);
      } else {
        console.log(`  ❌ 구버전: 개선사항 미반영`);
      }

    } catch (error) {
      console.log(`  ❌ 에러: ${error.message}`);
    }

    await page.close();
  }

  await browser.close();

  // 최종 결과
  console.log('\n' + '═'.repeat(60));
  console.log('📊 최종 배포 결과');
  console.log('═'.repeat(60));
  
  if (bestScore >= 5) {
    console.log('✅ 배포 성공!');
    console.log(`🎉 최적 URL: ${bestUrl}`);
    console.log(`⭐ 최종 점수: ${bestScore}/7`);
    console.log('\n모든 주요 개선사항이 프로덕션에 반영되었습니다!');
  } else if (bestScore > 0) {
    console.log('⚠️ 부분 성공');
    console.log(`📍 URL: ${bestUrl}`);
    console.log(`⭐ 점수: ${bestScore}/7`);
    console.log('\n일부 개선사항만 반영되었습니다. 추가 시간이 필요할 수 있습니다.');
  } else {
    console.log('❌ 배포 실패');
    console.log('개선사항이 아직 반영되지 않았습니다.');
    console.log('\n해결 방법:');
    console.log('1. Vercel 대시보드 확인: https://vercel.com');
    console.log('2. 수동 배포 실행');
    console.log('3. GitHub Actions 확인');
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('검증 완료');
  console.log('═'.repeat(60));
}

// 실행
finalVerification();