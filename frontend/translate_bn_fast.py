import json
import time
import re
import sys
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from deep_translator import GoogleTranslator
from threading import Lock

total_keys = 0
translated_keys = 0
lock = Lock()

def translate_value(value):
    global translated_keys, total_keys
    
    if not value or not str(value).strip():
        with lock:
            translated_keys += 1
        return value

    # Extract interpolations like {{count}}, {{amount}}
    placeholders = re.findall(r'\{\{[^\}]+\}\}', value)
    
    # Replace with __0__, __1__, etc.
    temp_value = value
    for i, p in enumerate(placeholders):
        temp_value = temp_value.replace(p, f'__{i}__')
        
    # Translate
    translator = GoogleTranslator(source='en', target='bn')
    translated = value
    try:
        translated = translator.translate(temp_value)
    except Exception as e:
        time.sleep(1)
        try:
            translator = GoogleTranslator(source='en', target='bn')
            translated = translator.translate(temp_value)
        except:
            with lock:
                translated_keys += 1
            return value # fallback to english

    # Restore placeholders
    if translated:
        for i, p in enumerate(placeholders):
            translated = re.sub(rf'__\s*{i}\s*__', p, translated)
    else:
        translated = value
        
    with lock:
        translated_keys += 1
        if translated_keys % 50 == 0:
            print(f"Translated {translated_keys} strings...", flush=True)
            
    return translated

def count_keys(data):
    global total_keys
    if isinstance(data, dict):
        for k, v in data.items():
            count_keys(v)
    elif isinstance(data, list):
        for v in data:
            count_keys(v)
    elif isinstance(data, str):
        if data.strip():
            total_keys += 1

def collect_paths(data, current_path=None):
    if current_path is None:
        current_path = []
    
    paths = []
    if isinstance(data, dict):
        for k, v in data.items():
            paths.extend(collect_paths(v, current_path + [k]))
    elif isinstance(data, list):
        for i, v in enumerate(data):
            paths.extend(collect_paths(v, current_path + [i]))
    elif isinstance(data, str):
        if data.strip():
            paths.append((current_path, data))
    return paths

def set_value(data, path, value):
    for step in path[:-1]:
        data = data[step]
    data[path[-1]] = value

def main():
    en_path = r'f:\Areas\Development\Projects\React\toroongo\frontend\public\locales\en\translation.json'
    bn_path = r'f:\Areas\Development\Projects\React\toroongo\frontend\public\locales\bn\translation.json'

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
        
    paths_and_values = collect_paths(en_data)
    print(f"Found {len(paths_and_values)} strings to translate.", flush=True)

    # Make a copy of the structure
    bn_data = json.loads(json.dumps(en_data))
    
    def worker(item):
        path, val = item
        trans_val = translate_value(val)
        return path, trans_val

    print("Starting translation with ThreadPool...", flush=True)
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(worker, item): item for item in paths_and_values}
        for i, future in enumerate(as_completed(futures)):
            path, trans_val = future.result()
            set_value(bn_data, path, trans_val)
            
            # Save progress every 100 items
            if (i + 1) % 100 == 0:
                with open(bn_path, 'w', encoding='utf-8') as f:
                    json.dump(bn_data, f, ensure_ascii=False, indent=4)
                print(f"Checkpoint saved at {i+1} items.", flush=True)

    # Final save
    with open(bn_path, 'w', encoding='utf-8') as f:
        json.dump(bn_data, f, ensure_ascii=False, indent=4)
        
    print("Done writing to", bn_path, flush=True)

if __name__ == '__main__':
    main()
