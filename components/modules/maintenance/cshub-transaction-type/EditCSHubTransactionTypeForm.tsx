"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import AccountDropDown from "../../generic/AccountDropDown";
import Grid from '@/components/common/Grid';
import TransactionTypeDropdown from "../../generic/TransactionTypeDropdown";
import ExamTypeDropdown from "../../generic/ExamTypeDropdown";
import DeductionDropDown from "../../generic/DeductionDropDown";
import Checkbox from "@/components/common/Checkbox";
import CSHubModuleDropDown from "../../generic/CSHubModuleDropDown";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";
import { editCSHubTransactionType } from "@/api/maintenance/cshub-transaction-type";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditCSHubTransactionTypeForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            description: "",
            source_id: "",
            transaction_type: "",
            exam_type: "",
            deduction_id: "",
            deduction_status_positive: "",
            deduction_status_negative: "",
            credit_status_positive: "",
            credit_status_negative: "",
            email_status: "",
            ho_debit: "",
            ho_credit: "",
            branch_debit: "",
            branch_credit: "",
            advances_debit: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            source_id: Yup.string().required("CS hub source module is required."),
            transaction_type: Yup.string().required("CS hub transaction type is required."),
            deduction_id: Yup.string().required("Payroll deduction id is required."),
            ho_credit: Yup.string().required("HO credit account is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Transaction Type",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editCSHubTransactionType(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Transaction type updated successfully");
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

    useEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Transaction Type"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <div className="flex  mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Transaction Type</span>
                </div>
                <Textfield
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    type="text"
                    value={editFormHandler.values.description}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.description}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editFormHandler.values.status}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.status}
                />
                <CSHubModuleDropDown
                    label="CS Hub Sourced Module"
                    required
                    name="source_id"
                    value={editFormHandler.values.source_id}
                    error={editFormHandler.errors.source_id}
                    onChange={editFormHandler.handleChange}
                    placeholder="select source module"
                />
                <DeductionDropDown
                    label="Payroll Deduction"
                    required
                    name="deduction_id"
                    value={Number(editFormHandler.values.deduction_id)}
                    error={editFormHandler.errors.deduction_id}
                    onChange={editFormHandler.handleChange}
                    placeholder="select deduction"
                />
                <TransactionTypeDropdown
                    label="CS Hub Transaction Type"
                    required
                    name="transaction_type"
                    value={Number(editFormHandler.values.transaction_type)}
                    error={editFormHandler.errors.transaction_type}
                    onChange={editFormHandler.handleChange}
                    placeholder="select transaction type"
                />
                <ExamTypeDropdown
                    label="CS Hub Exam Type"
                    name="exam_type"
                    value={Number(editFormHandler.values.exam_type)}
                    error={editFormHandler.errors.exam_type}
                    onChange={editFormHandler.handleChange}
                    placeholder="select exam type"
                />
                <Grid cols={2}>
                    <Checkbox
                        label="For Deduction (Positive)"
                        checked={editFormHandler.values.deduction_status_positive === "Yes"}
                        value="deduction_status_positive"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                editFormHandler.setFieldValue(value, "Yes");
                            } else {
                                editFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                    <Checkbox
                        label="For Deduction (Negative)"
                        checked={editFormHandler.values.deduction_status_negative === "Yes"}
                        value="deduction_status_negative"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                editFormHandler.setFieldValue(value, "Yes");
                            } else {
                                editFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                    <Checkbox
                        label="For Credit (Positive)"
                        checked={editFormHandler.values.credit_status_positive === "Yes"}
                        value="credit_status_positive"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                editFormHandler.setFieldValue(value, "Yes");
                            } else {
                                editFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                    <Checkbox
                        label="For Credit (Negative)"
                        checked={editFormHandler.values.credit_status_negative === "Yes"}
                        value="credit_status_negative"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                editFormHandler.setFieldValue(value, "Yes");
                            } else {
                                editFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                    <Checkbox
                        label="For Email"
                        checked={editFormHandler.values.email_status === "Yes"}
                        value="email_status"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                editFormHandler.setFieldValue(value, "Yes");
                            } else {
                                editFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                </Grid>
                <div className="flex mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>H.O. Entry Setup</span>
                </div>
                <div className="flex justify-end">
                <Checkbox
                    label="Advances Debit"
                    checked={editFormHandler.values.advances_debit === "Yes"}
                    value="advances_debit"
                    onChange={(e) => {
                        const value = e.target.value;

                        if (e.target.checked) {
                            editFormHandler.setFieldValue(value, "Yes");
                            editFormHandler.setFieldValue("ho_debit", "");
                        } else {
                            editFormHandler.setFieldValue(value, "No");
                        }
                    }}
                />
                </div>
                <AccountDropDown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="ho_debit"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.ho_debit}
                    error={editFormHandler.errors.ho_debit}
                    disabled={editFormHandler.values.advances_debit === "Yes"}
                />
                <AccountDropDown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="ho_credit"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.ho_credit}
                    error={editFormHandler.errors.ho_credit}
                    required
                />
                <div className="flex  mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Branch Entry Setup</span>
                </div>
                <AccountDropDown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="branch_debit"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.branch_debit}
                    error={editFormHandler.errors.branch_debit}
                />
                <AccountDropDown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="branch_credit"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.branch_credit}
                    error={editFormHandler.errors.branch_credit}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
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

export default EditCSHubTransactionTypeForm;