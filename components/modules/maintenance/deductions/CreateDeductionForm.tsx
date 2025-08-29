"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import Dropdown from "@/components/common/Dropdown";
import confirm from "@/components/common/Confirm";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { createDeduction } from "@/api/maintenance/deductions";
import { getAccounts } from "@/api/accounting/accounts";
import { getVendors } from "@/api/accounting/vendors";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateDeductionForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
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
                title: "Create Deduction",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createDeduction(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Deduction created successfully");
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

    const api = useApiCall();
    const api_1 = useApiCall();

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getAccounts()
                .then((resp) => {
                    if (!resp.error) {
                        api.setDataSet(resp.data.accounts);
                    }
                })
                .finally(() => {
                    api.setLoading(false);
                });
            api_1.setLoading(true);
            getVendors()
                .then((resp) => {
                    if (!resp.error) {
                        api_1.setDataSet(resp.data.vendors);
                    }
                })
                .finally(() => {
                    api_1.setLoading(false);
                });
        }
    }, [modal.isShowing]);

    const accountOptions = api.dataSet?.map((acc: any) => ({
        label: acc.acc_name,
        value: acc.acc_no
    }));

    const vendorOptions = api_1.dataSet?.map((acc: any) => ({
        label: acc.ven_name,
        value: acc.ven_no
    }));

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Deduction"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
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
                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Deduction Setup</span>
                </div>
                <Dropdown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="debit_id"
                    value={createFormHandler.values.debit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.debit_id}
                    options={accountOptions}
                />
                <Dropdown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="credit_id"
                    value={createFormHandler.values.credit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.credit_id}
                    options={accountOptions}
                />

                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Amortization Setup</span>
                </div>
                <Dropdown
                    label="Vendor"
                    placeholder="select vendor"
                    name="amortization_vendor_id"
                    value={createFormHandler.values.amortization_vendor_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.amortization_vendor_id}
                    options={vendorOptions}
                />
                <Dropdown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="amortization_debit_id"
                    value={createFormHandler.values.amortization_debit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.amortization_debit_id}
                    options={accountOptions}
                />
                <Dropdown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="amortization_credit_id"
                    value={createFormHandler.values.amortization_credit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.amortization_credit_id}
                    options={accountOptions}
                />

                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>End Loan Setup</span>
                </div>
                <Dropdown
                    label="Vendor"
                    placeholder="select vendor"
                    name="end_loan_vendor_id"
                    value={createFormHandler.values.end_loan_vendor_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.end_loan_vendor_id}
                    options={vendorOptions}
                />
                <Dropdown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="end_loan_debit_id"
                    value={createFormHandler.values.end_loan_debit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.end_loan_debit_id}
                    options={accountOptions}
                />
                <Dropdown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="end_loan_credit_id"
                    value={createFormHandler.values.end_loan_credit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.end_loan_credit_id}
                    options={accountOptions}
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

export default CreateDeductionForm;