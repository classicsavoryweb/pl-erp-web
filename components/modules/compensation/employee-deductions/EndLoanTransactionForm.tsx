"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useEffect } from "react";
import TextArea from "@/components/common/TextArea";
import confirm from "@/components/common/Confirm";
import { endLoanTransaction } from "@/api/compensation/employee-deductions";
import * as Yup from "yup";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EndLoanTransactionForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            balance: "",
            amount: "",
            end_loan_reason: "",
            end_loan_status: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            end_loan_reason: Yup.string()
                .trim()
                .required("End loan reason is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "End Loan Transaction",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                endLoanTransaction(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("End loan updated successfully");
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
            title="End Loan Transaction"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <TextArea
                    label="End loan reason"
                    name="end_loan_reason"
                    value={editFormHandler.values.end_loan_reason ?? ""}
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.end_loan_reason}
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

export default EndLoanTransactionForm;
