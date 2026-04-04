import sys, os, re

files = [
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
]

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    orig = content
    
    # In template strings e.g. `$${amount.toFixed(2)}` -> `${formatPrice(amount)}`
    content = re.sub(r'\$\$\{([^}]+)\.toFixed\(\d+\)\}', r'${formatPrice(\1)}', content)
    
    # In JSX text e.g. `${amount.toFixed(2)}` -> `{formatPrice(amount)}`
    content = re.sub(r'\$\{([^}]+)\.toFixed\(\d+\)\}', r'{formatPrice(\1)}', content)
    
    if content != orig:
        depth = f.count('/')
        import_path = '../../utils/currency'
        if depth == 2: import_path = '../utils/currency'
        if depth == 4: import_path = '../../../utils/currency'
        
        if 'formatPrice' not in content:
            content = f"import {{ formatPrice }} from '{import_path}';\n" + content
            
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print("Updated", f)
