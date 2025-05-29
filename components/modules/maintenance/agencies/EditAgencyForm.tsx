"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import { editAgency } from "@/api/agencies";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditAgencyForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editAgencyFormHandler = useFormik({
        initialValues: {
            status: "",
            name: "",
            employee_code: "",
            address: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Name is required."),
            employee_code: Yup.string().required("Employee code is required."),
            address: Yup.string().required("Address is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Agency",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editAgency(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Agency updated successfully");
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
            editAgencyFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit agency"
            onClose={() => {
                modal.onClose();
                editAgencyFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editAgencyFormHandler.handleSubmit}>
                <Textfield
                    label="Name"
                    placeholder="enter name"
                    name="name"
                    type="text"
                    value={editAgencyFormHandler.values.name}
                    required
                    onChange={editAgencyFormHandler.handleChange}
                    error={editAgencyFormHandler.errors.name}
                />
                <Textfield
                    label="Employee Code"
                    placeholder="enter employee code"
                    name="employee_code"
                    type="text"
                    value={editAgencyFormHandler.values.employee_code}
                    required
                    onChange={editAgencyFormHandler.handleChange}
                    error={editAgencyFormHandler.errors.employee_code}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editAgencyFormHandler.values.status}
                    required
                    onChange={editAgencyFormHandler.handleChange}
                    error={editAgencyFormHandler.errors.status}
                />
                <Textfield
                    label="Address"
                    placeholder="enter address"
                    name="address"
                    type="text"
                    value={editAgencyFormHandler.values.address}
                    required
                    onChange={editAgencyFormHandler.handleChange}
                    error={editAgencyFormHandler.errors.address}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editAgencyFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={editAgencyFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditAgencyForm;