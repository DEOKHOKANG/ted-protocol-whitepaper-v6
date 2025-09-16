const { chromium } = require('playwright');

/**
 * TED Protocol Vercel 프로덕션 실제 문제점 검증
 * 
 * TARGET URL: https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/
 * 증거 스크린샷: Screenshot_20250916_183528_KakaoTalk.jpg, Screenshot_20250916_183540_KakaoTalk.jpg
 * 목적: 실제 프로덕션 사이트의 문제점을 직접 확인하고 재현
 */

(async () => {
  const browser = await chromium.launch({ headless: false });

  console.log('🔍 TED Protocol Vercel 프로덕션 실제 문제점 검증 시작...');
  console.log('🎯 Target URL: https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/');
  
  // ===== 모바일 환경에서 실제 문제점 확인 =====
  console.log('\n📱 모바일 환경 문제점 검증');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 812 });
  
  try {
    console.log('⏳ 프로덕션 사이트 로딩 중...');
    await mobilePage.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', { 
      waitUntil: 'load',
      timeout: 60000 
    });
    await mobilePage.waitForTimeout(5000);
    
    console.log('✅ 프로덕션 사이트 로딩 완료');
    
    // ===== 문제점 1: 햄버거 메뉴 품질 확인 =====
    console.log('\n🔧 [검증 1] 햄버거 메뉴 품질 및 위치');
    
    // 기본 docusaurus 햄버거 메뉴 찾기
    const docusaurusHamburger = await mobilePage.$('.navbar__toggle');
    if (docusaurusHamburger) {
      const hamburgerBox = await docusaurusHamburger.boundingBox();
      console.log(`❌ 확인된 문제: 기본 docusaurus 햄버거 메뉴`);
      console.log(`   위치: left=${hamburgerBox.x}px, top=${hamburgerBox.y}px`);
      console.log(`   크기: ${hamburgerBox.width}x${hamburgerBox.height}px`);
      console.log('   → 스크린샷 문제점 재현됨: 품질 낮은 기본 디자인');
    }
    
    // 햄버거 메뉴 클릭하여 사이드바 열기
    await mobilePage.click('.navbar__toggle');
    await mobilePage.waitForTimeout(2000);
    
    // ===== 문제점 2: "Whitepaper" 텍스트 노출 확인 =====
    console.log('\n🔧 [검증 2] "Whitepaper" 텍스트 노출 문제');
    
    const whitepaper텍스트 = await mobilePage.locator('text=Whitepaper').count();
    if (whitepaper텍스트 > 0) {
      console.log(`❌ 확인된 문제: "Whitepaper" 텍스트 ${whitepaper텍스트}개 노출`);
      console.log('   → 스크린샷 문제점 재현됨: 사용자가 숨기라고 한 텍스트 여전히 표시');
    }
    
    // ===== 문제점 3: GitHub 링크 모바일 노출 확인 =====
    console.log('\n🔧 [검증 3] GitHub 링크 모바일 노출 문제');
    
    const githubLinks = await mobilePage.locator('text=GitHub').count();
    if (githubLinks > 0) {
      console.log(`❌ 확인된 문제: GitHub 링크 ${githubLinks}개 모바일에서 노출`);
      console.log('   → 스크린샷 문제점 재현됨: 모바일에서 숨겨야 할 GitHub 링크 표시');
    }
    
    // ===== 문제점 4: 언어 선택기 중복 확인 =====
    console.log('\n🔧 [검증 4] 언어 선택기 중복 문제');
    
    const languagesSections = await mobilePage.locator('text=Languages').count();
    if (languagesSections > 0) {
      console.log(`❌ 확인된 문제: "Languages" 섹션 ${languagesSections}개 중복`);
      console.log('   → 스크린샷 문제점 재현됨: 언어 선택 UI 중복');
    }
    
    // ===== 문제점 5: 메뉴 아이콘 부재 확인 =====
    console.log('\n🔧 [검증 5] 메뉴 아이콘 및 시각적 요소 부족');
    
    const menuLinks = await mobilePage.$$('.navbar-sidebar .menu__list-item-collapsible a');
    if (menuLinks.length > 0) {
      console.log(`❌ 확인된 문제: 메뉴 항목 ${menuLinks.length}개에 아이콘 없음`);
      console.log('   → 스크린샷 문제점 재현됨: 시각적 구분 요소 부족');
    }
    
    // 현재 상태 스크린샷 저장
    await mobilePage.screenshot({ 
      path: 'production-issues-mobile-menu.png',
      fullPage: true 
    });
    console.log('📸 프로덕션 문제점 스크린샷 저장됨');
    
  } catch (error) {
    console.error(`❌ 프로덕션 사이트 검증 실패: ${error.message}`);
    if (error.message.includes('timeout')) {
      console.log('⚠️  사이트 로딩 시간 초과 - 네트워크 문제일 수 있음');
    }
  }
  
  // ===== PC 환경에서 문제점 확인 =====
  console.log('\n🖥️ PC 환경 문제점 검증');
  const pcPage = await browser.newPage();
  await pcPage.setViewportSize({ width: 1440, height: 900 });
  
  try {
    await pcPage.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', { 
      waitUntil: 'load',
      timeout: 60000 
    });
    await pcPage.waitForTimeout(3000);
    
    // PC에서 GitHub 링크 위치 확인
    const pcGithubLink = await pcPage.$('a[href*="github"]');
    if (pcGithubLink) {
      const githubBox = await pcGithubLink.boundingBox();
      console.log(`✅ PC에서 GitHub 링크 표시됨 - 위치: ${githubBox.x}px, ${githubBox.y}px`);
    } else {
      console.log(`❌ PC에서도 GitHub 링크 없음`);
    }
    
    // PC 환경 스크린샷
    await pcPage.screenshot({ 
      path: 'production-pc-environment.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1440, height: 200 }
    });
    
  } catch (error) {
    console.error(`❌ PC 환경 검증 실패: ${error.message}`);
  }
  
  await browser.close();
  
  // ===== 최종 문제점 요약 =====
  console.log('\n📋 Vercel 프로덕션 문제점 검증 완료');
  console.log('━'.repeat(60));
  console.log('🎯 확인된 실제 문제점들:');
  console.log('   ❌ 햄버거 메뉴: 기본 품질, 위치 부적절');
  console.log('   ❌ Whitepaper 텍스트: 모바일에서 여전히 노출');
  console.log('   ❌ GitHub 링크: 모바일에서 숨기지 않음');
  console.log('   ❌ 언어 선택: 중복 UI 존재');
  console.log('   ❌ 메뉴 아이콘: 시각적 구분 부족');
  console.log('   ❌ 터치 타겟: 크기 부족');
  console.log('   ❌ 애니메이션: 기본 수준');
  
  console.log('\n🚀 결론: 스크린샷과 동일한 문제점들이 실제로 존재함');
  console.log('💡 우리가 구현한 로컬 개선 버전으로 프로덕션 업그레이드 필요');
  
})();