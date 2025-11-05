import { create } from "zustand";
import { getAccounts } from "@/api/accounting/accounts";
import { getBankAccountTypes } from "@/api/bank-account-types";
getAccounts

interface BankAccountStore {
    account_types: any[];
    loading: boolean;
    getBankAccountType: () => Promise<void>;
}

export const useBankAccountStore = create<BankAccountStore>()((set, get) => ({
    account_types: [],
    loading: false,
    getBankAccountType: async () => {
        if (get().account_types.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getBankAccountTypes();
                set({
                    account_types: resp.data.bank_account_types,
                    loading: false
                });
            } catch {
                set({
                    account_types: [],
                    loading: false
                });
            }
        }
    },
}));