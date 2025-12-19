"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editLastPayDeductionDetails } from "@/api/compensation/last-pay";
interface FormModalInterface {
    modal: any;
    formValue: any;
}

const EditLastPayDeductionDetails = ({
    modal,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            amount: "",
        },
        validateOnChange: false,
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Edit Deduction",
                message: "Are you sure you want to save changes?"
            });

            if(isConfirmed) {
                setSubmitting(true);
                editLastPayDeductionDetails(formValue.id, {
                    amount: values.amount
                }).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        modal.onClose();
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
                    label="Amount"
                    name="amount"
                    type="number"
                    value={editFormHandler.values.amount}
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.amount}
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

export default EditLastPayDeductionDetails;