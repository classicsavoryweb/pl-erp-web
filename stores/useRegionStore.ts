import { create } from "zustand";
import { getRegions } from "@/api/regions";

interface RegionStore {
    regions: any[];
    loading: boolean;
    getRegions: () => Promise<void>;
}

export const useRegionStore = create<RegionStore>()((set, get) => ({
    regions: [],
    loading: false,
    getRegions: async () => {
        try {
            set({
                loading: true,
            });
            const resp = await getRegions();
            set({
                regions: resp.data.regions,
                loading: false,
            });
        } catch {
            set({
                regions: [],
                loading: false,
            });
        }
    },
}));
