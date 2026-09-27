import { useState, useEffect } from 'react';

export interface VisitorStats {
  weekVisitors: number | null;
  monthVisitors: number | null;
  totalVisitors: number | null;
  loading: boolean;
}

/**
 * 统计 API 地址配置：
 * - 若使用独立 Cloudflare Worker，填入完整 Worker 域名，例如：'https://work-stats.<your-account>.workers.dev/'
 * - 若使用同域路由转发，保留默认：'/api/visit'
 */
const STATS_API_URL = 'https://mechanical-calculator-stats.marconie.workers.dev/';

/**
 * 访客统计 Hook
 * - 本地生成并持久化匿名 Visitor ID (localStorage)
 * - 单次 Session 仅执行一次 POST 上报，后续页面切换仅读取
 * - 兼顾异常捕获与开发环境 Mock 降级展示
 */
export function useVisitorStats(): VisitorStats {
  const [stats, setStats] = useState<VisitorStats>({
    weekVisitors: null,
    monthVisitors: null,
    totalVisitors: null,
    loading: true
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    async function syncStats() {
      try {
        // 1. 获取或生成匿名 Visitor ID
        let visitorId = localStorage.getItem('work_vid');
        if (!visitorId) {
          visitorId = 'v_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
          localStorage.setItem('work_vid', visitorId);
        }

        // 2. 判断当前会话是否已完成过写入上报
        const hasReportedThisSession = sessionStorage.getItem('work_session_reported') === '1';
        const method = hasReportedThisSession ? 'GET' : 'POST';

        const res = await fetch(STATS_API_URL, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: method === 'POST' ? JSON.stringify({ visitorId }) : undefined
        });

        if (!res.ok) {
          if (isMounted) {
            setStats({
              weekVisitors: import.meta.env.DEV ? 24 : null,
              monthVisitors: import.meta.env.DEV ? 88 : null,
              totalVisitors: import.meta.env.DEV ? 1260 : null,
              loading: false
            });
          }
          return;
        }

        const data = await res.json();
        if (isMounted) {
          setStats({
            weekVisitors: typeof data.weekVisitors === 'number' ? data.weekVisitors : 0,
            monthVisitors: typeof data.monthVisitors === 'number' ? data.monthVisitors : 0,
            totalVisitors: typeof data.totalVisitors === 'number' ? data.totalVisitors : 0,
            loading: false
          });
          sessionStorage.setItem('work_session_reported', '1');
        }
      } catch (_err) {
        if (isMounted) {
          setStats({
            weekVisitors: import.meta.env.DEV ? 24 : null,
            monthVisitors: import.meta.env.DEV ? 88 : null,
            totalVisitors: import.meta.env.DEV ? 1260 : null,
            loading: false
          });
        }
      }
    }

    syncStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return stats;
}
