# auto-indexnow-sitemap
Auto push new pages to Bing IndexNow based on sitemap

English | [简体中文](README.zh-CN.md)

### Features

* Automatically read local `sitemap.xml`
* Fetch online old sitemap.xml
* Compare differences and push only new pages to Bing IndexNow
* Supports `--check` dry-run to preview new URLs
* Chunked submissions for large sites

### Get IndexNow Key

1. Open [Bing IndexNow](https://www.bing.com/indexnow/getstarted)
2. Download the API key (the content is the key itself)
3. Upload it to your website root, e.g.: `https://www.example.com/<YOUR_INDEXNOW_KEY>.txt`


### Usage

1. Copy `scripts/pushIndexNow.js` to your project root.


2. Edit `scripts/pushIndexNow.js` config:

* `SITE_URL`: your website domain

* `INDEXNOW_KEY`: your IndexNow key

* `SITEMAP_FILES`: path to local sitemap, support multiple files

* `OLD_SITEMAP_URLS`: URL of online sitemap, support multiple urls

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

### Integration with Hugo

if your project does not have `package.json`, such as `hugo`, you need to change the import statement to the following:

``` js
// original
import fs from 'fs';
import process from 'process';

// change to
const fs = require('fs');
const process = require('process');
```


### Notes

* Dry-run only prints new URLs

* Ensure IndexNow key file is deployed: `https://www.example.com/<INDEXNOW_KEY>.txt`

* Works for any static site with a sitemap

* View [My Blog Post](https://liuhouliang.com/en/post/nextjs_indexnow/)