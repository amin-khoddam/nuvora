import { useState } from "react";
import { resolveVariant, type VariantChoice } from "../lib/variants";
import type { ProductSeller } from "../types";

const NO_CHOICE: VariantChoice = { sellerId: null, colorId: null, sizeId: null };

/**
 * Holds only what the user picked. The effective seller, color and size are
 * derived on every render, so a stale choice can never produce an invalid
 * combination and no effect is needed to "repair" state.
 */
export function useVariantSelection(sellers: ProductSeller[]) {
    const [choice, setChoice] = useState<VariantChoice>(NO_CHOICE);

    return {
        variant: resolveVariant(sellers, choice),
        selectSeller: (sellerId: string) => setChoice((previous) => ({ ...previous, sellerId })),
        selectColor: (colorId: string) => setChoice((previous) => ({ ...previous, colorId })),
        selectSize: (sizeId: string) => setChoice((previous) => ({ ...previous, sizeId })),
    };
}