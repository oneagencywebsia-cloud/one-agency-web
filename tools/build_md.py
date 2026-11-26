#!/usr/bin/env python3
"""Genera una version Markdown (index.md) de cada pagina para agentes de IA y llms-full.txt.

Uso:  python3 tools/build_md.py        (desde la raiz del repo)
- Lee cada <ruta>/index.html, extrae el contenido principal (article o main) y escribe <ruta>/index.md
- Anade <link rel="alternate" type="text/markdown"> al <head> si falta
- Genera llms-full.txt con las paginas clave concatenadas
"""
import glob, os, re
from bs4 import BeautifulSoup
from markdownify import markdownify as md

BASE = 'https://one-agency.es'
KEY_FIRST = ['index.html','sobre-nosotros/index.html','servicios/automatizacion-con-ia/index.html','servicios/chatbots-whatsapp/index.html',
             'servicios/webs-para-empresas/index.html','soluciones-para-instaladores/index.html','casos/automatizacion-empresa-electricidad-ia/index.html',
             'casos/marca-y-web-de-pesca-fishzone/index.html']

def url_of(path):
    d = os.path.dirname(path)
    return BASE + '/' + (d + '/' if d else '')

def extract(html):
    soup = BeautifulSoup(html, 'html.parser')
    title = (soup.title.string or '').strip() if soup.title else ''
    m = soup.find('meta', attrs={'name': 'description'})
    desc = m['content'].strip() if m and m.get('content') else ''
    root = soup.find('article') or soup.find('main') or soup.body
    for t in root.find_all(['script','style','svg','nav','form','button','noscript','iframe','link','meta']):
        t.decompose()
    for t in root.find_all(class_=re.compile(r'cta|sticky|reveal-io|skip|crumbs|hero-scroll-hint|float|mnav|nt-')):
        if t.name in ('div','span','a') and 'cta' in ' '.join(t.get('class', [])) and t.name == 'div':
            t.decompose()
    for t in root.find_all(class_='av'): t.decompose()
    for a in root.find_all('a', href=True):
        if a['href'].startswith('/') and not a['href'].startswith('//'): a['href'] = BASE + a['href']
    text = md(str(root), heading_style='ATX', bullets='-', strip=['img'])
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    text = re.sub(r'[ \t]+\n', '\n', text)
    return title, desc, text

def main():
    pages = sorted(glob.glob('**/index.html', recursive=True))
    out = {}
    for p in pages:
        if p.startswith(('node_modules/', 'tools/')): continue
        html = open(p, encoding='utf8').read()
        title, desc, text = extract(html)
        url = url_of(p)
        head = f'# {title}\n\n> {desc}\n\nFuente: {url}\n\n---\n\n'
        mdpath = os.path.join(os.path.dirname(p), 'index.md')
        open(mdpath, 'w', encoding='utf8').write(head + text + '\n')
        out[p] = (title, desc, url, text)
        link = f'<link rel="alternate" type="text/markdown" href="{url[len(BASE):]}index.md">'
        if 'type="text/markdown"' not in html:
            html = html.replace('</head>', link + '</head>', 1)
            open(p, 'w', encoding='utf8').write(html)
    order = [k for k in KEY_FIRST if k in out] + [k for k in sorted(out) if k not in KEY_FIRST and k != '404.html']
    full = ['# O.N.E Agency: contenido completo\n\n> Versión en Markdown de las páginas principales de https://one-agency.es/ para asistentes de IA. Agencia de soluciones digitales de Santaella (Córdoba): webs, procesos y automatizaciones con IA.\n']
    for k in order:
        t, d, u, text = out[k]
        full.append(f'\n\n---\n\n<!-- {u} -->\n\n{text}\n')
    open('llms-full.txt', 'w', encoding='utf8').write(''.join(full))
    print(len(out), 'paginas;', os.path.getsize('llms-full.txt') // 1024, 'KB en llms-full.txt')

if __name__ == '__main__':
    main()
