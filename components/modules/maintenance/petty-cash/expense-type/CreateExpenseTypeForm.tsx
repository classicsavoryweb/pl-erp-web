"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { createExpenseType } from "@/api/maintenance/expense-type";
import AccountDropDown from "../../../generic/AccountDropDown";
import ActiveInactiveDropDown from "../../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const CreateExpenseTypeForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
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
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Create Expense Type",
                message: "Are you sure you want to create this expense type?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createExpenseType(values)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Expense type created successfully");
                            onSubmitCallback();
                            modal.onClose();
                            resetForm();
                        } else {
                            toast.error(resp.data.message || "Error creating expense type");
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

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Expense Type"
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
                
                <AccountDropDown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="debit_id"
                    onChange={createFormHandler.handleChange}
                    value={createFormHandler.values.debit_id ?? ""}
                    error={createFormHandler.errors.debit_id}
                    required
                />

                <AccountDropDown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="credit_id"
                    onChange={createFormHandler.handleChange}
                    value={createFormHandler.values.credit_id ?? ""}
                    error={createFormHandler.errors.credit_id}
                    required
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

                <hr className="mt-6 pb-2 text-slate-300" />
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

export default CreateExpenseTypeForm;
