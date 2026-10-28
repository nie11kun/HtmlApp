import { useState } from 'react';
import Readout from './Readout';
import Notice from './Notice';

export default function SpiralAngleCalculator() {
    const [pinch, setPinch] = useState('');
    const [dia, setDia] = useState('');
    const [rotateAng, setRotateAng] = useState('');
    const [error, setError] = useState('');

    const handleCalculate = () => {
        const p = parseFloat(pinch);
        const d = parseFloat(dia);

        if (p > 0 && d > 0) {
            const result = (Math.atan(p / (Math.PI * d)) * (180 / Math.PI)).toFixed(4);
            setError('');
            setRotateAng(result);
        } else {
            setError("请检查导程 / 中径，两者都需大于 0");
        }
    };

    return (
        <div className="calc-panel" key="spiral-calculator">
            <div className="calc-row">
                <div className="calc-group">
                    <label>导程 Ph (mm)</label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="输入工件导程"
                        value={pinch}
                        onChange={e => setPinch(e.target.value)}
                    />
                </div>
                <div className="calc-group">
                    <label>中径 d₂ (mm)</label>
                    <input
                        type="number"
                        className="calc-input"
                        placeholder="输入工件中径"
                        value={dia}
                        onChange={e => setDia(e.target.value)}
                    />
                </div>
            </div>

            <hr className="calc-divider" />

            <div className="calc-group">
                <label>螺旋升角 λ (度)</label>
                <Readout value={rotateAng} />
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
