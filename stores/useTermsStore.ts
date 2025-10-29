import { getTerm } from "@/api/maintenance/terms";
import { create } from "zustand";

interface TermStore {
    terms: any[];
    loading: boolean;
    getTerms: () => Promise<void>;
}

export const useTermsStore = create<TermStore>()((set, get) => ({
    terms: [],
    loading: false,
    getTerms: async () => {
        if (get().terms.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getTerm();
                set({
                    terms: resp.data.terms,
                    loading: false
                });
            } catch {
                set({
                    terms: [],
                    loading: false
                });
            }
        }
    },
}));