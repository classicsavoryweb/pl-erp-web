import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { validateImportTransactionsScheduleTime, importTransactionsScheduleTime } from "@/api/transactions/schedule-time";
import { useState } from "react";

interface FormModalInterface {
    modal: any;
    api?: any;
};

interface EmployeesWithExcessiveTimetableValues {
    employee_id: string;
    employee_name: string;
    rest_day_count: number;
    incentive_leave_count: number;
}

const ImportModal = ({
    modal,
    api,
}: FormModalInterface) => {
    const [validatedFilePath, setValidatedFilePath] = useState<string | null>(null);
    const [employeesWithExcessiveTimetableValues, setEmployeesWithExcessiveTimetableValues] = useState<EmployeesWithExcessiveTimetableValues[]>([]);
    const [showValidationDetails, setShowValidationDetails] = useState(false);
    const [validationStep, setValidationStep] = useState<'initial' | 'rest_days' | 'incentive_leaves' | 'both_cut_off_has_rest_days' | 'multiple_rest_days' | 'complete'>('initial');
    const [excludedEmployeeIds, setExcludedEmployeeIds] = useState<string[]>([]);

    const importForm = useFormik({
        initialValues: {
            schedule_time_file: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            schedule_time_file: Yup.string().required("Excel file is required"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {

            setSubmitting(true);
            setValidationStep('initial');
            setExcludedEmployeeIds([]);

            const importResponse = await importTransactionsScheduleTime(values);

            if (!importResponse.error) {
                toast.success(importResponse.data.message);
                modal.onClose();
                resetForm();
                setValidatedFilePath(null);
                setShowValidationDetails(false);
                setEmployeesWithExcessiveTimetableValues([]);
                setValidationStep('initial');
                setExcludedEmployeeIds([]);
                if (api?.triggerReload) {
                    api.triggerReload();
                }
            } else {
                toast.error(importResponse.data.message);
            }
        }
    });

    const handleCloseModal = () => {
        modal.onClose();
        setValidatedFilePath(null);
        setShowValidationDetails(false);
        setEmployeesWithExcessiveTimetableValues([]);
        setValidationStep('initial');
        setExcludedEmployeeIds([]);
        importForm.resetForm();
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Import Schedule Time"
            onClose={handleCloseModal}
            size="sm"
        >
            <form onSubmit={importForm.handleSubmit}>
                <Textfield
                    label="Excel File"
                    type="file"
                    name="schedule_time_file"
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                            importForm.setFieldValue("schedule_time_file", file);
                            setValidatedFilePath(null);
                            setShowValidationDetails(false);
                            setEmployeesWithExcessiveTimetableValues([]);
                            setValidationStep('initial');
                        }
                    }}
                    error={importForm.errors.schedule_time_file}
                    required
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={handleCloseModal}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            onClick={() => {}}
                            loading={importForm.isSubmitting}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default ImportModal;