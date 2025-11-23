#!/usr/bin/env python3
"""
Copy files from public/assets to src/assets to support development servers that serve `src` only.
This script will copy files as-is and also create a 'hyphenated' version where spaces become '-'.
"""
import os
import shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_ASSETS = os.path.join(ROOT, 'public', 'assets')
SRC_ASSETS = os.path.join(ROOT, 'src', 'assets')

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def hyphenate(name):
    return name.replace(' ', '-')

def main():
    if not os.path.exists(PUBLIC_ASSETS):
        print('public/assets not found at', PUBLIC_ASSETS)
        return
    ensure_dir(SRC_ASSETS)
    for filename in os.listdir(PUBLIC_ASSETS):
        src_path = os.path.join(PUBLIC_ASSETS, filename)
        if not os.path.isfile(src_path):
            continue
        # Copy original
        dst_path = os.path.join(SRC_ASSETS, filename)
        shutil.copy2(src_path, dst_path)
        print('copied', filename, '->', os.path.relpath(dst_path, ROOT))
        # Also copy hyphenated name if different
        hyphenated = hyphenate(filename)
        if hyphenated != filename:
            dst_h = os.path.join(SRC_ASSETS, hyphenated)
            shutil.copy2(src_path, dst_h)
            print('copied', filename, '->', os.path.relpath(dst_h, ROOT))

if __name__ == '__main__':
    main()
