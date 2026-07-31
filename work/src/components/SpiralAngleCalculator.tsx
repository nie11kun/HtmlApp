import { useState } from 'react';

export default function SpiralAngleCalculator() {
    const [pinch, setPinch] = useState('');
    const [dia, setDia] = useState('');
    const [rotateAng, setRotateAng] = useState('');

    const handleCalculate = () => {
        const p = parseFloat(pinch);
        const d = parseFloat(dia);

        if (p > 0 && d > 0) {
            const result = (Math.atan(p / (Math.PI * d)) * (180 / Math.PI)).toFixed(3);
            setRotateAng(result);
        } else {
            alert("请检查螺距/中径是否正确");
        }
    };

    return (
        <div className="calc-panel" key="spiral-calculator">
            <h2 className="calc-title">螺旋升角计算</h2>
            
            <div className="calc-row">
                <div className="calc-group">
                    <label>导程</label>
                    <input 
                        type="number" 
                        className="calc-input" 
                        placeholder="输入工件导程" 
                        value={pinch}
                        onChange={e => setPinch(e.target.value)}
                    />
                </div>
                <div className="calc-group">
                    <label>中径</label>
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
                <label>螺旋升角 (度)</label>
                <input 
                    type="text" 
                    className="calc-input highlight" 
                    placeholder="点击计算查看结果" 
                    disabled
                    value={rotateAng}
                />
            </div>

            <div className="btn-container">
                <button className="calc-btn" onClick={handleCalculate}>
                    <i className="fas fa-calculator"></i> 计算
                </button>
            </div>
        </div>
    );
}
