import { create } from "zustand";
import { getBranchEmployees } from "@/api/employee";

interface BranchEmployeeStore {
    employees: any[];
    loading: boolean;
    getBranchEmployees: () => Promise<void>;
}

export const useBranchEmployeeStore = create<BranchEmployeeStore>()((set, get) => ({
    employees: [],
    loading: false,
    getBranchEmployees: async () => {
        if (get().employees.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getBranchEmployees();
                set({
                    employees: resp.data.employees,
                    loading: false
                });
            } catch {
                set({
                    employees: [],
                    loading: false
                });
            }
        }
    },
}));
