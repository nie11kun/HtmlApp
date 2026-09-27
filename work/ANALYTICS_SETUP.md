# 机械计算器 专属 D1 数据库 (mechanical-calculator-db) 访客统计配置指南

本文档详细介绍了如何为 **机械计算器 (work)** 项目在 Cloudflare 上配置独立的 **`mechanical-calculator-db`** D1 数据库与访客统计系统。

网站底栏实时展示：
* **本周访客数**（按自然周去重）
* **本月访客数**（按自然月去重）
* **历史总访客数**（全周期去重）

---

## 🗄️ 第一步：创建专属 D1 数据库 `mechanical-calculator-db`

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)；
2. 在左侧菜单栏点击 **Storage & Databases** -> **D1 SQL Database**；
3. 点击 **Create database** 按钮：
   * **Database name (数据库名称)**：填写 **`mechanical-calculator-db`**；
4. 点击确定创建后，进入该数据库详情页，切换到顶部的 **Console (控制台)** 标签页；
5. 复制并执行以下建表 SQL：

```sql
-- 1. 历史总访客表（通过匿名 visitor_id 保证绝对去重）
CREATE TABLE IF NOT EXISTS unique_visitors (
  visitor_id TEXT PRIMARY KEY,
  first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 每周访客表（周标签 + 匿名 visitor_id 联合主键，每周自动刷新去重）
CREATE TABLE IF NOT EXISTS weekly_visitors (
  week_tag TEXT NOT NULL,       -- 如 '2026-W39'
  visitor_id TEXT NOT NULL,
  visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (week_tag, visitor_id)
);

-- 3. 每月访客表（月标签 + 匿名 visitor_id 联合主键，每月自动刷新去重）
CREATE TABLE IF NOT EXISTS monthly_visitors (
  month_tag TEXT NOT NULL,      -- 如 '2026-09'
  visitor_id TEXT NOT NULL,
  visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (month_tag, visitor_id)
);
```

---

## ⚙️ 第二步：创建统计 Worker 并绑定 `mechanical-calculator-db`

由于前端托管若为纯静态 Assets-only Worker，Cloudflare 会禁用前端 Worker 的后台 Bindings 功能。因此推荐搭建独立的微型统计 Worker：

### 1. 新建统计 Worker
1. 在左侧菜单点击 **Compute** -> **Workers & Pages**；
2. 点击右上角 **Create** -> 选择 **`Start with Hello World!`**；
3. 为其命名（例如 **`mechanical-calculator-stats`** 或 **`work-stats`**），点击 **Deploy**。

### 2. 绑定专属 D1 数据库
1. 进入该统计 Worker 详情页；
2. 点击 **Settings** -> **Bindings**；
3. 点击 **Add binding** -> 选择 **D1 database**：
   * **Variable name（变量名）**：填 **`DB`**（必须大写字母 `DB`）；
   * **D1 database（数据库）**：下拉选择刚刚创建的 **`mechanical-calculator-db`**；
4. 点击 **Save and deploy (保存并部署)**。

### 3. 在线粘贴后端代码
点击该 Worker 页面右上角 **`</> Edit code`**，清空内容并粘贴以下代码后点击 **Deploy**：

```javascript
// 计算当前 ISO 周标签（如 2026-W39，以周一为起始日）
function getIsoWeekTag() {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// 计算当前自然月标签（如 2026-09）
function getMonthTag() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const weekTag = getIsoWeekTag();
    const monthTag = getMonthTag();

    // 1. POST 请求：独立访客去重录入
    if (request.method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const visitorId = body.visitorId;

        if (visitorId && typeof visitorId === 'string' && visitorId.length <= 64 && env.DB) {
          // 写入历史总访客
          await env.DB.prepare(`
            INSERT INTO unique_visitors (visitor_id, first_seen_at, last_seen_at)
            VALUES (?, datetime('now'), datetime('now'))
            ON CONFLICT(visitor_id) DO UPDATE SET last_seen_at = datetime('now')
          `).bind(visitorId).run();

          // 写入本周访客（按周去重）
          await env.DB.prepare(`
            INSERT INTO weekly_visitors (week_tag, visitor_id, visited_at)
            VALUES (?, ?, datetime('now'))
            ON CONFLICT(week_tag, visitor_id) DO UPDATE SET visited_at = datetime('now')
          `).bind(weekTag, visitorId).run();

          // 写入本月访客（按月去重）
          await env.DB.prepare(`
            INSERT INTO monthly_visitors (month_tag, visitor_id, visited_at)
            VALUES (?, ?, datetime('now'))
            ON CONFLICT(month_tag, visitor_id) DO UPDATE SET visited_at = datetime('now')
          `).bind(monthTag, visitorId).run();
        }
      } catch (err) {
        console.error('Record error:', err);
      }
    }

    // 2. 查询聚合统计数据
    let weekVisitors = 0;
    let monthVisitors = 0;
    let totalVisitors = 0;

    if (env.DB) {
      try {
        const [weekResult, monthResult, totalResult] = await Promise.all([
          env.DB.prepare('SELECT COUNT(*) as count FROM weekly_visitors WHERE week_tag = ?').bind(weekTag).first(),
          env.DB.prepare('SELECT COUNT(*) as count FROM monthly_visitors WHERE month_tag = ?').bind(monthTag).first(),
          env.DB.prepare('SELECT COUNT(*) as count FROM unique_visitors').first()
        ]);
        weekVisitors = Number(weekResult?.count || 0);
        monthVisitors = Number(monthResult?.count || 0);
        totalVisitors = Number(totalResult?.count || 0);
      } catch (err) {
        console.error('Query error:', err);
      }
    }

    return new Response(
      JSON.stringify({ weekVisitors, monthVisitors, totalVisitors, weekTag, monthTag }),
      { headers: corsHeaders }
    );
  }
};
```

部署成功后，复制上方的公网域名（例如：`https://mechanical-calculator-stats.marconie.workers.dev/`）。

---

## 🚀 第三步：配置前端地址与部署

1. 打开本项目中的 `src/utils/useVisitorStats.ts`；
2. 将 `STATS_API_URL` 替换为上一步获得的 Worker 地址：
   ```typescript
   const STATS_API_URL = 'https://mechanical-calculator-stats.marconie.workers.dev/';
   ```
3. 本地打包：
   ```bash
   npm run build
   ```
4. 将打包好的 `dist/` 目录部署到你的静态平台，即可实时显示独立的访客统计！

---

## 🔍 数据查询与运维 SQL

在 **`mechanical-calculator-db`** 的 Console 中可随时执行：

```sql
-- 查看当前概况
SELECT 
  (SELECT COUNT(*) FROM unique_visitors) AS total_uv,
  (SELECT COUNT(*) FROM weekly_visitors WHERE week_tag = '2026-W39') AS this_week_uv,
  (SELECT COUNT(*) FROM monthly_visitors WHERE month_tag = '2026-09') AS this_month_uv;

-- 查看最近 10 条独立访客
SELECT visitor_id, first_seen_at, last_seen_at 
FROM unique_visitors 
ORDER BY last_seen_at DESC 
LIMIT 10;

-- 清空测试数据
DELETE FROM unique_visitors;
DELETE FROM weekly_visitors;
DELETE FROM monthly_visitors;
```
