// Cloudflare Pages / Worker Advanced Mode
// 机械计算器 (绑定 D1 数据库: mechanical-calculator-db)
// 独立访客统计服务（本周 / 本月 / 历史总访客去重统计）

// 计算当前 ISO 周标签（例如 "2026-W39"，按周一为起始日）
function getIsoWeekTag() {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// 计算当前自然月标签（例如 "2026-09"）
function getMonthTag() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export default {
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);

    // 允许根路径或 /api/visit 请求
    if (url.pathname === '/' || url.pathname === '/api/visit') {
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

      // 1. 如果是 POST 请求，进行独立访客去重录入
      if (request.method === 'POST') {
        try {
          const body = await request.json().catch(() => ({}));
          const visitorId = body.visitorId;

          if (visitorId && typeof visitorId === 'string' && visitorId.length <= 64 && env.DB) {
            // 写入历史总访客表
            await env.DB.prepare(`
              INSERT INTO unique_visitors (visitor_id, first_seen_at, last_seen_at)
              VALUES (?, datetime('now'), datetime('now'))
              ON CONFLICT(visitor_id) DO UPDATE SET last_seen_at = datetime('now')
            `).bind(visitorId).run();

            // 写入本周访客表（按周去重）
            await env.DB.prepare(`
              INSERT INTO weekly_visitors (week_tag, visitor_id, visited_at)
              VALUES (?, ?, datetime('now'))
              ON CONFLICT(week_tag, visitor_id) DO UPDATE SET visited_at = datetime('now')
            `).bind(weekTag, visitorId).run();

            // 写入本月访客表（按月去重）
            await env.DB.prepare(`
              INSERT INTO monthly_visitors (month_tag, visitor_id, visited_at)
              VALUES (?, ?, datetime('now'))
              ON CONFLICT(month_tag, visitor_id) DO UPDATE SET visited_at = datetime('now')
            `).bind(monthTag, visitorId).run();
          }
        } catch (err) {
          console.error('[Visitor API] Record visit error:', err);
        }
      }

      // 2. 查询当前本周、本月与历史总人数
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
          console.error('[Visitor API] Query stats error:', err);
        }
      }

      return new Response(
        JSON.stringify({
          weekVisitors,
          monthVisitors,
          totalVisitors,
          weekTag,
          monthTag
        }),
        { headers: corsHeaders }
      );
    }

    // 若有内置静态资源引擎（如 Pages Advanced Mode）则回退到静态文件
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
