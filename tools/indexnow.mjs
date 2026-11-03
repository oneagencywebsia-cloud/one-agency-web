// Avisa a Bing, Yandex y demás buscadores IndexNow de las URLs del sitemap.
// Uso (DESPUÉS de desplegar, porque comprueban que la clave exista en producción):
//   node tools/indexnow.mjs            -> envía todo el sitemap
//   node tools/indexnow.mjs /blog/x/   -> envía solo esas rutas
// Google no usa IndexNow: para Google, enviar el sitemap en Search Console e inspeccionar la URL nueva.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const HOST = 'one-agency.es';
const KEY = 'de504f6a6ae46f2e8ea864067cf2fb91';
const only = process.argv.slice(2);
const urls = only.length
  ? only.map((u) => `https://${HOST}${u}`)
  : [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} URLs -> HTTP ${res.status} (200/202 = aceptado)`);
