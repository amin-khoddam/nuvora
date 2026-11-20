import { useState } from "react";
import { resolvePathByIds } from "../lib/category-tree";
import type { Category } from "../types";

/**
 * Drill-down state shared by the desktop mega menu and the mobile explorer.
 * Only ids are stored; the path is re-resolved from the tree on every render,
 * so it can never point at a category that no longer exists.
 */
export function useCategoryNavigation(roots: Category[]) {
    const [pathIds, setPathIds] = useState<string[]>([]);
    const path = resolvePathByIds(roots, pathIds);

    return {
        path,
        /** Goes one level deeper into `category`, a child of the current node. */
        drill: (category: Category) => setPathIds([...path.map((item) => item.id), category.id]),
        /** Keeps the first `depth` levels (0 goes back to the root list). */
        popTo: (depth: number) => setPathIds(path.slice(0, depth).map((item) => item.id)),
        /** Switches the top level; a no-op while it is already active so hover does not undo a drill-down. */
        showRoot: (category: Category) => {
            if (path[0]?.id !== category.id) setPathIds([category.id]);
        },
        reset: () => setPathIds([]),
    };
}