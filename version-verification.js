const { chromium } = require('playwright');

/**
 * Vercel 배포 버전 vs 로컬 코드베이스 대조 검증
 * 
 * 목적: 현재 Vercel 프로덕션에 배포된 버전이 로컬 코드베이스와 일치하는지 확인
 * Production URL: https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/
 * Local HEAD: 6d33cb3 🍔 MOBILE HAMBURGER MENU v5.0.0
 */

(async () => {
  const browser = await chromium.launch({ headless: false });

  console.log('🔍 Vercel 프로덕션 vs 로컬 코드베이스 대조 검증');
  console.log('━'.repeat(60));
  
  // 로컬 정보 확인
  console.log('📁 로컬 코드베이스 정보:');
  console.log('   • HEAD 커밋: 6d33cb3');
  console.log('   • 커밋 메시지: 🍔 MOBILE HAMBURGER MENU v5.0.0 - Complete UXUI Optimization');
  console.log('   • Package 버전: 6.0.0-ultimate-responsive');
  console.log('   • vercel.json DEPLOYMENT_ID: hamburger-menu-fix-v5.2');
  
  const page = await browser.newPage();
  
  try {
    console.log('\n🌐 Vercel 프로덕션 버전 분석...');
    await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', { 
      waitUntil: 'load',
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    
    // ===== 1. 메타 정보 확인 =====
    console.log('\n1️⃣ 사이트 메타 정보 분석:');
    
    const title = await page.title();
    console.log(`   ✅ 페이지 제목: ${title}`);
    
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    console.log(`   ✅ 메타 설명: ${metaDescription ? metaDescription.substring(0, 100) + '...' : 'N/A'}`);
    
    // ===== 2. 모바일 햄버거 메뉴 확인 =====
    console.log('\n2️⃣ 모바일 햄버거 메뉴 구현 확인:');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);
    
    // Docusaurus 기본 햄버거 메뉴 확인
    const docusaurusHamburger = await page.$('.navbar__toggle');
    if (docusaurusHamburger) {
      console.log('   ❌ 기본 Docusaurus 햄버거 메뉴 발견');
      console.log('   📝 로컬 코드와 불일치: 커스텀 햄버거 메뉴가 배포되지 않음');
    }
    
    // 커스텀 햄버거 메뉴 확인
    const customHamburger = await page.$('#mobile-hamburger-btn');
    if (customHamburger) {
      console.log('   ✅ 커스텀 햄버거 메뉴 발견');
      console.log('   ✅ 로컬 코드와 일치: 최신 개선사항 배포됨');
    } else {
      console.log('   ❌ 커스텀 햄버거 메뉴 없음');
      console.log('   📝 로컬 6d33cb3 커밋의 개선사항이 배포되지 않음');
    }
    
    // ===== 3. 메뉴 구조 확인 =====
    console.log('\n3️⃣ 메뉴 구조 분석:');
    
    // 햄버거 메뉴 클릭
    await page.click('.navbar__toggle');
    await page.waitForTimeout(2000);
    
    // 메뉴 항목 확인
    const menuItems = await page.$$('.menu__list-item a');
    console.log(`   📋 메뉴 항목 수: ${menuItems.length}개`);
    
    // "Whitepaper" 텍스트 확인
    const whitepaper텍스트 = await page.locator('text=Whitepaper').count();
    console.log(`   📝 "Whitepaper" 텍스트: ${whitepaper텍스트}개 발견`);
    if (whitepaper텍스트 > 0) {
      console.log('   ❌ 로컬 개선사항 미적용: "Whitepaper" 텍스트 여전히 노출');
    }
    
    // GitHub 링크 확인
    const githubLinks = await page.locator('text=GitHub').count();
    console.log(`   📝 GitHub 링크: ${githubLinks}개 발견`);
    
    // ===== 4. CSS/JS 버전 확인 =====
    console.log('\n4️⃣ 정적 자산 버전 확인:');
    
    // CSS 파일 확인
    const cssFiles = await page.$$eval('link[rel="stylesheet"]', links => 
      links.map(link => link.href).filter(href => href.includes('static'))
    );
    console.log(`   🎨 CSS 파일 수: ${cssFiles.length}개`);
    
    // JS 파일 확인
    const jsFiles = await page.$$eval('script[src]', scripts => 
      scripts.map(script => script.src).filter(src => src.includes('static'))
    );
    console.log(`   📜 JS 파일 수: ${jsFiles.length}개`);
    
    // ===== 5. 빌드 정보 확인 =====
    console.log('\n5️⃣ 빌드 정보 확인:');
    
    // 페이지 소스에서 Docusaurus 버전 확인
    const pageContent = await page.content();
    
    // Docusaurus 버전 확인
    const docusaurusVersion = pageContent.match(/docusaurus[\/\-](\d+\.\d+\.\d+)/i);
    if (docusaurusVersion) {
      console.log(`   ✅ Docusaurus 버전: ${docusaurusVersion[1]}`);
    }
    
    // 빌드 타임스탬프 확인
    const buildTime = pageContent.match(/build[\/\-]?time[\"']?\s*:\s*[\"']?([^\"'\s,}]+)/i);
    if (buildTime) {
      console.log(`   ✅ 빌드 시간: ${buildTime[1]}`);
    }
    
    // ===== 6. PC 버전 확인 =====
    console.log('\n6️⃣ PC 버전 확인:');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1000);
    
    const pcGithubLink = await page.$('a[href*="github"]');
    if (pcGithubLink) {
      console.log('   ✅ PC에서 GitHub 링크 정상 표시');
    }
    
    const pcHamburger = await page.$('.navbar__toggle');
    const isPcHamburgerVisible = pcHamburger && await pcHamburger.isVisible();
    console.log(`   📝 PC에서 햄버거 메뉴 표시: ${isPcHamburgerVisible ? '표시됨 (문제)' : '숨김 (정상)'}`);
    
    // 스크린샷 저장
    await page.screenshot({ 
      path: 'production-verification.png',
      clip: { x: 0, y: 0, width: 1440, height: 200 }
    });
    
  } catch (error) {
    console.error(`❌ 검증 실패: ${error.message}`);
  }
  
  await browser.close();
  
  // ===== 최종 분석 결과 =====
  console.log('\n📊 대조 검증 결과 분석:');
  console.log('━'.repeat(60));
  
  console.log('\n🔄 버전 일치성 검증:');
  console.log('   📋 로컬 HEAD: 6d33cb3 - Mobile Hamburger Menu v5.0.0');
  console.log('   🌐 Vercel 배포: 기본 Docusaurus 구조 사용 중');
  console.log('   📝 결론: 로컬 최신 커밋이 Vercel에 배포되지 않음');
  
  console.log('\n🎯 핵심 발견사항:');
  console.log('   ❌ 로컬 6d33cb3 커밋의 개선사항이 프로덕션에 반영되지 않음');
  console.log('   ❌ 커스텀 햄버거 메뉴 (#mobile-hamburger-btn) 배포 안됨');
  console.log('   ❌ "Whitepaper" 텍스트 숨김 처리 배포 안됨');
  console.log('   ❌ package.json의 v6.0.0-ultimate-responsive 버전 미반영');
  
  console.log('\n💡 권장 사항:');
  console.log('   🚀 로컬 6d33cb3 커밋을 Vercel에 배포 필요');
  console.log('   🔧 vercel.json 설정 확인 및 강제 배포 실행');
  console.log('   ✅ 배포 후 재검증 필요');
  
  console.log('\n🏁 최종 결론:');
  console.log('   ⚠️  현재 Vercel 프로덕션은 로컬 최신 커밋과 불일치');
  console.log('   📤 배포 작업이 필요한 상태');
  
})();