import { create } from "zustand";
import { getUniformItemOptions } from "@/api/uniform/item-masterlist";

interface GenderStore {
    gender: any[];
    loading: boolean;
    loaded:boolean;
    getUnifomGender: () => Promise<void>;
}

export const useUniformGenderStore = create<GenderStore>()((set, get) => ({
    gender: [],
    loading: false,
    loaded:false,
    getUnifomGender: async () => {
        if(get().loaded) return;
        if(get().loading) return;

        set({loading: true});
        try {
            const resp = await getUniformItemOptions();

            set({
                gender: resp.data.genders ?? [],
                loading: false,
                loaded: true,
            });
        } catch {
            set({
                gender: [],
                loading: false,
                loaded: false,
            });
        }
    },
}));