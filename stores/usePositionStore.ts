import { create } from "zustand";
import { getPositions } from "@/api/positions";

interface BranchStore {
    positions: any[];
    loading: boolean;
    getPositions: () => Promise<void>;
}

export const usePositionStore = create<BranchStore>()((set, get) => ({
    positions: [],
    loading: false,
    getPositions: async () => {
        if (get().positions.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getPositions();
                set({
                    positions: resp.data.positions,
                    loading: false
                });
            } catch {   
                set({
                    positions: [],
                    loading: false
                });
            }
        }
    },
}));