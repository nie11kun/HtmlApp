export type ToolId = '1' | '2' | '3' | '4' | '5' | '6' | '7';

export interface ToolMeta {
    id: ToolId;
    nav: string;
    title: string;
    tag: string;
    desc: string;
    formula: string;
}

export const TOOLS: ToolMeta[] = [
    {
        id: '1',
        nav: '双圆弧参数',
        title: '双圆弧参数',
        tag: 'Ball screw · Gothic arch',
        desc: '由钢球直径与接触角求沟道圆弧半径和两向偏心；也可以从圆弧半径与水平偏心反推钢球和接触角。',
        formula: 'R = k·Dw/2　e = (R − Dw/2)·sin α',
    },
    {
        id: '2',
        nav: '螺旋升角',
        title: '螺旋升角',
        tag: 'Thread · Worm',
        desc: '输入导程与中径，得到理论螺旋升角，用于砂轮架扳角与修整。',
        formula: 'λ = arctan( Ph / π·d₂ )',
    },
    {
        id: '3',
        nav: '线速度 ↔ 转速',
        title: '线速度 ↔ 转速',
        tag: 'Wheel · Spindle',
        desc: '固定砂轮直径，在主轴转速与砂轮线速度之间双向换算。',
        formula: 'v = n·π·D / 60000',
    },
    {
        id: '4',
        nav: '三线计算终尺寸',
        title: '三线计算终尺寸',
        tag: 'Thread · Measurement',
        desc: '用工件外径、三针测量值和钢球直径，算出磨削需要的终尺寸 H。',
        formula: 'H = (D − M)/2 + dw',
    },
    {
        id: '5',
        nav: 'AB 旋转轴拟合',
        title: 'AB 旋转轴拟合',
        tag: '5-axis · Rotary',
        desc: '原始 A/B 角与实际 A′/B′ 角互相换算，反算部分用割线法迭代求解，无解时会给出提示。',
        formula: 'A′ = arcsin( cos B · sin A )',
    },
    {
        id: '6',
        nav: '蜗杆加工数据',
        title: '蜗杆加工数据',
        tag: 'Worm · Profile',
        desc: '由模数、头数和分度圆直径，一次得出齿距、导程与导程角。',
        formula: 'p = π·m　L = p·z　γ = arctan( L / π·d )',
    },
    {
        id: '7',
        nav: '砂轮杆最大偏移',
        title: '砂轮杆最大偏移',
        tag: 'Nut grinding · Clearance',
        desc: '内螺纹磨削时，砂轮杆相对工件中心允许的最大偏移；超出即碰工件小径。',
        formula: 'e = √( (D₁ − d)²/4 − (l·tan θ)² )',
    },
];
