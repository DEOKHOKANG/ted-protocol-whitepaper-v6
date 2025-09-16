const fs = require('fs');
const path = require('path');

// Function to remove all markdown emphasis patterns
function removeAllEmphasis(text) {
  // Remove bold patterns (**text** and __text__)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  
  // Remove italic patterns (*text* and _text_) - more comprehensive
  // Handle single asterisks that are used for emphasis (not lists)
  // This regex looks for * not at the start of a line and not part of ** or ***
  text = text.replace(/(?<![*\n])\*([^*\n]+)\*(?![*])/g, '$1');
  
  // Remove underscores used for emphasis (not in words like file_name)
  text = text.replace(/(?<![a-zA-Z0-9])_([^_]+)_(?![a-zA-Z0-9])/g, '$1');
  
  // Remove triple asterisks (***text***)
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
  
  // Remove any remaining emphasis at the end of lines like *text.*
  text = text.replace(/\*([^*\n]+)\.\*/g, '$1.');
  
  return text;
}

// Function to process a single file
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const processedContent = removeAllEmphasis(content);
  
  if (content !== processedContent) {
    fs.writeFileSync(filePath, processedContent, 'utf8');
    console.log(`✅ Processed: ${filePath}`);
    return true;
  }
  return false;
}

// Function to recursively find and process all markdown files
function processDirectory(dir, processedFiles = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'build') {
      processDirectory(filePath, processedFiles);
    } else if (file.endsWith('.md')) {
      if (processFile(filePath)) {
        processedFiles.push(filePath);
      }
    }
  }
  
  return processedFiles;
}

// Main execution
console.log('🔍 Searching for markdown files with emphasis patterns...\n');

const directories = [
  './docs',
  './i18n/ko/docusaurus-plugin-content-docs/current',
  './i18n/zh-CN/docusaurus-plugin-content-docs/current',
  './i18n/ja/docusaurus-plugin-content-docs/current',
  './blog'
];

let totalProcessed = 0;

for (const dir of directories) {
  if (fs.existsSync(dir)) {
    console.log(`\n📁 Processing directory: ${dir}`);
    const processed = processDirectory(dir);
    totalProcessed += processed.length;
  }
}

console.log(`\n✨ Complete! Processed ${totalProcessed} files.`);
console.log('All markdown emphasis patterns have been removed.');