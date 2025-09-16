const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * TED Protocol Whitepaper - English vs Korean Comparison Tool
 * This tool compares every page between English and Korean versions
 * to ensure perfect synchronization
 */

async function comparePages() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const baseUrl = 'http://localhost:3095';
  
  // Pages to compare
  const pages = [
    { path: '/', name: 'executive-summary' },
    { path: '/introduction', name: 'introduction' },
    { path: '/problem-statement', name: 'problem-statement' },
    { path: '/tokenomics', name: 'tokenomics' },
    { path: '/technology', name: 'technology' },
    { path: '/governance', name: 'governance' },
    { path: '/roadmap', name: 'roadmap' },
    { path: '/risk-disclosure', name: 'risk-disclosure' }
  ];
  
  const comparisonResults = {
    timestamp: new Date().toISOString(),
    pages: []
  };
  
  console.log('🔍 Starting English vs Korean Comparison...\n');
  
  for (const pageInfo of pages) {
    console.log(`📄 Comparing: ${pageInfo.name}`);
    
    // Open English version
    const enPage = await context.newPage();
    await enPage.goto(`${baseUrl}${pageInfo.path}`, { waitUntil: 'networkidle' });
    await enPage.waitForTimeout(2000);
    
    // Open Korean version
    const koPage = await context.newPage();
    await koPage.goto(`${baseUrl}/ko${pageInfo.path}`, { waitUntil: 'networkidle' });
    await koPage.waitForTimeout(2000);
    
    // Get content metrics
    const enMetrics = await enPage.evaluate(() => {
      const content = document.querySelector('.theme-doc-markdown');
      const headers = document.querySelectorAll('h1, h2, h3');
      const codeBlocks = document.querySelectorAll('pre');
      const tables = document.querySelectorAll('table');
      const components = document.querySelectorAll('[class*="Dashboard"], [class*="Calculator"], [class*="Chart"], [class*="Table"], [class*="Timeline"]');
      
      return {
        textLength: content ? content.innerText.length : 0,
        headerCount: headers.length,
        codeBlockCount: codeBlocks.length,
        tableCount: tables.length,
        componentCount: components.length,
        headers: Array.from(headers).map(h => ({ 
          level: h.tagName, 
          text: h.innerText.trim().substring(0, 50) 
        }))
      };
    });
    
    const koMetrics = await koPage.evaluate(() => {
      const content = document.querySelector('.theme-doc-markdown');
      const headers = document.querySelectorAll('h1, h2, h3');
      const codeBlocks = document.querySelectorAll('pre');
      const tables = document.querySelectorAll('table');
      const components = document.querySelectorAll('[class*="Dashboard"], [class*="Calculator"], [class*="Chart"], [class*="Table"], [class*="Timeline"]');
      
      return {
        textLength: content ? content.innerText.length : 0,
        headerCount: headers.length,
        codeBlockCount: codeBlocks.length,
        tableCount: tables.length,
        componentCount: components.length,
        headers: Array.from(headers).map(h => ({ 
          level: h.tagName, 
          text: h.innerText.trim().substring(0, 50) 
        }))
      };
    });
    
    // Calculate differences
    const lengthDiff = ((koMetrics.textLength - enMetrics.textLength) / enMetrics.textLength * 100).toFixed(1);
    const isLengthOk = Math.abs(lengthDiff) <= 30; // Allow 30% difference for translations
    
    const pageComparison = {
      name: pageInfo.name,
      path: pageInfo.path,
      english: enMetrics,
      korean: koMetrics,
      differences: {
        textLengthDiff: `${lengthDiff}%`,
        headerDiff: koMetrics.headerCount - enMetrics.headerCount,
        codeBlockDiff: koMetrics.codeBlockCount - enMetrics.codeBlockCount,
        tableDiff: koMetrics.tableCount - enMetrics.tableCount,
        componentDiff: koMetrics.componentCount - enMetrics.componentCount
      },
      status: {
        lengthMatch: isLengthOk,
        structureMatch: koMetrics.headerCount === enMetrics.headerCount,
        codeMatch: koMetrics.codeBlockCount === enMetrics.codeBlockCount,
        tableMatch: koMetrics.tableCount === enMetrics.tableCount,
        componentMatch: koMetrics.componentCount === enMetrics.componentCount
      }
    };
    
    comparisonResults.pages.push(pageComparison);
    
    // Take screenshots for visual comparison
    await enPage.screenshot({ 
      path: `comparison/en-${pageInfo.name}.png`,
      fullPage: true 
    });
    await koPage.screenshot({ 
      path: `comparison/ko-${pageInfo.name}.png`,
      fullPage: true 
    });
    
    // Print comparison
    console.log(`  📊 Text Length: EN=${enMetrics.textLength} vs KO=${koMetrics.textLength} (${lengthDiff}%) ${isLengthOk ? '✅' : '❌'}`);
    console.log(`  📑 Headers: EN=${enMetrics.headerCount} vs KO=${koMetrics.headerCount} ${koMetrics.headerCount === enMetrics.headerCount ? '✅' : '❌'}`);
    console.log(`  💻 Code Blocks: EN=${enMetrics.codeBlockCount} vs KO=${koMetrics.codeBlockCount} ${koMetrics.codeBlockCount === enMetrics.codeBlockCount ? '✅' : '❌'}`);
    console.log(`  📋 Tables: EN=${enMetrics.tableCount} vs KO=${koMetrics.tableCount} ${koMetrics.tableCount === enMetrics.tableCount ? '✅' : '❌'}`);
    console.log(`  🧩 Components: EN=${enMetrics.componentCount} vs KO=${koMetrics.componentCount} ${koMetrics.componentCount === enMetrics.componentCount ? '✅' : '❌'}`);
    console.log('');
    
    await enPage.close();
    await koPage.close();
  }
  
  // Generate summary report
  const perfectMatches = comparisonResults.pages.filter(p => 
    p.status.structureMatch && 
    p.status.codeMatch && 
    p.status.tableMatch && 
    p.status.componentMatch
  );
  
  console.log('📊 COMPARISON SUMMARY');
  console.log('====================');
  console.log(`✅ Perfect Matches: ${perfectMatches.length}/${pages.length}`);
  console.log(`❌ Need Fixes: ${pages.length - perfectMatches.length}/${pages.length}`);
  console.log('\n🔴 Pages Needing Attention:');
  
  comparisonResults.pages.forEach(page => {
    const issues = [];
    if (!page.status.structureMatch) issues.push('Headers');
    if (!page.status.codeMatch) issues.push('Code Blocks');
    if (!page.status.tableMatch) issues.push('Tables');
    if (!page.status.componentMatch) issues.push('Components');
    if (!page.status.lengthMatch) issues.push('Content Length');
    
    if (issues.length > 0) {
      console.log(`  - ${page.name}: ${issues.join(', ')}`);
    }
  });
  
  // Save detailed report
  fs.writeFileSync(
    'comparison-report.json',
    JSON.stringify(comparisonResults, null, 2)
  );
  
  console.log('\n📁 Detailed report saved to: comparison-report.json');
  console.log('📸 Screenshots saved to: comparison/ directory');
  
  await browser.close();
}

// Create comparison directory
if (!fs.existsSync('comparison')) {
  fs.mkdirSync('comparison');
}

// Run comparison
comparePages().catch(console.error);