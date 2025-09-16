const { chromium, devices } = require('playwright');

/**
 * 참조 사이트 모바일 최적화 분석
 */

const REFERENCE_URL = 'https://ted-protocol-whitepaper-dpgs2c0gj-tedprotocols-projects.vercel.app/ko/';
const OUR_URL = 'https://ted-protocol-whitepaper-v6-kevinglecs-projects.vercel.app/ko/';

async function analyzeReference() {
  console.log('🔍 참조 사이트 모바일 최적화 분석');
  console.log('=' .repeat(60));

  const browser = await chromium.launch({ 
    headless: false,
    devtools: true 
  });

  // iPhone 12 기준으로 분석
  const context = await browser.newContext({
    ...devices['iPhone 12']
  });

  const page = await context.newPage();

  console.log('\n📱 참조 사이트 분석: ' + REFERENCE_URL);
  console.log('-'.repeat(40));

  try {
    await page.goto(REFERENCE_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // 1. 네비게이션 바 분석
    const navbarHeight = await page.$eval('.navbar', el => {
      const style = window.getComputedStyle(el);
      return {
        height: el.offsetHeight,
        padding: style.padding,
        background: style.background,
        position: style.position
      };
    }).catch(() => null);
    console.log('\n📍 네비게이션 바:');
    console.log('   높이:', navbarHeight?.height, 'px');
    console.log('   패딩:', navbarHeight?.padding);
    console.log('   위치:', navbarHeight?.position);

    // 2. 로고 및 브랜드
    const logoStyle = await page.$eval('.navbar__logo', el => {
      const style = window.getComputedStyle(el);
      return {
        height: el.offsetHeight,
        width: el.offsetWidth,
        display: style.display
      };
    }).catch(() => null);
    console.log('\n🏷️ 로고:');
    console.log('   크기:', logoStyle?.width, 'x', logoStyle?.height);

    // 3. 햄버거 메뉴
    const hamburger = await page.$eval('.navbar__toggle', el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        position: style.position,
        right: style.right,
        top: style.top,
        display: style.display
      };
    }).catch(() => null);
    console.log('\n🍔 햄버거 메뉴:');
    console.log('   크기:', hamburger?.width, 'x', hamburger?.height);
    console.log('   위치:', hamburger?.position, 'right:', hamburger?.right);

    // 4. 메인 컨테이너 분석
    const container = await page.$eval('.container, main', el => {
      const style = window.getComputedStyle(el);
      return {
        padding: style.padding,
        margin: style.margin,
        maxWidth: style.maxWidth
      };
    }).catch(() => null);
    console.log('\n📦 컨테이너:');
    console.log('   패딩:', container?.padding);
    console.log('   최대너비:', container?.maxWidth);

    // 5. 타이포그래피 분석
    const typography = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const p = document.querySelector('p');
      const link = document.querySelector('a');
      
      return {
        h1: h1 ? {
          fontSize: window.getComputedStyle(h1).fontSize,
          lineHeight: window.getComputedStyle(h1).lineHeight,
          fontWeight: window.getComputedStyle(h1).fontWeight
        } : null,
        p: p ? {
          fontSize: window.getComputedStyle(p).fontSize,
          lineHeight: window.getComputedStyle(p).lineHeight
        } : null,
        a: link ? {
          fontSize: window.getComputedStyle(link).fontSize,
          color: window.getComputedStyle(link).color
        } : null
      };
    });
    console.log('\n✍️ 타이포그래피:');
    console.log('   H1:', typography.h1?.fontSize, '/', typography.h1?.lineHeight);
    console.log('   본문:', typography.p?.fontSize, '/', typography.p?.lineHeight);

    // 6. 사이드바 분석
    await page.click('.navbar__toggle').catch(() => {});
    await page.waitForTimeout(500);
    
    const sidebar = await page.$eval('.navbar-sidebar', el => {
      const style = window.getComputedStyle(el);
      return {
        width: el.offsetWidth,
        transform: style.transform,
        transition: style.transition,
        background: style.background
      };
    }).catch(() => null);
    console.log('\n📑 사이드바:');
    console.log('   너비:', sidebar?.width, 'px');
    console.log('   트랜지션:', sidebar?.transition);

    // 7. 터치 타겟 크기
    const touchTargets = await page.$$eval('button, a.menu__link, .dropdown', elements => {
      return elements.slice(0, 5).map(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          width: rect.width,
          height: rect.height,
          padding: style.padding
        };
      });
    });
    console.log('\n👆 터치 타겟:');
    touchTargets.forEach(target => {
      console.log(`   ${target.tag}: ${target.width}x${target.height}, padding: ${target.padding}`);
    });

    // 8. 스크롤 및 오버플로우
    const overflow = await page.evaluate(() => {
      return {
        body: window.getComputedStyle(document.body).overflow,
        html: window.getComputedStyle(document.documentElement).overflow,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });
    console.log('\n📜 스크롤:');
    console.log('   가로 스크롤:', overflow.hasHorizontalScroll ? '있음 ❌' : '없음 ✅');
    console.log('   body overflow:', overflow.body);

    // 9. 언어 선택기
    const langSelector = await page.$eval('.navbar__item.dropdown', el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        position: style.position
      };
    }).catch(() => null);
    console.log('\n🌐 언어 선택기:');
    console.log('   표시:', langSelector?.display);

    // 10. 스크린샷
    await page.screenshot({ 
      path: 'reference-mobile-analysis.png',
      fullPage: false 
    });

    // 우리 사이트와 비교
    console.log('\n\n📊 우리 사이트와 비교: ' + OUR_URL);
    console.log('=' .repeat(60));

    await page.goto(OUR_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // 동일한 분석 수행
    const ourNavbar = await page.$eval('.navbar', el => {
      return {
        height: el.offsetHeight,
        padding: window.getComputedStyle(el).padding
      };
    }).catch(() => null);
    console.log('\n우리 네비게이션:', ourNavbar?.height, 'px');

    await page.screenshot({ 
      path: 'our-mobile-current.png',
      fullPage: false 
    });

  } catch (error) {
    console.error('오류:', error.message);
  }

  await browser.close();

  // 개선 제안
  console.log('\n\n💡 개선 제안');
  console.log('=' .repeat(60));
  console.log('1. 네비게이션 바 높이를 60px로 통일');
  console.log('2. 햄버거 메뉴 크기를 44x44px로 확대');
  console.log('3. 컨테이너 패딩을 16px로 조정');
  console.log('4. 사이드바 너비를 280px로 설정');
  console.log('5. 모든 터치 타겟을 최소 44px로 보장');
  console.log('6. 폰트 크기 최소 14px 유지');
  console.log('7. 부드러운 트랜지션 효과 추가');
}

analyzeReference().catch(console.error);