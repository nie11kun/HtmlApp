import type { CSSProperties, ReactNode } from 'react';
import type { ToolId } from '../tools';

// 每个工具一张发丝线工程简图，挂载时按 --i 顺序“画”出来
const d = (i: number) => ({ '--i': i } as CSSProperties);

// 螺纹/齿形轴向截面：crestY 为齿顶，rootY 为齿根，start 为第一个齿顶起点
function profile(start: number, end: number, pitch: number, crest: number, run: number, crestY: number, rootY: number) {
    const pts: string[] = [];
    const root = pitch - crest - run * 2;
    for (let x = start; x < end; x += pitch) {
        pts.push(`${x},${crestY}`, `${x + crest},${crestY}`, `${x + crest + run},${rootY}`);
        if (root > 0) pts.push(`${x + crest + run + root},${rootY}`);
    }
    return 'M' + pts.join(' L');
}

function Label({ x, y, i, children, anchor = 'middle' }: { x: number; y: number; i: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end' }) {
    return <text className="sk-label" x={x} y={y} textAnchor={anchor} style={d(i)}>{children}</text>;
}

function Cross({ x, y, i, s = 4 }: { x: number; y: number; i: number; s?: number }) {
    return <path className="sk-line" pathLength={1} style={d(i)} d={`M${x - s} ${y}h${s * 2}M${x} ${y - s}v${s * 2}`} />;
}

const drawings: Record<ToolId, ReactNode> = {
    '1': (
        <>
            <line className="sk-faint" x1="170" y1="40" x2="170" y2="172" style={d(0)} />
            <path className="sk-line" pathLength={1} style={d(1)} d="M170 142.8 A52 52 0 0 1 129.6 73.7 L36 73.7" />
            <path className="sk-line" pathLength={1} style={d(2)} d="M170 142.8 A52 52 0 0 0 210.4 73.7 L304 73.7" />
            <circle className="sk-line" pathLength={1} style={d(3)} cx="170" cy="100" r="40" />
            <path className="sk-hot" pathLength={1} style={d(5)} d="M178.5 91.5 L141.7 128.3" />
            <path className="sk-hot" pathLength={1} style={d(6)} d="M161.5 91.5 L198.3 128.3" />
            <path className="sk-line" pathLength={1} style={d(7)} d="M170 122 A22 22 0 0 1 154.4 115.6" />
            <Cross x={178.5} y={91.5} i={8} s={3} />
            <Cross x={161.5} y={91.5} i={8} s={3} />
            <path className="sk-line" pathLength={1} style={d(9)} d="M130 166 H210 M130 162 v8 M210 162 v8" />
            <line className="sk-faint" x1="130" y1="100" x2="130" y2="168" style={d(9)} />
            <line className="sk-faint" x1="210" y1="100" x2="210" y2="168" style={d(9)} />
            <Label x={170} y={180} i={10}>Dw</Label>
            <Label x={156} y={136} i={10}>α</Label>
            <Label x={222} y={136} i={11}>R</Label>
            <Label x={284} y={64} i={11} anchor="end">k = R/(Dw/2)</Label>
        </>
    ),
    '2': (
        <>
            <rect className="sk-line" pathLength={1} style={d(0)} x="40" y="40" width="90" height="150" />
            <clipPath id="sk-clip-2"><rect x="40" y="40" width="90" height="150" /></clipPath>
            <g clipPath="url(#sk-clip-2)">
                {[70, 96, 122, 148, 174, 200].map((y, k) => (
                    <path key={y} className={k === 2 ? 'sk-hot' : 'sk-line'} pathLength={1} style={d(1 + k * 0.4)} d={`M40 ${y} L130 ${y - 22}`} />
                ))}
            </g>
            <path className="sk-line" pathLength={1} style={d(4)} d="M24 96 V122 M20 96 h8 M20 122 h8" />
            <Label x={16} y={113} i={6} anchor="end">Ph</Label>
            <line className="sk-faint" x1="140" y1="180" x2="160" y2="180" style={d(5)} />
            <path className="sk-line" pathLength={1} style={d(5)} d="M170 180 H310 V146" />
            <path className="sk-hot" pathLength={1} style={d(6)} d="M170 180 L310 146" />
            <path className="sk-line" pathLength={1} style={d(7)} d="M206 180 A36 36 0 0 0 205 171.5" />
            <Label x={240} y={200} i={8}>π·d₂</Label>
            <Label x={320} y={167} i={8} anchor="start">Ph</Label>
            <Label x={216} y={175} i={9} anchor="start">λ</Label>
            <Label x={85} y={210} i={9}>d₂</Label>
        </>
    ),
    '3': (
        <>
            <circle className="sk-line" pathLength={1} style={d(0)} cx="130" cy="120" r="70" />
            <circle className="sk-line" pathLength={1} style={d(1)} cx="130" cy="120" r="18" />
            <Cross x={130} y={120} i={2} s={5} />
            <path className="sk-line" pathLength={1} style={d(3)} d="M214.7 134.9 A86 86 0 0 1 144.9 204.7" />
            <path className="sk-line sk-fade" style={d(5)} d="M152.9 198.2 L144.9 204.7 L154.7 208" />
            <path className="sk-hot" pathLength={1} style={d(4)} d="M130 50 H296" />
            <path className="sk-hot sk-fade" style={d(6)} d="M287 45 L296 50 L287 55" />
            <line className="sk-faint" x1="30" y1="50" x2="126" y2="50" style={d(5)} />
            <line className="sk-faint" x1="30" y1="190" x2="126" y2="190" style={d(5)} />
            <path className="sk-line" pathLength={1} style={d(6)} d="M36 50 V190 M31 50 h10 M31 190 h10" />
            <Label x={26} y={124} i={8} anchor="end">D</Label>
            <Label x={286} y={38} i={8}>v</Label>
            <Label x={222} y={190} i={9} anchor="start">n</Label>
        </>
    ),
    '4': (
        <>
            <clipPath id="sk-clip-4"><rect x="30" y="0" width="270" height="230" /></clipPath>
            <line className="sk-faint" x1="24" y1="120" x2="306" y2="120" style={d(0)} />
            <g clipPath="url(#sk-clip-4)">
                <path className="sk-line" pathLength={1} style={d(1)} d={profile(4, 320, 40, 5.36, 17.32, 66, 96)} />
                <path className="sk-line" pathLength={1} style={d(2)} d={profile(-16, 320, 40, 5.36, 17.32, 174, 144)} />
            </g>
            <circle className="sk-hot" pathLength={1} style={d(4)} cx="146.68" cy="72" r="12" />
            <circle className="sk-hot" pathLength={1} style={d(4.5)} cx="186.68" cy="72" r="12" />
            <circle className="sk-hot" pathLength={1} style={d(5)} cx="166.68" cy="168" r="12" />
            <line className="sk-faint" x1="190" y1="60" x2="318" y2="60" style={d(6)} />
            <line className="sk-faint" x1="170" y1="180" x2="318" y2="180" style={d(6)} />
            <path className="sk-line" pathLength={1} style={d(7)} d="M312 60 V180 M307 60 h10 M307 180 h10" />
            <path className="sk-line" pathLength={1} style={d(7)} d="M16 66 V174 M11 66 h10 M11 174 h10" />
            <Label x={324} y={124} i={9} anchor="start">M</Label>
            <Label x={8} y={124} i={9} anchor="end">D</Label>
            <Label x={166} y={206} i={10}>dw</Label>
        </>
    ),
    '5': (
        <>
            <line className="sk-faint" x1="170" y1="18" x2="170" y2="212" style={d(0)} />
            <line className="sk-faint" x1="70" y1="115" x2="270" y2="115" style={d(0)} />
            <circle className="sk-line" pathLength={1} style={d(1)} cx="170" cy="115" r="82" />
            <ellipse className="sk-line" pathLength={1} style={d(2)} cx="170" cy="115" rx="82" ry="24" />
            <ellipse className="sk-line" pathLength={1} style={d(3)} cx="170" cy="115" rx="34" ry="82" transform="rotate(-24 170 115)" />
            <path className="sk-hot" pathLength={1} style={d(5)} d="M170 115 L222 57" />
            <path className="sk-line" pathLength={1} style={d(6)} d="M170 115 L240 78" />
            <line className="sk-faint" x1="222" y1="57" x2="222" y2="130" style={d(7)} />
            <line className="sk-faint" x1="170" y1="115" x2="222" y2="130" style={d(7)} />
            <circle className="sk-hot sk-fade" style={d(7)} cx="222" cy="57" r="3" />
            <circle className="sk-line sk-fade" style={d(8)} cx="240" cy="78" r="3" />
            <Label x={228} y={50} i={9} anchor="start">A · B</Label>
            <Label x={248} y={82} i={9} anchor="start">A′ · B′</Label>
            <Label x={88} y={108} i={10}>A</Label>
            <Label x={140} y={40} i={10}>B</Label>
        </>
    ),
    '6': (
        <>
            <clipPath id="sk-clip-6"><rect x="28" y="0" width="264" height="230" /></clipPath>
            <line className="sk-faint" x1="20" y1="120" x2="310" y2="120" style={d(0)} />
            <g clipPath="url(#sk-clip-6)">
                <path className="sk-line" pathLength={1} style={d(1)} d={profile(6, 320, 44, 12, 10.2, 62, 90)} />
                <path className="sk-line" pathLength={1} style={d(2)} d={profile(6, 320, 44, 12, 10.2, 178, 150)} />
            </g>
            <line className="sk-faint" x1="20" y1="76" x2="310" y2="76" style={d(3)} />
            <line className="sk-faint" x1="20" y1="164" x2="310" y2="164" style={d(3)} />
            <path className="sk-hot" pathLength={1} style={d(4)} d="M56 46 H100 M56 41 v10 M100 41 v10" />
            <path className="sk-line" pathLength={1} style={d(5)} d="M56 24 H188 M56 19 v10 M188 19 v10" />
            <path className="sk-line" pathLength={1} style={d(6)} d="M304 76 V164 M299 76 h10 M299 164 h10" />
            <Label x={78} y={40} i={8}>p</Label>
            <Label x={122} y={18} i={8}>L = z·p</Label>
            <Label x={316} y={124} i={9} anchor="start">d</Label>
            <Label x={170} y={212} i={10}>m · z · γ</Label>
        </>
    ),
    '7': (
        <>
            <line className="sk-faint" x1="60" y1="115" x2="270" y2="115" style={d(0)} />
            <line className="sk-faint" x1="160" y1="16" x2="160" y2="214" style={d(0)} />
            <circle className="sk-line" pathLength={1} style={d(1)} cx="160" cy="115" r="88" />
            <circle className="sk-hot" pathLength={1} style={d(3)} cx="218" cy="93" r="26" />
            <Cross x={218} y={93} i={4} s={4} />
            <path className="sk-line" pathLength={1} style={d(5)} d="M160 115 V93" />
            <path className="sk-hot" pathLength={1} style={d(6)} d="M160 93 H218" />
            <line className="sk-faint" x1="160" y1="115" x2="242.3" y2="83.8" style={d(6)} />
            <circle className="sk-hot sk-fade" style={d(7)} cx="242.3" cy="83.8" r="3" />
            <Label x={176} y={86} i={8}>e</Label>
            <Label x={152} y={108} i={8} anchor="end">l·tanθ</Label>
            <Label x={92} y={44} i={9}>D₁</Label>
            <Label x={256} y={128} i={9} anchor="start">d</Label>
            <Label x={300} y={212} i={10} anchor="end">max e → 不干涉</Label>
        </>
    ),
};

// 个别图需要裁得更紧才不显空；--k 用于让标注字号与线宽保持一致
const VIEWBOX: Partial<Record<ToolId, [string, number]>> = {
    '1': ['50 30 240 162.4', 340 / 240],
};

export default function Schematic({ id }: { id: ToolId }) {
    const [vb, k] = VIEWBOX[id] ?? ['0 0 340 230', 1];
    return (
        <svg className="schematic" viewBox={vb} style={{ '--k': k } as CSSProperties} role="img" aria-label="原理简图">
            {drawings[id]}
        </svg>
    );
}
