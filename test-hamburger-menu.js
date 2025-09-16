const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // 모바일 뷰포트 설정
  await page.setViewportSize({ width: 375, height: 812 });
  
  try {
    console.log('🧪 TED Protocol 햄버거 메뉴 테스트 시작...');
    
    // 페이지 로드
    await page.goto('http://localhost:3096/', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);
    
    console.log('📱 모바일 뷰 확인 중...');
    
    // 햄버거 버튼이 있는지 확인
    const hamburgerButton = await page.$('#mobile-hamburger-btn');
    if (hamburgerButton) {
      console.log('✅ 햄버거 버튼 발견!');
      
      // 햄버거 버튼 클릭
      await page.click('#mobile-hamburger-btn');
      await page.waitForTimeout(1000);
      
      // 슬라이드 메뉴가 열렸는지 확인
      const slideMenu = await page.$('#mobile-slide-menu');
      const isVisible = await slideMenu.isVisible();
      
      if (isVisible) {
        console.log('✅ 슬라이드 메뉴가 성공적으로 열림!');
        
        // 메뉴 아이템들이 있는지 확인
        const menuItems = await page.$$('#menu-items a');
        console.log(`✅ 메뉴 아이템 ${menuItems.length}개 발견!`);
        
        // 스크린샷 촬영
        await page.screenshot({ 
          path: 'hamburger-menu-open.png',
          fullPage: true 
        });
        console.log('📸 햄버거 메뉴 열린 상태 스크린샷 저장됨');
        
        // 백드롭 클릭해서 메뉴 닫기 테스트
        await page.click('#mobile-backdrop');
        await page.waitForTimeout(500);
        
        const isMenuClosed = !(await slideMenu.isVisible());
        if (isMenuClosed) {
          console.log('✅ 백드롭 클릭으로 메뉴 닫기 성공!');
        } else {
          console.log('❌ 백드롭 클릭으로 메뉴 닫기 실패');
        }
        
      } else {
        console.log('❌ 슬라이드 메뉴가 보이지 않음');
      }
      
    } else {
      console.log('❌ 햄버거 버튼을 찾을 수 없음');
      
      // 디버깅을 위해 현재 DOM 구조 확인
      const portalExists = await page.$('#mobile-menu-portal');
      if (portalExists) {
        console.log('✅ mobile-menu-portal은 존재함');
        const portalContent = await page.innerHTML('#mobile-menu-portal');
        console.log('Portal 내용:', portalContent.substring(0, 200) + '...');
      } else {
        console.log('❌ mobile-menu-portal도 없음');
      }
    }
    
    // 최종 스크린샷
    await page.screenshot({ 
      path: 'mobile-final-test.png',
      fullPage: true 
    });
    console.log('📸 최종 테스트 스크린샷 저장됨');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
  } finally {
    await browser.close();
  }
  
  console.log('🎉 햄버거 메뉴 테스트 완료!');
})();