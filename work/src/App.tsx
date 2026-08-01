import { useState, useRef, useEffect } from 'react';
import ArcCalculator from './components/ArcCalculator';
import SpiralAngleCalculator from './components/SpiralAngleCalculator';
import SpeedCalculator from './components/SpeedCalculator';
import ThreeWireCalculator from './components/ThreeWireCalculator';
import ABRotationCalculator from './components/ABRotationCalculator';
import WormGearCalculator from './components/WormGearCalculator';
import MaxOffsetCalculator from './components/MaxOffsetCalculator';

function App() {
    const [calcType, setCalcType] = useState('1');
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

    return (
        <div className="app-container">
            <div className="top-links">
                <a href="https://niekun.net/" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-home"></i> <span className="link-text">首页</span>
                </a>
                <a href="https://blog.niekun.net/" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-blog"></i> <span className="link-text">博客</span>
                </a>
                <a href="https://blog.niekun.net/start-page.html" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-info-circle"></i> <span className="link-text">关于</span>
                </a>
            </div>

            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1>机械计算器</h1>
                </div>
                <div className={`sidebar-nav-wrapper ${canScrollLeft ? 'can-scroll-left' : ''} ${canScrollRight ? 'can-scroll-right' : ''}`}>
                    <nav className="sidebar-nav" ref={navRef} onScroll={checkScroll}>
                    <div className={`nav-item ${calcType === '1' ? 'active' : ''}`} onClick={() => setCalcType('1')}>
                        <i className="fas fa-circle-notch"></i>
                        <span>双圆弧参数</span>
                    </div>
                    <div className={`nav-item ${calcType === '2' ? 'active' : ''}`} onClick={() => setCalcType('2')}>
                        <i className="fas fa-wave-square"></i>
                        <span>螺旋升角</span>
                    </div>
                    <div className={`nav-item ${calcType === '3' ? 'active' : ''}`} onClick={() => setCalcType('3')}>
                        <i className="fas fa-tachometer-alt"></i>
                        <span>线速度 ↔ 转速</span>
                    </div>
                    <div className={`nav-item ${calcType === '4' ? 'active' : ''}`} onClick={() => setCalcType('4')}>
                        <i className="fas fa-ruler-combined"></i>
                        <span>三线计算终尺寸</span>
                    </div>
                    <div className={`nav-item ${calcType === '5' ? 'active' : ''}`} onClick={() => setCalcType('5')}>
                        <i className="fas fa-sync-alt"></i>
                        <span>AB旋转轴拟合</span>
                    </div>
                    <div className={`nav-item ${calcType === '6' ? 'active' : ''}`} onClick={() => setCalcType('6')}>
                        <i className="fas fa-cogs"></i>
                        <span>蜗杆加工数据</span>
                    </div>
                    <div className={`nav-item ${calcType === '7' ? 'active' : ''}`} onClick={() => setCalcType('7')}>
                        <i className="fas fa-arrows-alt-h"></i>
                        <span>砂轮杆最大偏移</span>
                    </div>
                    </nav>
                </div>
            </aside>

            <main className="main-content">
                <div style={{ display: calcType === '1' ? 'contents' : 'none' }}>
                    <ArcCalculator />
                </div>
                <div style={{ display: calcType === '2' ? 'contents' : 'none' }}>
                    <SpiralAngleCalculator />
                </div>
                <div style={{ display: calcType === '3' ? 'contents' : 'none' }}>
                    <SpeedCalculator />
                </div>
                <div style={{ display: calcType === '4' ? 'contents' : 'none' }}>
                    <ThreeWireCalculator />
                </div>
                <div style={{ display: calcType === '5' ? 'contents' : 'none' }}>
                    <ABRotationCalculator />
                </div>
                <div style={{ display: calcType === '6' ? 'contents' : 'none' }}>
                    <WormGearCalculator />
                </div>
                <div style={{ display: calcType === '7' ? 'contents' : 'none' }}>
                    <MaxOffsetCalculator />
                </div>

                <footer className="app-footer">
                    <p>&copy; {new Date().getFullYear()} 聂坤 版权所有</p>
                    <p>联系邮箱: <a href="mailto:me@niekun.net">me@niekun.net</a></p>
                </footer>
            </main>
        </div>
    );
}

export default App;
