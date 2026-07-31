import { useState } from 'react';

export default function ThreeWireCalculator() {
    const [workDia, setWorkDia] = useState('');
    const [workSanXian, setWorkSanXian] = useState('');
    const [workGangQiuDia, setWorkGangQiuDia] = useState('');
    const [workZhong, setWorkZhong] = useState('');

    const handleCalculate = () => {
        const d = parseFloat(workDia);
        const s = parseFloat(workSanXian);
        const g = parseFloat(workGangQiuDia);

        if (d > 0 && s > 0 && g > 0) {
            setWorkZhong(((d - s) / 2 + g).toString());
        } else {
            alert("请检查参数是否正确");
        }
    };

    return (
        <div className="calc-panel" key="threewire-calculator">
            <h2 className="calc-title">三线计算终尺寸</h2>
            
            <div className="calc-row">
                <div className="calc-group">
                    <label>工件外径</label>
                    <input 
                        type="number" 
                        className="calc-input" 
                        placeholder="输入工件外径" 
                        value={workDia}
                        onChange={e => setWorkDia(e.target.value)}
                    />
                </div>
                <div className="calc-group">
                    <label>三线测量</label>
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
                <label>钢球直径</label>
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
                <label>终尺寸H</label>
                <input 
                    type="text" 
                    className="calc-input highlight" 
                    placeholder="点击计算查看结果" 
                    disabled
                    value={workZhong}
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
