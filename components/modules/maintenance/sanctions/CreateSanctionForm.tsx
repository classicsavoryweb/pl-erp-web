"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";
import { createSanction } from "@/api/sanctions";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateSanctionForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            status: "active",
            description: "",
            rank: "",
            suspension_days: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            description: Yup.string().required("Sanction description is required."),
            rank: Yup.number().required("Rank is required.").typeError("Must be a number."),
            suspension_days: Yup.number().required("Suspension days is required.").typeError("Must be a number."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Sanction",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createSanction(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Sanction created successfully");
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
            title="Create Sanction"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Textfield
                    label="Sanction"
                    placeholder="enter sanction description"
                    name="description"
                    type="text"
                    value={createFormHandler.values.description}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.description}
                />
                <Textfield
                    label="Rank"
                    placeholder="enter rank"
                    name="rank"
                    type="text"
                    value={createFormHandler.values.rank}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.rank}
                />
                <Textfield
                    label="Suspension Days"
                    placeholder="enter sanction suspension days"
                    name="suspension_days"
                    type="text"
                    value={createFormHandler.values.suspension_days}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.suspension_days}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createFormHandler.values.status}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.status}
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

export default CreateSanctionForm;