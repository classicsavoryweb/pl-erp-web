import { create } from "zustand";
import { getEmployees } from "@/api/employee";

interface BranchStore {
    employees: any[];
    loading: boolean;
    getEmployees: () => Promise<void>;
}

export const useEmployeeStore = create<BranchStore>()((set, get) => ({
    employees: [],
    loading: false,
    getEmployees: async () => {
        if (get().employees.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getEmployees();
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