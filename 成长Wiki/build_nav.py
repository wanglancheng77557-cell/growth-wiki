# -*- coding: utf-8 -*-
# 扫描 docs/ 文件夹，自动生成 nav.json（分类 = 文件夹名，文章 = .md 文件）
import os, json

ROOT = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(ROOT, "docs")

def clean_name(name):
    parts = name.split("-", 1)
    if parts[0].isdigit() and len(parts) > 1:
        return parts[1]
    return name

def strip_md(name):
    return name[:-3] if name.endswith(".md") else name

nav = {"title": "我的成长Wiki", "categories": []}
if os.path.isdir(DOCS):
    for cat in sorted(os.listdir(DOCS)):
        cat_path = os.path.join(DOCS, cat)
        if not os.path.isdir(cat_path):
            continue
        articles = []
        for f in sorted(os.listdir(cat_path)):
            if f.endswith(".md"):
                rel = os.path.join("docs", cat, f).replace("\\", "/")
                articles.append({"title": clean_name(strip_md(f)), "file": rel})
        if articles:
            nav["categories"].append({"name": clean_name(cat), "articles": articles})

with open(os.path.join(ROOT, "nav.json"), "w", encoding="utf-8") as fh:
    json.dump(nav, fh, ensure_ascii=False, indent=2)

print("nav.json generated:", len(nav["categories"]), "categories")