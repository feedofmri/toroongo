import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

const EXCLUDE_DIRS = ['assets']; 

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (!EXCLUDE_DIRS.includes(f)) {
                walk(dirPath, callback);
            }
        } else {
            callback(path.join(dir, f));
        }
    });
}

const results = {};

walk(srcDir, (filePath) => {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js') && !filePath.endsWith('.json')) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(srcDir, filePath);

    // Find any string literal containing English letters of at least 2 chars
    // This is very broad but will help us see everything
    const stringMatches = content.match(/['"`][^'"`]*[a-zA-Z]{2,}[^'"`]*['"`]/g) || [];
    
    // Filter common code things (imports, keys, etc.)
    const filter = (text) => {
        if (!text) return false;
        const t = text.slice(1, -1).trim();
        if (t.length < 3) return false;
        if (/^[a-zA-Z0-9._/-]+$/.test(t)) {
            if (t.includes('/') || t.includes('.')) return false; // Likely paths or classnames
            if (t.toLowerCase() === t && !t.includes(' ')) return false; // Likely internal keys
        }
        if (/^&[a-z]+;$/.test(t)) return false;
        if (/^[A-Z_]+$/.test(t)) return false; // Likely constants
        return true;
    };

    const strings = stringMatches.filter(filter);

    if (strings.length > 0) {
        results[relativePath] = strings;
    }
});

fs.writeFileSync(path.join(__dirname, 'audit_total_results.json'), JSON.stringify(results, null, 2));
console.log(`Deep audit complete. Found ${Object.keys(results).length} files with potential UI strings.`);
