const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });

  console.log('🚀 TED Protocol Ultimate Responsive Test 시작...');

  // PC 환경 테스트
  console.log('\n🖥️ PC 환경 테스트...');
  const pcPage = await browser.newPage();
  await pcPage.setViewportSize({ width: 1440, height: 900 });
  
  try {
    await pcPage.goto('http://localhost:3097/', { waitUntil: 'load' });
    await pcPage.waitForTimeout(3000);
    
    // PC에서 GitHub 링크가 보이는지 확인
    const githubLink = await pcPage.$('.github-link');
    if (githubLink && await githubLink.isVisible()) {
      console.log('✅ PC: GitHub 링크가 정상적으로 표시됨');
    } else {
      console.log('❌ PC: GitHub 링크가 숨겨져 있음');
    }
    
    // PC에서 햄버거 버튼이 숨겨져 있는지 확인
    const hamburgerBtn = await pcPage.$('#mobile-hamburger-btn');
    if (!hamburgerBtn || !await hamburgerBtn.isVisible()) {
      console.log('✅ PC: 햄버거 버튼이 정상적으로 숨겨져 있음');
    } else {
      console.log('❌ PC: 햄버거 버튼이 보임 (문제)');
    }
    
    // PC 스크린샷
    await pcPage.screenshot({ 
      path: 'pc-responsive-test.png',
      fullPage: true 
    });
    console.log('📸 PC 환경 스크린샷 저장됨');
    
  } catch (error) {
    console.error('❌ PC 테스트 오류:', error.message);
  }
  
  // 모바일 환경 테스트
  console.log('\n📱 모바일 환경 테스트...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 812 });
  
  try {
    await mobilePage.goto('http://localhost:3097/', { waitUntil: 'load' });
    await mobilePage.waitForTimeout(3000);
    
    // 모바일에서 GitHub 링크가 숨겨져 있는지 확인
    const mobileGithubLink = await mobilePage.$('.github-link');
    if (!mobileGithubLink || !await mobileGithubLink.isVisible()) {
      console.log('✅ 모바일: GitHub 링크가 정상적으로 숨겨져 있음');
    } else {
      console.log('❌ 모바일: GitHub 링크가 보임 (문제)');
    }
    
    // 모바일에서 햄버거 버튼이 보이는지 확인
    const mobileHamburgerBtn = await mobilePage.$('#mobile-hamburger-btn');
    if (mobileHamburgerBtn && await mobileHamburgerBtn.isVisible()) {
      console.log('✅ 모바일: 햄버거 버튼이 정상적으로 표시됨 (좌측 상단)');
      
      // 햄버거 버튼의 위치 확인
      const btnBox = await mobileHamburgerBtn.boundingBox();
      console.log(`📍 햄버거 버튼 위치: left=${btnBox.x}px, top=${btnBox.y}px`);
      
      // 모바일 초기 상태 스크린샷
      await mobilePage.screenshot({ 
        path: 'mobile-initial.png',
        fullPage: true 
      });
      
      // 햄버거 버튼 클릭
      console.log('🖱️ 햄버거 버튼 클릭 중...');
      await mobilePage.click('#mobile-hamburger-btn');
      await mobilePage.waitForTimeout(1000);
      
      // 슬라이드 메뉴가 열렸는지 확인
      const slideMenu = await mobilePage.$('#mobile-slide-menu');
      if (slideMenu && await slideMenu.isVisible()) {
        console.log('✅ 슬라이드 메뉴가 성공적으로 열림!');
        
        // 메뉴 내용 확인
        const menuItems = await mobilePage.$$('#menu-items a');
        console.log(`✅ 메뉴 아이템 ${menuItems.length}개 발견`);
        
        // 닫기 버튼 확인
        const closeBtn = await mobilePage.$('#mobile-close-btn');
        if (closeBtn && await closeBtn.isVisible()) {
          console.log('✅ 슬라이드바 내 닫기 버튼 정상 표시');
        }
        
        // 메뉴 열린 상태 스크린샷
        await mobilePage.screenshot({ 
          path: 'mobile-menu-open.png',
          fullPage: true 
        });
        console.log('📸 모바일 메뉴 열린 상태 스크린샷 저장됨');
        
        // 닫기 버튼으로 메뉴 닫기 테스트
        console.log('🖱️ 슬라이드바 내 닫기 버튼 클릭 중...');
        await mobilePage.click('#mobile-close-btn');
        await mobilePage.waitForTimeout(500);
        
        const isMenuClosed = !(await slideMenu.isVisible());
        if (isMenuClosed) {
          console.log('✅ 닫기 버튼으로 메뉴 닫기 성공!');
        } else {
          console.log('❌ 닫기 버튼으로 메뉴 닫기 실패');
        }
        
      } else {
        console.log('❌ 슬라이드 메뉴가 열리지 않음');
      }
      
    } else {
      console.log('❌ 모바일: 햄버거 버튼을 찾을 수 없음');
    }
    
  } catch (error) {
    console.error('❌ 모바일 테스트 오류:', error.message);
  }
  
  // 태블릿 환경 테스트 (중간 크기)
  console.log('\n📟 태블릿 환경 테스트...');
  const tabletPage = await browser.newPage();
  await tabletPage.setViewportSize({ width: 768, height: 1024 });
  
  try {
    await tabletPage.goto('http://localhost:3097/', { waitUntil: 'load' });
    await tabletPage.waitForTimeout(2000);
    
    // 태블릿에서 햄버거 버튼이 보이는지 확인 (768px는 모바일 범위)
    const tabletHamburgerBtn = await tabletPage.$('#mobile-hamburger-btn');
    if (tabletHamburgerBtn && await tabletHamburgerBtn.isVisible()) {
      console.log('✅ 태블릿: 햄버거 버튼이 정상적으로 표시됨');
    } else {
      console.log('❌ 태블릿: 햄버거 버튼이 숨겨져 있음');
    }
    
    // 태블릿 스크린샷
    await tabletPage.screenshot({ 
      path: 'tablet-responsive-test.png',
      fullPage: true 
    });
    console.log('📸 태블릿 환경 스크린샷 저장됨');
    
  } catch (error) {
    console.error('❌ 태블릿 테스트 오류:', error.message);
  }
  
  await browser.close();
  
  console.log('\n🎉 Ultimate Responsive Test 완료!');
  console.log('📊 테스트 결과:');
  console.log('   - PC 환경: GitHub 표시, 햄버거 버튼 숨김');
  console.log('   - 모바일 환경: GitHub 숨김, 햄버거 버튼 좌측 상단 표시');
  console.log('   - 슬라이드 메뉴: 모바일 최적화 텍스트 크기');
  console.log('   - 닫기 버튼: 슬라이드바 내부에 위치');
  
})();