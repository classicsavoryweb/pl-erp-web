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
        if (get().regions.length === 0) {
            try {
                set({
                    loading: true,
                });
                const resp = await getRegions();
                const regions = resp?.data?.regions;

                set({
                    regions: Array.isArray(regions) ? regions : [],
                    loading: false,
                });
            } catch {
                set({
                    regions: [],
                    loading: false,
                });
            }
        }
    },
}));
