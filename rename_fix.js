const fs = require('fs');

// 1. Rename files on disk
try {
    if (fs.existsSync('showcase 4 .webp')) {
        fs.renameSync('showcase 4 .webp', 'showcase-4.webp');
    }
    if (fs.existsSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 7.webp')) {
        fs.renameSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 7.webp', 'Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase-7.webp');
    }
    if (fs.existsSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 4 .webp')) {
        fs.renameSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 4 .webp', 'Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase-4.webp');
    }
    if (fs.existsSync('showcase 7.webp')) {
        fs.renameSync('showcase 7.webp', 'showcase-7.webp');
    }
} catch(e) { console.log(e); }

// 2. Fix index.html paths
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/showcase 4 \.webp/g, 'showcase-4.webp');
indexHtml = indexHtml.replace(/showcase 7\.webp/g, 'showcase-7.webp');
// And ensure showcase 3 has no spaces
try {
    if (fs.existsSync('showcase 3.webp')) {
        fs.renameSync('showcase 3.webp', 'showcase-3.webp');
    }
    if (fs.existsSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 3.webp')) {
        fs.renameSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 3.webp', 'Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase-3.webp');
    }
} catch(e) {}
indexHtml = indexHtml.replace(/showcase 3\.webp/g, 'showcase-3.webp');

// Same for showcase 2 and 5 just in case!
try {
    if (fs.existsSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 2.webp')) {
        fs.renameSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 2.webp', 'Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase-2.webp');
    }
    if (fs.existsSync('showcase 5.webp')) fs.renameSync('showcase 5.webp', 'showcase-5.webp');
    if (fs.existsSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 5.webp')) {
        fs.renameSync('Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase 5.webp', 'Hero Photos-20260418T055411Z-3-001/Hero Photos/showcase-5.webp');
    }
} catch(e){}
indexHtml = indexHtml.replace(/showcase 2\.webp/g, 'showcase-2.webp');
indexHtml = indexHtml.replace(/showcase 5\.webp/g, 'showcase-5.webp');

fs.writeFileSync('index.html', indexHtml, 'utf8');

// 3. Update chunk_push.js to use 5MB
let chunkPush = fs.readFileSync('chunk_push.js', 'utf8');
chunkPush = chunkPush.replace(/const MAX_SIZE = 45 \* 1024 \* 1024;/, 'const MAX_SIZE = 5 * 1024 * 1024;');
fs.writeFileSync('chunk_push.js', chunkPush, 'utf8');

console.log('Renamed files and updated paths!');
