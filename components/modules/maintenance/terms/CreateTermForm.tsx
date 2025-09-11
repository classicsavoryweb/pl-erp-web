"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import { createTerm } from "@/api/maintenance/terms";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateTermForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
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
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Create Term",
                message: "Are you sure you want to create?",
            });
            if (isConfirmed) {
                setSubmitting(true);
                createTerm(values)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Term created successfully");
                            onSubmitCallback();
                            modal.onClose();
                            resetForm();
                        } else {
                            toast.error(resp.data.message);
                        }
                    }).catch(() => {
                        toast.error("Error encountered");
                    }).finally(() => {
                        setSubmitting(false);
                    });
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Term"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Textfield
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    type="text"
                    value={createFormHandler.values.description}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.description}
                />
                <Textfield
                    label="Cutoff"
                    placeholder="enter cutoff"
                    name="cutoff"
                    type="number"
                    value={createFormHandler.values.cutoff}
                    required
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newCutoff = e.target.value;
                        createFormHandler.setFieldValue("cutoff", newCutoff);

                        const cutoffValue = parseInt(newCutoff, 10);
                        if (!isNaN(cutoffValue)) {
                            const monthValue = (cutoffValue - 0) * 0.5; 
                            createFormHandler.setFieldValue("month", monthValue.toFixed(1));
                        }
                    }}
                    error={createFormHandler.errors.cutoff}
                />
                <Textfield
                    label="Amount from"
                    placeholder="enter amount"
                    name="amount_from"
                    type="number"
                    value={createFormHandler.values.amount_from}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.amount_from}
                />
                <Textfield
                    label="Amount to"
                    placeholder="enter amount"
                    name="amount_to"
                    type="number"
                    value={createFormHandler.values.amount_to}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.amount_to}
                />
                <Textfield
                    label="Month"
                    name="month"
                    type="text"
                    value={createFormHandler.values.month}
                    required
                    disabled
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.month}
                />
                <hr className="mt-6 pb-2 text-slate-300" />
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

export default CreateTermForm;
