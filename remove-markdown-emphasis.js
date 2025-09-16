const fs = require('fs');
const path = require('path');

// Function to remove markdown emphasis
function removeMarkdownEmphasis(text) {
  // Remove bold (**text** or __text__)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  
  // Remove italic (*text* or _text_) but be careful not to remove * in lists
  // Only remove if * is not at the beginning of a line (list) or part of ***
  text = text.replace(/(?<!^|\n|\*)\*([^*\n]+)\*(?!\*)/gm, '$1');
  text = text.replace(/(?<!^|\n)_([^_\n]+)_/gm, '$1');
  
  // Remove bold italic (***text*** or ___text___)
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
  text = text.replace(/___([^_]+)___/g, '$1');
  
  return text;
}

// Function to process a file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Skip processing for certain patterns that should keep emphasis
    const linesToPreserve = [
      /^#{1,6}\s/, // Headers
      /^\|/, // Table rows
      /^```/, // Code blocks
      /^---$/, // Horizontal rules or frontmatter
    ];
    
    // Process line by line to preserve certain structures
    const lines = content.split('\n');
    const processedLines = lines.map(line => {
      // Skip if line matches patterns to preserve
      if (linesToPreserve.some(pattern => pattern.test(line))) {
        return line;
      }
      
      // Skip if it's a list item with * at the beginning
      if (/^\s*\*\s/.test(line)) {
        // But still process the content after the list marker
        const match = line.match(/^(\s*\*\s)(.*)/);
        if (match) {
          return match[1] + removeMarkdownEmphasis(match[2]);
        }
        return line;
      }
      
      return removeMarkdownEmphasis(line);
    });
    
    content = processedLines.join('\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Processed: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No changes: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find all .md files
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and build directories
      if (!file.includes('node_modules') && !file.includes('build') && !file.includes('.docusaurus')) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
console.log('🚀 Starting to remove markdown emphasis from all files...\n');

const directories = [
  './docs',
  './i18n/ko/docusaurus-plugin-content-docs/current',
  './i18n/zh-CN/docusaurus-plugin-content-docs/current',
  './i18n/ja/docusaurus-plugin-content-docs/current'
];

let totalFiles = 0;
let modifiedFiles = 0;

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`\n📁 Processing directory: ${dir}`);
    const files = findMarkdownFiles(dir);
    
    files.forEach(file => {
      totalFiles++;
      if (processFile(file)) {
        modifiedFiles++;
      }
    });
  } else {
    console.log(`⚠️  Directory not found: ${dir}`);
  }
});

console.log('\n📊 Summary:');
console.log(`Total files processed: ${totalFiles}`);
console.log(`Files modified: ${modifiedFiles}`);
console.log('\n✨ Markdown emphasis removal complete!');