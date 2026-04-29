import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const distDir = resolve(projectDir, 'dist');
const htaccessPath = resolve(distDir, '.htaccess');

const htaccessContent = `Options -Indexes

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    RewriteRule ^index\\.html$ - [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
`;

await mkdir(distDir, { recursive: true });
await writeFile(htaccessPath, htaccessContent, 'utf8');

console.log(`Generated ${htaccessPath}`);

