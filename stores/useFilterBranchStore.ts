import { create } from "zustand";
import { getFilterBranches } from "@/api/branches";

interface FilterBranchStore {
    branches: any[];
    loading: boolean;
    getFilterBranches: () => Promise<void>;
}

export const useFilterBranchStore = create<FilterBranchStore>()((set, get) => ({
    branches: [],
    loading: false,
    getFilterBranches: async () => {
        if (get().branches.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getFilterBranches();
                set({
                    branches: resp.data.branches,
                    loading: false
                });
            } catch {
                set({
                    branches: [],
                    loading: false
                });
            }
        }
    },
}));