const fs = require('fs');
const files = [
    'src/pages/seller/SellerFinance.jsx',
    'src/pages/seller/SellerDashboard.jsx',
    'src/pages/seller/ProductManagement.jsx',
    'src/pages/seller/OrderManagement.jsx',
    'src/pages/buyer/Wishlist.jsx',
    'src/pages/buyer/ShoppingCart.jsx',
    'src/pages/buyer/ProductDetail.jsx',
    'src/pages/buyer/OrderHistory.jsx',
    'src/pages/buyer/OrderConfirmation.jsx',
    'src/pages/buyer/Checkout.jsx',
    'src/pages/admin/DisputeResolution.jsx',
    'src/components/product/ProductCard.jsx'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let originalContent = content;

    // Replace $\${...toFixed(2)} with \${formatPrice(...)}
    content = content.replace(/\$\$\{([^}]+)\.toFixed\(\d+\)\}/g, '${formatPrice($1)}');
    // Replace \${...toFixed(2)} with {formatPrice(...)}
    content = content.replace(/\$\{([^}]+)\.toFixed\(\d+\)\}/g, '{formatPrice($1)}');

    if (content !== originalContent) {
        let depth = f.split('/').length - 1;
        let importPath = '../../utils/currency';
        if (depth === 2) importPath = '../utils/currency';
        if (depth === 4) importPath = '../../../utils/currency';

        if (!content.includes('formatPrice')) {
            content = `import { formatPrice } from '${importPath}';\n` + content;
        }
        fs.writeFileSync(f, content);
        console.log('Updated', f);
    }
});
