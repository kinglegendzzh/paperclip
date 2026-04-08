const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const uiDir = path.join(cwd, 'ui/src');
const enJsonPath = path.join(uiDir, 'i18n/locales/en.json');
const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// Flatten valid keys
const validKeys = new Set();
for (const [ns, obj] of Object.entries(enData)) {
    if (typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            validKeys.add(`${ns}.${key}`);
        }
    }
}

// Recursively find .tsx files
function findTsxFiles(dir) {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findTsxFiles(fullPath));
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
            results.push(fullPath);
        }
    }
    return results;
}

const files = findTsxFiles(uiDir);
const usedKeys = new Set();

const regex = /t\((["'])([a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)\1/g;

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = regex.exec(content)) !== null) {
        usedKeys.add(match[2]);
    }
}

const missingKeys = [];
for (const key of usedKeys) {
    if (!validKeys.has(key)) {
        missingKeys.push(key);
    }
}

if (missingKeys.length > 0) {
    console.log('MISSING KEYS:\\n' + missingKeys.join('\\n'));
} else {
    console.log('All keys present!');
}
