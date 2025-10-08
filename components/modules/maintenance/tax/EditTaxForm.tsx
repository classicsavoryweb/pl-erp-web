"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Dropdown from "@/components/common/Dropdown";
import confirm from "@/components/common/Confirm";
import { editTax } from "@/api/maintenance/tax";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditTaxForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            type: "Semi-monthly",
            status: "S",
            range_min: "",
            range_max: "",
            salary_base: "",
            percentage: "",
            exemption: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            type: Yup.string().required("Type is required."),
            status: Yup.string().required("Status is required."),
            range_min: Yup.string().required("Range minimum is required."),
            range_max: Yup.string().required("Range maximum is required."),
            salary_base: Yup.string().required("Salary base is required."),
            percentage: Yup.string().required("Percentage is required."),
            exemption: Yup.string().required("Exemption is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Tax Contribution",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editTax(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Tax contribution updated successfully");
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

    const typeOption = [
        {
            label: "Semi-monthly",
            value: "Semi-monthly"
        }
    ];

    const statusOption = [
        {
            label: "S",
            value: "S"
        }
    ];

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Tax Contribution"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Dropdown
                    placeholder="select type"
                    label="Type"
                    name="type"
                    value={editFormHandler.values.status}
                    onChange={editFormHandler.handleChange}
                    options={typeOption}
                />
                <Dropdown
                    placeholder="select status"
                    label="Status"
                    name="status"
                    value={editFormHandler.values.status}
                    onChange={editFormHandler.handleChange}
                    options={statusOption}
                />
                <Textfield
                    label="Salary Range Minimum"
                    placeholder="enter range minimum"
                    name="range_min"
                    type="text"
                    value={editFormHandler.values.range_min}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.range_min}
                />
                <Textfield
                    label="Salary Range Maximum"
                    placeholder="enter range maximum"
                    name="range_max"
                    type="text"
                    value={editFormHandler.values.range_max}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.range_max}
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
                    label="Percentage"
                    placeholder="enter percentage"
                    name="percentage"
                    type="text"
                    value={editFormHandler.values.percentage}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.percentage}
                />
                <Textfield
                    label="Exemption"
                    placeholder="enter exemption"
                    name="exemption"
                    type="text"
                    value={editFormHandler.values.exemption}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.exemption}
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

export default EditTaxForm;