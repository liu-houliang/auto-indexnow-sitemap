# auto-indexnow-sitemap

### 功能

- 自动读取本地 sitemap.xml
- 获取线上旧 sitemap.xml
- 对比差异，增量推送新增页面到 Bing IndexNow
- 支持 `--check` 模拟测试，不发送请求
- 支持大批量分块提交，避免一次性推送过多 URL

### 使用方法

1. 复制 scripts/pushIndexNow.js代码文件到项目根目录


2. 修改js中的配置：

* `SITE_URL`：你的网站域名
* `INDEXNOW_KEY`：你的 IndexNow Key
* `SITEMAP_PATH`：本地 sitemap 路径
* `OLD_SITEMAP_URL`：线上 sitemap URL
* `CHUNK_SIZE`：每次提交 URL 数量

3. 本地模拟推送（dry-run）：

```bash
node scripts/pushIndexNow.js --check
```

4. 实际推送：

```bash
node scripts/pushIndexNow.js --push
```

### 集成到 Next.js

在 `package.json` 中：

```json
"scripts": {
  "build": "next build && next-sitemap && node scripts/pushIndexNow.js --push",
  "build-dev": "next build && next-sitemap && node scripts/pushIndexNow.js --check"
}
```

### 注意事项

* 本地 `--check` 只打印新增 URL，不会发送请求
* 确保 IndexNow key 文件已部署：
  `https://www.example.com/<INDEXNOW_KEY>.txt`
* 支持任意静态站点，只要生成 sitemap 即可
