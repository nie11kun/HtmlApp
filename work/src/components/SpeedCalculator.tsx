import { useState, useRef } from 'react';
import Notice from './Notice';

export default function SpeedCalculator() {
    const [dia, setDia] = useState('');
    const [linespeed, setLinespeed] = useState('');
    const [rotatespeed, setRotatespeed] = useState('');
    const [errA, setErrA] = useState('');
    const [errB, setErrB] = useState('');

    const group1Ref = useRef<HTMLDivElement>(null);
    const group2Ref = useRef<HTMLDivElement>(null);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (window.innerWidth <= 640 && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCalcLineSpeed = () => {
        const d = parseFloat(dia);
        const r = parseFloat(rotatespeed);
        if (d > 0 && r > 0) {
            setErrA(''); setErrB('');
            setLinespeed((r / 60 * (d * Math.PI) / 1000).toFixed(4));
            setTimeout(() => scrollToRef(group2Ref), 100);
        } else {
            setErrA("请输入大于 0 的砂轮直径和转速");
        }
    };

    const handleCalcRotateSpeed = () => {
        const d = parseFloat(dia);
        const l = parseFloat(linespeed);
        if (d > 0 && l > 0) {
            setErrA(''); setErrB('');
            setRotatespeed((l * 1000 / (d * Math.PI) * 60).toFixed(4));
            setTimeout(() => scrollToRef(group1Ref), 100);
        } else {
            setErrB("请输入大于 0 的砂轮直径和线速度");
        }
    };

    return (
        <div className="calc-panel large" key="speed-calculator">
            <div className="calc-card calc-base">
                <div className="calc-group">
                    <label>砂轮直径 (mm) <span className="label-aside">基准参数</span></label>
                    <input 
                        type="number" 
                        className="calc-input" 
                        placeholder="输入砂轮直径" 
                        value={dia}
                        onChange={e => setDia(e.target.value)}
                    />
                </div>
            </div>

            <div className="calc-split">
                {/* 组1: 输入转速 -> 算线速度 */}
                <div ref={group1Ref} className="calc-card">
                    <h3 className="calc-card-head"><span className="card-tag">A</span>求线速度<small>n → v</small></h3>
                    <div className="calc-group">
                        <label>已知转速 (转/分)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入砂轮转速" 
                            value={rotatespeed}
                            onChange={e => setRotatespeed(e.target.value)}
                        />
                    </div>
                    <button className="calc-btn" onClick={handleCalcLineSpeed}>
                        计算线速度 <i className="fas fa-arrow-right"></i>
                    </button>
                    <Notice msg={errA} />
                </div>

                {/* 组2: 输入线速度 -> 算转速 */}
                <div ref={group2Ref} className="calc-card is-b">
                    <h3 className="calc-card-head"><span className="card-tag">B</span>求转速<small>v → n</small></h3>
                    <div className="calc-group">
                        <label>已知线速度 (m/s)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入砂轮线速度" 
                            value={linespeed}
                            onChange={e => setLinespeed(e.target.value)}
                        />
                    </div>
                    <button className="calc-btn is-b" onClick={handleCalcRotateSpeed}>
                        计算转速 <i className="fas fa-arrow-right"></i>
                    </button>
                    <Notice msg={errB} />
                </div>
            </div>
        </div>
    );
}
