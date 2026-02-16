import { create } from "zustand";
import { getActiveCutOff } from "@/api/compensation/cut-off";

interface ActiveCutoffStore {
    active_cutoff: any | null;
    loading: boolean;
    getActiveCutoff: () => Promise<void>;
}

export const useActiveCutoffStore = create<ActiveCutoffStore>()((set, get) => ({
    active_cutoff: null,
    loading: false,
    getActiveCutoff: async () => {
        if (get().active_cutoff) return;
        try {
            set({ loading: true });
            const resp = await getActiveCutOff();
            if (!resp.error) {
                set({
                    active_cutoff: resp.data,
                    loading: false
                });
            } else {
                set({
                    active_cutoff: null,
                    loading: false
                });
            }
        } catch {
            set({
                active_cutoff: null,
                loading: false
            });
        }
    }
}));
