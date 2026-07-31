import { useState, useRef } from 'react';

export default function MaxOffsetCalculator() {
    // Inputs
    const [workLength, setWorkLength] = useState('');
    const [workMinorDia, setWorkMinorDia] = useState('');
    const [ganDia, setGanDia] = useState('');
    const [ganAngle, setGanAngle] = useState('');

    // Outputs
    const [maxOffset, setMaxOffset] = useState('');

    const resultRef = useRef<HTMLDivElement>(null);

    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (window.innerWidth <= 768 && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCalculate = () => {
        const length = parseFloat(workLength);
        const minorDia = parseFloat(workMinorDia);
        const ganDiameter = parseFloat(ganDia);
        const ganAng = parseFloat(ganAngle);

        if (isNaN(length) || length <= 0 || isNaN(minorDia) || minorDia <= 0 || isNaN(ganDiameter) || ganDiameter <= 0 || isNaN(ganAng)) {
            alert("请输入正确的工件和砂轮杆参数（尺寸必须大于0）");
            return;
        }

        const L1 = length * Math.tan(ganAng * Math.PI / 180);
        
        if (L1 + ganDiameter / 2 >= minorDia / 2) {
            alert("干涉错误：安装角度过大或尺寸设置不合理（砂轮杆在当前角度下会与工件小径发生干涉）");
            return;
        }

        const distance = Math.sqrt(Math.pow(minorDia / 2 - ganDiameter / 2, 2) - Math.pow(L1, 2));

        setMaxOffset(distance.toFixed(4));
        setTimeout(() => scrollToRef(resultRef), 100);
    };

    return (
        <div className="calc-panel large" key="max-offset-calculator">
            <h2 className="calc-title">砂轮杆最大偏移计算</h2>
            
            <div className="calc-row" style={{ gap: '2rem' }}>
                {/* 分组 1: 输入参数 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>输入参数</h3>
                    
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>工件长度 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入工件长度" 
                            value={workLength}
                            onChange={e => setWorkLength(e.target.value)}
                        />
                    </div>

                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>工件小径 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入工件小径" 
                            value={workMinorDia}
                            onChange={e => setWorkMinorDia(e.target.value)}
                        />
                    </div>
                    
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>砂轮杆直径 (mm)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入砂轮杆直径" 
                            value={ganDia}
                            onChange={e => setGanDia(e.target.value)}
                        />
                    </div>

                    <div className="calc-group" style={{ marginBottom: '1.5rem' }}>
                        <label>砂轮杆安装角 (度)</label>
                        <input 
                            type="number" 
                            className="calc-input" 
                            placeholder="输入安装角" 
                            value={ganAngle}
                            onChange={e => setGanAngle(e.target.value)}
                        />
                    </div>

                    <button className="calc-btn" style={{ width: '100%', marginTop: 'auto', flex: 'none' }} onClick={handleCalculate}>
                        计算最大偏移 <i className="fas fa-calculator"></i>
                    </button>
                </div>

                {/* 分组 2: 计算结果 */}
                <div ref={resultRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)', marginBottom: '1rem', textAlign: 'center' }}>计算结果</h3>
                    
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>最大偏移量 (mm)</label>
                        <input 
                            type="text" 
                            className="calc-input" 
                            style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}
                            value={maxOffset}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
