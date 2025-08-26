"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import Dropdown from "@/components/common/Dropdown";
import confirm from "@/components/common/Confirm";
import { editDeduction } from "@/api/maintenance/deductions";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditDeductionForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            description: "",
            debit_id: "",
            credit_id: "",
            amortization_vendor_id: "",
            amortization_debit_id: "",
            amortization_credit_id: "",
            end_loan_vendor_id: "",
            end_loan_debit_id: "",
            end_loan_credit_id: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            debit_id: Yup.string().required("Debit account is required."),
            credit_id: Yup.string().required("Credit account is required."),
            amortization_vendor_id: Yup.string().required("Amortization vendor is required."),
            amortization_debit_id: Yup.string().required("Amortization debit is required."),
            amortization_credit_id: Yup.string().required("Amortization credit is required."),
            end_loan_vendor_id: Yup.string().required("End loan vendor is required."),
            end_loan_debit_id: Yup.string().required("End loan debit is required."),
            end_loan_credit_id: Yup.string().required("End loan credit is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Deduction",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editDeduction(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Deduction updated successfully");
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
            title="Edit Deduction"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
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
                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Deduction Setup</span>
                </div>
                <Dropdown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="debit_id"
                    value={editFormHandler.values.debit_id}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.debit_id}
                    options={[
                        {
                            label: "Sample 1",
                            value: "Sample 1"
                        },
                        {
                            label: "Sample 2",
                            value: "Sample 2"
                        },
                    ]}
                />
                <Dropdown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="credit_id"
                    value={editFormHandler.values.credit_id}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.credit_id}
                    options={[
                        {
                            label: "Sample 1",
                            value: "Sample 1"
                        },
                        {
                            label: "Sample 2",
                            value: "Sample 2"
                        },
                    ]}
                />

                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Amortization Setup</span>
                </div>
                <Dropdown
                    label="Vendor"
                    placeholder="select vendor"
                    name="amortization_vendor_id"
                    value={editFormHandler.values.amortization_vendor_id}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.amortization_vendor_id}
                    options={[
                        {
                            label: "Sample 1",
                            value: "Sample 1"
                        },
                        {
                            label: "Sample 2",
                            value: "Sample 2"
                        },
                    ]}
                />
                <Dropdown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="amortization_debit_id"
                    value={editFormHandler.values.amortization_debit_id}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.amortization_debit_id}
                    options={[
                        {
                            label: "Sample 1",
                            value: "Sample 1"
                        },
                        {
                            label: "Sample 2",
                            value: "Sample 2"
                        },
                    ]}
                />
                <Dropdown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="amortization_credit_id"
                    value={editFormHandler.values.amortization_credit_id}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.amortization_credit_id}
                    options={[
                        {
                            label: "Sample 1",
                            value: "Sample 1"
                        },
                        {
                            label: "Sample 2",
                            value: "Sample 2"
                        },
                    ]}
                />

                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>End Loan Setup</span>
                </div>
                <Dropdown
                    label="Vendor"
                    placeholder="select vendor"
                    name="end_loan_vendor_id"
                    value={editFormHandler.values.end_loan_vendor_id}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.end_loan_vendor_id}
                    options={[
                        {
                            label: "Sample 1",
                            value: "Sample 1"
                        },
                        {
                            label: "Sample 2",
                            value: "Sample 2"
                        },
                    ]}
                />
                <Dropdown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="end_loan_debit_id"
                    value={editFormHandler.values.end_loan_debit_id}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.end_loan_debit_id}
                    options={[
                        {
                            label: "Sample 1",
                            value: "Sample 1"
                        },
                        {
                            label: "Sample 2",
                            value: "Sample 2"
                        },
                    ]}
                />
                <Dropdown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="end_loan_credit_id"
                    value={editFormHandler.values.end_loan_credit_id}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.end_loan_credit_id}
                    options={[
                        {
                            label: "Sample 1",
                            value: "Sample 1"
                        },
                        {
                            label: "Sample 2",
                            value: "Sample 2"
                        },
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

export default EditDeductionForm;