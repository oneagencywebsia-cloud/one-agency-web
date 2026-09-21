// Generador estático de O.N.E Agency (sin dependencias). Uso:  node tools/build.mjs && python tools/og.py
// Lee content/**/*.md + content/site.json y escribe HTML listo para Nginx en blog/, servicios/, recursos/, privacidad/,
// 404.html, sitemap.xml y blog/feed.xml. Valida enlaces internos y longitudes SEO.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));
const SITE = site.url;
const TODAY = new Date().toISOString().slice(0, 10);
const OUT_DIRS = ['blog', 'servicios', 'recursos', 'privacidad'];

const warnings = [];
const warn = (m) => warnings.push(m);

// ───────────────────────── utilidades ─────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const stripTags = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const rmrf = (p) => fs.rmSync(p, { recursive: true, force: true });
const writeOut = (rel, content) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content, 'utf8');
};

// ───────────────────────── markdown (subconjunto propio) ─────────────────────────
const internalLinks = [];
function inline(src, pageUrl) {
  let s = esc(src);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => {
    u = u.replace(/&amp;/g, '&');
    if (u.startsWith('/')) {
      internalLinks.push({ from: pageUrl, to: u });
      return `<a href="${esc(u)}">${t}</a>`;
    }
    return `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${t}</a>`;
  });
  return s;
}

function parseFront(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('Falta front-matter');
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 1) continue;
    fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { fm, body: m[2] };
}

function parseBlocks(src, pageUrl) {
  const lines = src.replace(/\r/g, '').split('\n');
  const blocks = [];
  let i = 0;
  const isBlank = (l) => /^\s*$/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (isBlank(l)) { i++; continue; }
    let m;
    if ((m = l.match(/^:::(note|tip|warn|example)\s*(.*)$/))) {
      const inner = [];
      i++;
      while (i < lines.length && !/^:::\s*$/.test(lines[i])) inner.push(lines[i++]);
      i++;
      const b = parseBlocks(inner.join('\n'), pageUrl).map((x) => x.html).join('\n');
      const title = m[2] ? `<strong class="note-t">${inline(m[2], pageUrl)}</strong>` : '';
      blocks.push({ t: 'note', html: `<aside class="note note-${m[1]}">${title}${b}</aside>` });
      continue;
    }
    if ((m = l.match(/^(#{2,4})\s+(.*)$/))) {
      const level = m[1].length;
      const text = m[2].trim();
      const id = slugify(text);
      blocks.push({ t: 'h' + level, level, text, id, html: `<h${level} id="${id}">${inline(text, pageUrl)}</h${level}>` });
      i++; continue;
    }
    if (/^\|/.test(l)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      const th = head.map((c) => `<th>${inline(c, pageUrl)}</th>`).join('');
      const tb = body.map((r) => `<tr>${r.map((c) => `<td>${inline(c, pageUrl)}</td>`).join('')}</tr>`).join('');
      blocks.push({ t: 'table', html: `<div class="tw"><table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>` });
      continue;
    }
    if (/^>\s?/.test(l)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
      blocks.push({ t: 'quote', html: `<blockquote>${inline(q.join(' '), pageUrl)}</blockquote>` });
      continue;
    }
    if (/^(-|\*)\s+/.test(l) || /^\d+\.\s+/.test(l)) {
      const ordered = /^\d+\./.test(l);
      const items = [];
      while (i < lines.length && (/^(-|\*)\s+/.test(lines[i]) || /^\d+\.\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
        if (/^\s{2,}\S/.test(lines[i])) items[items.length - 1] += ' ' + lines[i].trim();
        else items.push(lines[i].replace(/^((-|\*)|\d+\.)\s+/, ''));
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      blocks.push({ t: tag, html: `<${tag}>${items.map((x) => `<li>${inline(x, pageUrl)}</li>`).join('')}</${tag}>` });
      continue;
    }
    if (/^</.test(l)) {
      const raw = [];
      while (i < lines.length && !isBlank(lines[i])) raw.push(lines[i++]);
      blocks.push({ t: 'raw', html: raw.join('\n') });
      continue;
    }
    if (/^---+\s*$/.test(l)) { blocks.push({ t: 'hr', html: '<hr>' }); i++; continue; }
    const p = [];
    while (i < lines.length && !isBlank(lines[i]) && !/^(#{2,4}\s|>|\||:::|(-|\*)\s|\d+\.\s|<)/.test(lines[i])) p.push(lines[i++]);
    blocks.push({ t: 'p', html: `<p>${inline(p.join(' '), pageUrl)}</p>` });
  }
  return blocks;
}

// ───────────────────────── carga de contenido ─────────────────────────
function loadDir(dir, kind) {
  const abs = path.join(ROOT, 'content', dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter((f) => f.endsWith('.md')).sort().map((f) => {
    const raw = fs.readFileSync(path.join(abs, f), 'utf8');
    const { fm, body } = parseFront(raw);
    const slug = fm.slug || f.replace(/\.md$/, '');
    const base = kind === 'article' ? 'blog' : dir;
    const url = `/${base}/${slug}/`;
    const blocks = parseBlocks(body, url);
    const text = stripTags(blocks.map((b) => b.html).join(' '));
    const words = text.split(/\s+/).filter(Boolean).length;
    return { kind, fm, slug, url, blocks, words, file: f, date: fm.date || TODAY, modified: fm.modified || fm.date || TODAY };
  });
}

const articles = loadDir('blog', 'article');
const services = loadDir('servicios', 'service');
const resources = loadDir('recursos', 'resource');
const legal = loadDir('legal', 'legal');
const clusterById = Object.fromEntries(site.clusters.map((c) => [c.id, c]));
const articleBySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));

for (const a of articles) {
  if (!clusterById[a.fm.cluster]) throw new Error(`${a.file}: cluster desconocido "${a.fm.cluster}"`);
}
for (const c of site.clusters) {
  if (!articleBySlug[c.pillar]) warn(`Cluster ${c.id}: falta el pilar "${c.pillar}"`);
}

// ───────────────────────── CSS / JS compartido ─────────────────────────
const CSS = `
:root{--blue:#3B82F6;--blue-d:#1D4ED8;--orange:#F97316;--violet:#8B5CF6;--ink:#0F172A;--ink2:#1E293B;--mut:#475569;--soft:#64748B;--line:#E2E8F0;--bg:#F8FAFC;--card:#fff;--r:16px}
*{box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink2);background:var(--bg);line-height:1.7;font-size:17px;-webkit-font-smoothing:antialiased}
body:before{content:"";position:absolute;inset:0 0 auto 0;height:520px;z-index:-1;pointer-events:none;background:radial-gradient(60% 60% at 12% 0%,rgba(59,130,246,.16),transparent 70%),radial-gradient(50% 55% at 92% 4%,rgba(249,115,22,.13),transparent 70%),radial-gradient(45% 50% at 55% 0%,rgba(139,92,246,.10),transparent 72%)}
a{color:var(--blue-d);text-decoration-thickness:1px;text-underline-offset:3px}a:hover{color:var(--orange)}
img{max-width:100%;height:auto}
.skip{position:absolute;left:-999px;top:0;background:#fff;padding:8px 12px;z-index:100}.skip:focus{left:8px;top:8px}
.hd{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.86);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid rgba(59,130,246,.14);box-shadow:0 8px 30px -22px rgba(59,130,246,.5)}
.hd-in{max-width:1180px;margin:0 auto;padding:10px 20px;display:flex;align-items:center;gap:22px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);font-weight:800;font-size:1.08rem;letter-spacing:-.01em}
.brand img{border-radius:50%;width:38px;height:38px}
.brand b{background:linear-gradient(135deg,var(--blue),var(--orange));-webkit-background-clip:text;background-clip:text;color:transparent}
.nav{display:flex;gap:20px;margin-left:auto;align-items:center}
.nav a{color:var(--ink2);text-decoration:none;font-weight:600;font-size:.92rem}.nav a:hover{color:var(--blue-d)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,var(--blue-d),var(--blue) 45%,var(--orange));color:#fff!important;font-weight:700;text-decoration:none!important;border-radius:12px;padding:12px 22px;box-shadow:0 14px 34px -14px rgba(59,130,246,.75),0 6px 16px -8px rgba(249,115,22,.5);transition:transform .2s ease,box-shadow .2s ease}
.btn:hover{transform:translateY(-2px);box-shadow:0 20px 40px -14px rgba(59,130,246,.85)}
.btn-sm{padding:9px 16px;font-size:.88rem}
.btn-ghost{background:#fff;color:var(--ink)!important;border:1px solid var(--line);box-shadow:none}
@media(max-width:780px){.nav a:not(.btn){display:none}.nav{gap:10px}.hd-in{gap:12px}.brand span.w{display:none}}
.crumbs{max-width:1180px;margin:0 auto;padding:22px 20px 0;font-size:.82rem;color:var(--soft)}
.crumbs a{color:var(--soft);text-decoration:none}.crumbs a:hover{color:var(--blue-d)}.crumbs i{margin:0 7px;font-style:normal;opacity:.6}
.wrap{max-width:1180px;margin:0 auto;padding:18px 20px 60px;display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:48px;align-items:start}
.wrap.one{grid-template-columns:minmax(0,820px);justify-content:center}
@media(max-width:1020px){.wrap{grid-template-columns:minmax(0,1fr)}.side{order:-1}}
article{min-width:0}
.kick{display:inline-flex;align-items:center;gap:8px;font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--blue-d);background:rgba(59,130,246,.09);border:1px solid rgba(59,130,246,.2);padding:5px 12px;border-radius:99px;text-decoration:none}
h1{font-size:clamp(1.9rem,4.4vw,2.85rem);line-height:1.13;letter-spacing:-.025em;color:var(--ink);margin:14px 0 14px;font-weight:800}
.lead{font-size:1.16rem;color:var(--mut);margin:0 0 18px}
.meta{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:.84rem;color:var(--soft);margin:0 0 26px;align-items:center}
.meta .av{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--orange));color:#fff;font-weight:800;font-size:.72rem;display:inline-flex;align-items:center;justify-content:center}
.meta a{color:var(--ink2);font-weight:700;text-decoration:none}
article h2{font-size:1.6rem;line-height:1.25;letter-spacing:-.018em;color:var(--ink);margin:2.4em 0 .6em;padding-left:16px;position:relative;font-weight:800;scroll-margin-top:84px}
article h2:before{content:"";position:absolute;left:0;top:.14em;bottom:.14em;width:5px;border-radius:4px;background:linear-gradient(180deg,var(--blue),var(--orange))}
article h3{font-size:1.2rem;color:var(--ink);margin:1.8em 0 .4em;font-weight:800;scroll-margin-top:84px}
article h4{font-size:1.02rem;color:var(--ink);margin:1.4em 0 .3em}
article p{margin:0 0 1.1em}article ul,article ol{margin:0 0 1.2em;padding-left:1.3em}article li{margin:.35em 0}
article li::marker{color:var(--orange);font-weight:800}
article code{background:#EEF2FF;color:#3730A3;padding:2px 6px;border-radius:6px;font-size:.9em}
blockquote{margin:1.4em 0;padding:16px 20px;border-left:5px solid var(--blue);background:#fff;border-radius:0 var(--r) var(--r) 0;color:var(--ink2);box-shadow:0 10px 30px -22px rgba(15,23,42,.4)}
.note{margin:1.5em 0;padding:16px 20px;border-radius:var(--r);background:#fff;border:1px solid var(--line);border-left:5px solid var(--blue);box-shadow:0 12px 32px -24px rgba(59,130,246,.55)}
.note>*:last-child{margin-bottom:0}.note-t{display:block;color:var(--ink);margin-bottom:6px}
.note-tip{border-left-color:#22C55E}.note-warn{border-left-color:var(--orange);background:#FFF7ED}.note-example{border-left-color:var(--violet);background:#F5F3FF}
.tw{overflow-x:auto;margin:1.4em 0;border:1px solid var(--line);border-radius:var(--r);background:#fff}
table{border-collapse:collapse;width:100%;font-size:.93rem;min-width:520px}th,td{padding:11px 14px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
th{background:#F1F5F9;color:var(--ink);font-weight:800;font-size:.82rem;letter-spacing:.02em}tr:last-child td{border-bottom:0}
.side{position:sticky;top:84px;display:flex;flex-direction:column;gap:18px}
@media(max-width:1020px){.side{position:static}}
.toc{background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:16px 18px;font-size:.88rem;box-shadow:0 14px 34px -26px rgba(15,23,42,.5)}
.toc b{display:block;color:var(--ink);margin-bottom:8px;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase}
.toc ol{margin:0;padding-left:1.1em}.toc li{margin:.4em 0;line-height:1.35}.toc a{color:var(--mut);text-decoration:none}.toc a:hover{color:var(--blue-d)}
@media(max-width:1020px){.toc{display:none}}
.sc{border-radius:var(--r);padding:20px;background:linear-gradient(140deg,#0F172A,#1E3A8A 55%,#7C2D12);color:#fff;box-shadow:0 26px 50px -26px rgba(29,78,216,.8)}
.sc b{display:block;font-size:1.05rem;line-height:1.3;margin-bottom:8px}.sc p{margin:0 0 14px;font-size:.88rem;color:#CBD5E1;line-height:1.5}
.sc .btn{width:100%}.sc small{display:block;margin-top:10px;text-align:center;color:#94A3B8;font-size:.76rem}
@media(max-width:1020px){.sc{display:none}}
.cta{margin:2.4em 0;border-radius:22px;padding:30px 30px 28px;background:linear-gradient(135deg,#0B1226,#1D4ED8 60%,#EA580C);color:#fff;position:relative;overflow:hidden;box-shadow:0 34px 60px -28px rgba(29,78,216,.75),0 14px 30px -18px rgba(249,115,22,.55)}
.cta:after{content:"";position:absolute;right:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.22),transparent 70%)}
.cta .k{font-size:.74rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#FDBA74}
.cta h3,.cta h2{color:#fff!important;margin:6px 0 8px!important;padding:0!important;font-size:1.45rem!important;line-height:1.25}.cta h2:before,.cta h3:before{display:none}
.cta p{color:#DBEAFE;margin:0 0 18px;max-width:520px}
.cta .btn{background:#fff;color:#0F172A!important;box-shadow:0 14px 30px -12px rgba(0,0,0,.5)}
.cta .row{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.cta small{color:#BFDBFE;font-size:.82rem}
.cta.mini{padding:22px 24px}.cta.mini h3{font-size:1.15rem!important}
.author{display:flex;gap:16px;align-items:flex-start;margin:2.6em 0 0;padding:22px;background:#fff;border:1px solid var(--line);border-radius:var(--r)}
.author .av{flex:0 0 54px;width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--orange));color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center}
.author p{margin:2px 0 0;font-size:.92rem;color:var(--mut)}.author b{color:var(--ink)}
.more{margin:2.6em 0 0}.more h2{margin-top:0!important}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:18px}
.card{display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:20px;text-decoration:none;color:var(--ink2);box-shadow:0 18px 40px -30px rgba(15,23,42,.55);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
.card:hover{transform:translateY(-4px);border-color:rgba(59,130,246,.4);box-shadow:0 26px 50px -28px rgba(59,130,246,.6);color:var(--ink2)}
.card .t{font-weight:800;color:var(--ink);font-size:1.05rem;line-height:1.3;margin:8px 0 6px}.card .d{font-size:.9rem;color:var(--mut);line-height:1.5;flex:1}
.card .m{margin-top:12px;font-size:.78rem;color:var(--soft)}
.tag{align-self:flex-start;font-size:.7rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;padding:3px 9px;border-radius:99px;background:rgba(249,115,22,.12);color:#C2410C}
.tag.p{background:rgba(59,130,246,.12);color:var(--blue-d)}
.hub{max-width:1180px;margin:0 auto;padding:16px 20px 70px}
.hub h2{font-size:1.5rem;color:var(--ink);letter-spacing:-.015em;margin:2.2em 0 .3em}.hub .sub{color:var(--mut);margin:0 0 16px}
.faq details{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 18px;margin:10px 0}
.faq summary{cursor:pointer;font-weight:800;color:var(--ink);list-style:none;display:flex;justify-content:space-between;gap:12px}
.faq summary::-webkit-details-marker{display:none}.faq summary:after{content:"+";color:var(--orange);font-size:1.3rem;line-height:1}
.faq details[open] summary:after{content:"–"}.faq details p{margin:10px 0 0;color:var(--mut)}
.ft{background:#0B1226;color:#CBD5E1;padding:46px 20px 26px;margin-top:20px;font-size:.9rem}
.ft-in{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:30px}
@media(max-width:820px){.ft-in{grid-template-columns:1fr 1fr}}
.ft h4{color:#fff;margin:0 0 10px;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase}.ft a{display:block;color:#CBD5E1;text-decoration:none;margin:6px 0}.ft a:hover{color:#FDBA74}
.ft .brand{color:#fff}.ft p{margin:10px 0 0;color:#94A3B8;max-width:300px;line-height:1.55}
.ft-b{max-width:1180px;margin:30px auto 0;padding-top:18px;border-top:1px solid #1E293B;display:flex;flex-wrap:wrap;gap:8px 20px;justify-content:space-between;color:#94A3B8;font-size:.82rem}.ft-b a{display:inline;margin:0}
.sticky{position:fixed;left:0;right:0;bottom:0;z-index:60;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-top:1px solid var(--line);display:none;transform:translateY(110%);transition:transform .3s ease}
.sticky.on{transform:none}.sticky .btn{width:100%}
@media(max-width:1020px){.sticky{display:block}body{padding-bottom:70px}}
#ck{position:fixed;left:12px;right:12px;bottom:12px;z-index:90;max-width:560px;margin:0 auto;background:#0F172A;color:#E2E8F0;border-radius:16px;padding:16px 18px;font-size:.86rem;line-height:1.5;box-shadow:0 26px 60px -20px rgba(0,0,0,.6);display:none}
#ck b{color:#fff}#ck .r{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}#ck button{cursor:pointer;border:0;border-radius:10px;padding:9px 16px;font-weight:700;font-family:inherit}
#ck .ok{background:linear-gradient(135deg,var(--blue),var(--orange));color:#fff}#ck .no{background:#1E293B;color:#E2E8F0}#ck a{color:#93C5FD}
.calc{background:#fff;border:1px solid var(--line);border-radius:22px;padding:26px;box-shadow:0 30px 60px -36px rgba(59,130,246,.6)}
.calc-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.calc label{display:block;font-weight:700;color:var(--ink);font-size:.86rem;margin-bottom:6px}.calc small{display:block;color:var(--soft);font-weight:500;margin-top:4px;font-size:.78rem}
.calc input[type=number]{width:100%;padding:12px 14px;border:1px solid #CBD5E1;border-radius:12px;font:inherit;font-size:1rem;background:#F8FAFC}
.calc input[type=range]{width:100%;accent-color:var(--orange)}
.res{margin-top:22px;padding:22px;border-radius:18px;background:linear-gradient(135deg,#0B1226,#1D4ED8 65%,#EA580C);color:#fff}
.res .big{font-size:clamp(2rem,6vw,3rem);font-weight:800;line-height:1.1;letter-spacing:-.02em}
.res .g3{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-top:16px}.res .g3 div{background:rgba(255,255,255,.1);border-radius:12px;padding:12px 14px}
.res .g3 b{display:block;font-size:1.25rem}.res .g3 span{font-size:.78rem;color:#BFDBFE}.res p.n{font-size:.78rem;color:#BFDBFE;margin:14px 0 0}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
`;

const SCRIPT = `
(function(){
  var ck=document.getElementById('ck');
  try{var v=localStorage.getItem('priv_ok');if(v===null&&ck){setTimeout(function(){ck.style.display='block'},900)}}catch(e){}
  function set(v){try{localStorage.setItem('priv_ok',v)}catch(e){}if(ck)ck.style.display='none';if(typeof gtag==='function')gtag('consent','update',{analytics_storage:v==='1'?'granted':'denied'})}
  var a=document.getElementById('ck-ok'),n=document.getElementById('ck-no');
  if(a)a.onclick=function(){set('1')};if(n)n.onclick=function(){set('0')};
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-cta]');if(t&&typeof gtag==='function')gtag('event','cta_click',{cta_position:t.getAttribute('data-cta'),page_path:location.pathname})});
  var st=document.getElementById('sticky');
  if(st){var on=function(){st.classList.toggle('on',window.scrollY>520)};window.addEventListener('scroll',on,{passive:true});on()}
})();
`;

// ───────────────────────── plantillas ─────────────────────────
const ctaUrl = (slug, sector, cluster, pos) => {
  const q = new URLSearchParams();
  if (sector) q.set('sector', sector);
  q.set('fuente', slug || 'web');
  q.set('utm_source', 'blog');
  q.set('utm_medium', 'cta-' + pos);
  if (cluster) q.set('utm_campaign', cluster);
  return '/?' + q.toString().replace(/&/g, '&amp;') + '#contacto';
};

function head({ title, desc, url, ogImage, jsonld = [], noindex = false, type = 'website' }) {
  const canon = SITE + url;
  const img = SITE + (ogImage || '/og-image.jpg');
  return `<!DOCTYPE html>
<html lang="es"><head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-H3Y3WFCTL6"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}var po=false;try{po=localStorage.getItem('priv_ok')==='1'}catch(e){}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:po?'granted':'denied'});gtag('js',new Date());gtag('config','G-H3Y3WFCTL6');</script>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canon}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1'}">
<meta name="author" content="${esc(site.author.name)}">
<link rel="icon" type="image/png" href="/logo.png"><link rel="apple-touch-icon" href="/logo.png">
<link rel="alternate" type="application/rss+xml" title="Blog de ${esc(site.name)}" href="/blog/feed.xml">
<meta property="og:type" content="${type}"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="es_ES">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canon}">
<meta property="og:image" content="${img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${img}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"></noscript>
<style>${CSS}</style>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>`;
}

const header = () => `<a class="skip" href="#main">Saltar al contenido</a>
<header class="hd"><div class="hd-in">
<a class="brand" href="/" aria-label="O.N.E Agency, inicio"><img src="/logo.png" width="38" height="38" alt="" decoding="async"><span class="w">O.N.E <b>Agency</b></span></a>
<nav class="nav" aria-label="Principal">
<a href="/servicios/automatizacion-con-ia/">Servicios</a><a href="/blog/">Blog</a><a href="/recursos/calculadora-ahorro-automatizacion/">Calculadora</a>
<a class="btn btn-sm" data-cta="header" href="${ctaUrl('header', '', '', 'header')}">Diagnóstico gratuito</a>
</nav></div></header>`;

const footer = () => `<footer class="ft"><div class="ft-in">
<div><a class="brand" href="/"><img src="/logo.png" width="38" height="38" alt="" loading="lazy"><span>O.N.E <b>Agency</b></span></a><p>Automatización con IA para empresas de toda España. Menos tareas repetitivas, más tiempo para lo que importa.</p></div>
<div><h4>Guías</h4>${site.clusters.map((c) => `<a href="/blog/${c.id}/">${esc(c.name)}</a>`).join('')}</div>
<div><h4>Servicios</h4><a href="/servicios/automatizacion-con-ia/">Automatización con IA</a><a href="/servicios/chatbots-whatsapp/">Chatbots y WhatsApp</a><a href="/servicios/webs-para-empresas/">Webs para empresas</a><a href="/recursos/calculadora-ahorro-automatizacion/">Calculadora de ahorro</a></div>
<div><h4>Empresa</h4><a href="/">Inicio</a><a href="/#nosotros">Nosotros</a><a href="${ctaUrl('footer', '', '', 'footer')}">Diagnóstico gratuito</a><a href="mailto:angel@one-agency.es">angel@one-agency.es</a></div>
</div><div class="ft-b"><span>© ${new Date().getFullYear()} O.N.E Agency. Todos los derechos reservados.</span><span><a href="/privacidad/">Política de privacidad y cookies</a> · <a href="/blog/feed.xml">RSS</a></span></div></footer>
<div id="ck" role="dialog" aria-label="Aviso de cookies"><b>Cookies analíticas</b><br>Usamos Google Analytics para saber qué contenido te resulta útil. Solo se activa si lo aceptas. <a href="/privacidad/">Más información</a>
<div class="r"><button class="ok" id="ck-ok" type="button">Aceptar</button><button class="no" id="ck-no" type="button">Rechazar</button></div></div>
<script>${SCRIPT}</script></body></html>`;

const orgRef = { '@id': SITE + '/#organization' };
const personLd = () => ({ '@type': 'Person', name: site.author.name, url: site.author.url, jobTitle: site.author.role, sameAs: site.author.sameAs, worksFor: orgRef });
const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: SITE + it[1] })),
});
const crumbsHtml = (items) => `<nav class="crumbs" aria-label="Migas de pan">${items.map((it, i) => (i === items.length - 1 ? `<span>${esc(it[0])}</span>` : `<a href="${it[1]}">${esc(it[0])}</a><i>›</i>`)).join('')}</nav>`;

function ctaBox(cluster, slug, sector, pos, variant = 'full') {
  const c = clusterById[cluster] || site.clusters[0];
  const u = ctaUrl(slug, sector, cluster, pos);
  if (variant === 'mini') {
    return `<div class="cta mini"><span class="k">Diagnóstico gratuito</span><h3>${esc(c.cta.title)}</h3><p>${esc(c.cta.text)}</p><div class="row"><a class="btn" data-cta="${pos}" href="${u}">Reservar diagnóstico gratuito</a></div></div>`;
  }
  return `<div class="cta"><span class="k">Diagnóstico gratuito · 30 minutos</span><h2>${esc(c.cta.title)}</h2><p>${esc(c.cta.text)} Sin compromiso.</p><div class="row"><a class="btn" data-cta="${pos}" href="${u}">Reservar mi diagnóstico gratuito →</a><small>Respondemos en menos de 24 h</small></div></div>`;
}

function resourceBox() {
  return `<aside class="note note-tip"><strong class="note-t">Calcula tu ahorro en 1 minuto</strong><p>Con nuestra <a href="/recursos/calculadora-ahorro-automatizacion/">calculadora de ahorro por automatización</a> puedes estimar cuántas horas y cuánto dinero al año te devolvería automatizar tus tareas repetitivas.</p></aside>`;
}

function renderFaq(faq) {
  if (!faq.length) return '';
  return `<div class="faq">${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;
}

function extractFaq(blocks) {
  const faq = [];
  let inFaq = false, cur = null;
  for (const b of blocks) {
    if (b.t === 'h2') { inFaq = /preguntas frecuentes/i.test(b.text); cur = null; continue; }
    if (!inFaq) continue;
    if (b.t === 'h3') { cur = { q: b.text, a: '' }; faq.push(cur); }
    else if (cur && b.t === 'p') cur.a += (cur.a ? ' ' : '') + stripTags(b.html).replace(/\s+/g, ' ').trim();
  }
  return faq;
}

function bodyWithCtas(page, cluster) {
  const blocks = page.blocks;
  const h2s = blocks.filter((b) => b.t === 'h2' && !/preguntas frecuentes/i.test(b.text));
  const isPillar = page.fm.type === 'pillar';
  const out = [];
  let h2n = 0, faqStarted = false, skipFaq = false;
  for (const b of blocks) {
    if (b.t === 'h2') {
      if (/preguntas frecuentes/i.test(b.text)) {
        faqStarted = true;
        out.push(b.html);
        out.push('@@FAQ@@');
        skipFaq = true;
        continue;
      }
      skipFaq = false;
      h2n++;
      if (h2n === 3 && page.kind === 'article') out.push(ctaBox(cluster, page.slug, page.fm.sector, 'inline', 'mini'));
      if (page.kind === 'article' && isPillar && h2n === Math.max(6, Math.ceil(h2s.length * 0.65))) out.push(resourceBox());
    }
    if (skipFaq) continue;
    out.push(b.html);
  }
  return out.join('\n');
}

function articlePage(a) {
  const c = clusterById[a.fm.cluster];
  const faq = extractFaq(a.blocks);
  const h2s = a.blocks.filter((b) => b.t === 'h2');
  const seoTitle = a.fm.seoTitle || `${a.fm.title} | ${site.name}`;
  const desc = a.fm.description;
  const url = a.url;
  const og = `${url}og.jpg`;
  const mins = Math.max(3, Math.round(a.words / 200));
  const isPillar = a.fm.type === 'pillar';
  let body = bodyWithCtas(a, a.fm.cluster).replace('@@FAQ@@', renderFaq(faq));
  const toc = h2s.length >= 4 ? `<nav class="toc" aria-label="Índice"><b>En este artículo</b><ol>${h2s.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>` : '';
  const related = articles.filter((x) => x.fm.cluster === a.fm.cluster && x.slug !== a.slug).sort((x, y) => (x.fm.type === 'pillar' ? -1 : 1) - (y.fm.type === 'pillar' ? -1 : 1)).slice(0, 3);
  const others = articles.filter((x) => x.fm.cluster !== a.fm.cluster && x.fm.type === 'pillar').slice(0, 6 - related.length);
  const more = [...related, ...others].slice(0, 6);
  const moreHtml = more.length ? `<section class="more"><h2>Sigue leyendo</h2><div class="grid">${more.map(cardHtml).join('')}</div></section>` : '';
  const crumbItems = [['Inicio', '/'], ['Blog', '/blog/'], [c.name, `/blog/${c.id}/`], [a.fm.title, url]];
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: a.fm.title, description: desc,
      image: [SITE + og], datePublished: a.date, dateModified: a.modified, inLanguage: 'es-ES',
      mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + url },
      author: personLd(), publisher: { '@type': 'Organization', name: site.name, '@id': SITE + '/#organization', logo: { '@type': 'ImageObject', url: SITE + '/logo.png' } },
      articleSection: c.name, wordCount: a.words,
    },
    breadcrumbLd(crumbItems),
  ];
  if (faq.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

  const sideCta = `<div class="sc"><b>${esc(c.cta.title)}</b><p>${esc(c.cta.text)}</p><a class="btn" data-cta="sidebar" href="${ctaUrl(a.slug, a.fm.sector, a.fm.cluster, 'sidebar')}">Diagnóstico gratuito</a><small>30 minutos · sin compromiso</small></div>`;
  const html = `${head({ title: seoTitle, desc, url, ogImage: og, jsonld: ld, type: 'article' })}<body>${header()}
${crumbsHtml(crumbItems)}
<div class="wrap" id="main"><article>
<a class="kick" href="/blog/${c.id}/">${esc(c.name)}</a>
<h1>${esc(a.fm.title)}</h1>
<p class="lead">${esc(a.fm.lead || desc)}</p>
<div class="meta"><span class="av" aria-hidden="true">AC</span><span>Por <a href="${site.author.url}" rel="author">${esc(site.author.name)}</a></span><span>Actualizado el ${fmtDate(a.modified)}</span><span>${mins} min de lectura</span></div>
${body}
${ctaBox(a.fm.cluster, a.slug, a.fm.sector, 'final')}
<div class="author"><span class="av" aria-hidden="true">AC</span><div><b>${esc(site.author.name)}</b> · ${esc(site.author.role)}<p>${esc(site.author.bio)}</p></div></div>
${moreHtml}
</article><aside class="side">${toc}${sideCta}</aside></div>
<div class="sticky" id="sticky"><a class="btn" data-cta="sticky" href="${ctaUrl(a.slug, a.fm.sector, a.fm.cluster, 'sticky')}">⚡ Reservar diagnóstico gratuito</a></div>
${footer()}`;
  return html;
}

function cardHtml(a) {
  const c = clusterById[a.fm.cluster];
  const mins = Math.max(3, Math.round(a.words / 200));
  return `<a class="card" href="${a.url}"><span class="tag ${a.fm.type === 'pillar' ? 'p' : ''}">${a.fm.type === 'pillar' ? 'Guía completa' : esc(c.name)}</span><span class="t">${esc(a.fm.title)}</span><span class="d">${esc(a.fm.description)}</span><span class="m">${mins} min de lectura</span></a>`;
}

function hubPage() {
  const url = '/blog/';
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Blog', name: `Blog de ${site.name}`, url: SITE + url, inLanguage: 'es-ES', publisher: { '@type': 'Organization', name: site.name, '@id': SITE + '/#organization' } },
    breadcrumbLd([['Inicio', '/'], ['Blog', url]]),
  ];
  const pillars = site.clusters.map((c) => articleBySlug[c.pillar]).filter(Boolean);
  const latest = [...articles].filter((a) => a.fm.type !== 'pillar').sort((x, y) => y.date.localeCompare(x.date)).slice(0, 12);
  return `${head({ title: 'Blog de automatización con IA para empresas | O.N.E Agency', desc: 'Guías prácticas de automatización con IA para pymes y empresas de España: chatbots, WhatsApp, n8n, facturación, costes y casos por sector.', url, jsonld: ld })}<body>${header()}
${crumbsHtml([['Inicio', '/'], ['Blog', url]])}
<main class="hub" id="main"><span class="kick">Blog</span><h1>Automatización con IA para empresas, explicada sin humo</h1>
<p class="lead" style="max-width:760px">Guías prácticas para pymes y negocios de toda España: qué automatizar, cómo hacerlo, cuánto cuesta y qué resultados esperar. Escritas por quien construye estos sistemas cada semana.</p>
<h2>Guías completas por tema</h2><p class="sub">Empieza por la guía del tema que más te interese.</p>
<div class="grid">${pillars.map(cardHtml).join('')}</div>
${site.clusters.map((c) => {
    const list = articles.filter((a) => a.fm.cluster === c.id && a.fm.type !== 'pillar');
    if (!list.length) return '';
    return `<h2>${esc(c.name)}</h2><p class="sub">${esc(c.desc)} <a href="/blog/${c.id}/">Ver todo →</a></p><div class="grid">${list.slice(0, 6).map(cardHtml).join('')}</div>`;
  }).join('')}
${ctaBox('automatizacion-ia', 'blog-hub', '', 'hub')}
</main>${footer()}`;
}

function clusterPage(c) {
  const url = `/blog/${c.id}/`;
  const list = articles.filter((a) => a.fm.cluster === c.id).sort((x, y) => (x.fm.type === 'pillar' ? -1 : 1) - (y.fm.type === 'pillar' ? -1 : 1) || x.fm.title.localeCompare(y.fm.title));
  const ld = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.name, description: c.desc, url: SITE + url, inLanguage: 'es-ES', isPartOf: { '@type': 'Blog', '@id': SITE + '/blog/' } },
    breadcrumbLd([['Inicio', '/'], ['Blog', '/blog/'], [c.name, url]]),
  ];
  return `${head({ title: `${c.name}: guías y artículos | O.N.E Agency`, desc: c.desc, url, jsonld: ld })}<body>${header()}
${crumbsHtml([['Inicio', '/'], ['Blog', '/blog/'], [c.name, url]])}
<main class="hub" id="main"><span class="kick">${esc(c.name)}</span><h1>${esc(c.name)}</h1><p class="lead" style="max-width:760px">${esc(c.desc)}</p>
<div class="grid">${list.map(cardHtml).join('')}</div>
${ctaBox(c.id, 'cluster-' + c.id, '', 'cluster')}
</main>${footer()}`;
}

function simplePage(p, { serviceLd = false } = {}) {
  const url = p.url;
  const crumbs = p.kind === 'service' ? [['Inicio', '/'], ['Servicios', '/servicios/automatizacion-con-ia/'], [p.fm.title, url]]
    : p.kind === 'resource' ? [['Inicio', '/'], ['Recursos', url], [p.fm.title, url]]
    : [['Inicio', '/'], [p.fm.title, url]];
  if (p.kind === 'service') crumbs[1] = ['Servicios', '/servicios/automatizacion-con-ia/'];
  if (p.kind === 'resource') crumbs.splice(1, 1);
  const faq = extractFaq(p.blocks);
  const cluster = p.fm.cluster || 'automatizacion-ia';
  let body = bodyWithCtas(p, cluster).replace('@@FAQ@@', renderFaq(faq));
  if (p.fm.script === 'calc') body = body.replace('<p>@@CALC@@</p>', CALC_HTML);
  const ld = [breadcrumbLd(crumbs)];
  if (p.kind === 'service') {
    ld.push({
      '@context': 'https://schema.org', '@type': 'Service', name: p.fm.title, description: p.fm.description, url: SITE + url,
      provider: orgRef, areaServed: { '@type': 'Country', name: 'España' }, serviceType: p.fm.serviceType || p.fm.title,
    });
  }
  if (p.kind === 'resource') ld.push({ '@context': 'https://schema.org', '@type': 'WebApplication', name: p.fm.title, description: p.fm.description, url: SITE + url, applicationCategory: 'BusinessApplication', operatingSystem: 'Web' });
  if (faq.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  const showCta = p.kind !== 'legal';
  const seoTitle = p.fm.seoTitle || `${p.fm.title} | ${site.name}`;
  const og = p.kind === 'legal' ? '/og-image.jpg' : `${url}og.jpg`;
  const sticky = showCta ? `<div class="sticky" id="sticky"><a class="btn" data-cta="sticky" href="${ctaUrl(p.slug, p.fm.sector, cluster, 'sticky')}">⚡ Reservar diagnóstico gratuito</a></div>` : '';
  return `${head({ title: seoTitle, desc: p.fm.description, url, ogImage: og, jsonld: ld })}<body>${header()}
${p.kind === 'legal' ? '' : crumbsHtml(crumbs)}
<div class="wrap one" id="main"><article>
<h1>${esc(p.fm.title)}</h1>
${p.fm.lead ? `<p class="lead">${esc(p.fm.lead)}</p>` : ''}
${body}
${showCta ? ctaBox(cluster, p.slug, p.fm.sector, 'final') : ''}
</article></div>${sticky}
${footer()}`;
}

const CALC_HTML = `<div class="calc" id="calc"><div class="calc-g">
<div><label for="c-h">Horas por semana en tareas repetitivas<small>Por persona: copiar datos, responder lo mismo, informes, facturas…</small></label><input id="c-h" type="number" min="0" max="80" step="0.5" value="6"></div>
<div><label for="c-p">Personas que hacen esas tareas</label><input id="c-p" type="number" min="1" max="500" step="1" value="3"></div>
<div><label for="c-c">Coste por hora (€, con seguridad social)<small>Sueldo bruto anual + cotización empresa, dividido entre ~1.700 h</small></label><input id="c-c" type="number" min="5" max="200" step="1" value="18"></div>
<div><label for="c-a">Porcentaje realmente automatizable: <b id="c-av">60%</b><small>Sé conservador: casi nunca es el 100%</small></label><input id="c-a" type="range" min="10" max="90" step="5" value="60"></div>
<div><label for="c-i">Inversión estimada en automatizar (€)<small>Opcional: para calcular en cuántos meses se amortiza</small></label><input id="c-i" type="number" min="0" step="100" value="3000"></div>
</div>
<div class="res" aria-live="polite"><span style="font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:#FDBA74;font-weight:800">Ahorro estimado al año</span><div class="big" id="r-y">—</div>
<div class="g3"><div><b id="r-h">—</b><span>horas liberadas al año</span></div><div><b id="r-m">—</b><span>ahorro al mes</span></div><div><b id="r-r">—</b><span>amortización</span></div></div>
<p class="n">Estimación orientativa: horas × personas × 46 semanas × % automatizable × coste/hora. No incluye costes de herramientas ni mantenimiento. Los resultados reales dependen de cada proceso.</p></div></div>
<script>(function(){var q=function(i){return document.getElementById(i)};function n(v){return isFinite(v)?v:0}
function f(x){return Math.round(x).toLocaleString('de-DE')}
function u(){var h=n(+q('c-h').value),p=n(+q('c-p').value),c=n(+q('c-c').value),a=n(+q('c-a').value)/100,i=n(+q('c-i').value);q('c-av').textContent=Math.round(a*100)+'%';
var hy=h*p*46*a,sy=hy*c;q('r-y').textContent=f(sy)+' €';q('r-h').textContent=f(hy)+' h';q('r-m').textContent=f(sy/12)+' €';
q('r-r').textContent=(i>0&&sy>0)?(i/(sy/12)<1?'< 1 mes':(Math.round(i/(sy/12)*10)/10).toLocaleString('de-DE')+' meses'):'—';
if(typeof gtag==='function'&&!u.s){u.s=1;gtag('event','calculator_use')}}
['c-h','c-p','c-c','c-a','c-i'].forEach(function(id){q(id).addEventListener('input',u)});u.s=0;u()})();</script>`;

function privacyPage(p) {
  return simplePage(p);
}

// ───────────────────────── generación ─────────────────────────
for (const d of OUT_DIRS) rmrf(path.join(ROOT, d));
const sitemap = [{ url: '/', lastmod: TODAY, cf: 'weekly', pr: '1.0' }];

for (const a of articles) {
  writeOut(`blog${a.url.slice(5)}index.html`, articlePage(a));
  sitemap.push({ url: a.url, lastmod: a.modified, cf: 'monthly', pr: a.fm.type === 'pillar' ? '0.9' : '0.7' });
  if (a.fm.description.length < 110 || a.fm.description.length > 165) warn(`${a.slug}: description ${a.fm.description.length} car.`);
  const st = a.fm.seoTitle || `${a.fm.title} | ${site.name}`;
  if (st.length > 66) warn(`${a.slug}: title ${st.length} car.`);
  const minWords = a.fm.type === 'pillar' ? 1500 : 800;
  if (a.words < minWords) warn(`${a.slug}: solo ${a.words} palabras (mín. ${minWords})`);
}
writeOut('blog/index.html', hubPage());
sitemap.push({ url: '/blog/', lastmod: TODAY, cf: 'daily', pr: '0.8' });
for (const c of site.clusters) {
  writeOut(`blog/${c.id}/index.html`, clusterPage(c));
  sitemap.push({ url: `/blog/${c.id}/`, lastmod: TODAY, cf: 'weekly', pr: '0.8' });
}
for (const s of services) {
  writeOut(`servicios/${s.slug}/index.html`, simplePage(s));
  sitemap.push({ url: s.url, lastmod: s.modified, cf: 'monthly', pr: '0.9' });
}
for (const r of resources) {
  writeOut(`recursos/${r.slug}/index.html`, simplePage(r));
  sitemap.push({ url: r.url, lastmod: r.modified, cf: 'monthly', pr: '0.8' });
}
for (const l of legal) {
  if (l.slug === 'privacidad') {
    writeOut('privacidad/index.html', privacyPage({ ...l, url: '/privacidad/' }));
    sitemap.push({ url: '/privacidad/', lastmod: l.modified, cf: 'yearly', pr: '0.3' });
  }
}

// 404
writeOut('404.html', `${head({ title: 'Página no encontrada | O.N.E Agency', desc: 'La página que buscas no existe.', url: '/404.html', noindex: true })}<body>${header()}
<main class="hub" id="main" style="text-align:center;padding-top:70px"><span class="kick">Error 404</span><h1>Esta página no existe</h1><p class="lead">Puede que el enlace haya cambiado. Prueba con estas guías o vuelve al inicio.</p>
<p><a class="btn" href="/">Ir al inicio</a> &nbsp; <a class="btn btn-ghost" href="/blog/">Ver el blog</a></p></main>${footer()}`);

// sitemap
writeOut('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map((s) => `  <url>\n    <loc>${SITE}${s.url}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n    <changefreq>${s.cf}</changefreq>\n    <priority>${s.pr}</priority>\n  </url>`).join('\n')}\n</urlset>\n`);

// rss
const rssItems = [...articles].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)).slice(0, 30);
writeOut('blog/feed.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>\n<title>Blog de ${esc(site.name)}</title><link>${SITE}/blog/</link><description>Guías de automatización con IA para empresas de España.</description><language>es-ES</language>\n<atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>\n${rssItems.map((a) => `<item><title>${esc(a.fm.title)}</title><link>${SITE}${a.url}</link><guid>${SITE}${a.url}</guid><pubDate>${new Date(a.date + 'T09:00:00Z').toUTCString()}</pubDate><description>${esc(a.fm.description)}</description></item>`).join('\n')}\n</channel></rss>\n`);

// ───────────────────────── validación de enlaces internos ─────────────────────────
const known = new Set(sitemap.map((s) => s.url));
['/logo.png', '/og-image.jpg', '/blog/feed.xml'].forEach((u) => known.add(u));
let broken = 0;
for (const l of internalLinks) {
  const clean = l.to.split('#')[0].split('?')[0] || '/';
  if (!known.has(clean)) { broken++; warn(`Enlace roto en ${l.from} → ${l.to}`); }
}

// ───────────────────────── informe ─────────────────────────
console.log(`Artículos: ${articles.length} · Servicios: ${services.length} · Recursos: ${resources.length} · URLs en sitemap: ${sitemap.length}`);
console.log(`Palabras totales artículos: ${articles.reduce((s, a) => s + a.words, 0)}`);
if (warnings.length) { console.log(`\nAVISOS (${warnings.length}):`); warnings.forEach((w) => console.log(' · ' + w)); }
if (broken) { console.error(`\n${broken} enlaces internos rotos`); process.exit(1); }
console.log('\nBuild OK');
