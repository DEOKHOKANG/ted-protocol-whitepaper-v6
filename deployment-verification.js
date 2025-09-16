const { chromium } = require('playwright');

/**
 * Vercel 배포 완료 검증 스크립트
 * 목적: 배포 상태 확인 및 최신 버전 검증
 */

const PRODUCTION_URL = 'https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app';

async function verifyDeployment() {
  console.log('🔍 Vercel 배포 완료 검증 시작');
  console.log('━'.repeat(60));
  console.log(`📍 Production URL: ${PRODUCTION_URL}`);
  console.log(`🕐 검증 시간: ${new Date().toISOString()}`);
  console.log('━'.repeat(60));

  const browser = await chromium.launch({ 
    headless: false,
    viewport: { width: 1440, height: 900 }
  });

  const context = await browser.newContext({
    // 캐시 무시 설정
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });

  const page = await context.newPage();

  try {
    // 1. 페이지 로드 및 기본 정보
    console.log('\n1️⃣ 페이지 접속 및 기본 정보 확인...');
    await page.goto(PRODUCTION_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    const title = await page.title();
    console.log(`   ✅ 페이지 제목: ${title}`);

    // 2. 소스 코드에서 버전 정보 찾기
    console.log('\n2️⃣ 배포 버전 정보 확인...');
    const pageContent = await page.content();
    
    // CSS 파일 버전 확인
    const cssLinks = await page.$$eval('link[rel="stylesheet"]', links => 
      links.map(link => link.href)
    );
    
    const hasCustomCSS = cssLinks.some(href => href.includes('custom'));
    console.log(`   ${hasCustomCSS ? '✅' : '❌'} Custom CSS 로드: ${hasCustomCSS ? 'Yes' : 'No'}`);

    // JS 파일 체크
    const scriptSrcs = await page.$$eval('script[src]', scripts => 
      scripts.map(script => script.src)
    );
    console.log(`   ✅ JS 파일 개수: ${scriptSrcs.length}개`);

    // 3. 모바일 뷰에서 개선사항 확인
    console.log('\n3️⃣ 모바일 개선사항 확인...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    // Whitepaper 텍스트 카운트
    const whitepaperCount = await page.locator('text=Whitepaper').count();
    console.log(`   📝 Whitepaper 텍스트: ${whitepaperCount}개`);

    // GitHub 링크 확인
    const githubLinks = await page.locator('a[href*="github"]:visible').count();
    console.log(`   🔗 GitHub 링크: ${githubLinks}개`);

    // 커스텀 햄버거 메뉴 확인
    const customHamburger = await page.$('#mobile-hamburger-btn');
    const defaultHamburger = await page.$('.navbar__toggle');
    
    if (customHamburger) {
      console.log(`   ✅ 커스텀 햄버거 메뉴: 발견됨`);
    } else if (defaultHamburger) {
      console.log(`   ❌ 기본 Docusaurus 햄버거 메뉴 사용 중`);
    }

    // 4. Root.js 스크립트 확인
    console.log('\n4️⃣ Root.js 스크립트 적용 확인...');
    const mobileMenuPortal = await page.$('#mobile-menu-portal');
    if (mobileMenuPortal) {
      console.log(`   ✅ Mobile Menu Portal: 존재함 (Root.js 적용됨)`);
    } else {
      console.log(`   ❌ Mobile Menu Portal: 없음 (Root.js 미적용)`);
    }

    // 5. 네트워크 응답 헤더 확인
    console.log('\n5️⃣ 서버 응답 헤더 확인...');
    const response = await page.goto(PRODUCTION_URL, { waitUntil: 'domcontentloaded' });
    const headers = response.headers();
    
    if (headers['x-vercel-id']) {
      console.log(`   ✅ Vercel ID: ${headers['x-vercel-id']}`);
    }
    if (headers['x-vercel-deployment-url']) {
      console.log(`   ✅ Deployment URL: ${headers['x-vercel-deployment-url']}`);
    }
    if (headers['age']) {
      console.log(`   ⏱️ Cache Age: ${headers['age']} seconds`);
    }

    // 6. 최종 배포 URL 확인
    console.log('\n6️⃣ 최종 배포 URL 정보...');
    const currentURL = page.url();
    console.log(`   🔗 Current URL: ${currentURL}`);
    
    // Vercel 프리뷰 URL 패턴 체크
    if (currentURL.includes('vercel.app')) {
      if (currentURL.includes('-git-')) {
        const match = currentURL.match(/-git-([^-]+)-/);
        if (match) {
          console.log(`   🔀 Git Branch Deployment: ${match[1]}`);
        }
      } else if (currentURL.includes('dpgs2c0gj')) {
        console.log(`   ✅ Production Deployment Confirmed`);
      }
    }

    // 7. 스크린샷 저장
    console.log('\n7️⃣ 검증 스크린샷 저장...');
    
    // 모바일 스크린샷
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({ 
      path: 'deployment-mobile-verification.png',
      fullPage: false 
    });
    console.log(`   📸 Mobile screenshot saved`);

    // PC 스크린샷
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ 
      path: 'deployment-desktop-verification.png',
      fullPage: false 
    });
    console.log(`   📸 Desktop screenshot saved`);

    // 8. 배포 상태 판정
    console.log('\n' + '═'.repeat(60));
    console.log('📊 배포 상태 최종 판정');
    console.log('═'.repeat(60));

    const isDeployed = {
      customCSS: hasCustomCSS,
      rootJS: mobileMenuPortal !== null,
      whitepaperFixed: whitepaperCount === 0,
      githubFixed: githubLinks === 0,
      customHamburger: customHamburger !== null
    };

    const deploymentScore = Object.values(isDeployed).filter(v => v).length;
    const totalChecks = Object.keys(isDeployed).length;

    console.log('\n배포 체크리스트:');
    console.log(`   ${isDeployed.customCSS ? '✅' : '❌'} Custom CSS 적용`);
    console.log(`   ${isDeployed.rootJS ? '✅' : '❌'} Root.js 스크립트 적용`);
    console.log(`   ${isDeployed.whitepaperFixed ? '✅' : '❌'} Whitepaper 텍스트 제거`);
    console.log(`   ${isDeployed.githubFixed ? '✅' : '❌'} GitHub 링크 숨김`);
    console.log(`   ${isDeployed.customHamburger ? '✅' : '❌'} 커스텀 햄버거 메뉴`);

    console.log(`\n📈 배포 점수: ${deploymentScore}/${totalChecks}`);

    if (deploymentScore === totalChecks) {
      console.log('✅ 배포 완전 성공! 모든 개선사항이 반영되었습니다.');
      console.log(`\n🎉 최종 프로덕션 URL: ${PRODUCTION_URL}`);
    } else if (deploymentScore > 0) {
      console.log('⚠️ 부분 배포: 일부 개선사항만 반영되었습니다.');
      console.log('💡 추가 시간이 필요하거나 캐시 클리어가 필요할 수 있습니다.');
    } else {
      console.log('❌ 배포 미반영: 개선사항이 아직 적용되지 않았습니다.');
      console.log('🔄 Vercel 대시보드에서 배포 상태를 확인하세요.');
    }

    // 9. 대체 URL 제안
    console.log('\n' + '═'.repeat(60));
    console.log('🔗 Vercel 배포 URL 옵션');
    console.log('═'.repeat(60));
    console.log('\n현재 사용 가능한 URL:');
    console.log(`1. Production (Current): ${PRODUCTION_URL}`);
    console.log(`2. Latest Commit: https://tedprotocol-git-main-tedprotocols-projects.vercel.app`);
    console.log(`3. Organization URL: https://ted-protocol-whitepaper.vercel.app`);
    console.log('\n💡 위 URL들을 순서대로 확인해보세요.');

  } catch (error) {
    console.error(`\n❌ 검증 실패: ${error.message}`);
  }

  await browser.close();

  console.log('\n' + '═'.repeat(60));
  console.log('검증 완료');
  console.log('═'.repeat(60));
}

// 실행
verifyDeployment();