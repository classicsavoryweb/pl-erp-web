"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import { createAgency } from "@/api/agencies";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateAgencyForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createAgencyFormHandler = useFormik({
        initialValues: {
            status: "active",
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
                title: "Create Agency",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createAgency(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Agency created successfully");
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
            title="Create new agency"
            onClose={() => {
                modal.onClose();
                createAgencyFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createAgencyFormHandler.handleSubmit}>
                <Textfield
                    label="Name"
                    placeholder="enter name"
                    name="name"
                    type="text"
                    value={createAgencyFormHandler.values.name}
                    required
                    onChange={createAgencyFormHandler.handleChange}
                    error={createAgencyFormHandler.errors.name}
                />
                <Textfield
                    label="Employee Code"
                    placeholder="enter employee code"
                    name="employee_code"
                    type="text"
                    value={createAgencyFormHandler.values.employee_code}
                    required
                    onChange={createAgencyFormHandler.handleChange}
                    error={createAgencyFormHandler.errors.employee_code}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createAgencyFormHandler.values.status}
                    required
                    onChange={createAgencyFormHandler.handleChange}
                    error={createAgencyFormHandler.errors.status}
                />
                <Textfield
                    label="Address"
                    placeholder="enter address"
                    name="address"
                    type="text"
                    value={createAgencyFormHandler.values.address}
                    required
                    onChange={createAgencyFormHandler.handleChange}
                    error={createAgencyFormHandler.errors.address}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createAgencyFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createAgencyFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateAgencyForm;