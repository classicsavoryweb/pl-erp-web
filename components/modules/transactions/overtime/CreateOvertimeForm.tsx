"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import BranchDropDown from "../../generic/BranchDropDown";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";
import { createOvertime } from "@/api/transactions/overtime";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import Dropdown from "@/components/common/Dropdown";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateOvertimeForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>({});

    const createFormHandler = useFormik({
        initialValues: {
            employee_number: "",
            date: "",
            regular_overtime: "",
            legal_holiday_overtime: "",
            special_holiday_overtime: "",
            night_diff_overtime: "",
            overtime_status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_number: Yup.string().required("Employee is required."),
            date: Yup.string().required("Date is required."),
            regular_overtime: Yup.string().required("Regular overtime is required."),
            legal_holiday_overtime: Yup.string().required("Legal holiday overtime is required."),
            special_holiday_overtime: Yup.string().required("Special holiday overtime is required."),
            night_diff_overtime: Yup.string().required("Night diff overtime is required."),
            overtime_status: Yup.string().required("Overtime status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Overtime",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createOvertime(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Overtime created successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally((() => {
                    setSubmitting(false);
                }));
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Overtime"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <SearchEmployeeDropDown
                    label="Employee"
                    placeholder="select employee"
                    name="employee"
                    value={employee}
                    onChange={(e) => {
                        setEmployee(e.target.value);
                        createFormHandler.setFieldValue("branch_assignment_id", e.target.value.branch_id);
                        createFormHandler.setFieldValue("employee_number", e.target.value.employee_number);
                    }}
                    error={createFormHandler.errors.employee_number}
                    status="active"
                />
                <Textfield
                    label="Branch"
                    placeholder="-"
                    value={employee?.current_branch?.name ?? ""}
                    disabled
                />
                <Textfield
                    label="Date"
                    placeholder="enter date"
                    name="date"
                    type="date"
                    value={createFormHandler.values.date}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.date}
                />
                <Textfield
                    label="Regular Overtime"
                    placeholder="enter overtime"
                    name="regular_overtime"
                    type="text"
                    value={createFormHandler.values.regular_overtime}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.regular_overtime}
                />
                <Textfield
                    label="Night Diff Overtime"
                    placeholder="enter night diff overtime"
                    name="night_diff_overtime"
                    type="text"
                    value={createFormHandler.values.night_diff_overtime}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.night_diff_overtime}
                />
                <Textfield
                    label="Legal Holiday Overtime"
                    placeholder="enter legal holiday overtime"
                    name="legal_holiday_overtime"
                    type="text"
                    value={createFormHandler.values.legal_holiday_overtime}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.legal_holiday_overtime}
                />
                <Textfield
                    label="Special Holiday Overtime"
                    placeholder="enter special holiday overtime"
                    name="special_holiday_overtime"
                    type="text"
                    value={createFormHandler.values.special_holiday_overtime}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.special_holiday_overtime}
                />
                <Dropdown
                    label="Overtime Status"
                    placeholder="select overtime status"
                    name="overtime_status"
                    value={createFormHandler.values.overtime_status}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.overtime_status}
                    options={[
                        {
                            label: "Approved",
                            value: "Approved"
                        },
                        {
                            label: "Unapproved",
                            value: "Unapproved"
                        }
                    ]}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createFormHandler.resetForm();
                                setEmployee({});
                            }}
                            
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateOvertimeForm;