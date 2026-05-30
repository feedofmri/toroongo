import json
import time
import re
from deep_translator import GoogleTranslator

total_keys = 0
translated_keys = 0

def translate_value(translator, value):
    global translated_keys, total_keys
    
    # Extract interpolations like {{count}}, {{amount}}
    placeholders = re.findall(r'\{\{[^\}]+\}\}', value)
    
    # Replace with __0__, __1__, etc.
    temp_value = value
    for i, p in enumerate(placeholders):
        temp_value = temp_value.replace(p, f'__{i}__')
        
    # Translate
    try:
        translated = translator.translate(temp_value)
    except Exception as e:
        print(f"Error translating '{value}': {e}")
        time.sleep(2)
        try:
            translated = translator.translate(temp_value)
        except:
            translated_keys += 1
            return value # fallback to english

    # Restore placeholders
    if translated:
        for i, p in enumerate(placeholders):
            translated = re.sub(rf'__\s*{i}\s*__', p, translated)
    else:
        translated = value
        
    translated_keys += 1
    if translated_keys % 100 == 0:
        print(f"Translated {translated_keys} strings...")
        
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

def recursive_translate(data, translator):
    if isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            if v is None:
                new_dict[k] = None
            else:
                new_dict[k] = recursive_translate(v, translator)
        return new_dict
    elif isinstance(data, list):
        new_list = []
        for v in data:
            if v is None:
                new_list.append(None)
            else:
                new_list.append(recursive_translate(v, translator))
        return new_list
    elif isinstance(data, str):
        if not data.strip():
            return data
        return translate_value(translator, data)
    else:
        return data

def main():
    en_path = r'f:\Areas\Development\Projects\React\toroongo\frontend\public\locales\en\translation.json'
    bn_path = r'f:\Areas\Development\Projects\React\toroongo\frontend\public\locales\bn\translation.json'

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
        
    count_keys(en_data)
    print(f"Found {total_keys} strings to translate.")

    translator = GoogleTranslator(source='en', target='bn')
    
    print("Starting translation...")
    translated_data = recursive_translate(en_data, translator)
    
    with open(bn_path, 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=4)
        
    print("Done writing to", bn_path)

if __name__ == '__main__':
    main()
