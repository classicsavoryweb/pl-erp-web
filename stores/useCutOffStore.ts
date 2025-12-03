import { create } from "zustand";
import { getAllFinalizedCutOffs } from "@/api/compensation/cut-off";

interface CutOffStore {
    cut_offs: any[];
    loading: boolean;
    getCutOffs: () => Promise<void>;
}

export const useCutOffStore = create<CutOffStore>()((set, get) => ({
    cut_offs: [],
    loading: false,
    getCutOffs: async () => {
        if (get().cut_offs.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getAllFinalizedCutOffs();
                set({
                    cut_offs: resp.data,
                    loading: false
                });
            } catch {
                set({
                    cut_offs: [],
                    loading: false
                });
            }
        }
    },
}));