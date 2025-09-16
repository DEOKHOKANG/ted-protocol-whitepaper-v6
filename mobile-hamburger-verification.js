const { chromium } = require('playwright');

async function mobileHamburgerVerification() {
  console.log('\n🍔 MOBILE HAMBURGER MENU UXUI 검증\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 400
  });
  
  // 다양한 모바일 디바이스에서 테스트
  const devices = [
    { name: 'iPhone 12 Pro', width: 390, height: 844, category: 'premium' },
    { name: 'Samsung Galaxy S21', width: 360, height: 800, category: 'standard' },
    { name: 'iPhone SE', width: 320, height: 568, category: 'compact' },
    { name: 'Google Pixel 5', width: 393, height: 851, category: 'large' },
    { name: 'iPhone 13 Mini', width: 375, height: 812, category: 'premium-compact' }
  ];
  
  const verificationResults = [];
  
  for (const device of devices) {
    console.log(`🍔 ${device.name} (${device.width}x${device.height}) - ${device.category}`);
    
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    
    // 에러 모니터링
    page.on('pageerror', error => {
      console.log(`    ⚠️ Page Error: ${error.message}`);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`    ⚠️ Console Error: ${msg.text()}`);
      }
    });
    
    try {
      await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // 페이지 로딩 대기
      await page.waitForTimeout(3000);
      
      console.log(`  🔍 헤더 구조 분석...`);
      
      // 헤더 구조 및 모바일 메뉴 확인
      const headerAnalysis = await page.evaluate(() => {
        const navbar = document.querySelector('.navbar');
        const whitepaperText = document.querySelector('.navbar__item[href*="whitepaper"], .navbar__link[href*="whitepaper"]');
        const githubLink = document.querySelector('.navbar__item[href*="github"], .navbar__link[href*="github"]');
        const languageDropdown = document.querySelector('.navbar__item--type-localeDropdown');
        const hamburgerContainer = document.querySelector('.mobile-menu-container');
        const hamburgerButton = document.querySelector('[class*="hamburgerButton"]');
        const docusaurusToggle = document.querySelector('.navbar__toggle');
        
        return {
          navbar: {
            exists: !!navbar,
            height: navbar ? navbar.offsetHeight : 0,
            classes: navbar ? navbar.className : ''
          },
          removedElements: {
            whitepaperHidden: !whitepaperText || whitepaperText.style.display === 'none' || 
                            window.getComputedStyle(whitepaperText).display === 'none',
            githubHidden: !githubLink || githubLink.style.display === 'none' ||
                         window.getComputedStyle(githubLink).display === 'none'
          },
          languageButton: {
            exists: !!languageDropdown,
            position: languageDropdown ? {
              right: languageDropdown.getBoundingClientRect().right,
              width: languageDropdown.offsetWidth,
              height: languageDropdown.offsetHeight
            } : null
          },
          hamburgerMenu: {
            containerExists: !!hamburgerContainer,
            buttonExists: !!hamburgerButton,
            docusaurusToggleHidden: !docusaurusToggle || docusaurusToggle.style.display === 'none' ||
                                   window.getComputedStyle(docusaurusToggle).display === 'none',
            position: hamburgerContainer ? hamburgerContainer.getBoundingClientRect() : null
          }
        };
      });
      
      console.log(`    📱 네비바 높이: ${headerAnalysis.navbar.height}px`);
      console.log(`    🚫 Whitepaper 텍스트 숨김: ${headerAnalysis.removedElements.whitepaperHidden ? '✅' : '❌'}`);
      console.log(`    🚫 GitHub 링크 숨김: ${headerAnalysis.removedElements.githubHidden ? '✅' : '❌'}`);
      console.log(`    🌐 언어 버튼: ${headerAnalysis.languageButton.exists ? '✅' : '❌'}`);
      console.log(`    🍔 햄버거 메뉴: ${headerAnalysis.hamburgerMenu.buttonExists ? '✅' : '❌'}`);
      console.log(`    🔒 기본 토글 숨김: ${headerAnalysis.hamburgerMenu.docusaurusToggleHidden ? '✅' : '❌'}`);
      
      // 햄버거 메뉴 클릭 테스트
      if (headerAnalysis.hamburgerMenu.buttonExists) {
        console.log(`  🍔 햄버거 메뉴 클릭 테스트...`);
        
        await page.click('[class*="hamburgerButton"]');
        await page.waitForTimeout(1000);
        
        // 슬라이드 메뉴 확인
        const menuAnalysis = await page.evaluate(() => {
          const slideMenu = document.querySelector('[class*="mobileMenu"]');
          const backdrop = document.querySelector('[class*="backdrop"]');
          const menuItems = document.querySelectorAll('[class*="menuLink"]');
          const brandSection = document.querySelector('[class*="brandSection"]');
          const socialLinks = document.querySelectorAll('[class*="socialLink"]');
          
          if (!slideMenu) return { error: 'Slide menu not found' };
          
          const menuRect = slideMenu.getBoundingClientRect();
          const screenWidth = window.innerWidth;
          const menuPercent = (menuRect.width / screenWidth * 100).toFixed(1);
          
          return {
            menu: {
              exists: !!slideMenu,
              isOpen: slideMenu.classList.toString().includes('open'),
              width: menuRect.width,
              widthPercent: parseFloat(menuPercent),
              height: menuRect.height,
              transform: window.getComputedStyle(slideMenu).transform
            },
            backdrop: {
              exists: !!backdrop,
              isVisible: backdrop ? window.getComputedStyle(backdrop).display !== 'none' : false
            },
            content: {
              menuItemCount: menuItems.length,
              hasBrandSection: !!brandSection,
              socialLinksCount: socialLinks.length,
              menuItemsText: Array.from(menuItems).slice(0, 3).map(item => item.textContent.trim())
            },
            styling: {
              background: slideMenu ? window.getComputedStyle(slideMenu).background : '',
              backdropFilter: slideMenu ? window.getComputedStyle(slideMenu).backdropFilter : '',
              boxShadow: slideMenu ? window.getComputedStyle(slideMenu).boxShadow : ''
            }
          };
        });
        
        if (menuAnalysis.error) {
          console.log(`    ❌ ${menuAnalysis.error}`);
        } else {
          console.log(`    📐 슬라이드 메뉴: ${menuAnalysis.menu.width}px (${menuAnalysis.menu.widthPercent}%)`);
          console.log(`    🌫️ 백드롭: ${menuAnalysis.backdrop.isVisible ? '✅' : '❌'}`);
          console.log(`    📋 메뉴 아이템: ${menuAnalysis.content.menuItemCount}개`);
          console.log(`    🏢 브랜드 섹션: ${menuAnalysis.content.hasBrandSection ? '✅' : '❌'}`);
          console.log(`    🔗 소셜 링크: ${menuAnalysis.content.socialLinksCount}개`);
          console.log(`    🎨 그라데이션: ${menuAnalysis.styling.background.includes('gradient') ? '✅' : '❌'}`);
          console.log(`    🌀 블러 효과: ${menuAnalysis.styling.backdropFilter.includes('blur') ? '✅' : '❌'}`);
          
          // 메뉴 아이템 클릭 테스트
          if (menuAnalysis.content.menuItemCount > 0) {
            console.log(`    🖱️ 메뉴 네비게이션 테스트...`);
            await page.click('[class*="menuLink"]');
            await page.waitForTimeout(1000);
            
            // 메뉴가 닫혔는지 확인
            const menuClosed = await page.evaluate(() => {
              const slideMenu = document.querySelector('[class*="mobileMenu"]');
              return slideMenu ? !slideMenu.classList.toString().includes('open') : true;
            });
            
            console.log(`    🔄 자동 메뉴 닫기: ${menuClosed ? '✅' : '❌'}`);
          }
        }
        
        // 종합 점수 계산
        let score = 100;
        
        // 헤더 최적화 (30점)
        if (!headerAnalysis.removedElements.whitepaperHidden) score -= 15;
        if (!headerAnalysis.removedElements.githubHidden) score -= 15;
        
        // 햄버거 메뉴 기능 (40점)
        if (!headerAnalysis.hamburgerMenu.buttonExists) score -= 20;
        if (!menuAnalysis.menu?.exists) score -= 20;
        
        // 슬라이드 메뉴 디자인 (20점)
        if (!menuAnalysis.styling?.background.includes('gradient')) score -= 10;
        if (!menuAnalysis.styling?.backdropFilter.includes('blur')) score -= 10;
        
        // 콘텐츠 및 네비게이션 (10점)
        if (menuAnalysis.content?.menuItemCount < 8) score -= 5;
        if (!menuAnalysis.content?.hasBrandSection) score -= 5;
        
        const finalScore = Math.max(0, score);
        
        const result = {
          device: device.name,
          category: device.category,
          viewport: { width: device.width, height: device.height },
          headerAnalysis,
          menuAnalysis,
          score: finalScore,
          grade: finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : finalScore >= 60 ? 'C' : 'D',
          success: finalScore >= 80,
          timestamp: new Date().toISOString()
        };
        
        verificationResults.push(result);
        
        const status = result.success ? '✅' : '⚠️';
        const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : result.grade === 'C' ? '🥉' : '🔻';
        
        console.log(`  ${status} ${gradeEmoji} ${result.grade}등급 (${finalScore}점)`);
        console.log();
        
      } else {
        console.log(`  ❌ 햄버거 버튼을 찾을 수 없음`);
        verificationResults.push({
          device: device.name,
          error: 'Hamburger button not found',
          success: false,
          score: 0,
          grade: 'F'
        });
      }
      
      // 스크린샷
      await page.screenshot({ 
        path: `mobile-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`,
        fullPage: false
      });
      
    } catch (error) {
      console.log(`  ❌ 오류: ${error.message}`);
      verificationResults.push({
        device: device.name,
        error: error.message,
        success: false,
        score: 0,
        grade: 'F'
      });
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // 최종 보고서
  console.log('\n' + '=' .repeat(60));
  console.log('\n🍔 모바일 햄버거 메뉴 UXUI 최종 보고서\n');
  
  const successCount = verificationResults.filter(r => r.success).length;
  const totalCount = verificationResults.length;
  const avgScore = verificationResults.reduce((sum, r) => sum + (r.score || 0), 0) / totalCount;
  
  console.log(`🎯 전체 성공률: ${successCount}/${totalCount} (${(successCount/totalCount*100).toFixed(1)}%)`);
  console.log(`📊 평균 점수: ${avgScore.toFixed(1)}/100`);
  console.log();
  
  console.log('📱 디바이스별 상세 결과:');
  verificationResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.device}: ${result.error}`);
    } else {
      const status = result.success ? '✅' : '⚠️';
      const gradeEmoji = result.grade === 'A+' ? '🏆' : result.grade === 'A' ? '🥇' : result.grade === 'B' ? '🥈' : result.grade === 'C' ? '🥉' : '🔻';
      
      console.log(`${status} ${result.device}: ${gradeEmoji} ${result.grade}등급 (${result.score}점)`);
      console.log(`    🚫 헤더 정리: ${result.headerAnalysis.removedElements.whitepaperHidden ? '✅' : '❌'}`);
      console.log(`    🍔 햄버거 메뉴: ${result.headerAnalysis.hamburgerMenu.buttonExists ? '✅' : '❌'}`);
      console.log(`    📐 슬라이드 메뉴: ${result.menuAnalysis.menu?.widthPercent || 0}%`);
      console.log(`    🎨 프리미엄 디자인: ${result.menuAnalysis.styling?.background.includes('gradient') ? '✅' : '❌'}`);
    }
    console.log();
  });
  
  // 카테고리별 분석
  const categoryStats = verificationResults.reduce((stats, result) => {
    if (!result.error && result.category) {
      if (!stats[result.category]) stats[result.category] = { total: 0, success: 0, avgScore: 0 };
      stats[result.category].total++;
      if (result.success) stats[result.category].success++;
      stats[result.category].avgScore += result.score || 0;
    }
    return stats;
  }, {});
  
  console.log('📊 카테고리별 성과:');
  Object.entries(categoryStats).forEach(([category, stat]) => {
    const successRate = (stat.success / stat.total * 100).toFixed(1);
    const avgScore = (stat.avgScore / stat.total).toFixed(1);
    console.log(`  ${category}: ${stat.success}/${stat.total} (${successRate}%) - 평균 ${avgScore}점`);
  });
  console.log();
  
  // 최종 판정
  if (successCount === totalCount && avgScore >= 90) {
    console.log('🎉🍔 완벽한 모바일 햄버거 메뉴 구현!');
    console.log('   모든 디바이스에서 프리미엄 UXUI와 완벽한 기능성 달성!');
  } else if (successCount >= totalCount * 0.8) {
    console.log('🎉🍔 우수한 모바일 햄버거 메뉴!');
    console.log('   대부분 디바이스에서 최적화된 사용자 경험 제공!');
  } else {
    console.log('⚠️ 모바일 햄버거 메뉴 부분 성공 - 개선 권장');
  }
  
  console.log('\n✅ 모바일 햄버거 메뉴 UXUI 검증 완료\n');
  
  return {
    totalDevices: totalCount,
    successfulDevices: successCount,
    successRate: (successCount/totalCount*100),
    averageScore: avgScore,
    categoryStats,
    results: verificationResults
  };
}

mobileHamburgerVerification().catch(console.error);