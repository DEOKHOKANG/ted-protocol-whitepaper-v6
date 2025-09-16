const { chromium } = require('playwright');

/**
 * 최신 Git 배포 URL 확인
 */

const URLS_TO_CHECK = [
  {
    name: 'Git Main Branch',
    url: 'https://tedprotocol-git-main-tedprotocols-projects.vercel.app'
  },
  {
    name: 'Organization URL',
    url: 'https://ted-protocol-whitepaper.vercel.app'
  },
  {
    name: 'Production (Original)',
    url: 'https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app'
  }
];

async function checkAllDeployments() {
  console.log('🔍 모든 Vercel 배포 URL 확인');
  console.log('━'.repeat(60));

  const browser = await chromium.launch({ 
    headless: false,
    viewport: { width: 375, height: 812 }
  });

  for (const deployment of URLS_TO_CHECK) {
    console.log(`\n📍 Checking: ${deployment.name}`);
    console.log(`   URL: ${deployment.url}`);
    console.log('   ' + '-'.repeat(50));

    const page = await browser.newPage();
    
    try {
      // 페이지 로드
      const response = await page.goto(deployment.url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      const status = response.status();
      console.log(`   📡 HTTP Status: ${status}`);

      if (status === 200) {
        // 모바일 뷰로 설정
        await page.setViewportSize({ width: 375, height: 812 });
        await page.waitForTimeout(2000);

        // 핵심 지표 확인
        const checks = {
          whitepaperText: await page.locator('text=Whitepaper').count(),
          githubLinks: await page.locator('a[href*="github"]:visible').count(),
          customHamburger: await page.$('#mobile-hamburger-btn'),
          mobilePortal: await page.$('#mobile-menu-portal'),
          defaultHamburger: await page.$('.navbar__toggle')
        };

        console.log(`   📝 Whitepaper texts: ${checks.whitepaperText}`);
        console.log(`   🔗 GitHub links: ${checks.githubLinks}`);
        console.log(`   🍔 Custom hamburger: ${checks.customHamburger ? 'YES' : 'NO'}`);
        console.log(`   📱 Mobile portal: ${checks.mobilePortal ? 'YES' : 'NO'}`);
        console.log(`   📋 Default hamburger: ${checks.defaultHamburger ? 'YES' : 'NO'}`);

        // 개선 점수 계산
        let score = 0;
        if (checks.whitepaperText === 0) score++;
        if (checks.githubLinks === 0) score++;
        if (checks.customHamburger) score++;
        if (checks.mobilePortal) score++;
        if (!checks.defaultHamburger) score++;

        console.log(`   ⭐ Improvement Score: ${score}/5`);

        if (score >= 3) {
          console.log(`   ✅ THIS DEPLOYMENT HAS IMPROVEMENTS!`);
          console.log(`   🎉 Recommended URL: ${deployment.url}`);
          
          // 스크린샷 저장
          await page.screenshot({ 
            path: `deployment-${deployment.name.replace(/\s/g, '-').toLowerCase()}.png`,
            fullPage: false 
          });
        } else {
          console.log(`   ❌ Old version without improvements`);
        }
      } else {
        console.log(`   ⚠️ Unable to access (Status: ${status})`);
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    await page.close();
  }

  await browser.close();

  console.log('\n' + '═'.repeat(60));
  console.log('🏁 배포 URL 확인 완료');
  console.log('═'.repeat(60));
}

// 실행
checkAllDeployments();