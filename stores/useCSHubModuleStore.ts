import { create } from "zustand";
import { getCSHubModules } from "@/api/maintenance/cshub-modules";

interface ModuleStore {
    modules: any[];
    loading: boolean;
    getCSHubModules: () => Promise<void>;
}

export const useModuleStore = create<ModuleStore>()((set, get) => ({
    modules: [],
    loading: false,
    getCSHubModules: async () => {
        if (get().modules.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getCSHubModules();
                set({
                    modules: resp.data.modules,
                    loading: false
                });
            } catch {
                set({
                    modules: [],
                    loading: false
                });
            }
        }
    },
}));