"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editPhilhealth } from "@/api/maintenance/philhealth";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditPhilhealthForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            salary_range_min: "",
            salary_range_max: "",
            salary_base: "",
            employee_share: "",
            employer_share: "",
            total_monthly_contribution: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            salary_range_min: Yup.string().required("Salary range minimum is required."),
            salary_range_max: Yup.string().required("Salary range maximum is required."),
            salary_base: Yup.string().required("Salary base is required."),
            employee_share: Yup.string().required("Employee share is required."),
            employer_share: Yup.string().required("Employer share is required."),
            total_monthly_contribution: Yup.string().required("Total monthly contribution is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Philhealth Contribution",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editPhilhealth(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Philhealth updated successfully");
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
            title="Edit Philhealth Contribution"
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
                    label="Salary Base"
                    placeholder="enter salary base"
                    name="salary_base"
                    type="text"
                    value={editFormHandler.values.salary_base}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.salary_base}
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
                    label="Total Monthly Contribution"
                    placeholder="enter total monthly contribution"
                    name="total_monthly_contribution"
                    type="text"
                    value={editFormHandler.values.total_monthly_contribution}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.total_monthly_contribution}
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

export default EditPhilhealthForm;