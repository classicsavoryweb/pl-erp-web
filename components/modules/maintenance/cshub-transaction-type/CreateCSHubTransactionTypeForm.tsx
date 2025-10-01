"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AccountDropDown from "../../generic/AccountDropDown";
import Grid from '@/components/common/Grid';
import TransactionTypeDropdown from "../../generic/TransactionTypeDropdown";
import ExamTypeDropdown from "../../generic/ExamTypeDropdown";
import DeductionDropDown from "../../generic/DeductionDropDown";
import Checkbox from "@/components/common/Checkbox";
import CSHubModuleDropDown from "../../generic/CSHubModuleDropDown";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";
import { createCSHubTransactionType } from "@/api/maintenance/cshub-transaction-type";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateCSHubTransactionTypeForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
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
            status: "active",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            source_id: Yup.string().required("CS hub source module is required."),
            transaction_type: Yup.string().required("CS hub transaction type is required."),
            deduction_id: Yup.string().required("Payroll deduction id is required."),
            ho_credit: Yup.string().required("HO credit account is required."),
            branch_debit: Yup.string().required("Branch debit is required."),
            branch_credit: Yup.string().required("Branch credit is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Transaction Type",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createCSHubTransactionType(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Transaction type created successfully");
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
            title="Create Transaction Type"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Transaction Type</span>
                </div>
                <Textfield
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    type="text"
                    value={createFormHandler.values.description}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.description}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createFormHandler.values.status}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.status}
                />
                <CSHubModuleDropDown
                    label="CS Hub Sourced Module"
                    required
                    name="source_id"
                    value={createFormHandler.values.source_id}
                    error={createFormHandler.errors.source_id}
                    onChange={createFormHandler.handleChange}
                    placeholder="select source module"
                />
                <DeductionDropDown
                    label="Payroll Deduction"
                    required
                    name="deduction_id"
                    value={createFormHandler.values.deduction_id}
                    error={createFormHandler.errors.deduction_id}
                    onChange={createFormHandler.handleChange}
                    placeholder="select deduction"
                />
                <TransactionTypeDropdown
                    label="CS Hub Transaction Type"
                    required
                    name="transaction_type"
                    value={Number(createFormHandler.values.transaction_type)}
                    error={createFormHandler.errors.transaction_type}
                    onChange={createFormHandler.handleChange}
                    placeholder="select transaction type"
                />
                <ExamTypeDropdown
                    label="CS Hub Exam Type"
                    name="exam_type"
                    value={Number(createFormHandler.values.exam_type)}
                    error={createFormHandler.errors.exam_type}
                    onChange={createFormHandler.handleChange}
                    placeholder="select exam type"
                />
                
                <Grid cols={2}>
                    <Checkbox
                        label="For Deduction (Positive)"
                        checked={createFormHandler.values.deduction_status_positive === "Yes"}
                        value="deduction_status_positive"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                createFormHandler.setFieldValue(value, "Yes");
                            } else {
                                createFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                    <Checkbox
                        label="For Deduction (Negative)"
                        checked={createFormHandler.values.deduction_status_negative === "Yes"}
                        value="deduction_status_negative"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                createFormHandler.setFieldValue(value, "Yes");
                            } else {
                                createFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                    <Checkbox
                        label="For Credit (Positive)"
                        checked={createFormHandler.values.credit_status_positive === "Yes"}
                        value="credit_status_positive"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                createFormHandler.setFieldValue(value, "Yes");
                            } else {
                                createFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                    <Checkbox
                        label="For Credit (Negative)"
                        checked={createFormHandler.values.credit_status_negative === "Yes"}
                        value="credit_status_negative"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                createFormHandler.setFieldValue(value, "Yes");
                            } else {
                                createFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                    <Checkbox
                        label="For Email"
                        checked={createFormHandler.values.email_status === "Yes"}
                        value="email_status"
                        onChange={(e) => {
                            const value = e.target.value;

                            if (e.target.checked) {
                                createFormHandler.setFieldValue(value, "Yes");
                            } else {
                                createFormHandler.setFieldValue(value, "No");
                            }
                        }}
                    />
                </Grid>
                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>H.O. Entry Setup</span>
                </div>
                <div className="flex justify-end">
                <Checkbox
                    label="Advances Debit"
                    checked={createFormHandler.values.advances_debit === "Yes"}
                    value="advances_debit"
                    onChange={(e) => {
                        const value = e.target.value;

                        if (e.target.checked) {
                            createFormHandler.setFieldValue(value, "Yes");
                            createFormHandler.setFieldValue("ho_debit", "");
                        } else {
                            createFormHandler.setFieldValue(value, "No");
                        }
                    }}
                />
                </div>
                <AccountDropDown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="ho_debit"
                    onChange={createFormHandler.handleChange}
                    value={createFormHandler.values.ho_debit}
                    error={createFormHandler.errors.ho_debit}
                    disabled={createFormHandler.values.advances_debit === "Yes"}
                />
                <AccountDropDown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="ho_credit"
                    onChange={createFormHandler.handleChange}
                    value={createFormHandler.values.ho_credit}
                    error={createFormHandler.errors.ho_credit}
                    required
                />
                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Branch Entry Setup</span>
                </div>
                <AccountDropDown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="branch_debit"
                    onChange={createFormHandler.handleChange}
                    value={createFormHandler.values.branch_debit}
                    error={createFormHandler.errors.branch_debit}
                    required
                />
                <AccountDropDown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="branch_credit"
                    onChange={createFormHandler.handleChange}
                    value={createFormHandler.values.branch_credit}
                    error={createFormHandler.errors.branch_credit}
                    required
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

export default CreateCSHubTransactionTypeForm;