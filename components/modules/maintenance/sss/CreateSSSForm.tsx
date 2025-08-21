"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { createSSS } from "@/api/maintenance/sss";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateSSSForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
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
                title: "Create SSS",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createSSS(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("SSS created successfully");
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

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create SSS"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Textfield
                    label="Salary Range Minimum"
                    placeholder="enter salary range minimum"
                    name="salary_range_min"
                    type="text"
                    value={createFormHandler.values.salary_range_min}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.salary_range_min}
                />
                <Textfield
                    label="Salary Range Maximum"
                    placeholder="enter salary range maximum"
                    name="salary_range_max"
                    type="text"
                    value={createFormHandler.values.salary_range_max}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.salary_range_max}
                />
                <Textfield
                    label="Salary Credit"
                    placeholder="enter salary credit"
                    name="salary_credit"
                    type="text"
                    value={createFormHandler.values.salary_credit}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.salary_credit}
                />
                <Textfield
                    label="Employer SS"
                    placeholder="enter employer ss"
                    name="employer_ss"
                    type="text"
                    value={createFormHandler.values.employer_ss}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.employer_ss}
                />
                <Textfield
                    label="Employer CC"
                    placeholder="enter employer cc"
                    name="employer_cc"
                    type="text"
                    value={createFormHandler.values.employer_cc}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.employer_cc}
                />
                <Textfield
                    label="Employee SS"
                    placeholder="enter employee ss"
                    name="employee_ss"
                    type="text"
                    value={createFormHandler.values.employee_ss}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.employee_ss}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
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

export default CreateSSSForm;