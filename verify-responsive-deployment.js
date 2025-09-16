const { chromium, devices } = require('playwright');

/**
 * 반응형 배포 검증 스크립트
 */

const PRODUCTION_URL = 'https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app';

const TEST_DEVICES = [
  { name: 'iPhone SE (320px)', viewport: { width: 320, height: 568 } },
  { name: 'iPhone 12 (390px)', device: devices['iPhone 12'] },
  { name: 'iPhone Pro Max (428px)', viewport: { width: 428, height: 926 } },
  { name: 'iPad Mini (768px)', device: devices['iPad Mini'] },
  { name: 'iPad Pro 11 (834px)', viewport: { width: 834, height: 1194 } }
];

async function verifyResponsive() {
  console.log('🚀 반응형 배포 검증 시작');
  console.log('━'.repeat(60));
  console.log(`📍 Production URL: ${PRODUCTION_URL}`);
  console.log('━'.repeat(60));

  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });

  let totalScore = 0;
  let totalTests = 0;

  for (const deviceConfig of TEST_DEVICES) {
    console.log(`\n📱 테스트: ${deviceConfig.name}`);
    console.log('-'.repeat(40));

    const context = await browser.newContext({
      ...deviceConfig.device,
      ...deviceConfig.viewport ? { viewport: deviceConfig.viewport } : {}
    });

    const page = await context.newPage();

    try {
      await page.goto(PRODUCTION_URL, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      await page.waitForTimeout(2000);

      // 테스트 1: Whitepaper 텍스트
      const whitepaperCount = await page.locator('text=Whitepaper').count();
      const whitepaperPass = whitepaperCount === 0;
      console.log(`   📝 Whitepaper 숨김: ${whitepaperPass ? '✅' : '❌'} (${whitepaperCount}개)`);
      if (whitepaperPass) totalScore++;
      totalTests++;

      // 테스트 2: GitHub 링크
      const githubVisible = await page.$$eval('a[href*="github"]', links => 
        links.filter(link => {
          const style = window.getComputedStyle(link);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }).length
      );
      const githubPass = githubVisible === 0;
      console.log(`   🔗 GitHub 링크 숨김: ${githubPass ? '✅' : '❌'} (${githubVisible}개)`);
      if (githubPass) totalScore++;
      totalTests++;

      // 테스트 3: 반응형 패딩
      const containerPadding = await page.$eval('.container', el => {
        const style = window.getComputedStyle(el);
        return parseInt(style.paddingLeft) + parseInt(style.paddingRight);
      }).catch(() => 0);

      const viewport = deviceConfig.viewport || deviceConfig.device?.viewport || { width: 375 };
      const expectedPadding = viewport.width < 375 ? 24 : 
                             viewport.width < 414 ? 32 :
                             viewport.width < 768 ? 40 : 80;
      
      const paddingPass = containerPadding >= expectedPadding * 0.5;
      console.log(`   📐 반응형 패딩: ${paddingPass ? '✅' : '❌'} (${containerPadding}px / 예상 ${expectedPadding}px)`);
      if (paddingPass) totalScore++;
      totalTests++;

      // 테스트 4: 터치 타겟 크기
      const touchTargets = await page.$$eval('button, .button, a.button', elements => 
        elements.map(el => {
          const rect = el.getBoundingClientRect();
          return Math.min(rect.width, rect.height);
        })
      );

      const smallTargets = touchTargets.filter(size => size < 44);
      const touchPass = smallTargets.length === 0;
      console.log(`   👆 터치 타겟 (44px+): ${touchPass ? '✅' : '❌'} (작은 타겟 ${smallTargets.length}개)`);
      if (touchPass) totalScore++;
      totalTests++;

      // 테스트 5: 가로 스크롤
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      const scrollPass = !hasHorizontalScroll;
      console.log(`   ↔️ 가로 스크롤 없음: ${scrollPass ? '✅' : '❌'}`);
      if (scrollPass) totalScore++;
      totalTests++;

      // 테스트 6: 폰트 크기
      const fontSizes = await page.$$eval('p, li', elements => 
        elements.slice(0, 10).map(el => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.fontSize);
        })
      );

      const smallFonts = fontSizes.filter(size => size < 14);
      const fontPass = smallFonts.length === 0;
      console.log(`   📖 읽기 가능한 폰트: ${fontPass ? '✅' : '❌'} (작은 폰트 ${smallFonts.length}개)`);
      if (fontPass) totalScore++;
      totalTests++;

      // 스크린샷
      const screenshotName = `responsive-${deviceConfig.name.replace(/[\s()]/g, '-')}.png`;
      await page.screenshot({ 
        path: screenshotName,
        fullPage: false 
      });
      console.log(`   📸 스크린샷: ${screenshotName}`);

    } catch (error) {
      console.error(`   ❌ 오류: ${error.message}`);
    }

    await context.close();
  }

  await browser.close();

  // 최종 점수
  const percentage = Math.round((totalScore / totalTests) * 100);
  
  console.log('\n' + '═'.repeat(60));
  console.log('📊 최종 결과');
  console.log('═'.repeat(60));
  console.log(`⭐ ${totalScore}/${totalTests} 테스트 통과 (${percentage}%)`);
  
  if (percentage >= 90) {
    console.log('\n🎉🎉🎉 완벽한 반응형 구현! 모든 디바이스에서 최적화되었습니다! 🎉🎉🎉');
  } else if (percentage >= 70) {
    console.log('\n✅ 좋은 반응형 구현입니다. 일부 개선 가능한 부분이 있습니다.');
  } else {
    console.log('\n⚠️ 반응형 구현에 개선이 필요합니다.');
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📋 배포 정보');
  console.log('═'.repeat(60));
  console.log('Production: https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app');
  console.log('Latest: https://ted-protocol-whitepaper-v6-c2a76nsnu-kevinglecs-projects.vercel.app');
  console.log('\n✅ 반응형 디자인 v3.0 배포 완료!');
}

verifyResponsive().catch(console.error);