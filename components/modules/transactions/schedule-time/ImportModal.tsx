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
    const [validationStep, setValidationStep] = useState<'initial' | 'rest_days' | 'incentive_leaves' | 'multiple_rest_days' | 'complete'>('initial');
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

            const validationResponse = await validateImportTransactionsScheduleTime(values);
            
            if (validationResponse.error) {
                toast.error(validationResponse.data?.message || "Validation failed");
                setSubmitting(false);
                return;
            }
            
            if (validationResponse.data?.file_path) {
                setValidatedFilePath(validationResponse.data.file_path);
            }

            const excludedIds: string[] = [];
            
            if (!validationResponse.data?.employees_with_excessive_leaves && 
                !validationResponse.data?.employees_with_multiple_rest_days_per_week) {
                setValidationStep('complete');
            }

            if (validationResponse.data?.employees_with_excessive_leaves?.length > 0) {
                const employeesWithExcessiveRestDays = validationResponse.data.employees_with_excessive_leaves.filter(
                    (emp: any) => emp.rest_day_count >= 3
                );

                if (employeesWithExcessiveRestDays.length > 0) {
                    setEmployeesWithExcessiveTimetableValues(employeesWithExcessiveRestDays);
                    setValidationStep('rest_days');
                    
                    const restDayMessage = (
                        <div className="space-y-4 text-sm">
                            <p>Employees with 3 or more rest days:</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-gray-600 font-semibold border-b border-slate-300 pb-1">
                                    <span>Employee Name</span>
                                    <span>Rest Day Count</span>
                                </div>
                                {employeesWithExcessiveRestDays.map((employee: any) => (
                                    <div key={employee.employee_id} className="flex justify-between items-start">
                                        <span>{employee.employee_name}</span>
                                        <span className="text-right">
                                            <span className="font-semibold">{employee.rest_day_count}</span>
                                            <div>
                                                {employee.rest_day_dates.join(', ')}
                                            </div>
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4">Do you want to proceed?</p>
                        </div>
                    );

                    const restDayConfirmed = await confirm({
                        title: "Confirm Rest Day Import",
                        message: "",
                        children: restDayMessage,
                        size: "md"
                    });

                    if (!restDayConfirmed) {
                        employeesWithExcessiveRestDays.forEach((emp: any) => {
                            if (!excludedIds.includes(emp.employee_id)) {
                                excludedIds.push(emp.employee_id);
                            }
                        });
                        toast.info("Importing cancelled.");
                        
                        setSubmitting(false);
                        return;
                    }
                }
            }

            if (validationResponse.data?.employees_with_excessive_leaves?.length > 0) {
                const employeesWithExcessiveIncentiveLeaves = validationResponse.data.employees_with_excessive_leaves.filter(
                    (emp: any) => emp.incentive_leave_count >= 3
                );

                if (employeesWithExcessiveIncentiveLeaves.length > 0) {
                    setEmployeesWithExcessiveTimetableValues(employeesWithExcessiveIncentiveLeaves);
                    setValidationStep('incentive_leaves');
                    
                    const incentiveLeaveMessage = (
                        <div className="space-y-4 text-sm">
                            <p>Employees with 3 or more incentive leaves:</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-gray-600 font-semibold border-b border-slate-300 pb-1">
                                    <span>Employee Name</span>
                                    <span>Incentive Leave Count</span>
                                </div>
                                {employeesWithExcessiveIncentiveLeaves.map((employee: any) => (
                                    <div key={employee.employee_id} className="flex justify-between items-start">
                                        <span>{employee.employee_name}</span>
                                        <span className="text-right">
                                            <span className="font-semibold">{employee.incentive_leave_count}</span>
                                            <div>
                                                {employee.incentive_leave_dates.join(', ')}
                                            </div>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                    const incentiveLeaveConfirmed = await confirm({
                        title: "Incentive Leave Notice",
                        message: "",
                        children: incentiveLeaveMessage,
                        onlyCancel: true,
                        size: "md"
                    });

                    employeesWithExcessiveIncentiveLeaves.forEach((emp: any) => {
                        if (!excludedIds.includes(emp.employee_id)) {
                            excludedIds.push(emp.employee_id);
                        }
                    });

                    if (!incentiveLeaveConfirmed) {
                        toast.info("Incentive leave data excluded");
                    }
                }
            }

            if (validationResponse.data?.employees_with_multiple_rest_days_per_week?.length > 0) {
                setEmployeesWithExcessiveTimetableValues(validationResponse.data.employees_with_multiple_rest_days_per_week);
                setValidationStep('multiple_rest_days');

                const multipleRestDaysMessage = (
                    <div className="space-y-4 text-sm">
                        <p>Employees with more than 1 rest day in a week:</p>
                        <div className="space-y-1">
                            <div className="flex justify-between text-gray-600 font-semibold border-b border-slate-300 pb-1">
                                <span>Employee Name</span>
                                <span>Multiple Rest Days</span>
                            </div>
                            {validationResponse.data.employees_with_multiple_rest_days_per_week.map((item: any, idx: number) => (
                                <div key={item.employee_name + '-' + idx} className="flex justify-between items-start">
                                    <span>{item.employee_name}</span>
                                    <span className="text-right">
                                        {item.rest_day_dates.join(', ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4">Do you want to proceed?</p>
                    </div>
                );

                const multipleRestDaysConfirmed = await confirm({
                    title: "Confirm Multiple Rest Days Import",
                    message: "",
                    children: multipleRestDaysMessage,
                    size: "md"
                });

                if (!multipleRestDaysConfirmed) {
                    validationResponse.data.employees_with_multiple_rest_days_per_week.forEach((item: any) => {
                        if (item.employee_id && !excludedIds.includes(item.employee_id)) {
                            excludedIds.push(item.employee_id);
                        }
                    });
                    toast.info("Importing cancelled.");
                    setSubmitting(false);
                    return;
                }
            }

            setValidationStep('complete');
            setExcludedEmployeeIds(excludedIds);

            const importPayload = validatedFilePath
                ? { 
                    file_path: validatedFilePath,
                    excluded_employee_ids: excludedIds
                  }
                : {
                    ...values,
                    excluded_employee_ids: excludedIds
                  };

            const importResponse = await importTransactionsScheduleTime(importPayload);

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