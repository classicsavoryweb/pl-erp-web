import { getScheduleMasterlist } from './../api/schedule-masterlist';
import { getAdjustmentTypes } from './../api/maintenance/adjustment-type';
import { create } from "zustand";

interface ScheduleMasterlistStore {
    scheduleMasterlist: any[];
    loading: boolean;
    getScheduleMasterlist: () => Promise<void>;
}

export const useScheduleMasterlistStore = create<ScheduleMasterlistStore>()((set, get) => ({
    scheduleMasterlist: [],
    loading: false,
    getScheduleMasterlist: async () => {
        if (get().scheduleMasterlist.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getScheduleMasterlist();
                set({
                    scheduleMasterlist: resp.data.schedule_masterlist,
                    loading: false
                });
            } catch {
                set({
                    scheduleMasterlist: [],
                    loading: false
                });
            }
        }
    },
}));