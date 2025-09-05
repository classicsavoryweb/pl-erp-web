import { create } from "zustand";
import { getTransType } from "@/api/maintenance/cshub-source-type";

interface TransactionStore {
    transactions: any[];
    loading: boolean;
    getTransType: () => Promise<void>;
}

export const useTransactionTypeStore = create<TransactionStore>()((set, get) => ({
    transactions: [],
    loading: false,
    getTransType: async () => {
        if (get().transactions.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getTransType();
                set({
                    transactions: resp.data.transaction_type,
                    loading: false
                });
            } catch {
                set({
                    transactions: [],
                    loading: false
                });
            }
        }
    },
}));