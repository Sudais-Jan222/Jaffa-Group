const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd) {
    console.log(`Running: ${cmd}`);
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Error running ${cmd}`);
        process.exit(1);
    }
}

// Ensure .git is gone and re-init
try { 
    if (fs.existsSync('.git')) {
        fs.rmSync('.git', { recursive: true, force: true }); 
    }
} catch (e) {
    console.error('Warning: could not delete .git folder. Using cmd.exe to forcefully delete.');
    try { execSync('cmd.exe /c "rd /s /q .git"', { stdio: 'ignore' }); } catch(err){}
}

run('git init');
run('git remote add origin https://github.com/Sudais-Jan222/Jaffa-Group.git');
run('git branch -M main');
run('git config http.postBuffer 1048576000');

// Get all files
function getFiles(dir, files_) {
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files) {
        let name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            if (!name.includes('.git') && !name.includes('node_modules')) {
                getFiles(name, files_);
            }
        } else {
            files_.push(name);
        }
    }
    return files_;
}

const allFiles = getFiles('.');
let chunk = [];
let currentSize = 0;
const MAX_SIZE = 5 * 1024 * 1024; // 45MB per commit

// First, add all code files (.html, .css, .js) as initial commit
let initialFiles = allFiles.filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js') || f.endsWith('.md'));
for (let f of initialFiles) {
    run(`git add "${f}"`);
}
run('git commit -m "Initial commit - Code base"');
run('git push -u origin main -f');

// Now chunk the remaining files (mostly images)
let remainingFiles = allFiles.filter(f => !initialFiles.includes(f) && !f.endsWith('chunk_push.js'));

let commitCount = 1;
for (let i = 0; i < remainingFiles.length; i++) {
    let file = remainingFiles[i];
    let stat = fs.statSync(file);
    chunk.push(file);
    currentSize += stat.size;

    if (currentSize >= MAX_SIZE || i === remainingFiles.length - 1) {
        console.log(`\n\n--- Committing chunk ${commitCount} (${(currentSize / 1024 / 1024).toFixed(2)} MB) ---`);
        for (let f of chunk) {
            run(`git add "${f}"`);
        }
        run(`git commit -m "Adding media files part ${commitCount}"`);
        run(`git push origin main`);
        chunk = [];
        currentSize = 0;
        commitCount++;
    }
}
console.log('All files pushed successfully in chunks!');
