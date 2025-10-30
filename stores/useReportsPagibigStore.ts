import { create } from "zustand";
import { getReportsPagibigLoanTypes } from "@/api/reports/reports-pagibig";

interface ReportsPagibigStore {
    reportsPagibig: string[];
    loading: boolean;
    getReportsPagibigLoanTypes: () => Promise<void>;
}

export const useReportsPagibigStore = create<ReportsPagibigStore>((set, get) => ({
    reportsPagibig: [],
    loading: false,
    getReportsPagibigLoanTypes: async () => {
        if (get().reportsPagibig.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getReportsPagibigLoanTypes();
                set({
                    reportsPagibig: resp.data || [],
                    loading: false,
                });
            } catch {
                set({
                    reportsPagibig: [],
                    loading: false,
                });
            }
        }
    },
}));
