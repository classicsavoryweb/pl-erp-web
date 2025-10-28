import { getVendors } from './../api/accounting/vendors';
import { create } from "zustand";

interface VendorStore {
    vendors: any[];
    loading: boolean;
    getVendor: () => Promise<void>;
}

export const useVendorStore = create<VendorStore>()((set, get) => ({
    vendors: [],
    loading: false,
    getVendor: async () => {
        if (get().vendors.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getVendors();
                set({
                    vendors: resp.data.vendors,
                    loading: false
                });
            } catch {
                set({
                    vendors: [],
                    loading: false
                });
            }
        }
    },
}));