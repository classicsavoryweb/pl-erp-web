import { create } from "zustand";
import { getBranches } from "@/api/branches";

interface BranchStore {
    branches: any[];
    loading: boolean;
    getBranches: () => Promise<void>;
}

export const useBranchStore = create<BranchStore>()((set, get) => ({
    branches: [],
    loading: false,
    getBranches: async () => {
        if (get().branches.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getBranches();
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