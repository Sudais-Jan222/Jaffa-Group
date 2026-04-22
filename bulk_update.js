const fs = require('fs');
const path = require('path');

const tags = [
    "Exclusive luxury residence showcasing sophisticated architectural design and premium finishes.",
    "A masterclass in modern mountain living, blending natural textures with high-end luxury.",
    "Architectural excellence redefined through meticulous craftsmanship and visionary design.",
    "An immersive sanctuary designed for those who appreciate the finer details of master-built architecture.",
    "Sophisticated living redefined, featuring expansive views and seamless indoor-outdoor transitions."
];

const portfolioPath = path.join(__dirname, 'portfolio.html');
const projectRootDir = path.join(__dirname, 'Jaffa Group Portfolo');

let content = fs.readFileSync(portfolioPath, 'utf8');
const folders = fs.readdirSync(projectRootDir).filter(f => fs.statSync(path.join(projectRootDir, f)).isDirectory());

folders.forEach(name => {
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/_/g, '-') + '.html';
    const tag = tags[name.length % tags.length];

    // Escape name for regex
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 1. Update Card Link, Title Transition, and Image Transition
    // We look for the comment <!-- Card X: Name --> to find the block
    const cardBlockRegex = new RegExp(`(<!-- Card \\d+: ${escapedName} -->[\\s\\S]*?)(<div class="portfolio-card"[\\s\\S]*?)(<img src="([^"]*?)" alt="${escapedName}")([\\s\\S]*?)(<h3)([\\s\\S]*?>)(.*?)(</h3>)([\\s\\S]*?)(<a href=")(.*?)(" class="view-project-btn">View Project</a>)`, 'g');

    content = content.replace(cardBlockRegex, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13) => {
        // Add style to img if missing
        let newImg = p3;
        if (!p3.includes('view-transition-name')) {
            newImg = `${p3} style="view-transition-name: project-image;"`;
        }

        // Add style to h3 if missing
        let newH3Open = p7;
        if (!p7.includes('view-transition-name')) {
            newH3Open = p7.replace('>', ' style="view-transition-name: project-title;">');
        }

        return `${p1}${p2}${newImg}${p5}${p6}${newH3Open}${p8}${p9}${p10}${p11}${slug}${p13}`;
    });

    // 2. Update Description
    const descRegex = new RegExp(`(<!-- Card \\d+: ${escapedName} -->[\\s\\S]*?<p class="card-description"[\\s\\S]*?>)(.*?)(</p>)`, 'g');
    content = content.replace(descRegex, (match, p1, p2, p3) => {
        return `${p1}${tag}${p3}`;
    });
});

fs.writeFileSync(path.join(__dirname, 'portfolio_updated.html'), content);
console.log('Portfolio update completed. Generated portfolio_updated.html');
