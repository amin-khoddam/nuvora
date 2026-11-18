import { useCallback, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper/types";

interface SwiperEdges {
    isBeginning: boolean;
    isEnd: boolean;
    /** True when every slide fits, so there is nothing to scroll. */
    isLocked: boolean;
}

const INITIAL_EDGES: SwiperEdges = { isBeginning: true, isEnd: false, isLocked: true };

/**
 * Keeps a Swiper instance and its scroll edges in React state, so arrow
 * buttons can disable at the ends. Everything is driven by Swiper's own
 * events; spread `swiperProps` onto `<Swiper>`.
 */
export function useSwiperNav() {
    const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
    const [edges, setEdges] = useState<SwiperEdges>(INITIAL_EDGES);

    const sync = useCallback((instance: SwiperInstance) => {
        const next: SwiperEdges = {
            isBeginning: instance.isBeginning,
            isEnd: instance.isEnd,
            isLocked: instance.isLocked,
        };
        setEdges((previous) =>
            previous.isBeginning === next.isBeginning &&
            previous.isEnd === next.isEnd &&
            previous.isLocked === next.isLocked
                ? previous
                : next,
        );
    }, []);

    const swiperProps = {
        onSwiper: (instance: SwiperInstance) => {
            setSwiper(instance);
            sync(instance);
        },
        onSlideChange: sync,
        onResize: sync,
        onUpdate: sync,
        onLock: sync,
        onUnlock: sync,
        onToEdge: sync,
        onFromEdge: sync,
    };

    return { swiper, edges, swiperProps };
}