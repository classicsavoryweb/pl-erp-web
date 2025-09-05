import { create } from "zustand";
import { getDeduction } from "@/api/maintenance/deductions";

interface DeductionStore {
    deductions: any[];
    loading: boolean;
    getDeduction: () => Promise<void>;
}

export const useDeductionStore = create<DeductionStore>()((set, get) => ({
    deductions: [],
    loading: false,
    getDeduction: async () => {
        if (get().deductions.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getDeduction();
                set({
                    deductions: resp.data.deductions,
                    loading: false
                });
            } catch {
                set({
                    deductions: [],
                    loading: false
                });
            }
        }
    },
}));