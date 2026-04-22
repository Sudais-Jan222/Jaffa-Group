const fs = require('fs');
const path = require('path');

const projectRootDir = path.join(__dirname, 'Jaffa Group Portfolo');
const tags = [
    "Exterior Perspective",
    "Interior Harmony",
    "Master Suite",
    "Architectural Detail",
    "Living Space",
    "Gourmet Kitchen",
    "Outdoor Sanctuary",
    "Modern Craftsmanship"
];

// Spans for a 4-column Bento grid (Total 8 items)
// 1: Big (2x2), 2: Wide (2x1), 3-4: Standard, 5: Tall (1x2), 6-8: Standard
const spanClasses = ['big', 'wide', '', '', 'tall', '', '', ''];

const rootFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && !['index.html', 'portfolio.html', 'project-template.html', 'portfolio_updated.html'].includes(f));

rootFiles.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    let content = fs.readFileSync(filePath, 'utf8');

    // Identify project folder name from fileName slug? No, better use the existing content or a mapping.
    // Actually, I can extract the project name from the <title> or <h1>
    const titleMatch = content.match(/<h1 class="project-hero-title">(.*?)<\/h1>/);
    if (!titleMatch) return;
    const projectName = titleMatch[1];
    const projectFolderPath = path.join(projectRootDir, projectName);

    if (fs.existsSync(projectFolderPath)) {
        const images = fs.readdirSync(projectFolderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.webp') || f.endsWith('.png'));
        // Sort images so hero is first if needed, though they are numbered usually
        images.sort();

        let galleryHtml = '';
        // Use up to 8 images for the bento grid
        const galleryImages = images.slice(0, 8);

        galleryImages.forEach((img, idx) => {
            const spanClass = spanClasses[idx] || '';
            const tag = tags[idx % tags.length];
            galleryHtml += `        <div class="gallery-card ${spanClass}">
            <img src="Jaffa Group Portfolo/${projectName}/${img}" alt="${projectName} view ${idx + 1}" loading="lazy">
            <div class="gallery-card-info">
                <span class="gallery-card-tag">${tag}</span>
            </div>
        </div>\n`;
        });

        // 1. Update the Gallery Section Template
        // We look for the <section class="project-gallery"> block
        const galleryRegex = /<section class="project-gallery">[\s\S]*?<\/section>/;
        
        const newGallerySection = `    <!-- Project Gallery Section -->
    <section class="project-gallery">
        <div class="gallery-title-wrapper">
            <p class="gallery-subtitle">Portfolio</p>
            <h2 class="gallery-main-title">Project Gallery</h2>
        </div>
        <div class="gallery-grid-modern">
${galleryHtml}        </div>
    </section>`;

        if (galleryRegex.test(content)) {
            content = content.replace(galleryRegex, newGallerySection);
            fs.writeFileSync(filePath, content);
            console.log(`Updated Gallery: ${fileName}`);
        }
    }
});
