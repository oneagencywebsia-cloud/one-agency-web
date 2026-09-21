# Genera las imágenes Open Graph (1200x630) de cada página + og-image.jpg. Uso: python tools/og.py (tras node tools/build.mjs)
import glob, io, json, os, re
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
W, H = 1200, 630
FONT_B = next((p for p in ['C:/Windows/Fonts/segoeuib.ttf', 'C:/Windows/Fonts/arialbd.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'] if os.path.exists(p)), None)
FONT_R = next((p for p in ['C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/arial.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'] if os.path.exists(p)), None)
site = json.load(io.open(os.path.join(ROOT, 'content/site.json'), encoding='utf-8'))
clusters = {c['id']: c['name'] for c in site['clusters']}
logo = Image.open(os.path.join(ROOT, 'logo.png')).convert('RGBA').resize((84, 84), Image.LANCZOS)


def font(path, size):
    return ImageFont.truetype(path, size) if path else ImageFont.load_default()


def background():
    img = Image.new('RGB', (W, H), (11, 18, 38))
    px = img.load()
    for y in range(H):
        for x in range(W):
            t = (x / W) * 0.6 + (y / H) * 0.4
            r = int(11 + (29 - 11) * min(1, t * 1.6))
            g = int(18 + (78 - 18) * min(1, t * 1.6))
            b = int(38 + (216 - 38) * min(1, t * 1.6))
            px[x, y] = (r, g, b)
    glow = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse((760, -140, 1340, 440), fill=(249, 115, 22))
    d.ellipse((-200, 380, 340, 860), fill=(139, 92, 246))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    return Image.blend(img, Image.composite(glow, img, glow.convert('L')), 0.55)


def wrap(draw, text, fnt, maxw):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=fnt) <= maxw:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def make(title, kicker, out):
    img = background().convert('RGBA')
    d = ImageDraw.Draw(img)
    mask = Image.new('L', (84, 84), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 83, 83), fill=255)
    img.paste(logo, (70, 62), mask)
    d.text((170, 84), 'O.N.E Agency', font=font(FONT_B, 34), fill=(255, 255, 255))
    kf = font(FONT_B, 26)
    k = kicker.upper()
    kw = d.textlength(k, font=kf)
    d.rounded_rectangle((70, 196, 70 + kw + 40, 244), radius=24, fill=(255, 255, 255, 30), outline=(253, 186, 116), width=2)
    d.text((90, 203), k, font=kf, fill=(253, 186, 116))
    size = 68
    while size > 38:
        tf = font(FONT_B, size)
        lines = wrap(d, title, tf, W - 140)
        if len(lines) <= 3:
            break
        size -= 4
    y = 270
    for ln in lines:
        d.text((70, y), ln, font=tf, fill=(255, 255, 255))
        y += int(size * 1.18)
    d.text((70, H - 68), 'one-agency.es', font=font(FONT_R, 30), fill=(203, 213, 225))
    d.rounded_rectangle((W - 420, H - 84, W - 70, H - 30), radius=14, fill=(255, 255, 255))
    d.text((W - 395, H - 74), 'Diagnóstico gratuito', font=font(FONT_B, 30), fill=(15, 23, 42))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.convert('RGB').save(out, 'JPEG', quality=84, optimize=True, progressive=True)


def front(path):
    t = io.open(path, encoding='utf-8').read()
    m = re.match(r'---\r?\n(.*?)\r?\n---', t, re.S)
    fm = {}
    for line in m.group(1).splitlines():
        if ':' in line:
            k, v = line.split(':', 1)
            fm[k.strip()] = v.strip()
    return fm


count = 0
make('Automatización con IA para empresas de toda España', 'O.N.E Agency', os.path.join(ROOT, 'og-image.jpg'))
count += 1
for f in sorted(glob.glob(os.path.join(ROOT, 'content/blog/*.md'))):
    fm = front(f)
    slug = fm.get('slug') or os.path.basename(f)[:-3]
    make(fm['title'], clusters.get(fm.get('cluster'), 'Blog'), os.path.join(ROOT, 'blog', slug, 'og.jpg'))
    count += 1
for f in sorted(glob.glob(os.path.join(ROOT, 'content/servicios/*.md'))):
    fm = front(f)
    slug = fm.get('slug') or os.path.basename(f)[:-3]
    make(fm['title'], 'Servicio', os.path.join(ROOT, 'servicios', slug, 'og.jpg'))
    count += 1
for f in sorted(glob.glob(os.path.join(ROOT, 'content/recursos/*.md'))):
    fm = front(f)
    slug = fm.get('slug') or os.path.basename(f)[:-3]
    make(fm['title'], 'Calculadora', os.path.join(ROOT, 'recursos', slug, 'og.jpg'))
    count += 1
print('OG generadas:', count)
