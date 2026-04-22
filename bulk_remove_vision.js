const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !['index.html', 'portfolio.html', 'project-template.html', 'portfolio_updated.html'].includes(f));

const sectionRegex = /<!-- Project Description Section -->[\s\S]*?<\/section>/g;

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (sectionRegex.test(content)) {
        content = content.replace(sectionRegex, '');
        fs.writeFileSync(filePath, content);
        console.log(`Cleaned: ${file}`);
    } else {
        console.log(`Skipped (not found): ${file}`);
    }
});
