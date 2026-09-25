

import { create } from "zustand";
import { getUniformItemOptions } from "@/api/uniform/item-masterlist";

interface SizeStore {
    sizes: any[];
    loading: boolean;
    loaded: Boolean;
    getUniformItemZiseOptions: () => Promise<void>;
}

export const useUniformSizeStore = create<SizeStore>()((set, get) => ({
    sizes: [],
    loading: false,
    loaded: false,
    getUniformItemZiseOptions: async () => {
        if (get().loaded) return;
        if (get().loading) return;

        set({ loading: true});
    
         try {
            const resp = await getUniformItemOptions();

            set({
                sizes: resp.data.sizes ?? [],
                loading: false,
                loaded: true,
            });
        } catch {
            set({
                sizes: [],
                loading: false,
                loaded: false,
            });
        }
    },
}));
