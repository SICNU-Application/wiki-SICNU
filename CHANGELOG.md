# Changelog

## 2026-02-03
- twikoo：彻底修复 Docsify SPA 页面切换时多评论区叠加问题
- twikoo：新增 `destroyTwikoo()` 统一销毁函数，管理定时器、观察者和 DOM 清理
- twikoo：在 `hook.beforeEach` 路由切换前提前销毁旧评论实例
- twikoo：`ensureTcomment()` 改为每次创建前先清理所有旧容器
- twikoo：`doneEach` 中延迟 50ms 创建新容器，确保 DOM 更新完成
- twikoo：移除 `loadTwikoo` 和 `observeAndLoad` 中多余的 `ensureTcomment()` 调用
- twikoo：增强 token 机制防止快速切换页面时的竞态条件

## 2026-02-02
- docsify-last-modified：新增“优先 HEAD、GitHub 备用”的策略与配置项（preferHead）
- 同步要求：腾讯云 COS 需开启 CORS，并在 Expose Headers 中加入 `Last-Modified`
- 站点 Origin 建议：优先保留 `https://www.sicnuwiki.com`（可按需追加 `https://sicnuwiki.com`）
- twikoo：修正 Docsify 页面 path 计算，确保不同页面评论区独立
- twikoo：统一 README 相关路径（如 `/README` 与 `/./README`）以共享评论区
- twikoo：切换页面时懒加载评论区，减少移动端卡顿并自动刷新评论
- twikoo：切换页面时清理旧评论容器，避免多评论区叠加
- twikoo：增加路由令牌，防止旧页面异步回流导致重复评论区
- docsify：统一侧边栏到根目录，避免子目录 `_sidebar.md` 404
- docsify：同步 vercel 版本的根目录侧边栏 alias 配置
- twikoo（主站）：容器随页面内容动态挂载，路径归一化（含 README 同一），切页前清理 `.twikoo` 等 DOM，保证仅一个评论框
- twikoo（vercel 备份）：同步清理 `.twikoo` 相关 DOM，保持单一评论框，与主站逻辑一致

### 腾讯云 COS CORS 设置要点
- 路径：对象存储 COS → 存储桶 → 安全管理 → 跨域访问 CORS
- Allowed Origins：`https://www.sicnuwiki.com`（如需兼容非 www，再加 `https://sicnuwiki.com`）
- Allowed Methods：`GET, HEAD`
- Allowed Headers：`*`
- Expose Headers：`Last-Modified`（原有 `ETag` 等可保留）
- Max Age：600 或 3600
