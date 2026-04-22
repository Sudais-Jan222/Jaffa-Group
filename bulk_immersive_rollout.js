const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !['index.html', 'portfolio.html', 'project-template.html', 'portfolio_updated.html'].includes(f));

// Pre-defined descriptive titles for variety
const titles = [
    "Architectural Perspective",
    "Interior Harmony",
    "Gourmet Kitchen",
    "Master Suite Sanctuary",
    "Exterior Glow",
    "Design Detail",
    "Living Space",
    "Outdoor Oasis"
];

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Find all images in the old bento grid
    const imgRegex = /<img src="([^"]+)" alt="([^"]+)">/g;
    let images = [];
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        if (!match[1].includes('logo')) { // Skip logo
            images.push(match[1]);
        }
    }

    // Deduplicate and filter (first few are usually hero/gallery)
    images = [...new Set(images)].filter(src => src.startsWith('Jaffa Group Portfolo') || src.includes('DSC'));
    
    if (images.length === 0) {
        console.log(`No project images found for ${file}, skipping.`);
        return;
    }

    // 2. Build Thumbnails HTML
    const thumbsHtml = images.map((src, idx) => {
        const title = titles[idx % titles.length];
        const activeClass = idx === 0 ? 'active' : '';
        return `                <div class="thumb-item ${activeClass}" data-title="${title}">
                    <img src="${src}" alt="Thumbnail ${idx + 1}">
                </div>`;
    }).join('\n');

    // 3. Define the new Immersive Section
    const firstImg = images[0];
    const projectTitleMatch = content.match(/<h1 class="project-hero-title">([^<]+)<\/h1>/);
    const projTitle = projectTitleMatch ? projectTitleMatch[1] : "Project View";
    
    const immersiveSection = `    <!-- Project Gallery Section -->
    <section class="project-gallery">
        <div class="immersive-gallery-container">
            <!-- Master Display Area -->
            <div class="gallery-master" id="main-gallery-view">
                <img src="${firstImg}" alt="${projTitle} - Main View" class="master-img">
                
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

    // 4. Replace the old project gallery section
    const gallerySectionRegex = /<section class="project-gallery">[\s\S]*?<\/section>/;
    if (gallerySectionRegex.test(content)) {
        content = content.replace(gallerySectionRegex, immersiveSection);
        
        // 5. Ensure FontAwesome is included for the arrows if not present
        if (!content.includes('font-awesome')) {
            const headEndRegex = /<\/head>/;
            content = content.replace(headEndRegex, '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">\n</head>');
        }

        fs.writeFileSync(filePath, content);
        console.log(`Updated to Immersive Gallery: ${file}`);
    } else {
        console.log(`Gallery section not found for ${file}`);
    }
});
