const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !['index.html', 'portfolio.html', 'project-template.html', 'portfolio_updated.html'].includes(f));

// Regex to find the whole inline script block from project pages
const scriptRegex = /<script>[\s\S]*?Simple entrance animations[\s\S]*?<\/script>/g;

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (scriptRegex.test(content)) {
        content = content.replace(scriptRegex, '<script src="project-detail.js"></script>');
        fs.writeFileSync(filePath, content);
        console.log(`Migrated: ${file}`);
    } else {
        // Fallback: If it already has script but maybe old version, or just find any tail script
        console.log(`Skipped or already migrated: ${file}`);
    }
});
