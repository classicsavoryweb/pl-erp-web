"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import Textfield from "@/components/common/Textfield";
import Checkbox from "@/components/common/Checkbox";
import DeductionDropDown from "../../generic/DeductionDropDown";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import confirm from "@/components/common/Confirm";
import { createEmployeeDeduction } from "@/api/compensation/employee-deductions";
import BranchDropDown from "../../generic/BranchDropDown";
import TextArea from "@/components/common/TextArea";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateEmployeeDeductionForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>({});
    const [branch, setBranch] = useState<any>({});

    const today = new Date().toISOString().split("T")[0]; 

    const createFormHandler = useFormik({
        initialValues: {
            employee_id: "",
            deduction_id: "",
            months: "",
            amount: "",
            start_date: today,
            end_date: today,
            monthly_amortization: "",
            balance: "",
            remarks: "",
            branch_id: "",
            block_payment: "No",
            approved_by: null,
            approved_date: null,
            approved_status: "Yes",
            deduction_status: null,
            end_loan_reason: null,
            end_loan_status: "No"
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_id: Yup.string().required("Employee ID is required."),
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
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Create Deduction",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createEmployeeDeduction(values)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Deduction created successfully");
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
                    }).finally(() => {
                        setSubmitting(false);
                    });
            }
        }
    });

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
            createFormHandler.setFieldValue("end_date", formattedEndDate);
        }

        if (isValidAmount) {
            createFormHandler.setFieldValue("balance", parsedAmount.toFixed(2));
        }

        if (isValidAmount && isValidMonths && parsedMonths > 0) {
            const monthly = parsedAmount / parsedMonths;
            createFormHandler.setFieldValue("monthly_amortization", monthly.toFixed(2));
        } else {
            createFormHandler.setFieldValue("monthly_amortization", "");
        }
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Deduction"
            onClose={() => {
                modal.onClose();
                setEmployee({});
                setBranch({});
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <SearchEmployeeDropDown
                    status="all"
                    label="Employee"
                    placeholder="select employee"
                    name="employee_id"
                    onChange={(e) => {
                        const selectedEmployee = e.target.value;
                        setEmployee(selectedEmployee);
                        createFormHandler.setFieldValue("employee_id", selectedEmployee.id);

                        if (selectedEmployee.current_branch?.id) {
                            createFormHandler.setFieldValue("branch_id", selectedEmployee.current_branch.id);
                        }
                    }}
                    value={employee}
                    error={createFormHandler.errors.employee_id}
                    required
                />
                <DeductionDropDown
                    label="Deduction Type"
                    required
                    name="deduction_id"
                    value={createFormHandler.values.deduction_id}
                    error={createFormHandler.errors.deduction_id}
                    onChange={createFormHandler.handleChange}
                    placeholder="select deduction type"
                />
                <Textfield
                    label="Month(s)"
                    name="months"
                    type="number"
                    value={createFormHandler.values.months}
                    required
                    onChange={(e) => {
                        createFormHandler.handleChange(e);
                        updateDerivedFields({
                            ...createFormHandler.values,
                            months: e.target.value
                        });
                    }}
                    error={createFormHandler.errors.months}
                />
                <Textfield
                    label="Amount"
                    placeholder="enter amount"
                    name="amount"
                    type="number"
                    value={createFormHandler.values.amount}
                    required
                    onChange={(e) => {
                        createFormHandler.handleChange(e);
                        updateDerivedFields({
                            ...createFormHandler.values,
                            amount: e.target.value
                        });
                    }}
                    error={createFormHandler.errors.amount}
                />
                <Textfield
                    label="Start Date"
                    placeholder="select start date"
                    name="start_date"
                    type="date"
                    value={createFormHandler.values.start_date}
                    required
                    onChange={(e) => {
                        createFormHandler.handleChange(e);
                        updateDerivedFields({
                            ...createFormHandler.values,
                            start_date: e.target.value
                        });
                    }}
                    error={createFormHandler.errors.start_date}
                />
                <Textfield
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={createFormHandler.values.end_date}
                    disabled
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.end_date}
                />
                <Textfield
                    label="Monthly Amortization"
                    name="monthly_amortization"
                    type="text"
                    value={createFormHandler.values.monthly_amortization}
                    disabled
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.monthly_amortization}
                />
                <Textfield
                    label="Balance"
                    name="balance"
                    type="text"
                    value={createFormHandler.values.balance}
                    disabled
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.balance}
                />
                <BranchDropDown
                    placeholder="select branch"
                    label="Branch"
                    name="branch_id"
                    value={createFormHandler.values.branch_id}
                    onChange={(e) => {
                        createFormHandler.handleChange(e);
                        const branch = e.target.obj;
                        setBranch(branch);
                    }}
                    error={createFormHandler.errors.branch_id}
                />
                <Checkbox
                    label="Block Payment"
                    checked={createFormHandler.values.block_payment === "Yes"}
                    value="block_payment"
                    onChange={(e) => {
                        createFormHandler.setFieldValue("block_payment", e.target.checked ? "Yes" : "No");
                    }}
                />
                <TextArea
                    label="Remarks"
                    name="remarks"
                    value={createFormHandler.values.remarks}
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.remarks}
                />
                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                setEmployee({});
                                setBranch({});
                                createFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={() => { }}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default CreateEmployeeDeductionForm;