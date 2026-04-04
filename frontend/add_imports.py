import sys, os, re

files = [
    'src/pages/seller/SellerFinance.jsx',
    'src/pages/seller/SellerDashboard.jsx',
    'src/pages/seller/ProductManagement.jsx',
    'src/pages/buyer/Wishlist.jsx',
    'src/pages/buyer/ShoppingCart.jsx',
    'src/pages/buyer/ProductDetail.jsx',
    'src/pages/buyer/OrderHistory.jsx',
    'src/pages/buyer/Checkout.jsx',
    'src/pages/admin/DisputeResolution.jsx',
    'src/components/product/ProductCard.jsx'
]

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check if 'import { formatPrice }' is in content
    if 'import { formatPrice }' not in content and 'formatPrice' in content:
        depth = f.count('/')
        import_path = '../../utils/currency'
        if depth == 2: import_path = '../utils/currency'
        if depth == 4: import_path = '../../../utils/currency'
        
        # Add import after the last import statement, or at the top if no imports
        import_stmt = f"import {{ formatPrice }} from '{import_path}';\n"
        
        # Find position to insert
        lines = content.split('\n')
        insert_idx = 0
        for i, line in enumerate(lines):
            if line.startswith('import '):
                insert_idx = i + 1
        
        lines.insert(insert_idx, import_stmt.strip())
        new_content = '\n'.join(lines)
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print("Added import to", f)
