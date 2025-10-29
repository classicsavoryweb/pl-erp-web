import { create } from "zustand";
import { getCSHubTransactionType } from "@/api/maintenance/cshub-transaction-type";

interface TransactionStore {
    transactions: any[];
    loading: boolean;
    getTransType: () => Promise<void>;
}

export const useCSHubTransactionTypeStore = create<TransactionStore>()((set, get) => ({
    transactions: [],
    loading: false,
    getTransType: async () => {
        if (get().transactions.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getCSHubTransactionType();
                set({
                    transactions: resp.data.transaction_types,
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