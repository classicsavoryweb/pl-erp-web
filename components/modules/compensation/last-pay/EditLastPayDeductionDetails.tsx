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
    onUpdated?: (updatedDeduction: any) => void;
}

const EditLastPayDeductionDetails = ({
    modal,
    formValue,
    onUpdated
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            amount: "",
        },
        validateOnChange: false,
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isPreview = formValue?.__source === "preview";
            const isConfirmed = await confirm({
                title: "Edit Deduction",
                message: "Are you sure you want to save changes?"
            });

            if(isConfirmed) {
                if (isPreview) {
                    onUpdated?.({
                        ...formValue,
                        amount: values.amount
                    });
                    modal.onClose();
                    resetForm();
                    return;
                }

                setSubmitting(true);
                editLastPayDeductionDetails(formValue.id, {
                    amount: values.amount
                }).then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        onUpdated?.({
                            ...formValue,
                            amount: values.amount
                        });
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
            if (formValue?.deduction?.description === "SSS Loans") {
                editFormHandler.setValues({
                    ...formValue,
                    amount: formValue?.balance ?? formValue?.amount ?? ""
                });
            } else {
                editFormHandler.setValues(formValue);
            }
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Balance"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Balance"
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
