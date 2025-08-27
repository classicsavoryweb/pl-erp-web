"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Textfield from "@/components/common/Textfield";
import Dropdown from "@/components/common/Dropdown";
import confirm from "@/components/common/Confirm";
import { createPeriodDefinition } from "@/api/maintenance/period-definition";

const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = (new Date().getFullYear()+1).toString();

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const CreatePeriodDefinitionForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            year: currentYear,
            status: "active"
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            year: Yup.string().required("Year is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Create period definition",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed){
                const finalValues = {
                    months: allMonths, 
                    year: values.year,
                    status: values.status
                };
                setSubmitting(true);
                createPeriodDefinition(finalValues)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Period definition created successfully");
                            onSubmitCallback();
                            modal.onClose();
                            resetForm();
                        } else {
                            toast.error(resp.data.message);
                        }
                    })
                    .catch(() => {
                        toast.error("Error encountered");
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create period definition"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Textfield
                    label="Year"
                    placeholder="enter year"
                    name="year"
                    type="text"
                    value={createFormHandler.values.year}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.year}
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

export default CreatePeriodDefinitionForm;
