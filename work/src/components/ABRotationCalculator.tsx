import { useState } from 'react';
import Readout from './Readout';
import Notice from './Notice';

export default function ABRotationCalculator() {
    const [A, setA] = useState('');
    const [B, setB] = useState('');
    const [C, setC] = useState('');
    const [D, setD] = useState('');
    
    const [resultCD, setResultCD] = useState('');
    const [resultAB, setResultAB] = useState('');
    const [errCD, setErrCD] = useState('');
    const [errAB, setErrAB] = useState('');

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
        if (!A || !B || isNaN(parseFloat(A)) || isNaN(parseFloat(B))) {
            setErrCD('请输入 A 和 B（度）');
            return;
        }
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

        if (!Number.isFinite(C_rad) || !Number.isFinite(D_rad)) {
            setErrCD('该组 A / B 超出可换算范围，请检查输入角度');
            setResultCD('');
            return;
        }
        setErrCD('');
        setResultCD(`A' = ${degrees(C_rad).toFixed(4)} 度, B' = ${degrees(D_rad).toFixed(4)} 度`);
    };

    const solveB = (C_rad: number, D_rad: number, R: number, B_guess: number) => {
        // 割线法：以步长收敛（|Δx| < 1e-13 rad）而非仅看残差，并限制迭代次数防止页面卡死；不收敛返回 NaN
        const fsolve = (func: (x: number) => number, guess: number) => {
            let x0 = guess;
            let x1 = guess + 0.1;
            let y0 = func(x0);
            for (let i = 0; i < 200; i++) {
                const y1 = func(x1);
                if (!Number.isFinite(y1)) return NaN;
                if (y1 === 0) return x1;
                if (y1 === y0) return Math.abs(y1) < 1e-12 ? x1 : NaN;
                const x2 = x1 - y1 * (x1 - x0) / (y1 - y0);
                if (Math.abs(x2 - x1) < 1e-13) return x2;
                x0 = x1; y0 = y1;
                x1 = x2;
            }
            return NaN;
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
        if (!C || !D || isNaN(parseFloat(C)) || isNaN(parseFloat(D))) {
            setErrAB('请输入 A′ 和 B′（度）');
            return;
        }
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

        if (!Number.isFinite(A_solution) || !Number.isFinite(B_solution)) {
            setErrAB('该组 A′ / B′ 无解或迭代不收敛，请检查输入角度');
            setResultAB('');
            return;
        }
        setErrAB('');
        setResultAB(`A = ${degrees(A_solution).toFixed(4)} 度, B = ${degrees(B_solution).toFixed(4)} 度`);
    };

    return (
        <div className="calc-panel large" key="ab-calculator">
            <div className="calc-split">
                <div className="calc-card">
                    <h3 className="calc-card-head"><span className="card-tag">A</span>原始 → 实际<small>A B → A′ B′</small></h3>
                    <div className="calc-group">
                        <label>A (度)</label>
                        <input type="number" className="calc-input" value={A} onChange={e => setA(e.target.value)} step="any" placeholder="输入 A" />
                    </div>
                    <div className="calc-group">
                        <label>B (度)</label>
                        <input type="number" className="calc-input" value={B} onChange={e => setB(e.target.value)} step="any" placeholder="输入 B" />
                    </div>
                    <button className="calc-btn" onClick={calculateCD}>计算 A′ 和 B′ <i className="fas fa-arrow-right"></i></button>
                    <Readout value={resultCD} />
                    <Notice msg={errCD} />
                </div>

                <div className="calc-card is-b">
                    <h3 className="calc-card-head"><span className="card-tag">B</span>实际 → 原始<small>A′ B′ → A B</small></h3>
                    <div className="calc-group">
                        <label>A′ (度)</label>
                        <input type="number" className="calc-input" value={C} onChange={e => setC(e.target.value)} step="any" placeholder="输入 A′" />
                    </div>
                    <div className="calc-group">
                        <label>B′ (度)</label>
                        <input type="number" className="calc-input" value={D} onChange={e => setD(e.target.value)} step="any" placeholder="输入 B′" />
                    </div>
                    <button className="calc-btn is-b" onClick={calculateAB}>
                        <i className="fas fa-arrow-left"></i> 计算 A 和 B
                    </button>
                    <Readout value={resultAB} tone="b" />
                    <Notice msg={errAB} />
                </div>
            </div>
        </div>
    );
}
