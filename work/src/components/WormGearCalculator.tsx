import { useState, useRef } from 'react';
import Readout from './Readout';
import Notice from './Notice';

export default function WormGearCalculator() {
    // Inputs
    const [moduleValue, setModuleValue] = useState('');
    const [threads, setThreads] = useState('');
    const [diameter, setDiameter] = useState('');

    // Outputs
    const [pitch, setPitch] = useState('');
    const [lead, setLead] = useState('');
    const [leadAngle, setLeadAngle] = useState('');
    const [error, setError] = useState('');

    const resultRef = useRef<HTMLDivElement>(null);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (window.innerWidth <= 640 && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCalculate = () => {
        const m = parseFloat(moduleValue);
        const z = parseInt(threads, 10);
        const d = parseFloat(diameter);

        if (m > 0 && z >= 1 && d > 0) {
            const p = m * Math.PI;
            const L = p * z;
            const gamma = Math.atan(L / (Math.PI * d)) * (180 / Math.PI);

            setError('');
            setPitch(p.toFixed(4));
            setLead(L.toFixed(4));
            setLeadAngle(gamma.toFixed(4));

            setTimeout(() => scrollToRef(resultRef), 100);
        } else {
            setError("请输入大于 0 的模数、分度圆直径，以及正整数头数");
        }
    };

    return (
        <div className="calc-panel large" key="worm-gear-calculator">
            <div className="calc-split">
                {/* 分组 1: 输入参数 */}
                <div className="calc-card">
                    <h3 className="calc-card-head"><span className="card-tag">IN</span>输入参数</h3>

                    <div className="calc-group">
                        <label>模数 (m)</label>
                        <input
                            type="number"
                            className="calc-input"
                            placeholder="输入模数"
                            value={moduleValue}
                            onChange={e => setModuleValue(e.target.value)}
                        />
                    </div>

                    <div className="calc-group">
                        <label>头数 (z)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="calc-input"
                            placeholder="输入正整数头数"
                            value={threads}
                            onChange={e => setThreads(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>

                    <div className="calc-group">
                        <label>分度圆直径 (d, mm)</label>
                        <input
                            type="number"
                            className="calc-input"
                            placeholder="输入分度圆直径"
                            value={diameter}
                            onChange={e => setDiameter(e.target.value)}
                        />
                    </div>

                    <button className="calc-btn" onClick={handleCalculate}>
                        计算加工数据 <i className="fas fa-arrow-right"></i>
                    </button>
                    <Notice msg={error} />
                </div>

                {/* 分组 2: 计算结果 */}
                <div ref={resultRef} className="calc-card is-out">
                    <h3 className="calc-card-head"><span className="card-tag">OUT</span>计算结果</h3>

                    <div className="calc-group">
                        <label>齿距 (p, mm)</label>
                        <Readout value={pitch} placeholder="—" />
                    </div>

                    <div className="calc-group">
                        <label>导程 (L, mm)</label>
                        <Readout value={lead} placeholder="—" />
                    </div>

                    <div className="calc-group">
                        <label>导程角 (γ, 度)</label>
                        <Readout value={leadAngle} placeholder="—" />
                    </div>
                </div>
            </div>
        </div>
    );
}
