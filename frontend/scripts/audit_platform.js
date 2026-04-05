import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

const filesToAudit = [
    'pages/seller/StoreHome.jsx',
    'pages/seller/StoreCatalog.jsx',
    'pages/seller/StoreAbout.jsx',
    'pages/seller/StorePolicies.jsx',
    'pages/seller/SellerSettings.jsx',
    'pages/seller/SellerFinance.jsx',
    'pages/seller/BlogManagement.jsx',
    'pages/seller/BlogEditor.jsx',
    'pages/buyer/ShopsPage.jsx',
    'pages/buyer/SearchResults.jsx',
    'pages/buyer/ProductDetail.jsx',
    'pages/buyer/Checkout.jsx',
    'pages/admin/AdminOverview.jsx',
    'pages/admin/UserManagement.jsx',
    'pages/admin/SellerManagement.jsx',
    'pages/admin/DisputeResolution.jsx',
    'pages/admin/CategoryManagement.jsx',
    'pages/admin/AdminFinance.jsx',
    'components/ui/NotificationDropdown.jsx',
    'components/message/FloatingMessage.jsx',
    'components/layout/SellerLayout.jsx',
    'components/layout/SellerDashboardLayout.jsx',
    'components/layout/AdminDashboardLayout.jsx',
    'components/layout/BuyerDashboardLayout.jsx'
];

const results = {};

filesToAudit.forEach(file => {
    const fullPath = path.join(srcDir, file);
    if (!fs.existsSync(fullPath)) {
        results[file] = 'FILE NOT FOUND';
        return;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Find text inside JSX tags: >Text<
    const tagMatches = content.match(/>[^<>{}$\n\r]*[a-zA-Z]{2,}[^<>{}$\n\r]*</g) || [];
    
    // Find placeholders: placeholder="Text"
    const placeholderMatches = content.match(/placeholder="[^"]*[a-zA-Z]{2,}[^"]*"/g) || [];

    // Find alert calls: alert('Text')
    const alertMatches = content.match(/alert\('[^']*[a-zA-Z]{2,}[^']*'\)/g) || [];

    results[file] = {
        tags: tagMatches.map(m => m.slice(1, -1).trim()).filter(t => t.length > 0),
        placeholders: placeholderMatches.map(m => m.match(/"([^"]+)"/)[1]),
        alerts: alertMatches.map(m => m.match(/'([^']+)'/)[1])
    };
});

fs.writeFileSync(path.join(__dirname, 'audit_results.json'), JSON.stringify(results, null, 2));
console.log('Audit complete. Results saved to scripts/audit_results.json');
