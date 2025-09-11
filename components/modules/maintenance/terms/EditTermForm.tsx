"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editTerm } from "@/api/maintenance/terms";
interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditTermForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            description: "",
            cutoff: "",
            amount_from: "",
            amount_to: "",
            month: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Description is required."),
            cutoff: Yup.string().required("Cutoff is required."),
            amount_from: Yup.string().required("Amount from is required."),
            amount_to: Yup.string().required("Amount to is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Term",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editTerm(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Term updated successfully");
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
            title="Edit Term"
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
                <Textfield
                    label="Cutoff"
                    placeholder="enter cutoff"
                    name="cutoff"
                    type="number"
                    value={editFormHandler.values.cutoff}
                    required
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newCutoff = e.target.value;
                        editFormHandler.setFieldValue("cutoff", newCutoff);

                        const cutoffValue = parseInt(newCutoff, 10);
                        if (!isNaN(cutoffValue)) {
                            const monthValue = (cutoffValue - 0) * 0.5; 
                            editFormHandler.setFieldValue("month", monthValue.toFixed(1));
                        }
                    }}
                    error={editFormHandler.errors.cutoff}
                />
                <Textfield
                    label="Amount from"
                    placeholder="enter amount"
                    name="amount_from"
                    type="number"
                    value={editFormHandler.values.amount_from}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.amount_from}
                />
                <Textfield
                    label="Amount to"
                    placeholder="enter amount"
                    name="amount_to"
                    type="number"
                    value={editFormHandler.values.amount_to}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.amount_to}
                />
                <Textfield
                    label="Month"
                    name="month"
                    type="text"
                    value={editFormHandler.values.month}
                    required
                    disabled
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.month}
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

export default EditTermForm;