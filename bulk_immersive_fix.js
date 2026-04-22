const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const assetsDir = path.join(rootDir, 'Jaffa Group Portfolo');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !['index.html', 'portfolio.html', 'project-template.html', 'portfolio_updated.html'].includes(f));

// Pre-defined descriptive titles for variety
const titles = [
    "Architectural Perspective",
    "Interior Harmony",
    "Gourmet Kitchen",
    "Master Suite Sanctuary",
    "Exterior Glow",
    "Design Detail",
    "Living Space",
    "Outdoor Oasis",
    "Material Texture",
    "Landscape Integration"
];

// Get all project folders
const assetFolders = fs.readdirSync(assetsDir).filter(f => fs.statSync(path.join(assetsDir, f)).isDirectory());

htmlFiles.forEach(htmlFile => {
    const htmlPath = path.join(rootDir, htmlFile);
    const projectName = htmlFile.replace('.html', '');
    
    // 1. Find the matching folder
    // Logic: normalize names by replacing hyphens with spaces and lowercase
    const normalizedProjName = projectName.toLowerCase().replace(/-/g, ' ');
    
    let matchedFolder = assetFolders.find(f => {
        const normalizedFolder = f.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ').trim();
        return normalizedFolder === normalizedProjName || 
               normalizedProjName.startsWith(normalizedFolder) || 
               normalizedFolder.startsWith(normalizedProjName);
    });

    if (!matchedFolder) {
        // Fallback: try removing common prefixes/suffixes
        // e.g. "american-saddler-correct-one" -> "american saddler"
        const coreName = normalizedProjName.split(' ')[0];
        matchedFolder = assetFolders.find(f => f.toLowerCase().includes(coreName));
    }

    if (!matchedFolder) {
        console.log(`Could not find folder for ${htmlFile}`);
        return;
    }

    console.log(`Matching ${htmlFile} -> folder: "${matchedFolder}"`);
    
    // 2. Scan the matched folder for images
    const folderPath = path.join(assetsDir, matchedFolder);
    const folderImages = fs.readdirSync(folderPath).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !f.startsWith('.');
    });

    if (folderImages.length === 0) {
        console.log(`No images found in folder ${matchedFolder} for ${htmlFile}`);
        return;
    }

    // Sort images to put hero/main ones first
    folderImages.sort((a,b) => {
        if (a.toLowerCase().includes('hero')) return -1;
        if (b.toLowerCase().includes('hero')) return 1;
        return 0;
    });

    // 3. Generate Thumbnails HTML
    const thumbsHtml = folderImages.map((img, idx) => {
        const title = titles[idx % titles.length];
        const activeClass = idx === 0 ? 'active' : '';
        const imgSrc = `Jaffa Group Portfolo/${matchedFolder}/${img}`;
        return `                <div class="thumb-item ${activeClass}" data-title="${title}">
                    <img src="${imgSrc}" alt="Thumbnail ${idx + 1}" loading="lazy">
                </div>`;
    }).join('\n');

    const firstImgSrc = `Jaffa Group Portfolo/${matchedFolder}/${folderImages[0]}`;

    // 4. Read the HTML and replace the gallery section
    let content = fs.readFileSync(htmlPath, 'utf8');

    // Extract project title for the master view if possible
    const titleMatch = content.match(/<h1 class="project-hero-title">([^<]+)<\/h1>/);
    const displayTitle = titleMatch ? titleMatch[1] : matchedFolder;

    const immersiveSection = `    <!-- Project Gallery Section -->
    <section class="project-gallery">
        <div class="immersive-gallery-container">
            <!-- Master Display Area -->
            <div class="gallery-master" id="main-gallery-view">
                <img src="${firstImgSrc}" alt="${displayTitle} - Main View" class="master-img">
                
                <!-- Text Overlays -->
                <div class="master-overlay">
                    <p class="master-project-context">Portfolio / Perspective</p>
                    <h2 class="master-title" id="gallery-label-title">${titles[0]}</h2>
                </div>

                <!-- Navigation Buttons -->
                <div class="nav-btn prev"><i class="fas fa-chevron-left"></i></div>
                <div class="nav-btn next"><i class="fas fa-chevron-right"></i></div>
            </div>

            <!-- Thumbnail Bar -->
            <div class="immersive-thumbs">
${thumbsHtml}
            </div>
        </div>
    </section>`;

    const gallerySectionRegex = /<section class="project-gallery">[\s\S]*?<\/section>/;
    if (gallerySectionRegex.test(content)) {
        content = content.replace(gallerySectionRegex, immersiveSection);
        fs.writeFileSync(htmlPath, content);
        console.log(`Successfully restored gallery for ${htmlFile} (${folderImages.length} images)`);
    } else {
        console.log(`Gallery section tag mismatch for ${htmlFile}`);
    }
});
