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
            employer_share: "",
            employee_share: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employer_share: Yup.string().required("Employer share is required."),
            employee_share: Yup.string().required("Employee share is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Pagibig",
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
            title="Edit pagibig"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Employer Share"
                    placeholder="enter employer share"
                    name="employer_share"
                    type="text"
                    value={editFormHandler.values.employer_share}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.employer_share}
                />
                <Textfield
                    label="Employee Share"
                    placeholder="enter employee share"
                    name="employee_share"
                    type="text"
                    value={editFormHandler.values.employee_share}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.employee_share}
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