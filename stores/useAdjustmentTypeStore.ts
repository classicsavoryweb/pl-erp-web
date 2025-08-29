import { getAdjustmentTypes } from './../api/maintenance/adjustment-type';
import { create } from "zustand";

interface AdjustmentTypeStore {
    adjustmentTypes: any[];
    loading: boolean;
    getAdjustmentTypes: () => Promise<void>;
}

export const useAdjustmentTypeStore = create<AdjustmentTypeStore>()((set, get) => ({
    adjustmentTypes: [],
    loading: false,
    getAdjustmentTypes: async () => {
        if (get().adjustmentTypes.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getAdjustmentTypes();
                set({
                    adjustmentTypes: resp.data.adjustment_types,
                    loading: false
                });
            } catch {
                set({
                    adjustmentTypes: [],
                    loading: false
                });
            }
        }
    },
}));