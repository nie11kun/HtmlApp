import { useState, useRef } from 'react';

export default function ArcCalculator() {
    const [coeValue, setCoeValue] = useState('1.11');
    const [ballDia, setBallDia] = useState('');
    const [touchAng, setTouchAng] = useState('');
    const [arcRadius, setArcRadius] = useState('');
    const [horiOffset, setHoriOffset] = useState('');
    const [verOffset, setVerOffset] = useState('');

    const forwardRef = useRef<HTMLDivElement>(null);
    const reverseRef = useRef<HTMLDivElement>(null);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (window.innerWidth <= 768 && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCalculate = () => {
        const coe = parseFloat(coeValue);
        const bd = parseFloat(ballDia);
        const ta = parseFloat(touchAng);
        if (isNaN(coe) || coe <= 0) {
            alert("标准系数错误");
            return;
        }
        if (bd > 0 && ta > 0 && ta < 90) {
            const radius = (coe * bd / 2);
            const ho = (radius - bd / 2) * Math.sin(ta * Math.PI / 180);
            const vo = (radius - bd / 2) * Math.cos(ta * Math.PI / 180);
            setArcRadius(radius.toFixed(4));
            setHoriOffset(ho.toFixed(4));
            setVerOffset(vo.toFixed(4));
            setTimeout(() => scrollToRef(reverseRef), 100);
        } else {
            alert("请检查钢球直径/接触角是否正确");
        }
    };

    const handleReCalculate = () => {
        const coe = parseFloat(coeValue);
        const ho = parseFloat(horiOffset);
        const radius = parseFloat(arcRadius);

        if (isNaN(coe) || coe <= 0) {
            alert("标准系数错误 (请在左侧正向计算面板中设置)");
            return;
        }

        if (ho > 0 && radius > 0) {
            const bd = (radius / coe * 2);
            const ta = Math.asin(ho / (radius - bd / 2)) * (180 / Math.PI);
            const calculatedVo = (radius - bd / 2) * Math.cos(ta * Math.PI / 180);
            
            setBallDia(bd.toFixed(4));
            setTouchAng(ta.toFixed(4));
            setVerOffset(calculatedVo.toFixed(4));

            if (isNaN(ta)) {
                alert("接触角不存在，请检查圆弧半径/偏心是否正确");
            } else {
                setTimeout(() => scrollToRef(forwardRef), 100);
            }
        } else {
            alert("请检查圆弧半径/水平偏心是否正确");
        }
    };

    const PRESET_COES = ['1.15', '1.14', '1.13', '1.12', '1.11', '1.10', '1.09', '1.08', '1.07', '1.06', '1.05'];

    return (
        <div className="calc-panel large" key="arc-calculator">
            <h2 className="calc-title">双圆弧参数计算</h2>
            
            <div className="calc-row" style={{ gap: '2rem' }}>
                {/* 分组 1: 正向计算 */}
                <div ref={forwardRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>正向计算 (求圆弧参数)</h3>
                    
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>标准系数 (可选择或输入)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select 
                                className="calc-input" 
                                style={{ flex: 1 }}
                                value={PRESET_COES.includes(coeValue) ? coeValue : 'custom'} 
                                onChange={e => {
                                    if(e.target.value !== 'custom') setCoeValue(e.target.value);
                                }}
                            >
                                {PRESET_COES.map(val => (
                                    <option key={val} value={val}>系数: {val}</option>
                                ))}
                                <option value="custom" disabled hidden>自定义</option>
                            </select>
                            <input 
                                type="number" 
                                className="calc-input" 
                                style={{ flex: 1 }}
                                placeholder="输入系数" 
                                value={coeValue}
                                onChange={e => setCoeValue(e.target.value)}
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>钢球直径 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入钢球直径" 
                            value={ballDia}
                            onChange={e => setBallDia(e.target.value)}
                        />
                    </div>
                    
                    <div className="calc-group" style={{ marginBottom: '1.5rem' }}>
                        <label>接触角 (度)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入接触角" 
                            value={touchAng}
                            onChange={e => setTouchAng(e.target.value)}
                        />
                    </div>

                    <button className="calc-btn" style={{ width: '100%', marginTop: 'auto', flex: 'none' }} onClick={handleCalculate}>
                        计算圆弧参数 <i className="fas fa-arrow-right"></i>
                    </button>
                    
                    {/* Hidden spacer to align buttons perfectly on desktop */}
                    <div style={{ marginTop: '1rem', visibility: 'hidden', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-info-circle"></i>
                        <span>仅需输入圆弧半径和水平偏心即可反算参数</span>
                    </div>
                </div>

                {/* 分组 2: 反向推算 */}
                <div ref={reverseRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)', marginBottom: '1rem', textAlign: 'center' }}>反向推算 (求钢球/接触角)</h3>
                    
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>圆弧半径 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入圆弧半径" 
                            value={arcRadius}
                            onChange={e => setArcRadius(e.target.value)}
                        />
                    </div>

                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>水平偏心 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入水平偏心" 
                            value={horiOffset}
                            onChange={e => setHoriOffset(e.target.value)}
                        />
                    </div>
                    
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>垂直偏心 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入垂直偏心" 
                            value={verOffset}
                            onChange={e => setVerOffset(e.target.value)}
                        />
                    </div>
                    <button className="calc-btn" style={{ width: '100%', background: 'var(--accent-secondary)', marginTop: 'auto', flex: 'none' }} onClick={handleReCalculate}>
                        <i className="fas fa-arrow-left"></i> 反算钢球与接触角
                    </button>

                    <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-info-circle" style={{ color: 'var(--accent-secondary)' }}></i>
                        <span>仅需输入圆弧半径和水平偏心即可反算参数</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
