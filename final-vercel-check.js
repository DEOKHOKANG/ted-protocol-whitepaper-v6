const { chromium } = require('playwright');

(async () => {
  console.log('🎯 최종 Vercel 검증 - JavaScript 주입 확인\n');
  console.log('=' .repeat(60) + '\n');
  
  console.log('⏳ 90초 배포 대기중...\n');
  await new Promise(resolve => setTimeout(resolve, 90000));
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    
    const page = await context.newPage();
    
    console.log('🌐 Vercel 로딩중...\n');
    await page.goto('https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/', { 
      waitUntil: 'networkidle'
    });
    
    await page.waitForTimeout(3000);
    
    // Check if JavaScript was injected
    const hasScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(s => s.src.includes('mobile-fix.js')) ||
             scripts.some(s => s.innerHTML.includes('Immediate mobile fixes'));
    });
    console.log(`JavaScript 주입: ${hasScript ? '✅' : '❌'}\n`);
    
    // Test all fixes
    const tests = [];
    
    // 1. Title hidden
    const titleHidden = await page.evaluate(() => {
      const title = document.querySelector('.navbar__title');
      if (!title) return true;
      const style = window.getComputedStyle(title);
      return style.display === 'none' || style.visibility === 'hidden';
    });
    tests.push({ name: '제목 숨김', passed: titleHidden });
    
    // 2. Open sidebar
    await page.locator('.navbar__toggle').click();
    await page.waitForTimeout(2000);
    
    // 3. Sidebar width
    const sidebarWidth = await page.evaluate(() => {
      const sidebar = document.querySelector('.navbar-sidebar');
      if (!sidebar) return '0%';
      return ((sidebar.offsetWidth / window.innerWidth) * 100).toFixed(1) + '%';
    });
    tests.push({ name: '사이드바 너비', passed: parseFloat(sidebarWidth) <= 90, value: sidebarWidth });
    
    // 4. Close button
    const closeButton = await page.evaluate(() => {
      const btn = document.querySelector('.navbar-sidebar__close');
      if (!btn) return { text: '', style: '' };
      return {
        text: btn.textContent,
        width: btn.offsetWidth,
        height: btn.offsetHeight,
        borderRadius: window.getComputedStyle(btn).borderRadius
      };
    });
    const isBox = !closeButton.borderRadius.includes('50%');
    const hasClose = closeButton.text.includes('CLOSE');
    tests.push({ 
      name: '닫기 버튼', 
      passed: isBox && hasClose, 
      value: `${closeButton.width}x${closeButton.height}, ${isBox ? '박스' : '원형'}, "${closeButton.text}"`
    });
    
    // 5. GitHub hidden
    const githubHidden = await page.evaluate(() => {
      const github = document.querySelector('[href*="github"]');
      if (!github) return true;
      const style = window.getComputedStyle(github);
      return style.display === 'none' || style.visibility === 'hidden';
    });
    tests.push({ name: 'GitHub 숨김', passed: githubHidden });
    
    // Print results
    console.log('📊 테스트 결과:\n');
    tests.forEach(test => {
      const status = test.passed ? '✅' : '❌';
      const value = test.value ? ` (${test.value})` : '';
      console.log(`  ${status} ${test.name}${value}`);
    });
    
    const allPassed = tests.every(t => t.passed);
    console.log(`\n${allPassed ? '🎉 모든 테스트 통과!' : '⚠️ 일부 테스트 실패'}\n`);
    
    await page.screenshot({ path: 'final-vercel-result.png' });
    
  } finally {
    await browser.close();
  }
  
  console.log('=' .repeat(60));
  console.log('\n✅ 최종 검증 완료\n');
})();