import { create } from "zustand";
import { getUniformItemOptions } from "@/api/uniform/item-masterlist";

interface SupplierStore {
    supplier: any[];
    loading: boolean;
    loaded: boolean;
    getUniformSupplier: () => Promise<void>;
}

export const useUniformSupplierStore = create<SupplierStore>()((set, get) => ({
    supplier: [],
    loading: false,
    loaded: false,

    getUniformSupplier: async () => {
        if (get().loaded) return;
        if (get().loading) return;

        set({ loading: true });

        try {
            const resp = await getUniformItemOptions();

            set({
                supplier: resp.data.suppliers ?? [],
                loading: false,
                loaded: true,
            });
        } catch {
            set({
                supplier: [],
                loading: false,
                loaded: false,
            });
        }
    },
}));
