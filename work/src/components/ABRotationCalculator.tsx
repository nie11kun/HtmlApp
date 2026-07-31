import { useState } from 'react';

export default function ABRotationCalculator() {
    const [A, setA] = useState('');
    const [B, setB] = useState('');
    const [C, setC] = useState('');
    const [D, setD] = useState('');
    
    const [resultCD, setResultCD] = useState('');
    const [resultAB, setResultAB] = useState('');

    const radians = (degrees: number) => degrees * (Math.PI / 180);
    const degrees = (radians: number) => radians * (180 / Math.PI);

    const computeIntermediates = (R: number, B_rad: number, A_rad: number) => {
        const L1 = R * Math.cos(B_rad);
        const L2 = R * Math.sin(A_rad);
        const L3 = L1 * Math.sin(A_rad);
        const L4 = L2 - L3;
        const L5 = 2 * R * Math.sin(B_rad / 2);
        const L6 = Math.sqrt(L5 ** 2 - L4 ** 2);
        const L7 = Math.sqrt(R ** 2 - L2 ** 2);
        const L8 = Math.sqrt(R ** 2 - L3 ** 2);
        return [L3, L4, L5, L6, L7, L8];
    };

    const calculateCD = () => {
        if (!A || !B) return;
        const A_rad = radians(parseFloat(A));
        const B_rad = radians(parseFloat(B));
        const R = 1;

        let tmp1 = 1;
        if (B_rad < 0) {
            tmp1 = -1;
        }

        const [L3, _L4, _L5, L6, L7, L8] = computeIntermediates(R, B_rad, A_rad);
        const C_rad = Math.asin(L3 / R);
        const D_rad = Math.acos((L7 ** 2 + L8 ** 2 - L6 ** 2) / (2 * L7 * L8)) * tmp1;

        setResultCD(`A' = ${degrees(C_rad).toFixed(4)} 度, B' = ${degrees(D_rad).toFixed(4)} 度`);
    };

    const solveB = (C_rad: number, D_rad: number, R: number, B_guess: number) => {
        const fsolve = (func: (x: number) => number, guess: number) => {
            const epsilon = 1e-9;
            let x0 = guess;
            let x1 = guess + 0.1;
            while (Math.abs(func(x1)) > epsilon) {
                const y0 = func(x0);
                const y1 = func(x1);
                const x2 = x1 - y1 * (x1 - x0) / (y1 - y0);
                x0 = x1;
                x1 = x2;
            }
            return x1;
        };

        const equation = (B_val: number) => {
            const A_rad = Math.asin(Math.sin(C_rad) / Math.cos(B_val));
            const [_L3, _L4, _L5, L6, L7, L8] = computeIntermediates(R, B_val, A_rad);
            const cos_D_calculated = (L7 ** 2 + L8 ** 2 - L6 ** 2) / (2 * L7 * L8);
            return Math.cos(D_rad) - cos_D_calculated;
        };

        return fsolve(equation, B_guess);
    };

    const calculateAB = () => {
        if (!C || !D) return;
        const C_rad = radians(parseFloat(C));
        const D_rad = radians(parseFloat(D));
        const R = 1;
        const B_guess = radians(30);

        let tmp1 = 1;
        if (D_rad < 0) {
            tmp1 = -1;
        }

        const B_solution = solveB(C_rad, D_rad, R, B_guess) * tmp1;
        const A_solution = Math.asin(Math.sin(C_rad) / Math.cos(B_solution));

        setResultAB(`A = ${degrees(A_solution).toFixed(4)} 度, B = ${degrees(B_solution).toFixed(4)} 度`);
    };

    return (
        <div className="calc-panel large" key="ab-calculator">
            <h2 className="calc-title">AB旋转轴拟合角度计算</h2>
            
            <div className="calc-row" style={{ gap: '3rem' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>
                        A B 原始 -{'>'} A' B' 实际
                    </h3>
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>A (度)</label>
                        <input type="number" className="calc-input" value={A} onChange={e => setA(e.target.value)} step="any" />
                    </div>
                    <div className="calc-group">
                        <label>B (度)</label>
                        <input type="number" className="calc-input" value={B} onChange={e => setB(e.target.value)} step="any" />
                    </div>
                    <div className="btn-container">
                        <button className="calc-btn" onClick={calculateCD}>计算 A' 和 B'</button>
                    </div>
                    {resultCD && <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--accent)', fontWeight: 600 }}>{resultCD}</p>}
                </div>

                <div style={{ width: '1px', background: 'var(--border-color)' }}></div>

                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
                        A' B' 实际 -{'>'} A B 原始
                    </h3>
                    <div className="calc-group" style={{ marginBottom: '1rem' }}>
                        <label>A' (度)</label>
                        <input type="number" className="calc-input" value={C} onChange={e => setC(e.target.value)} step="any" />
                    </div>
                    <div className="calc-group">
                        <label>B' (度)</label>
                        <input type="number" className="calc-input" value={D} onChange={e => setD(e.target.value)} step="any" />
                    </div>
                    <div className="btn-container">
                        <button className="calc-btn" style={{ background: 'var(--accent-secondary)' }} onClick={calculateAB}>
                            计算 A 和 B
                        </button>
                    </div>
                    {resultAB && <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--accent-secondary)', fontWeight: 600 }}>{resultAB}</p>}
                </div>
            </div>
        </div>
    );
}
