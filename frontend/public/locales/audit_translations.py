import json
import os

def check_translations(base_path, master_lng='en'):
    languages = ['en', 'bn', 'ne', 'ms', 'ar', 'id', 'hi']
    master_file = os.path.join(base_path, master_lng, 'translation.json')
    
    with open(master_file, 'r', encoding='utf-8') as f:
        master_data = json.load(f)
    
    def get_keys(data, prefix=''):
        keys = {}
        for k, v in data.items():
            full_key = f"{prefix}.{k}" if prefix else k
            if isinstance(v, dict):
                keys.update(get_keys(v, full_key))
            elif isinstance(v, list):
                for i, item in enumerate(v):
                    if isinstance(item, dict):
                        keys.update(get_keys(item, f"{full_key}[{i}]"))
                    else:
                        keys[f"{full_key}[{i}]"] = item
            else:
                keys[full_key] = v
        return keys

    master_keys = get_keys(master_data)
    
    results = {}
    for lng in languages:
        if lng == master_lng:
            continue
        
        file_path = os.path.join(base_path, lng, 'translation.json')
        if not os.path.exists(file_path):
            results[lng] = {'status': 'missing_file'}
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                results[lng] = {'status': 'invalid_json'}
                continue
                
        lng_keys = get_keys(data)
        
        missing = [k for k in master_keys if k not in lng_keys]
        untranslated = [k for k in master_keys if k in lng_keys and lng_keys[k] == master_keys[k] and master_keys[k] and not k.endswith('dateLocale')]
        
        results[lng] = {
            'status': 'ok',
            'missing': missing,
            'untranslated': untranslated,
            'total_master': len(master_keys),
            'total_lng': len(lng_keys)
        }
        
    return results

if __name__ == "__main__":
    base_path = r'f:\Areas\Development\Projects\React\toroongo\frontend\public\locales'
    results = check_translations(base_path)
    with open('audit_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    print("Audit completed. Results saved to audit_results.json")
