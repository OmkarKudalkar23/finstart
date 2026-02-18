'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import CubeLoader from './CubeLoader';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [show, setShow] = useState(false);
    const [mounted, setMounted] = useState(false);
    const prevPath = useRef<string | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Skip the very first render (initial page load)
        if (prevPath.current === null) {
            prevPath.current = pathname;
            return;
        }

        if (prevPath.current === pathname) return;
        prevPath.current = pathname;

        // Clear any in-flight timers
        if (hideTimer.current) clearTimeout(hideTimer.current);
        if (unmountTimer.current) clearTimeout(unmountTimer.current);

        // Mount → show (two-step so CSS transition fires)
        setMounted(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setShow(true));
        });

        // After 800 ms start fade-out
        hideTimer.current = setTimeout(() => {
            setShow(false);
            // After fade-out completes (300 ms) unmount from DOM
            unmountTimer.current = setTimeout(() => setMounted(false), 320);
        }, 800);

        return () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
            if (unmountTimer.current) clearTimeout(unmountTimer.current);
        };
    }, [pathname]);

    return (
        <>
            {mounted && (
                <div
                    className="pt-overlay"
                    style={{ opacity: show ? 1 : 0 }}
                    aria-hidden="true"
                >
                    <CubeLoader isLoading fullScreen />
                </div>
            )}
            {children}
        </>
    );
}
