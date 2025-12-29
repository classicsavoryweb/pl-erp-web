import { create } from "zustand";
import { getAccounts } from "@/api/accounting/accounts";

interface AccountStore {
    accounts: any[];
    loading: boolean;
    getAccount: () => Promise<void>;
}

export const useAccountStore = create<AccountStore>()((set, get) => ({
    accounts: [],
    loading: false,
    getAccount: async () => {
        if (get().accounts.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getAccounts();
                set({
                    accounts: resp?.data?.accounts ?? [],
                    loading: false
                });
            } catch {
                set({
                    accounts: [],
                    loading: false
                });
            }
        }
    },
}));