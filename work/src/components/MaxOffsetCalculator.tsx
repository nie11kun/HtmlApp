import { useState, useRef } from 'react';
import Readout from './Readout';
import Notice from './Notice';

export default function MaxOffsetCalculator() {
    // Inputs
    const [workLength, setWorkLength] = useState('');
    const [workMinorDia, setWorkMinorDia] = useState('');
    const [ganDia, setGanDia] = useState('');
    const [ganAngle, setGanAngle] = useState('');

    // Outputs
    const [maxOffset, setMaxOffset] = useState('');
    const [error, setError] = useState('');

    const resultRef = useRef<HTMLDivElement>(null);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (window.innerWidth <= 640 && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCalculate = () => {
        const length = parseFloat(workLength);
        const minorDia = parseFloat(workMinorDia);
        const ganDiameter = parseFloat(ganDia);
        const ganAng = parseFloat(ganAngle);

        if (isNaN(length) || length <= 0 || isNaN(minorDia) || minorDia <= 0 || isNaN(ganDiameter) || ganDiameter <= 0 || isNaN(ganAng)) {
            setError("请输入正确的工件和砂轮杆参数（尺寸必须大于 0）");
            return;
        }

        const L1 = length * Math.tan(ganAng * Math.PI / 180);

        if (L1 + ganDiameter / 2 >= minorDia / 2) {
            setError("干涉：安装角度过大或尺寸设置不合理，砂轮杆在当前角度下会与工件小径发生干涉");
            setMaxOffset('');
            return;
        }

        const distance = Math.sqrt(Math.pow(minorDia / 2 - ganDiameter / 2, 2) - Math.pow(L1, 2));

        setError('');
        setMaxOffset(distance.toFixed(4));
        setTimeout(() => scrollToRef(resultRef), 100);
    };

    return (
        <div className="calc-panel large" key="max-offset-calculator">
            <div className="calc-note">
                <i className="fas fa-info-circle"></i>
                <p>
                    本模块主要针对<strong>螺母加工</strong>，用于计算砂轮杆相对工件中心所能允许的<strong>最大偏移距离</strong>。如果实际加工偏移超过此最大距离，砂轮杆就会碰到工件小径（发生干涉）。
                </p>
            </div>

            <div className="calc-split">
                {/* 分组 1: 输入参数 */}
                <div className="calc-card">
                    <h3 className="calc-card-head"><span className="card-tag">IN</span>输入参数</h3>

                    <div className="calc-group">
                        <label>工件长度 l (mm)</label>
                        <input
                            type="number"
                            className="calc-input"
                            placeholder="输入工件长度"
                            value={workLength}
                            onChange={e => setWorkLength(e.target.value)}
                        />
                    </div>

                    <div className="calc-group">
                        <label>工件小径 D₁ (mm)</label>
                        <input
                            type="number"
                            className="calc-input"
                            placeholder="输入工件小径"
                            value={workMinorDia}
                            onChange={e => setWorkMinorDia(e.target.value)}
                        />
                    </div>

                    <div className="calc-group">
                        <label>砂轮杆直径 d (mm)</label>
                        <input
                            type="number"
                            className="calc-input"
                            placeholder="输入砂轮杆直径"
                            value={ganDia}
                            onChange={e => setGanDia(e.target.value)}
                        />
                    </div>

                    <div className="calc-group">
                        <label>砂轮杆安装角 θ (度)</label>
                        <input
                            type="number"
                            className="calc-input"
                            placeholder="输入安装角"
                            value={ganAngle}
                            onChange={e => setGanAngle(e.target.value)}
                        />
                    </div>

                    <button className="calc-btn" onClick={handleCalculate}>
                        计算最大偏移 <i className="fas fa-arrow-right"></i>
                    </button>
                    <Notice msg={error} />
                </div>

                {/* 分组 2: 计算结果 */}
                <div ref={resultRef} className="calc-card is-out">
                    <h3 className="calc-card-head"><span className="card-tag">OUT</span>计算结果</h3>

                    <div className="calc-group">
                        <label>最大偏移量 e (mm)</label>
                        <Readout value={maxOffset} placeholder="—" />
                    </div>
                    <p className="calc-hint">实际偏移小于此值时，砂轮杆不会碰到工件小径。</p>
                </div>
            </div>
        </div>
    );
}
