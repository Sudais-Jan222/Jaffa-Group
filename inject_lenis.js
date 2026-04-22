const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !['index.html', 'portfolio.html', 'project-template.html', 'portfolio_updated.html'].includes(f));

const lenisScript = '<script src="https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js"></script>\n    ';
const targetString = '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>';

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(targetString) && !content.includes('lenis.min.js')) {
        content = content.replace(targetString, lenisScript + targetString);
        fs.writeFileSync(filePath, content);
        console.log(`Injected Lenis: ${file}`);
    } else {
        console.log(`Skipped (already injected or target not found): ${file}`);
    }
});
