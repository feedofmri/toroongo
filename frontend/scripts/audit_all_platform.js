import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

const EXCLUDE_DIRS = ['assets', 'theme', 'context', 'contexts', 'services', 'hooks', 'data']; // Main focus is on UI/JSX

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
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(srcDir, filePath);

    // Find text inside JSX tags: >Text<
    const tagMatches = content.match(/>[^<>{}$\n\r]*[a-zA-Z]{2,}[^<>{}$\n\r]*</g) || [];
    
    // Find placeholders: placeholder="Text"
    const placeholderMatches = content.match(/placeholder="[^"]*[a-zA-Z]{2,}[^"]*"/g) || [];

    // Find alert calls: alert('Text')
    const alertMatches = content.match(/alert\('[^']*[a-zA-Z]{2,}[^']*'\)/g) || [];

    // Filter out some obviously common non-translatable things
    const filter = (text) => {
        if (!text) return false;
        const t = text.trim();
        if (t.length < 2) return false;
        if (/^[0-9+.\- %$]+$/.test(t)) return false; // Numbers, percentages, etc.
        if (/^&[a-z]+;$/.test(t)) return false; // HTML entities
        return true;
    };

    const tags = tagMatches.map(m => m.slice(1, -1).trim()).filter(filter);
    const placeholders = placeholderMatches.map(m => m.match(/"([^"]+)"/)[1]).filter(filter);
    const alerts = alertMatches.map(m => m.match(/'([^']+)'/)[1]).filter(filter);

    if (tags.length > 0 || placeholders.length > 0 || alerts.length > 0) {
        results[relativePath] = { tags, placeholders, alerts };
    }
});

fs.writeFileSync(path.join(__dirname, 'audit_all_results.json'), JSON.stringify(results, null, 2));
console.log(`Audit complete. Found ${Object.keys(results).length} files with hardcoded strings.`);
