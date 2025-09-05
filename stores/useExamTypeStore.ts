import { create } from "zustand";
import { getExamType } from "@/api/maintenance/cshub-source-type";

interface ExamStore {
    exams: any[];
    loading: boolean;
    getExamType: () => Promise<void>;
}

export const useExamTypeStore = create<ExamStore>()((set, get) => ({
    exams: [],
    loading: false,
    getExamType: async () => {
        if (get().exams.length === 0) {
            try {
                set({
                    loading: true
                });
                const resp = await getExamType();
                set({
                    exams: resp.data.exam_type,
                    loading: false
                });
            } catch {
                set({
                    exams: [],
                    loading: false
                });
            }
        }
    },
}));