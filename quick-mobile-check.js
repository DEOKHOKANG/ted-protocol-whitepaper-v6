const { chromium, devices } = require('playwright');

/**
 * 빠른 모바일 검증
 */

async function quickCheck() {
  console.log('🔍 빠른 모바일 검증 시작\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: false 
  });

  try {
    // 모바일 컨텍스트
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      locale: 'ko-KR'
    });

    const page = await context.newPage();
    
    // 최신 배포 URL
    const url = 'https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app/ko/';
    console.log(`📱 모바일 접속: ${url}\n`);
    
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    await page.waitForTimeout(2000);

    // 1. 가로 스크롤 체크
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`가로 스크롤: ${hasHorizontalScroll ? '❌ 있음' : '✅ 없음'}`);

    // 2. Whitepaper 텍스트 체크
    const whitepaperVisible = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.navbar__title, .navbar__brand b, .navbar__brand span'));
      return elements.some(el => {
        const style = window.getComputedStyle(el);
        return el.textContent?.includes('Whitepaper') && 
               style.display !== 'none' && 
               style.visibility !== 'hidden';
      });
    });
    console.log(`Whitepaper 텍스트: ${whitepaperVisible ? '❌ 보임' : '✅ 숨김'}`);

    // 3. GitHub 링크 체크
    const githubVisible = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="github"]'));
      return links.some(link => {
        const style = window.getComputedStyle(link);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
    });
    console.log(`GitHub 링크: ${githubVisible ? '❌ 보임' : '✅ 숨김'}`);

    // 4. 햄버거 메뉴 체크
    const hamburgerVisible = await page.evaluate(() => {
      const toggle = document.querySelector('.navbar__toggle');
      if (!toggle) return false;
      const style = window.getComputedStyle(toggle);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    console.log(`햄버거 메뉴: ${hamburgerVisible ? '✅ 보임' : '❌ 안보임'}`);

    // 5. 네비바 높이
    const navbarHeight = await page.evaluate(() => {
      const navbar = document.querySelector('.navbar');
      return navbar ? navbar.offsetHeight : 0;
    });
    console.log(`네비바 높이: ${navbarHeight}px`);

    // 스크린샷
    await page.screenshot({ 
      path: 'mobile-check.png',
      fullPage: false 
    });
    console.log('\n📸 스크린샷 저장: mobile-check.png');

  } catch (error) {
    console.error('❌ 오류:', error.message);
  }

  await browser.close();
  console.log('\n✅ 검증 완료');
}

quickCheck().catch(console.error);