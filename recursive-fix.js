const { chromium } = require('playwright');
const fs = require('fs');

async function recursiveFix() {
  console.log('🔄 재귀개선 시작...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  
  const page = await context.newPage();
  
  // Test locally first
  console.log('📱 로컬 테스트...');
  await page.goto('http://localhost:3400/', { waitUntil: 'networkidle' });
  
  // Inject maximum priority fixes
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media screen and (max-width: 996px) {
        .navbar__title { 
          display: none !important; 
          position: absolute !important;
          left: -9999px !important;
        }
        .navbar__items--right [href*="github"] { 
          display: none !important; 
        }
        .navbar-sidebar {
          width: 85% !important;
          max-width: 320px !important;
        }
        .navbar-sidebar__close {
          width: 80px !important;
          height: 36px !important;
          border-radius: 6px !important;
          background: #6B46C1 !important;
        }
        .navbar-sidebar__close::before {
          content: "CLOSE" !important;
          color: white !important;
          font-weight: 600 !important;
        }
        .navbar-sidebar__close svg {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  });
  
  await page.waitForTimeout(1000);
  await page.locator('.navbar__toggle').click();
  await page.waitForTimeout(1000);
  
  // Verify fixes
  const results = await page.evaluate(() => {
    const checks = {};
    
    const title = document.querySelector('.navbar__title');
    checks.titleHidden = !title || window.getComputedStyle(title).display === 'none';
    
    const sidebar = document.querySelector('.navbar-sidebar');
    if (sidebar) {
      checks.sidebarWidth = ((sidebar.offsetWidth / window.innerWidth) * 100).toFixed(1) + '%';
    }
    
    const closeBtn = document.querySelector('.navbar-sidebar__close');
    if (closeBtn) {
      checks.closeText = closeBtn.textContent || window.getComputedStyle(closeBtn, '::before').content;
      checks.borderRadius = window.getComputedStyle(closeBtn).borderRadius;
    }
    
    const github = document.querySelector('.navbar [href*="github"]');
    checks.githubHidden = !github || window.getComputedStyle(github).display === 'none';
    
    return checks;
  });
  
  console.log('\n📊 로컬 테스트 결과:');
  console.log(`  제목 숨김: ${results.titleHidden ? '✅' : '❌'}`);
  console.log(`  사이드바: ${results.sidebarWidth} ${parseFloat(results.sidebarWidth) <= 90 ? '✅' : '❌'}`);
  console.log(`  닫기버튼: ${results.closeText} / ${results.borderRadius}`);
  console.log(`  GitHub: ${results.githubHidden ? '✅' : '❌'}`);
  
  if (Object.values(results).every(v => v === true || (typeof v === 'string' && v.includes('85')))) {
    console.log('\n✅ 로컬 테스트 성공! CSS 업데이트 중...\n');
    
    // Add even more aggressive CSS
    const additionalCSS = `

/* RECURSIVE FIX - ULTIMATE PRIORITY */
@media screen and (max-width: 996px) {
  /* Force hide title with multiple selectors */
  .navbar__title,
  .navbar__brand .navbar__title,
  .navbar__logo + b,
  .navbar__logo + span,
  [class*="navbar__title"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    position: absolute !important;
    left: -99999px !important;
    pointer-events: none !important;
    z-index: -9999 !important;
  }
  
  /* Force GitHub hide */
  .navbar__item [href*="github"],
  .navbar__items [href*="github"],
  .navbar__items--right [href*="github"],
  a[href*="github.com"] {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
    opacity: 0 !important;
    overflow: hidden !important;
  }
  
  /* Force sidebar width */
  .navbar-sidebar,
  .navbar-sidebar--show,
  [class*="navbar-sidebar"] {
    width: 85% !important;
    max-width: 320px !important;
    min-width: 280px !important;
  }
  
  /* Force close button style */
  .navbar-sidebar__close,
  [class*="navbar-sidebar__close"] {
    width: auto !important;
    min-width: 80px !important;
    max-width: 100px !important;
    height: 36px !important;
    padding: 8px 16px !important;
    border-radius: 6px !important;
    background: #6B46C1 !important;
    background-color: #6B46C1 !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    line-height: 20px !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    border: none !important;
    box-shadow: 0 2px 8px rgba(107, 70, 193, 0.3) !important;
  }
  
  .navbar-sidebar__close::before {
    content: "CLOSE" !important;
    color: white !important;
    font-weight: 600 !important;
    display: block !important;
  }
  
  .navbar-sidebar__close svg,
  .navbar-sidebar__close img,
  .navbar-sidebar__close i {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
  }
  
  .navbar-sidebar__close::after {
    display: none !important;
  }
}

/* Even higher specificity overrides */
@media (max-width: 996px) {
  html body .navbar .navbar__title { display: none !important; }
  html body .navbar [href*="github"] { display: none !important; }
  html body .navbar-sidebar { width: 85% !important; }
  html body .navbar-sidebar__close::before { content: "CLOSE" !important; }
}
`;
    
    // Append to custom.css
    const cssPath = '/Users/kevin/Downloads/테드프로토콜/ted-protocol-docs/ted-whitepaper-docs/src/css/custom.css';
    const currentCSS = fs.readFileSync(cssPath, 'utf8');
    fs.writeFileSync(cssPath, currentCSS + additionalCSS);
    
    console.log('✅ CSS 업데이트 완료!');
  }
  
  await browser.close();
  console.log('\n🔄 재귀개선 완료!');
}

recursiveFix().catch(console.error);