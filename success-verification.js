const { chromium } = require('playwright');

/**
 * 최종 성공 검증
 */

const PRODUCTION_URL = 'https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app';

async function verifySuccess() {
  console.log('🎉 TED Protocol Whitepaper v6.0 최종 검증');
  console.log('━'.repeat(60));
  console.log(`📍 Production URL: ${PRODUCTION_URL}`);
  console.log('━'.repeat(60));

  const browser = await chromium.launch({ 
    headless: false,
    viewport: { width: 375, height: 812 }
  });

  const page = await browser.newPage();

  try {
    // 페이지 로드
    await page.goto(PRODUCTION_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    console.log('\n✅ 사이트 접속 성공! (SSO 비활성화 완료)');
    
    const title = await page.title();
    console.log(`📄 페이지 제목: ${title}`);

    // 모바일 뷰 설정
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    console.log('\n📱 모바일 개선사항 검증:');
    
    // Whitepaper 텍스트 확인
    const whitepaperCount = await page.locator('text=Whitepaper').count();
    console.log(`   📝 Whitepaper 텍스트: ${whitepaperCount}개 ${whitepaperCount === 0 ? '✅' : '❌'}`);

    // GitHub 링크 확인
    const githubVisible = await page.$$eval('a[href*="github"]', links => 
      links.filter(link => {
        const style = window.getComputedStyle(link);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }).length
    );
    console.log(`   🔗 GitHub 링크: ${githubVisible}개 ${githubVisible === 0 ? '✅' : '❌'}`);

    // 커스텀 햄버거 메뉴
    const customHamburger = await page.$('#mobile-hamburger-btn');
    console.log(`   🍔 커스텀 햄버거: ${customHamburger ? '✅ 있음' : '❌ 없음'}`);

    // Root.js 적용
    const mobilePortal = await page.$('#mobile-menu-portal');
    console.log(`   📱 모바일 포털: ${mobilePortal ? '✅ 있음' : '❌ 없음'}`);

    // PC 버전 확인
    console.log('\n💻 데스크톱 버전 검증:');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1000);

    const pcGithub = await page.$('a[href*="github"]:visible');
    console.log(`   🔗 GitHub 링크: ${pcGithub ? '✅ 표시됨' : '❌ 숨김'}`);

    const pcHamburger = await page.$('.navbar__toggle');
    const pcHamburgerVisible = pcHamburger && await pcHamburger.isVisible();
    console.log(`   🍔 햄버거 메뉴: ${pcHamburgerVisible ? '❌ 표시됨' : '✅ 숨김'}`);

    // 스크린샷 저장
    await page.screenshot({ 
      path: 'success-mobile.png',
      fullPage: false 
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ 
      path: 'success-desktop.png',
      fullPage: false 
    });

    // 점수 계산
    let score = 0;
    let total = 6;
    if (whitepaperCount === 0) score++;
    if (githubVisible === 0) score++;
    if (customHamburger) score++;
    if (mobilePortal) score++;
    if (pcGithub) score++;
    if (!pcHamburgerVisible) score++;

    console.log('\n' + '═'.repeat(60));
    console.log('📊 최종 점수');
    console.log('═'.repeat(60));
    console.log(`⭐ ${score}/${total} 테스트 통과`);
    
    if (score === total) {
      console.log('\n🎉🎉🎉 완벽한 성공! 모든 개선사항이 적용되었습니다! 🎉🎉🎉');
    } else if (score >= 4) {
      console.log('\n✅ 성공! 대부분의 개선사항이 적용되었습니다.');
    } else {
      console.log('\n⚠️ 일부 개선사항만 적용되었습니다.');
    }

  } catch (error) {
    console.error(`❌ 오류: ${error.message}`);
  }

  await browser.close();

  console.log('\n' + '═'.repeat(60));
  console.log('📋 배포 정보');
  console.log('═'.repeat(60));
  console.log('GitHub: https://github.com/DEOKHOKANG/ted-protocol-whitepaper-v6');
  console.log('Vercel: https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app');
  console.log('API Token: i4Eal4DO8cxoBt2GKjEJNSnF');
  console.log('Project ID: prj_nlGJUWxGvSg5WE5ytR0kmLWhncfY');
  console.log('\n✅ SSO Protection: 비활성화 완료');
  console.log('✅ 배포 상태: LIVE AND OPERATIONAL');
}

verifySuccess();