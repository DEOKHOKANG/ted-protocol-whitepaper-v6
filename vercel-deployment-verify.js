const { chromium } = require('playwright');

async function verifyDeployment() {
  console.log('\n🚀 Vercel 배포 재귀검증\n');
  console.log('=' .repeat(60) + '\n');
  console.log('URL: https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  try {
    // Mobile context
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    
    console.log('⏳ 페이지 로딩 중...');
    await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await page.waitForTimeout(3000);
    console.log('✅ 페이지 로드 완료\n');
    
    // 1. CSS 파일 로드 확인
    console.log('📋 스타일시트 로드 확인:');
    const hasForceCSS = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const hasForce = links.some(link => link.href.includes('force-mobile-fix.css'));
      const styles = Array.from(document.querySelectorAll('style'));
      const hasInline = styles.some(style => style.innerHTML.includes('CLOSE'));
      return { hasForce, hasInline, totalStyles: styles.length };
    });
    console.log(`  force-mobile-fix.css: ${hasForceCSS.hasForce ? '✅ 로드됨' : '❌ 없음'}`);
    console.log(`  인라인 스타일: ${hasForceCSS.hasInline ? '✅ 있음' : '❌ 없음'}`);
    console.log(`  총 스타일 태그: ${hasForceCSS.totalStyles}개\n`);
    
    // 2. 헤더 타이틀 확인
    console.log('📱 모바일 헤더 검증:');
    const headerState = await page.evaluate(() => {
      const title = document.querySelector('.navbar__title');
      const brandText = document.querySelector('.navbar__brand b');
      const github = document.querySelector('.navbar [href*="github"]');
      
      const results = {
        title: null,
        brandText: null,
        github: null
      };
      
      if (title) {
        const style = window.getComputedStyle(title);
        results.title = {
          exists: true,
          text: title.textContent,
          display: style.display,
          visibility: style.visibility,
          width: style.width,
          hidden: style.display === 'none' || style.visibility === 'hidden'
        };
      } else {
        results.title = { exists: false, hidden: true };
      }
      
      if (brandText) {
        const style = window.getComputedStyle(brandText);
        results.brandText = {
          exists: true,
          text: brandText.textContent,
          display: style.display,
          hidden: style.display === 'none'
        };
      } else {
        results.brandText = { exists: false, hidden: true };
      }
      
      if (github) {
        const style = window.getComputedStyle(github);
        results.github = {
          exists: true,
          display: style.display,
          hidden: style.display === 'none'
        };
      } else {
        results.github = { exists: false, hidden: true };
      }
      
      return results;
    });
    
    console.log(`  Whitepaper 타이틀: ${headerState.title.hidden ? '✅ 숨김' : `❌ 보임 ("${headerState.title.text}")`}`);
    console.log(`  브랜드 텍스트: ${headerState.brandText.hidden ? '✅ 숨김' : `❌ 보임 ("${headerState.brandText.text}")`}`);
    console.log(`  GitHub 링크: ${headerState.github.hidden ? '✅ 숨김' : '❌ 보임'}\n`);
    
    // 3. 햄버거 메뉴 클릭
    console.log('🍔 햄버거 메뉴 테스트:');
    await page.click('.navbar__toggle');
    console.log('  메뉴 클릭 완료');
    await page.waitForTimeout(2000);
    
    // 4. 사이드바 검증
    const sidebarState = await page.evaluate(() => {
      const sidebar = document.querySelector('.navbar-sidebar');
      const closeBtn = document.querySelector('.navbar-sidebar__close');
      
      const results = {
        sidebar: null,
        closeBtn: null
      };
      
      if (sidebar) {
        const style = window.getComputedStyle(sidebar);
        const rect = sidebar.getBoundingClientRect();
        results.sidebar = {
          width: rect.width,
          widthPercent: (rect.width / window.innerWidth * 100).toFixed(1),
          display: style.display,
          maxWidth: style.maxWidth
        };
      }
      
      if (closeBtn) {
        const style = window.getComputedStyle(closeBtn);
        const rect = closeBtn.getBoundingClientRect();
        const beforeContent = window.getComputedStyle(closeBtn, '::before').content;
        const afterContent = window.getComputedStyle(closeBtn, '::after').content;
        
        results.closeBtn = {
          text: closeBtn.textContent.trim(),
          width: rect.width,
          height: rect.height,
          borderRadius: style.borderRadius,
          background: style.backgroundColor || style.background,
          beforeContent: beforeContent,
          afterContent: afterContent,
          innerHTML: closeBtn.innerHTML
        };
      }
      
      return results;
    });
    
    console.log('\n📊 사이드바 상태:');
    console.log(`  너비: ${sidebarState.sidebar.widthPercent}% (${sidebarState.sidebar.width}px)`);
    console.log(`  최대 너비: ${sidebarState.sidebar.maxWidth}`);
    const widthOK = parseFloat(sidebarState.sidebar.widthPercent) <= 80;
    console.log(`  너비 최적화: ${widthOK ? '✅' : '❌'}\n`);
    
    console.log('🔘 닫기 버튼 상태:');
    console.log(`  텍스트: "${sidebarState.closeBtn.text}"`);
    console.log(`  ::before: ${sidebarState.closeBtn.beforeContent}`);
    console.log(`  ::after: ${sidebarState.closeBtn.afterContent}`);
    console.log(`  크기: ${sidebarState.closeBtn.width}x${sidebarState.closeBtn.height}px`);
    console.log(`  모서리: ${sidebarState.closeBtn.borderRadius}`);
    console.log(`  배경색: ${sidebarState.closeBtn.background}`);
    
    const isBoxStyle = sidebarState.closeBtn.borderRadius && 
                      !sidebarState.closeBtn.borderRadius.includes('50%');
    const hasCloseText = sidebarState.closeBtn.text === 'CLOSE' || 
                        sidebarState.closeBtn.beforeContent?.includes('CLOSE') ||
                        sidebarState.closeBtn.afterContent?.includes('CLOSE');
    
    console.log(`\n  박스 스타일: ${isBoxStyle ? '✅' : '❌'}`);
    console.log(`  CLOSE 텍스트: ${hasCloseText ? '✅' : '❌'}\n`);
    
    // 5. 스크린샷
    await page.screenshot({ 
      path: 'vercel-deployment-verify.png',
      fullPage: false 
    });
    console.log('📸 스크린샷: vercel-deployment-verify.png\n');
    
    // 6. 최종 검증 결과
    console.log('=' .repeat(60));
    console.log('\n📋 최종 검증 결과:\n');
    
    const allChecks = [
      { name: 'Whitepaper 텍스트 숨김', passed: headerState.title.hidden },
      { name: 'GitHub 링크 숨김', passed: headerState.github.hidden },
      { name: '사이드바 너비 최적화', passed: widthOK },
      { name: '닫기 버튼 박스 스타일', passed: isBoxStyle },
      { name: 'CLOSE 텍스트 표시', passed: hasCloseText }
    ];
    
    allChecks.forEach(check => {
      console.log(`  ${check.passed ? '✅' : '❌'} ${check.name}`);
    });
    
    const allPassed = allChecks.every(c => c.passed);
    
    console.log(`\n${allPassed ? '🎉 모든 검증 통과!' : '⚠️ 일부 개선 필요'}`);
    
    if (!allPassed) {
      console.log('\n💡 개선 방안:');
      console.log('1. 캐시 무효화가 필요할 수 있습니다');
      console.log('2. 빌드가 아직 진행 중일 수 있습니다');
      console.log('3. 브라우저 하드 리프레시 필요 (Ctrl+Shift+R)');
    }
    
  } finally {
    await browser.close();
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('\n✅ Vercel 배포 검증 완료\n');
}

verifyDeployment().catch(console.error);