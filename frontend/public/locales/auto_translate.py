import json
import os
import time
from deep_translator import GoogleTranslator
from concurrent.futures import ThreadPoolExecutor, as_completed

def get_nested(d, path):
    keys = path.replace('[', '.').replace(']', '').split('.')
    current = d
    for k in keys:
        if k == '': continue
        if isinstance(current, dict):
            current = current.get(k)
        elif isinstance(current, list):
            current = current[int(k)]
        else:
            return None
        if current is None:
            return None
    return current

def set_nested(d, path, value):
    keys = path.replace('[', '.').replace(']', '').split('.')
    keys = [k for k in keys if k]
    current = d
    for i, k in enumerate(keys[:-1]):
        next_k = keys[i+1]
        is_next_list = next_k.isdigit()
        
        if isinstance(current, dict):
            if k not in current:
                current[k] = [] if is_next_list else {}
            current = current[k]
        elif isinstance(current, list):
            idx = int(k)
            while len(current) <= idx:
                current.append(None)
            if current[idx] is None:
                current[idx] = [] if is_next_list else {}
            current = current[idx]
            
    last_k = keys[-1]
    if isinstance(current, dict):
        current[last_k] = value
    elif isinstance(current, list):
        idx = int(last_k)
        while len(current) <= idx:
            current.append(None)
        current[idx] = value

def translate_item(path, text, lng):
    try:
        translator = GoogleTranslator(source='en', target=lng)
        translated = translator.translate(text)
        return path, translated, None
    except Exception as e:
        return path, None, e

def run_translation():
    base_path = r'f:\Areas\Development\Projects\React\toroongo\frontend\public\locales'
    master_file = os.path.join(base_path, 'en', 'translation.json')
    with open(master_file, 'r', encoding='utf-8') as f:
        master_data = json.load(f)
        
    audit_file = os.path.join(base_path, 'audit_results.json')
    with open(audit_file, 'r', encoding='utf-8') as f:
        audit_data = json.load(f)
        
    for lng, data in audit_data.items():
        if lng == 'en' or data.get('status') != 'ok':
            continue
            
        print(f"Processing {lng}...", flush=True)
        lng_file = os.path.join(base_path, lng, 'translation.json')
        with open(lng_file, 'r', encoding='utf-8') as f:
            lng_data = json.load(f)
            
        items_to_translate = data.get('missing', []) + data.get('untranslated', [])
        tasks = []
        for path in items_to_translate:
            en_val = get_nested(master_data, path)
            if en_val and isinstance(en_val, str):
                tasks.append((path, en_val))
                
        count = 0
        total = len(tasks)
        print(f"Found {total} items to translate for {lng}", flush=True)
        
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_path = {executor.submit(translate_item, path, text, lng): path for path, text in tasks}
            for i, future in enumerate(as_completed(future_to_path)):
                path, translated, error = future.result()
                if error:
                    print(f"Error translating '{path}': {error}", flush=True)
                elif translated:
                    set_nested(lng_data, path, translated)
                    count += 1
                
                if (i + 1) % 50 == 0:
                    print(f"[{lng}] Progress: {i + 1}/{total}...", flush=True)
                    # incremental save
                    with open(lng_file, 'w', encoding='utf-8') as f:
                        json.dump(lng_data, f, ensure_ascii=False, indent=2)
                        
        print(f"Translated {count} items for {lng}.", flush=True)
        
        # Save back
        with open(lng_file, 'w', encoding='utf-8') as f:
            json.dump(lng_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    run_translation()
