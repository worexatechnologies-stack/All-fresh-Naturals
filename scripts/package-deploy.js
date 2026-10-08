import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distPath = path.resolve(rootDir, 'dist');
const zipPath = path.resolve(rootDir, 'hostinger_deploy.zip');

console.log('🚀 1. Building Vite production bundle & bundling PHP REST API...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

console.log('\n📦 2. Verifying critical deployment files in dist/...');
const criticalFiles = [
  'index.html',
  '.htaccess',
  'api/index.php',
  'api/config/db.php',
  'api/config/rate_limiter.php',
  'assets'
];

for (const file of criticalFiles) {
  const fullPath = path.join(distPath, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing critical file: ${file}`);
    process.exit(1);
  }
}
console.log('✅ All critical files present (.htaccess, index.html, api/index.php, rate_limiter.php)');

console.log('\n🤐 3. Creating Hostinger 1-click deployment ZIP: hostinger_deploy.zip...');
if (fs.existsSync(zipPath)) {
  try {
    fs.unlinkSync(zipPath);
  } catch {}
}

// Use built-in Windows tar (non-blocking, fast, handles shared read locks cleanly)
try {
  execSync(`tar -a -c -f "${zipPath}" -C "${distPath}" .`, { cwd: rootDir, stdio: 'inherit' });
} catch {
  // Fallback to PowerShell if tar is unavailable
  const psScript = `Get-ChildItem -Path '${distPath}' -Force | Compress-Archive -DestinationPath '${zipPath}' -Force`;
  execSync(`powershell -NoProfile -Command "${psScript}"`, { cwd: rootDir, stdio: 'inherit' });
}

if (!fs.existsSync(zipPath)) {
  console.error('❌ Failed to create zip archive.');
  process.exit(1);
}

const stats = fs.statSync(zipPath);
const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`\n🎉 SUCCESS! Deployment package created:`);
console.log(`📁 File: ${zipPath} (${sizeMb} MB)`);
console.log(`
======================================================================
HOW TO DEPLOY TO HOSTINGER:
1. Log in to Hostinger hPanel -> Websites -> Manage -> File Manager
2. Navigate to: public_html
3. Upload: hostinger_deploy.zip
4. Right-click hostinger_deploy.zip and click "Extract" (Extract into public_html)
5. Delete hostinger_deploy.zip
All files (index.html, .htaccess, api/, assets/) are now live!
======================================================================
`);
