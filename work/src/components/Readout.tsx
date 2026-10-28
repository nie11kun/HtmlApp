import { useEffect, useState } from 'react';

const DIGITS = '0123456789';

// 计算结果读数：数值变化时数字像机床数显一样逐位“解码”，非数字字符保持不动以免抖动
export default function Readout({ value, placeholder = '等待计算', tone = 'a' }: { value: string; placeholder?: string; tone?: 'a' | 'b' }) {
    const [shown, setShown] = useState(value);

    useEffect(() => {
        if (!value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setShown(value);
            return;
        }
        let pos = 0;
        const id = window.setInterval(() => {
            pos += 0.5;
            const done = Math.floor(pos);
            setShown([...value].map((c, i) => (i < done || !/\d/.test(c) ? c : DIGITS[(Math.random() * 10) | 0])).join(''));
            if (done >= value.length) window.clearInterval(id);
        }, 25);
        return () => window.clearInterval(id);
    }, [value]);

    return (
        <output className={`readout tone-${tone} ${value ? 'has-value' : ''}`}>
            <span aria-hidden="true">{value ? shown : placeholder}</span>
            <span className="sr-only">{value || placeholder}</span>
        </output>
    );
}
