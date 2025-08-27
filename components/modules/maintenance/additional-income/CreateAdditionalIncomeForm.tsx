"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import Checkbox from "@/components/common/Checkbox";
import Dropdown from "@/components/common/Dropdown";
import confirm from "@/components/common/Confirm";
import { createAdditionalIncome } from "@/api/maintenance/additional-income";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateAdditionalIncomeForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            description: "",
            taxable: "Yes",
            status: "active",
            head_office_debit_id: "",
            head_office_credit_id: "",
            store_debit_id: "",
            store_credit_id: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            taxable: Yup.string().required("Taxable is required."),
            status: Yup.string().required("Status is required."),
            head_office_debit_id: Yup.string().required("Head office debit is required."),
            head_office_credit_id: Yup.string().required("Head office credit is required."),
            store_debit_id: Yup.string().required("Store debit is required."),
            store_credit_id: Yup.string().required("Store credit is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Create Additional Income",
                message: "Are you sure you want to create?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createAdditionalIncome(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Additional Income created successfully");
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
            title="Create additional income"
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
                <Checkbox
                    label="Taxable"
                    checked={createFormHandler.values.taxable === "Yes"}
                    value="taxable"
                    onChange={(e) => {
                        const value = e.target.value;

                        if (e.target.checked) {
                            createFormHandler.setFieldValue(value, "Yes");
                        } else {
                            createFormHandler.setFieldValue(value, "No");
                        }
                    }}
                />
                <div className="flex text-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Head Office</span>
                </div>
                <Dropdown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="head_office_debit_id"
                    value={createFormHandler.values.head_office_debit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.head_office_debit_id}
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
                    name="head_office_credit_id"
                    value={createFormHandler.values.head_office_credit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.head_office_credit_id}
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
                    <span>Store</span>
                </div>
                <Dropdown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="store_debit_id"
                    value={createFormHandler.values.store_debit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.store_debit_id}
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
                    name="store_credit_id"
                    value={createFormHandler.values.store_credit_id}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.store_credit_id}
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

export default CreateAdditionalIncomeForm;