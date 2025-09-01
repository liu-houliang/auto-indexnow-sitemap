#!/usr/bin/env node
/**
 * pushIndexNow.js - Auto push new pages to Bing IndexNow
 * Usage:
 *   Local dry-run (check new URLs):
 *     node pushIndexNow.js --check
 *   Actual push online:
 *     node pushIndexNow.js --push
 *
 * Note: This script is intended to run in Node.js (server-side), not in the browser.
 */

import fs from 'fs';
import process from 'process';

// ====== Configuration ======
const SITE_URL = 'https://www.example.com';    

const INDEXNOW_KEY = 'your-indexnow-key';    

const SITEMAP_FILES = [
  './out/sitemap.xml',
];

const OLD_SITEMAP_URLS = [
  `${SITE_URL}/sitemap.xml`,
];  

const CHUNK_SIZE = 1000;                             

// ====== Command-line args ======
const args = process.argv.slice(2);
const PUSH_MODE = args.includes('--push');
const CHECK_MODE = args.includes('--check') || !PUSH_MODE;

// ====== Helper functions ======
function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// Parse sitemap.xml using regex to extract <loc> URLs
function parseSitemap(xmlString) {
  const regex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = regex.exec(xmlString)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

// Send URLs to Bing IndexNow
async function sendIndexNow(urls) {
  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls
  };

  console.log('=== IndexNow POST Payload Preview ===');
  console.log(JSON.stringify(payload, null, 2));
  console.log('====================================');

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

// ====== Main ======
(async function main() {
  // 1. Read local sitemap.xml
  const newUrls = [];
  for (const file of SITEMAP_FILES) {
    if (!fs.existsSync(file)) continue;
    const xml = fs.readFileSync(file, 'utf-8');
    newUrls.push(...parseSitemap(xml));
  }

  // 2. Fetch online sitemap.xml
  let oldUrls = [];
  for (const url of OLD_SITEMAP_URLS) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const xml = await res.text();
      oldUrls.push(...parseSitemap(xml));
    } catch(e) {
      console.warn('Failed to fetch', url);
    }
  }

  // 3. Compute difference (new URLs)
  const oldSet = new Set(oldUrls);
  const toPush = newUrls.filter(u => !oldSet.has(u));

  if (toPush.length === 0) {
    console.log('No new pages to push.');
    process.exit(0);
  }

  console.log(`Found ${toPush.length} new pages.`);

  if (CHECK_MODE) {
    console.log('== Dry run mode ==');
    toPush.forEach(u => console.log(u));
    process.exit(0);
  }

  // 4. Push new URLs to Bing IndexNow
  const chunks = chunkArray(toPush, CHUNK_SIZE);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Pushing chunk ${i + 1}/${chunks.length} (${chunk.length} URLs)...`);
    try {
      const res = await sendIndexNow(chunk);
      if (res.ok) console.log(`Chunk ${i + 1} succeeded (HTTP ${res.status})`);
      else console.error(`Chunk ${i + 1} failed (HTTP ${res.status})`, res.text);
    } catch (e) {
      console.error(`Chunk ${i + 1} encountered an error:`, e.message || e);
    }
    if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 500));
  }

  console.log('IndexNow push completed.');
})();
