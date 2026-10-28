import { useState, useRef } from 'react';
import Notice from './Notice';

export default function ArcCalculator() {
    const [coeValue, setCoeValue] = useState('1.11');
    const [ballDia, setBallDia] = useState('');
    const [touchAng, setTouchAng] = useState('');
    const [arcRadius, setArcRadius] = useState('');
    const [horiOffset, setHoriOffset] = useState('');
    const [verOffset, setVerOffset] = useState('');
    const [errA, setErrA] = useState('');
    const [errB, setErrB] = useState('');

    // 计算结果按 4 位小数显示，但保留未舍入的值：字段未被改动时，另一方向直接用原值计算，正反来回不累积舍入误差
    const exact = useRef<Record<string, { shown: string; value: number }>>({});
    const show = (key: string, value: number, set: (v: string) => void) => {
        const shown = value.toFixed(4);
        exact.current[key] = { shown, value };
        set(shown);
    };
    const read = (key: string, str: string) => {
        const e = exact.current[key];
        return e && e.shown === str ? e.value : parseFloat(str);
    };

    const forwardRef = useRef<HTMLDivElement>(null);
    const reverseRef = useRef<HTMLDivElement>(null);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (window.innerWidth <= 640 && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCalculate = () => {
        const coe = parseFloat(coeValue);
        const bd = read('bd', ballDia);
        const ta = read('ta', touchAng);
        if (isNaN(coe) || coe <= 0) {
            setErrA("标准系数错误，请输入大于 0 的系数");
            return;
        }
        if (bd > 0 && ta > 0 && ta < 90) {
            const radius = (coe * bd / 2);
            const ho = (radius - bd / 2) * Math.sin(ta * Math.PI / 180);
            const vo = (radius - bd / 2) * Math.cos(ta * Math.PI / 180);
            setErrA('');
            setErrB('');
            show('r', radius, setArcRadius);
            show('ho', ho, setHoriOffset);
            show('vo', vo, setVerOffset);
            setTimeout(() => scrollToRef(reverseRef), 100);
        } else {
            setErrA("请检查钢球直径 / 接触角：直径需大于 0，接触角需在 0–90° 之间");
        }
    };

    const handleReCalculate = () => {
        const coe = parseFloat(coeValue);
        const ho = read('ho', horiOffset);
        const radius = read('r', arcRadius);

        if (isNaN(coe) || coe <= 0) {
            setErrB("标准系数错误（请在左侧正向计算面板中设置）");
            return;
        }

        if (ho > 0 && radius > 0) {
            const bd = (radius / coe * 2);
            const ta = Math.asin(ho / (radius - bd / 2)) * (180 / Math.PI);

            // 先校验再写回，避免无解时把正向面板已有的输入改成 NaN
            if (isNaN(ta)) {
                setErrB("接触角不存在：水平偏心不能大于 圆弧半径 − 钢球半径，请检查圆弧半径 / 偏心");
                return;
            }

            const calculatedVo = (radius - bd / 2) * Math.cos(ta * Math.PI / 180);
            setErrA('');
            setErrB('');
            show('bd', bd, setBallDia);
            show('ta', ta, setTouchAng);
            show('vo', calculatedVo, setVerOffset);
            setTimeout(() => scrollToRef(forwardRef), 100);
        } else {
            setErrB("请检查圆弧半径 / 水平偏心，两者都需大于 0");
        }
    };

    const PRESET_COES = ['1.15', '1.14', '1.13', '1.12', '1.11', '1.10', '1.09', '1.08', '1.07', '1.06', '1.05'];

    return (
        <div className="calc-panel large" key="arc-calculator">
            <div className="calc-split">
                {/* 分组 1: 正向计算 */}
                <div ref={forwardRef} className="calc-card">
                    <h3 className="calc-card-head"><span className="card-tag">A</span>正向计算<small>求圆弧参数</small></h3>
                    
                    <div className="calc-group">
                        <label>标准系数 (可选择或输入)</label>
                        <div className="calc-inline">
                            <select 
                                className="calc-input" 
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
                                placeholder="输入系数" 
                                value={coeValue}
                                onChange={e => setCoeValue(e.target.value)}
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="calc-group">
                        <label>钢球直径 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入钢球直径" 
                            value={ballDia}
                            onChange={e => setBallDia(e.target.value)}
                        />
                    </div>
                    
                    <div className="calc-group">
                        <label>接触角 (度)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入接触角" 
                            value={touchAng}
                            onChange={e => setTouchAng(e.target.value)}
                        />
                    </div>

                    <button className="calc-btn" onClick={handleCalculate}>
                        计算圆弧参数 <i className="fas fa-arrow-right"></i>
                    </button>
                    <Notice msg={errA} />
                    
                    {/* Hidden spacer to align buttons perfectly on desktop */}
                    <div className="calc-hint is-ghost" aria-hidden="true">
                        <i className="fas fa-info-circle"></i>
                        <span>仅需输入圆弧半径和水平偏心即可反算参数</span>
                    </div>
                </div>

                {/* 分组 2: 反向推算 */}
                <div ref={reverseRef} className="calc-card is-b">
                    <h3 className="calc-card-head"><span className="card-tag">B</span>反向推算<small>求钢球 / 接触角</small></h3>
                    
                    <div className="calc-group">
                        <label>圆弧半径 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入圆弧半径" 
                            value={arcRadius}
                            onChange={e => setArcRadius(e.target.value)}
                        />
                    </div>

                    <div className="calc-group">
                        <label>水平偏心 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入水平偏心" 
                            value={horiOffset}
                            onChange={e => setHoriOffset(e.target.value)}
                        />
                    </div>
                    
                    <div className="calc-group">
                        <label>垂直偏心 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入垂直偏心" 
                            value={verOffset}
                            onChange={e => setVerOffset(e.target.value)}
                        />
                    </div>
                    <button className="calc-btn is-b" onClick={handleReCalculate}>
                        <i className="fas fa-arrow-left"></i> 反算钢球与接触角
                    </button>
                    <Notice msg={errB} />

                    <div className="calc-hint">
                        <i className="fas fa-info-circle"></i>
                        <span>仅需输入圆弧半径和水平偏心即可反算参数</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
