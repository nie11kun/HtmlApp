import { useState, useRef } from 'react';

export default function WormGearCalculator() {
    // Inputs
    const [moduleValue, setModuleValue] = useState('');
    const [threads, setThreads] = useState('');
    const [diameter, setDiameter] = useState('');

    // Outputs
    const [pitch, setPitch] = useState('');
    const [lead, setLead] = useState('');
    const [leadAngle, setLeadAngle] = useState('');

    const resultRef = useRef<HTMLDivElement>(null);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (window.innerWidth <= 768 && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCalculate = () => {
        const m = parseFloat(moduleValue);
        const z = parseFloat(threads);
        const d = parseFloat(diameter);

        if (m > 0 && z > 0 && d > 0) {
            const p = m * Math.PI;
            const L = p * z;
            const gamma = Math.atan(L / (Math.PI * d)) * (180 / Math.PI);

            setPitch(p.toFixed(4));
            setLead(L.toFixed(4));
            setLeadAngle(gamma.toFixed(4));
            
            setTimeout(() => scrollToRef(resultRef), 100);
        } else {
            alert("请输入正确的模数、头数和分度圆直径");
        }
    };

    return (
        <div className="calc-panel large" key="worm-gear-calculator">
            <h2 className="calc-title">蜗杆加工数据计算</h2>
            
            <div className="calc-row" style={{ gap: '2rem' }}>
                {/* 分组 1: 输入参数 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>输入参数</h3>
                    
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>模数 (m)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入模数" 
                            value={moduleValue}
                            onChange={e => setModuleValue(e.target.value)}
                        />
                    </div>

                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>头数 (z)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入头数" 
                            value={threads}
                            onChange={e => setThreads(e.target.value)}
                        />
                    </div>
                    
                    <div className="calc-group" style={{ marginBottom: '1.5rem' }}>
                        <label>分度圆直径 (d, mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入分度圆直径" 
                            value={diameter}
                            onChange={e => setDiameter(e.target.value)}
                        />
                    </div>

                    <button className="calc-btn" style={{ width: '100%', marginTop: 'auto', flex: 'none' }} onClick={handleCalculate}>
                        计算加工数据 <i className="fas fa-calculator"></i>
                    </button>
                </div>

                {/* 分组 2: 计算结果 */}
                <div ref={resultRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)', marginBottom: '1rem', textAlign: 'center' }}>计算结果</h3>
                    
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>齿距 (p, mm)</label>
                        <input 
                            type="text" 
                            className="calc-input" 
                            style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}
                            value={pitch}
                            readOnly
                        />
                    </div>

                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>导程 (L, mm)</label>
                        <input 
                            type="text" 
                            className="calc-input" 
                            style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}
                            value={lead}
                            readOnly
                        />
                    </div>
                    
                    <div className="calc-group" style={{ marginBottom: '1.5rem' }}>
                        <label>导程角 (γ, 度)</label>
                        <input 
                            type="text" 
                            className="calc-input" 
                            style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}
                            value={leadAngle}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
