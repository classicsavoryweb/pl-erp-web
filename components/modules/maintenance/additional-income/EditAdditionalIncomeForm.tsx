"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import AccountDropDown from "../../generic/AccountDropDown";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import Checkbox from "@/components/common/Checkbox";
import confirm from "@/components/common/Confirm";
import { editAdditionalIncome } from "@/api/maintenance/additional-income";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditAdditionalIncomeForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            description: "",
            taxable: "",
            status: "",
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
                title: "Edit Additional Income",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editAdditionalIncome(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Additional Income updated successfully");
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
            title="Edit Additional Income"
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
                <Checkbox
                    label="Taxable"
                    checked={editFormHandler.values.taxable === "Yes"}
                    value="taxable"
                    onChange={(e) => {
                        const value = e.target.value;

                        if (e.target.checked) {
                            editFormHandler.setFieldValue(value, "Yes");
                        } else {
                            editFormHandler.setFieldValue(value, "No");
                        }
                    }}
                />
                <div className="flex mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Head Office</span>
                </div>
                <AccountDropDown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="head_office_debit_id"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.head_office_debit_id}
                    error={editFormHandler.errors.head_office_debit_id}
                    required
                />
                <AccountDropDown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="head_office_credit_id"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.head_office_credit_id}
                    error={editFormHandler.errors.head_office_credit_id}
                    required
                />

                <div className="fletext-gray-600 mt-3 font-semibold border-b border-slate-300 pb-1 mb-1">
                    <span>Store</span>
                </div>
                <AccountDropDown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="store_debit_id"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.store_debit_id}
                    error={editFormHandler.errors.store_debit_id}
                    required
                />
                <AccountDropDown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="store_credit_id"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.store_credit_id}
                    error={editFormHandler.errors.store_credit_id}
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

export default EditAdditionalIncomeForm;