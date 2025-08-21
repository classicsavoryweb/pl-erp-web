"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editSSS } from "@/api/maintenance/sss";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditSSSForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            salary_range_min: "",
            salary_range_max: "",
            salary_credit: "",
            employer_ss: "",
            employer_cc: "",
            employee_ss: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            salary_range_min: Yup.string().required("Salary range minimum is required."),
            salary_range_max: Yup.string().required("Salary range maximum is required."),
            salary_credit: Yup.string().required("Salary credit is required."),
            employer_ss: Yup.string().required("Employer SS is required."),
            employer_cc: Yup.string().required("Employer CC is required."),
            employee_ss: Yup.string().required("Employee SS is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit SSS",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editSSS(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("SSS updated successfully");
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
            title="Edit SSS"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Salary Range Minimum"
                    placeholder="enter salary range minimum"
                    name="salary_range_min"
                    type="text"
                    value={editFormHandler.values.salary_range_min}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.salary_range_min}
                />
                <Textfield
                    label="Salary Range Maximum"
                    placeholder="enter salary range maximum"
                    name="salary_range_max"
                    type="text"
                    value={editFormHandler.values.salary_range_max}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.salary_range_max}
                />
                <Textfield
                    label="Salary Credit"
                    placeholder="enter salary credit"
                    name="salary_credit"
                    type="text"
                    value={editFormHandler.values.salary_credit}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.salary_credit}
                />
                <Textfield
                    label="Employer SS"
                    placeholder="enter employer ss"
                    name="employer_ss"
                    type="text"
                    value={editFormHandler.values.employer_ss}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.employer_ss}
                />
                <Textfield
                    label="Employer CC"
                    placeholder="enter employer cc"
                    name="employer_cc"
                    type="text"
                    value={editFormHandler.values.employer_cc}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.employer_cc}
                />
                <Textfield
                    label="Employee SS"
                    placeholder="enter employee ss"
                    name="employee_ss"
                    type="text"
                    value={editFormHandler.values.employee_ss}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.employee_ss}
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

export default EditSSSForm;