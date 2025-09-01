# auto-indexnow-sitemap


### Features

* Automatically read local `sitemap.xml`
* Fetch online old sitemap.xml
* Compare differences and push only new pages to Bing IndexNow
* Supports `--check` dry-run to preview new URLs
* Chunked submissions for large sites


### Usage

1. Copy `scripts/pushIndexNow.js` to your project root.


2. Edit `scripts/pushIndexNow.js` config:

* `SITE_URL`: your website domain
* `INDEXNOW_KEY`: your IndexNow key
* `SITEMAP_PATH`: path to local sitemap
* `OLD_SITEMAP_URL`: URL of online sitemap
* `CHUNK_SIZE`: max URLs per submission

3. Dry-run locally:

```bash
node scripts/pushIndexNow.js --check
```

4. Push actual URLs:

```bash
node scripts/pushIndexNow.js --push
```

### Integration with Next.js

```json
"scripts": {
  "build": "next build && next-sitemap && node scripts/pushIndexNow.js --push",
  "build-dev": "next build && next-sitemap && node scripts/pushIndexNow.js --check"
}
```

### Notes

* Dry-run only prints new URLs
* Ensure IndexNow key file is deployed:
  `https://www.example.com/<INDEXNOW_KEY>.txt`
* Works for any static site with a sitemap
