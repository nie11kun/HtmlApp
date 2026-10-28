import { useEffect, useRef } from 'react';

// 背景上的 CAD 十字光标与坐标读数（仅桌面精确指针；悬停在面板上时隐藏）
export default function Crosshair() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const coord = root.querySelector<HTMLElement>('.xh-coord')!;
        const target = { x: -100, y: -100 };
        const pos = { x: -100, y: -100 };
        const mm = 25.4 / 96;
        let raf = 0;

        const tick = () => {
            pos.x += (target.x - pos.x) * 0.22;
            pos.y += (target.y - pos.y) * 0.22;
            root.style.setProperty('--x', `${pos.x}px`);
            root.style.setProperty('--y', `${pos.y}px`);
            coord.textContent = `X ${(pos.x * mm).toFixed(2).padStart(6, '0')}  Y ${(pos.y * mm).toFixed(2).padStart(6, '0')}`;
            if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) raf = requestAnimationFrame(tick);
            else raf = 0;
        };

        const onMove = (e: PointerEvent) => {
            target.x = e.clientX;
            target.y = e.clientY;
            const busy = (e.target as Element).closest?.('.calc-panel, .rail, .tool-copy, .site-foot');
            root.classList.toggle('is-on', !busy);
            if (!raf) raf = requestAnimationFrame(tick);
        };
        const onLeave = () => root.classList.remove('is-on');

        window.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('pointermove', onMove);
            document.documentElement.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <div className="crosshair" ref={rootRef} aria-hidden="true">
            <span className="xh-h" />
            <span className="xh-v" />
            <span className="xh-coord" />
        </div>
    );
}
