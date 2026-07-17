"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { editExpenseType } from "@/api/maintenance/expense-type";
import { useEffect } from "react";
import AccountDropDown from "../../../generic/AccountDropDown";
import ActiveInactiveDropDown from "../../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditExpenseTypeForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            id: "",
            description: "",
            debit_id: "",
            credit_id: "",
            status: "active",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            debit_id: Yup.string().required("Debit account is required."),
            credit_id: Yup.string().required("Credit account is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Edit Expense Type",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editExpenseType(values, formValue.id)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Expense type updated successfully");
                            onSubmitCallback();
                            modal.onClose();
                        } else {
                            toast.error(resp.data.message || "Error updating expense type");
                        }
                    })
                    .catch(() => {
                        toast.error("Error encountered");
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
            }
        }
    });

    useEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues({
                id: formValue.id ?? "",
                description: formValue.description ?? "",
                debit_id: formValue.debit_id ?? "",
                credit_id: formValue.credit_id ?? "",
                status: formValue.status ?? "active",
            });
        }
    }, [modal.isShowing, formValue]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Expense Type"
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

                <AccountDropDown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="debit_id"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.debit_id ?? ""}
                    error={editFormHandler.errors.debit_id}
                    required
                />

                <AccountDropDown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="credit_id"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.credit_id ?? ""}
                    error={editFormHandler.errors.credit_id}
                    required
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

                <hr className="mt-6 pb-2 text-slate-300" />
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
                            onClick={() => { }}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditExpenseTypeForm;
