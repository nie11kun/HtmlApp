import { useState, useRef } from 'react';

export default function SpeedCalculator() {
    const [dia, setDia] = useState('');
    const [linespeed, setLinespeed] = useState('');
    const [rotatespeed, setRotatespeed] = useState('');

    const group1Ref = useRef<HTMLDivElement>(null);
    const group2Ref = useRef<HTMLDivElement>(null);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (window.innerWidth <= 768 && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCalcLineSpeed = () => {
        const d = parseFloat(dia);
        const r = parseFloat(rotatespeed);
        if (d > 0 && r > 0) {
            setLinespeed((r / 60 * (d * Math.PI) / 1000).toFixed(3));
            setTimeout(() => scrollToRef(group2Ref), 100);
        } else {
            alert("请输入正确的直径和转速");
        }
    };

    const handleCalcRotateSpeed = () => {
        const d = parseFloat(dia);
        const l = parseFloat(linespeed);
        if (d > 0 && l > 0) {
            setRotatespeed((l * 1000 / (d * Math.PI) * 60).toFixed(3));
            setTimeout(() => scrollToRef(group1Ref), 100);
        } else {
            alert("请输入正确的直径和线速度");
        }
    };

    return (
        <div className="calc-panel large" key="speed-calculator">
            <h2 className="calc-title">线速度 ↔ 转速计算</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <div className="calc-group">
                    <label>砂轮直径 (mm) <span style={{color:'var(--text-muted)'}}>- 基准参数</span></label>
                    <input 
                        type="number" 
                        className="calc-input" 
                        placeholder="输入砂轮直径" 
                        value={dia}
                        onChange={e => setDia(e.target.value)}
                    />
                </div>
            </div>

            <div className="calc-row" style={{ gap: '2rem' }}>
                {/* 组1: 输入转速 -> 算线速度 */}
                <div ref={group1Ref} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>求线速度</h3>
                    <div className="calc-group" style={{ marginBottom: '1.5rem' }}>
                        <label>已知转速 (转/分)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入砂轮转速" 
                            value={rotatespeed}
                            onChange={e => setRotatespeed(e.target.value)}
                        />
                    </div>
                    <button className="calc-btn" style={{ width: '100%' }} onClick={handleCalcLineSpeed}>
                        计算线速度 <i className="fas fa-arrow-right"></i>
                    </button>
                </div>

                {/* 组2: 输入线速度 -> 算转速 */}
                <div ref={group2Ref} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)', marginBottom: '1rem', textAlign: 'center' }}>求转速</h3>
                    <div className="calc-group" style={{ marginBottom: '1.5rem' }}>
                        <label>已知线速度 (m/s)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入砂轮线速度" 
                            value={linespeed}
                            onChange={e => setLinespeed(e.target.value)}
                        />
                    </div>
                    <button className="calc-btn" style={{ width: '100%', background: 'var(--accent-secondary)' }} onClick={handleCalcRotateSpeed}>
                        计算转速 <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
