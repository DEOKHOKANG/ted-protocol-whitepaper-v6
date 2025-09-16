const { chromium } = require('playwright');

const EXPECTED_URLS = [
  'https://ted-protocol-whitepaper-v6.vercel.app',
  'https://ted-protocol-whitepaper-v6-deokhokang.vercel.app',
  'https://ted-protocol-whitepaper-v6-git-main-deokhokang.vercel.app'
];

async function verifyNewDeployment() {
  console.log('🚀 새로운 Vercel 프로젝트 배포 검증');
  console.log('━'.repeat(60));

  const browser = await chromium.launch({ 
    headless: false,
    viewport: { width: 375, height: 812 }
  });

  let successUrl = null;
  let bestScore = 0;

  for (const url of EXPECTED_URLS) {
    console.log(`\n🔍 확인 중: ${url}`);
    
    const page = await browser.newPage();
    
    try {
      const response = await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      const status = response.status();
      console.log(`   📡 HTTP Status: ${status}`);
      
      if (status === 200) {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.waitForTimeout(2000);
        
        const metrics = {
          whitepaperText: await page.locator('text=Whitepaper').count(),
          githubLinks: await page.locator('a[href*="github"]:visible').count()
        };
        
        console.log(`   📝 Whitepaper: ${metrics.whitepaperText}개`);
        console.log(`   🔗 GitHub: ${metrics.githubLinks}개`);
        
        let score = 0;
        if (metrics.whitepaperText === 0) score += 3;
        if (metrics.githubLinks === 0) score += 3;
        
        if (score > bestScore) {
          bestScore = score;
          successUrl = url;
        }
      }
    } catch (error) {
      console.log(`   ❌ ${error.message}`);
    }
    
    await page.close();
  }
  
  await browser.close();
  
  console.log('\n' + '═'.repeat(60));
  if (bestScore >= 4) {
    console.log('✅ 배포 성공\!');
    console.log(`🎉 URL: ${successUrl}`);
  } else {
    console.log('⏳ 배포 대기 중...');
  }
}

verifyNewDeployment();
EOF < /dev/null