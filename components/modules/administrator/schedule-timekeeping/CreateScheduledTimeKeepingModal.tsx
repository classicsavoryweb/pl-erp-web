"use client";

import { createScheduledTimeKeepingGeneration } from "@/api/administrators/schedule-timekeeping";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface ModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}
const CreateScheduledTimeKeepingModal = ({
    modal,
    onSubmitCallback
}: ModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            schedule: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            schedule: Yup.string().required("Schedule is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Scheduled Timekeeping Generation",
                message: "Are you sure you want to submit?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                try {
                    const resp = await createScheduledTimeKeepingGeneration(values);

                    if (!resp.error) {
                        modal.onClose();
                        resetForm();
                        onSubmitCallback();
                    } else {
                        toast.error(resp.data.message);
                    }
                } catch {
                    toast.error("Error encountered");
                } finally {
                    resetForm();
                }
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Schedule"
            size="sm"
            showCloseButton
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
        >
            <form
                onSubmit={formHandler.handleSubmit}
            >
                <Textfield
                    required
                    type="datetime-local"
                    label="Schedule"
                    name="schedule"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.schedule}
                    error={formHandler.errors.schedule}
                />
                <Button
                    type="submit"
                    label="Submit"
                    onClick={() => {}}
                    loading={formHandler.isSubmitting}
                />
            </form>
        </Modal>
    );
};

export default CreateScheduledTimeKeepingModal;