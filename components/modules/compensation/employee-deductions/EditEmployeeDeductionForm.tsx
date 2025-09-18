"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useEffect, useState } from "react";
import Checkbox from "@/components/common/Checkbox";
import BranchDropDown from "../../generic/BranchDropDown";
import TextArea from "@/components/common/TextArea";
import DeductionDropDown from "../../generic/DeductionDropDown";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import confirm from "@/components/common/Confirm";
import { editEmployeeDeduction } from "@/api/compensation/employee-deductions";
import { getEmployee } from "@/api/employee";
import { getBranches } from "@/api/branches";
interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditEmployeeDeductionForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>({});
    const [branch, setBranch] = useState<any>({});
    const api = useApiCall();

    const editFormHandler = useFormik({
        initialValues: {
            employee_id: "",
            deduction_id: "",
            months: "",
            amount: "",
            start_date: "",
            end_date: "",
            monthly_amortization: "",
            balance: "",
            remarks: "",
            branch_id: "",
            block_payment: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            deduction_id: Yup.string().required("Deduction ID is required."),
            months: Yup.string().required("Month(s) is required."),
            amount: Yup.string().required("Amount is required."),
            start_date: Yup.string().required("Start date is required."),
            end_date: Yup.string().required("End date is required."),
            monthly_amortization: Yup.string().required("Monthly amortization is required."),
            balance: Yup.string().required("Balance is required."),
            branch_id: Yup.string().required("Branch is required."),
            block_payment: Yup.string().required("Block Payment is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Deduction",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editEmployeeDeduction(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Deduction updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        setEmployee({});
                        setBranch({}); 
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

    useAsyncEffect(() => {
        if (modal.isShowing) {

            editFormHandler.setValues({
                ...formValue,
            });

            api.setLoading(true);
            getEmployee(formValue.employee_number).then((resp: any) => {
                if (!resp.error && resp.data.employee) {
                    const employeeData = resp.data.employee;
                    setEmployee(employeeData);
                } else {
                    setEmployee({});
                    setBranch({});
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                setEmployee({});
                setBranch({});
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    useEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    const updateDerivedFields = (updatedValues: any) => {
        const { months, amount, start_date } = updatedValues;

        const cleanMonths = typeof months === 'string' ? months.replace(/,/g, '') : String(months);
        const cleanAmount = typeof amount === 'string' ? amount.replace(/,/g, '') : String(amount);

        const parsedMonths = Number(cleanMonths);
        const parsedAmount = Number(cleanAmount);

        const isValidMonths = Number.isFinite(parsedMonths);
        const isValidAmount = Number.isFinite(parsedAmount);

        if (isValidMonths && start_date) {
            const start = new Date(start_date);
            const end = new Date(start);
            end.setMonth(start.getMonth() + parsedMonths);
            const formattedEndDate = end.toISOString().split("T")[0];
            editFormHandler.setFieldValue("end_date", formattedEndDate);
        }

        if (isValidAmount) {
            editFormHandler.setFieldValue("balance", parsedAmount.toFixed(2));
        }

        if (isValidAmount && isValidMonths && parsedMonths > 0) {
            const monthly = parsedAmount / parsedMonths;
            editFormHandler.setFieldValue("monthly_amortization", monthly.toFixed(2));
        } else {
            editFormHandler.setFieldValue("monthly_amortization", "");
        }
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Deduction"
            onClose={() => {
                modal.onClose();
                setEmployee({});
                setBranch({});
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <SearchEmployeeDropDown
                    label="Employee"
                    placeholder="select employee"
                    name="employee"
                    onChange={editFormHandler.handleChange}
                    value={employee}
                    error={editFormHandler.errors.employee_id}
                    required
                    disabled
                />
                <DeductionDropDown
                    label="Deduction ID"
                    required
                    name="deduction_id"
                    value={Number(editFormHandler.values.deduction_id)}
                    error={editFormHandler.errors.deduction_id}
                    onChange={editFormHandler.handleChange}
                    placeholder="select deduction"
                />
                <Textfield
                    label="Month(s)"
                    name="months"
                    type="number"
                    value={editFormHandler.values.months}
                    required
                    onChange={(e) => {
                        editFormHandler.handleChange(e);
                        updateDerivedFields({
                            ...editFormHandler.values,
                            months: e.target.value
                        });
                    }}
                    error={editFormHandler.errors.months}
                />
                <Textfield
                    label="Amount"
                    placeholder="enter amount"
                    name="amount"
                    type="text"
                    value={editFormHandler.values.amount}
                    required
                    onChange={(e) => {
                        editFormHandler.handleChange(e);
                        updateDerivedFields({
                            ...editFormHandler.values,
                            amount: e.target.value
                        });
                    }}
                    error={editFormHandler.errors.amount}
                />
                <Textfield
                    label="Start Date"
                    placeholder="select start date"
                    name="start_date"
                    type="date"
                    value={editFormHandler.values.start_date}
                    required
                    onChange={(e) => {
                        editFormHandler.handleChange(e);
                        updateDerivedFields({
                            ...editFormHandler.values,
                            start_date: e.target.value
                        });
                    }}
                    error={editFormHandler.errors.start_date}
                />
                <Textfield
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={editFormHandler.values.end_date}
                    disabled
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.end_date}
                />
                <Textfield
                    label="Monthly Amortization"
                    name="monthly_amortization"
                    type="text"
                    value={editFormHandler.values.monthly_amortization}
                    disabled
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.monthly_amortization}
                />
                <Textfield
                    label="Balance"
                    name="balance"
                    type="text"
                    value={editFormHandler.values.balance}
                    disabled
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.balance}
                />
                <BranchDropDown
                    placeholder="select branch"
                    label="Branch"
                    name="branch_id"
                    value={Number(editFormHandler.values.branch_id)}
                    onChange={(e) => {
                        const branch = e.target.obj;
                        setBranch(branch);

                        editFormHandler.setFieldValue("branch_id", Number(branch.id));
                    }}
                    error={editFormHandler.errors.branch_id}
                />
                <Checkbox
                    label="Block Payment"
                    checked={editFormHandler.values.block_payment === "Yes"}
                    value="block_payment"
                    onChange={(e) => {
                        editFormHandler.setFieldValue("block_payment", e.target.checked ? "Yes" : "No");
                    }}
                />
                <TextArea
                    label="Remarks"
                    name="remarks"
                    value={editFormHandler.values.remarks}
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.remarks}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                setEmployee({});
                                setBranch({});
                                editFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={editFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditEmployeeDeductionForm;