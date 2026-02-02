# Changelog

## 2026-02-02
- docsify-last-modified：新增“优先 HEAD、GitHub 备用”的策略与配置项（preferHead）
- 同步要求：腾讯云 COS 需开启 CORS，并在 Expose Headers 中加入 `Last-Modified`
- 站点 Origin 建议：优先保留 `https://www.sicnuwiki.com`（可按需追加 `https://sicnuwiki.com`）
- twikoo：修正 Docsify 页面 path 计算，确保不同页面评论区独立

### 腾讯云 COS CORS 设置要点
- 路径：对象存储 COS → 存储桶 → 安全管理 → 跨域访问 CORS
- Allowed Origins：`https://www.sicnuwiki.com`（如需兼容非 www，再加 `https://sicnuwiki.com`）
- Allowed Methods：`GET, HEAD`
- Allowed Headers：`*`
- Expose Headers：`Last-Modified`（原有 `ETag` 等可保留）
- Max Age：600 或 3600
