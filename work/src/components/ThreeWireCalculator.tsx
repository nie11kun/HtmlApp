import { useState } from 'react';
import Readout from './Readout';
import Notice from './Notice';

export default function ThreeWireCalculator() {
    const [workDia, setWorkDia] = useState('');
    const [workSanXian, setWorkSanXian] = useState('');
    const [workGangQiuDia, setWorkGangQiuDia] = useState('');
    const [workZhong, setWorkZhong] = useState('');
    const [error, setError] = useState('');

    const handleCalculate = () => {
        const d = parseFloat(workDia);
        const s = parseFloat(workSanXian);
        const g = parseFloat(workGangQiuDia);

        if (d > 0 && s > 0 && g > 0) {
            setError('');
            // 与其他工具一致保留 4 位小数，避免 1.5000000000000007 这类浮点噪声
            setWorkZhong(((d - s) / 2 + g).toFixed(4));
        } else {
            setError("请检查工件外径、三线测量值和钢球直径，三者都需大于 0");
        }
    };

    return (
        <div className="calc-panel" key="threewire-calculator">
            <div className="calc-row">
                <div className="calc-group">
                    <label>工件外径 D</label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="输入工件外径"
                        value={workDia}
                        onChange={e => setWorkDia(e.target.value)}
                    />
                </div>
                <div className="calc-group">
                    <label>三线测量 M</label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="输入三线测量值"
                        value={workSanXian}
                        onChange={e => setWorkSanXian(e.target.value)}
                    />
                </div>
            </div>

            <div className="calc-group">
                <label>钢球直径 dw</label>
                <input
                    type="number"
                    className="calc-input"
                    placeholder="输入钢球直径"
                    value={workGangQiuDia}
                    onChange={e => setWorkGangQiuDia(e.target.value)}
                />
            </div>

            <hr className="calc-divider" />

            <div className="calc-group">
                <label>终尺寸 H</label>
                <Readout value={workZhong} />
            </div>

            <Notice msg={error} />

            <div className="btn-container">
                <button className="calc-btn" onClick={handleCalculate}>
                    <i className="fas fa-calculator"></i> 计算
                </button>
            </div>
        </div>
    );
}
