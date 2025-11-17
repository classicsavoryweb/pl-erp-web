"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editPagibig } from "@/api/maintenance/pagibig";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditPagibigForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            min_amount: 0,
            max_amount: 0,
            percentage: 0,
            max_deduction: 0,
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            min_amount: Yup.number().required("Minimum Amount is required.").min(1, "Must be greater than 0"),
            max_amount: Yup.number().required("Max Amount is required.").min(1, "Must be greater than 0"),
            percentage: Yup.number().required("Percentage is required.").min(1, "Must be greater than 0"),
            max_deduction: Yup.number().required("Max Deduction is required.").min(1, "Must be greater than 0"),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Pagibig Contribution",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editPagibig(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Pagibig updated successfully");
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
            title="Edit Pagibig Contribution"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Minimum Amount"
                    placeholder="enter minimum amount"
                    name="min_amount"
                    type="number"
                    value={editFormHandler.values.min_amount}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.min_amount}
                />
                <Textfield
                    label="Max Amount"
                    placeholder="enter max amount"
                    name="max_amount"
                    type="number"
                    value={editFormHandler.values.max_amount}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.max_amount}
                />
                <Textfield
                    label="Percentage"
                    placeholder="enter percentage"
                    name="percentage"
                    type="number"
                    value={editFormHandler.values.percentage}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.percentage}
                />
                <Textfield
                    label="Max Deduction"
                    placeholder="enter max deduction"
                    name="max_deduction"
                    type="number"
                    value={editFormHandler.values.max_deduction}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.max_deduction}
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

export default EditPagibigForm;