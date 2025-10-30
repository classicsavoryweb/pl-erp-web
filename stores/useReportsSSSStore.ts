import { create } from "zustand";
import { getReportsSSSLoanTypes } from "@/api/reports/reports-sss";

interface ReportsSSSStore {
    reportsSSS: string[];
    loading: boolean;
    getReportsSSSLoanTypes: () => Promise<void>;
}

export const useReportsSSSStore = create<ReportsSSSStore>((set, get) => ({
    reportsSSS: [],
    loading: false,
    getReportsSSSLoanTypes: async () => {
        if (get().reportsSSS.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getReportsSSSLoanTypes();
                set({
                    reportsSSS: resp.data || [],
                    loading: false,
                });
            } catch {
                set({
                    reportsSSS: [],
                    loading: false,
                });
            }
        }
    },
}));
