import { getRates } from '@/api/rates';
import { create } from "zustand";

interface RateStore {
    rates: any[];
    loading: boolean;
    getRates: () => Promise<void>;
}

export const useRatesStore = create<RateStore>()((set, get) => ({
    rates: [],
    loading: false,
    getRates: async () => {
        if (get().rates.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getRates();
                set({
                    rates: resp.data.rates,
                    loading: false
                });
            } catch {
                set({
                    rates: [],
                    loading: false
                });
            }
        }
    },
}));