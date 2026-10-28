import { useState, useRef, useEffect } from 'react';
import { useVisitorStats } from './utils/useVisitorStats';
import { TOOLS, type ToolId } from './tools';
import Schematic from './components/Schematic';
import Crosshair from './components/Crosshair';
import ArcCalculator from './components/ArcCalculator';
import SpiralAngleCalculator from './components/SpiralAngleCalculator';
import SpeedCalculator from './components/SpeedCalculator';
import ThreeWireCalculator from './components/ThreeWireCalculator';
import ABRotationCalculator from './components/ABRotationCalculator';
import WormGearCalculator from './components/WormGearCalculator';
import MaxOffsetCalculator from './components/MaxOffsetCalculator';

const PANELS: Record<ToolId, () => React.JSX.Element> = {
    '1': ArcCalculator,
    '2': SpiralAngleCalculator,
    '3': SpeedCalculator,
    '4': ThreeWireCalculator,
    '5': ABRotationCalculator,
    '6': WormGearCalculator,
    '7': MaxOffsetCalculator,
};

const LINKS = [
    { href: 'https://niekun.net/', label: '首页', icon: 'fa-home' },
    { href: 'https://blog.niekun.net/', label: '博客', icon: 'fa-blog' },
    { href: 'https://blog.niekun.net/start-page.html', label: '关于', icon: 'fa-info-circle' },
];

function BrandMark() {
    return (
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="11.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
            <circle cx="16" cy="16" r="4" fill="none" stroke="currentColor" strokeWidth="1.25" />
            <path d="M16 1.5v6M16 24.5v6M1.5 16h6M24.5 16h6" stroke="currentColor" strokeWidth="1.25" />
            <circle cx="24.1" cy="7.9" r="2.2" fill="var(--accent)" />
        </svg>
    );
}

function App() {
    const [calcType, setCalcType] = useState<ToolId>('1');
    const stats = useVisitorStats();
    const navRef = useRef<HTMLElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (navRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const tool = TOOLS.find(t => t.id === calcType)!;
    const index = TOOLS.indexOf(tool) + 1;
    const fmt = (n: number | null) => (stats.loading ? '···' : n !== null ? n.toLocaleString() : '--');

    const selectTool = (id: ToolId, el: HTMLElement) => {
        setCalcType(id);
        if (window.innerWidth <= 900) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    return (
        <div className="app">
            <div className="backdrop" aria-hidden="true" />
            <div className="grain" aria-hidden="true" />
            <Crosshair />

            <aside className="rail">
                <a className="brand" href="./" aria-label="机械计算器 首页">
                    <BrandMark />
                    <span className="brand-name">机械计算器</span>
                    <span className="brand-sub">MECH/CALC</span>
                </a>

                <p className="rail-intro">七把数字量具，<br />给机床旁的你。</p>

                <div className={`tool-nav-wrap ${canScrollLeft ? 'can-left' : ''} ${canScrollRight ? 'can-right' : ''}`}>
                    <nav className="tool-nav" ref={navRef} onScroll={checkScroll} aria-label="计算工具">
                        {TOOLS.map((t, i) => (
                            <button
                                key={t.id}
                                type="button"
                                className={`tool-link ${calcType === t.id ? 'active' : ''}`}
                                aria-current={calcType === t.id ? 'page' : undefined}
                                onClick={e => selectTool(t.id, e.currentTarget)}
                            >
                                <span className="tool-index">{String(i + 1).padStart(2, '0')}</span>
                                <span className="tool-label">{t.nav}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="rail-meta">
                    <div className="rail-links">
                        {LINKS.map(l => (
                            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label}>
                                <i className={`fas ${l.icon}`} aria-hidden="true"></i>
                                <span>{l.label}</span>
                            </a>
                        ))}
                    </div>
                    <p className="rail-note">纯前端计算 · 数据不出浏览器</p>
                </div>
            </aside>

            <main className="main">
                <header className="tool-head" key={calcType}>
                    <div className="tool-copy">
                        <p className="eyebrow">
                            <span>Tool {String(index).padStart(2, '0')} / {String(TOOLS.length).padStart(2, '0')}</span>
                            <span className="eyebrow-rule" />
                            <span>{tool.tag}</span>
                        </p>
                        <h1 className="tool-title"><span>{tool.title}</span></h1>
                        <p className="tool-desc">{tool.desc}</p>
                        <p className="tool-formula"><span className="formula-tag">f</span>{tool.formula}</p>
                    </div>
                    <div className="tool-figure">
                        <Schematic id={calcType} />
                        <p className="figure-caption">
                            <span>Fig. {String(index).padStart(2, '0')}</span>
                            <span>Schematic</span>
                            <span>NTS</span>
                        </p>
                    </div>
                </header>

                {TOOLS.map(t => {
                    const Panel = PANELS[t.id];
                    return (
                        <section key={t.id} className="panel-slot" hidden={calcType !== t.id} aria-label={t.title}>
                            <Panel />
                        </section>
                    );
                })}

                <footer className="site-foot">
                    <div className="foot-stats" aria-label="访客统计">
                        <span className="live-dot" aria-hidden="true" />
                        <span className="stat"><span className="stat-label">本周</span><span className="stat-num">{fmt(stats.weekVisitors)}</span></span>
                        <span className="stat"><span className="stat-label">本月</span><span className="stat-num">{fmt(stats.monthVisitors)}</span></span>
                        <span className="stat"><span className="stat-label">累计</span><span className="stat-num">{fmt(stats.totalVisitors)}</span></span>
                        <span className="stat-unit">位访客</span>
                    </div>
                    <p className="foot-copy">
                        &copy; {new Date().getFullYear()} <a href="https://niekun.net/" target="_blank" rel="noopener noreferrer">聂坤</a> 版权所有
                    </p>
                </footer>
            </main>
        </div>
    );
}

export default App;
