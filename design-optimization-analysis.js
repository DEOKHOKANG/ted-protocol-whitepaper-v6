const { chromium } = require('playwright');

async function designOptimizationAnalysis() {
  console.log('\n🎨 모바일 사이드바 디자인 최적화 재귀검증\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3 // 고해상도 모바일 시뮬레이션
  });
  
  const page = await context.newPage();
  
  console.log('📱 현재 Vercel 디자인 분석...');
  await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(2000);
  
  // 1. 헤더 디자인 분석
  console.log('\n🔍 1. 헤더 디자인 분석:');
  const headerAnalysis = await page.evaluate(() => {
    const navbar = document.querySelector('.navbar');
    const logo = document.querySelector('.navbar__logo');
    const toggle = document.querySelector('.navbar__toggle');
    const langDropdown = document.querySelector('.dropdown');
    
    return {
      navbar: navbar ? {
        height: navbar.offsetHeight,
        background: window.getComputedStyle(navbar).backgroundColor,
        padding: window.getComputedStyle(navbar).padding,
        boxShadow: window.getComputedStyle(navbar).boxShadow
      } : null,
      logo: logo ? {
        width: logo.offsetWidth,
        height: logo.offsetHeight,
        visible: window.getComputedStyle(logo).display !== 'none'
      } : null,
      toggle: toggle ? {
        size: `${toggle.offsetWidth}x${toggle.offsetHeight}`,
        position: toggle.getBoundingClientRect(),
        visible: window.getComputedStyle(toggle).display !== 'none'
      } : null,
      langDropdown: langDropdown ? {
        position: langDropdown.getBoundingClientRect(),
        width: langDropdown.offsetWidth
      } : null
    };
  });
  
  console.log(`  헤더 높이: ${headerAnalysis.navbar?.height}px`);
  console.log(`  로고 표시: ${headerAnalysis.logo?.visible ? '✅' : '❌'}`);
  console.log(`  햄버거 버튼: ${headerAnalysis.toggle?.size}`);
  console.log(`  언어 선택기: ${headerAnalysis.langDropdown?.width}px 너비\n`);
  
  // 2. 햄버거 메뉴 열기
  console.log('🍔 사이드바 디자인 분석...');
  await page.click('.navbar__toggle');
  await page.waitForTimeout(2000);
  
  // 사이드바 디자인 상세 분석
  const sidebarDesign = await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    const backdrop = document.querySelector('.navbar-sidebar__backdrop');
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    const menuItems = document.querySelectorAll('.navbar-sidebar .menu__link');
    
    const analysis = {
      sidebar: null,
      backdrop: null,
      closeBtn: null,
      menuItems: [],
      spacing: {},
      typography: {},
      colors: {},
      usability: {}
    };
    
    if (sidebar) {
      const sidebarStyle = window.getComputedStyle(sidebar);
      const rect = sidebar.getBoundingClientRect();
      
      analysis.sidebar = {
        width: rect.width,
        widthPercent: (rect.width / window.innerWidth * 100).toFixed(1),
        height: rect.height,
        background: sidebarStyle.backgroundColor,
        borderRadius: sidebarStyle.borderRadius,
        boxShadow: sidebarStyle.boxShadow,
        padding: sidebarStyle.padding,
        position: rect.x
      };
    }
    
    if (backdrop) {
      const backdropStyle = window.getComputedStyle(backdrop);
      analysis.backdrop = {
        background: backdropStyle.backgroundColor,
        opacity: backdropStyle.opacity,
        zIndex: backdropStyle.zIndex
      };
    }
    
    if (closeBtn) {
      const closeBtnStyle = window.getComputedStyle(closeBtn);
      const rect = closeBtn.getBoundingClientRect();
      
      analysis.closeBtn = {
        width: rect.width,
        height: rect.height,
        background: closeBtnStyle.backgroundColor,
        borderRadius: closeBtnStyle.borderRadius,
        fontSize: closeBtnStyle.fontSize,
        fontWeight: closeBtnStyle.fontWeight,
        color: closeBtnStyle.color,
        margin: closeBtnStyle.margin,
        text: closeBtn.textContent,
        position: { x: rect.x, y: rect.y }
      };
    }
    
    // 메뉴 아이템 분석
    menuItems.forEach((item, index) => {
      const itemStyle = window.getComputedStyle(item);
      const rect = item.getBoundingClientRect();
      
      analysis.menuItems.push({
        index,
        text: item.textContent,
        fontSize: itemStyle.fontSize,
        lineHeight: itemStyle.lineHeight,
        padding: itemStyle.padding,
        margin: itemStyle.margin,
        color: itemStyle.color,
        background: itemStyle.backgroundColor,
        height: rect.height,
        isActive: item.classList.contains('menu__link--active')
      });
    });
    
    // 간격 분석
    const menuList = document.querySelector('.navbar-sidebar .menu__list');
    if (menuList) {
      const menuListStyle = window.getComputedStyle(menuList);
      analysis.spacing = {
        menuListPadding: menuListStyle.padding,
        itemSpacing: analysis.menuItems.length > 1 ? 
          analysis.menuItems[1].position?.y - (analysis.menuItems[0].position?.y + analysis.menuItems[0].height) : 0
      };
    }
    
    return analysis;
  });
  
  // 3. 디자인 분석 결과 출력
  console.log('\n📊 사이드바 디자인 분석 결과:\n');
  
  console.log('📐 레이아웃:');
  console.log(`  사이드바 너비: ${sidebarDesign.sidebar?.width}px (${sidebarDesign.sidebar?.widthPercent}%)`);
  console.log(`  사이드바 높이: ${sidebarDesign.sidebar?.height}px`);
  console.log(`  배경: ${sidebarDesign.sidebar?.background}`);
  console.log(`  그림자: ${sidebarDesign.sidebar?.boxShadow ? '있음' : '없음'}\n`);
  
  console.log('🎯 닫기 버튼:');
  console.log(`  크기: ${sidebarDesign.closeBtn?.width}x${sidebarDesign.closeBtn?.height}px`);
  console.log(`  텍스트: "${sidebarDesign.closeBtn?.text}"`);
  console.log(`  배경색: ${sidebarDesign.closeBtn?.background}`);
  console.log(`  모서리: ${sidebarDesign.closeBtn?.borderRadius}`);
  console.log(`  폰트 크기: ${sidebarDesign.closeBtn?.fontSize}\n`);
  
  console.log('📝 메뉴 아이템:');
  console.log(`  총 ${sidebarDesign.menuItems.length}개 항목`);
  if (sidebarDesign.menuItems.length > 0) {
    const firstItem = sidebarDesign.menuItems[0];
    console.log(`  폰트 크기: ${firstItem.fontSize}`);
    console.log(`  줄 높이: ${firstItem.lineHeight}`);
    console.log(`  패딩: ${firstItem.padding}`);
    console.log(`  평균 높이: ${(sidebarDesign.menuItems.reduce((sum, item) => sum + item.height, 0) / sidebarDesign.menuItems.length).toFixed(1)}px\n`);
  }
  
  console.log('🎨 백드롭:');
  console.log(`  배경: ${sidebarDesign.backdrop?.background}`);
  console.log(`  투명도: ${sidebarDesign.backdrop?.opacity}\n`);
  
  // 4. 디자인 최적화 권장사항 생성
  const recommendations = [];
  
  // 사이드바 너비 체크
  const widthPercent = parseFloat(sidebarDesign.sidebar?.widthPercent || '0');
  if (widthPercent > 60) {
    recommendations.push({
      priority: 'HIGH',
      category: '레이아웃',
      issue: `사이드바가 ${widthPercent}%로 여전히 넓음`,
      solution: '45% 이하로 축소 권장'
    });
  }
  
  // 닫기 버튼 크기 체크
  const btnWidth = sidebarDesign.closeBtn?.width || 0;
  const btnHeight = sidebarDesign.closeBtn?.height || 0;
  if (btnWidth > 60 || btnHeight > 35) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'UI 요소',
      issue: `닫기 버튼이 ${btnWidth}x${btnHeight}px로 큼`,
      solution: '40x24px 더 컴팩트 권장'
    });
  }
  
  // 메뉴 아이템 가독성 체크
  if (sidebarDesign.menuItems.length > 0) {
    const avgHeight = sidebarDesign.menuItems.reduce((sum, item) => sum + item.height, 0) / sidebarDesign.menuItems.length;
    if (avgHeight > 50) {
      recommendations.push({
        priority: 'MEDIUM',
        category: '타이포그래피',
        issue: `메뉴 아이템 높이가 ${avgHeight.toFixed(1)}px로 높음`,
        solution: '40px 이하로 압축 권장'
      });
    }
  }
  
  // 백드롭 투명도 체크
  const backdropOpacity = parseFloat(sidebarDesign.backdrop?.opacity || '0');
  if (backdropOpacity < 0.6) {
    recommendations.push({
      priority: 'LOW',
      category: '시각적 구분',
      issue: `백드롭 투명도가 ${backdropOpacity}로 낮음`,
      solution: '0.7 이상으로 증가하여 콘텐츠 구분 강화'
    });
  }
  
  // 5. 권장사항 출력
  console.log('💡 디자인 최적화 권장사항:\n');
  
  if (recommendations.length === 0) {
    console.log('🎉 현재 디자인이 모바일 최적화 기준에 부합합니다!\n');
  } else {
    recommendations.forEach((rec, index) => {
      const priorityIcon = rec.priority === 'HIGH' ? '🔴' : rec.priority === 'MEDIUM' ? '🟡' : '🟢';
      console.log(`${index + 1}. ${priorityIcon} ${rec.category}`);
      console.log(`   문제: ${rec.issue}`);
      console.log(`   해결: ${rec.solution}\n`);
    });
  }
  
  // 6. 스크린샷 및 디자인 요약
  await page.screenshot({ 
    path: 'mobile-sidebar-design-analysis.png',
    fullPage: false 
  });
  console.log('📸 디자인 분석 스크린샷: mobile-sidebar-design-analysis.png\n');
  
  // 7. 전체 UX 점수 계산
  let uxScore = 100;
  recommendations.forEach(rec => {
    if (rec.priority === 'HIGH') uxScore -= 25;
    else if (rec.priority === 'MEDIUM') uxScore -= 15;
    else uxScore -= 5;
  });
  
  console.log('=' .repeat(60));
  console.log(`\n📊 모바일 UX 점수: ${Math.max(0, uxScore)}/100`);
  
  if (uxScore >= 90) console.log('🎉 우수한 모바일 디자인!');
  else if (uxScore >= 70) console.log('👍 양호한 모바일 디자인');
  else if (uxScore >= 50) console.log('⚠️ 개선이 필요한 디자인');
  else console.log('🚨 긴급 개선이 필요한 디자인');
  
  await browser.close();
  console.log('\n✅ 디자인 최적화 분석 완료\n');
  
  return {
    score: uxScore,
    recommendations: recommendations,
    designData: sidebarDesign
  };
}

designOptimizationAnalysis().catch(console.error);