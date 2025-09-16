const { chromium } = require('playwright');

(async () => {
  console.log('\n🔄 재귀개선 검증\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  console.log('📱 Vercel 로딩중...');
  await page.goto('https://tedprotocol-whitepaper.vercel.app/', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  await page.waitForTimeout(3000);
  
  // Check for Root component
  const hasRoot = await page.evaluate(() => {
    return document.querySelector('#mobile-critical-fixes') !== null;
  });
  console.log(`\nRoot 컴포넌트 적용: ${hasRoot ? '✅' : '❌'}`);
  
  // Run tests
  const tests = [];
  
  // 1. Title hidden
  const titleCheck = await page.evaluate(() => {
    const title = document.querySelector('.navbar__title');
    if (!title) return { hidden: true, display: 'none' };
    const style = window.getComputedStyle(title);
    return {
      hidden: style.display === 'none' || style.visibility === 'hidden',
      display: style.display,
      visibility: style.visibility
    };
  });
  tests.push({
    name: 'Whitepaper 타이틀 숨김',
    passed: titleCheck.hidden,
    details: `display: ${titleCheck.display}`
  });
  
  // 2. GitHub hidden
  const githubCheck = await page.evaluate(() => {
    const github = document.querySelector('.navbar [href*="github"]');
    if (!github) return { hidden: true };
    const style = window.getComputedStyle(github);
    return {
      hidden: style.display === 'none',
      display: style.display
    };
  });
  tests.push({
    name: 'GitHub 아이콘 숨김',
    passed: githubCheck.hidden
  });
  
  // 3. Open sidebar
  console.log('\n📱 햄버거 메뉴 열기...');
  await page.locator('.navbar__toggle').click();
  await page.waitForTimeout(2000);
  
  // 4. Sidebar width
  const sidebarCheck = await page.evaluate(() => {
    const sidebar = document.querySelector('.navbar-sidebar');
    if (!sidebar) return { width: '0%', px: 0 };
    return {
      width: ((sidebar.offsetWidth / window.innerWidth) * 100).toFixed(1) + '%',
      px: sidebar.offsetWidth
    };
  });
  const widthOK = parseFloat(sidebarCheck.width) >= 80 && parseFloat(sidebarCheck.width) <= 90;
  tests.push({
    name: '사이드바 너비 (85% 목표)',
    passed: widthOK,
    details: `${sidebarCheck.width} (${sidebarCheck.px}px)`
  });
  
  // 5. Close button
  const closeCheck = await page.evaluate(() => {
    const btn = document.querySelector('.navbar-sidebar__close');
    if (!btn) return { text: '', isBox: false };
    
    const style = window.getComputedStyle(btn);
    const beforeStyle = window.getComputedStyle(btn, '::before');
    
    return {
      text: btn.textContent.trim(),
      beforeContent: beforeStyle.content,
      borderRadius: style.borderRadius,
      background: style.backgroundColor || style.background,
      width: btn.offsetWidth,
      height: btn.offsetHeight,
      isBox: !style.borderRadius.includes('50%')
    };
  });
  
  const hasCloseText = closeCheck.text === 'CLOSE' || 
                       closeCheck.beforeContent.includes('CLOSE');
  const isBoxStyle = closeCheck.isBox && closeCheck.borderRadius.includes('6px');
  
  tests.push({
    name: '닫기 버튼 박스 스타일',
    passed: isBoxStyle && hasCloseText,
    details: `${closeCheck.isBox ? '박스' : '원형'} / "${closeCheck.text || closeCheck.beforeContent}" / ${closeCheck.width}x${closeCheck.height}px`
  });
  
  // Print results
  console.log('\n📊 테스트 결과:\n');
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    const details = test.details ? ` (${test.details})` : '';
    console.log(`  ${icon} ${test.name}${details}`);
  });
  
  const allPassed = tests.every(t => t.passed);
  
  if (allPassed) {
    console.log('\n🎉 모든 재귀개선 성공!');
  } else {
    console.log('\n⚠️ 일부 개선 필요');
    console.log('\n💡 추가 조치:');
    console.log('  1. Vercel 캐시 완전 무효화 필요');
    console.log('  2. CDN 엣지 캐시 갱신 대기 (5-10분)');
    console.log('  3. 브라우저 하드 리프레시 (Ctrl+Shift+R)');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'recursive-verify-result.png' });
  console.log('\n📸 스크린샷: recursive-verify-result.png');
  
  await browser.close();
  
  console.log('\n' + '=' .repeat(60));
  console.log('\n✅ 재귀검증 완료\n');
})();