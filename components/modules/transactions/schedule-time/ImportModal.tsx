import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { validateImportTransactionsScheduleTime, importTransactionsScheduleTime } from "@/api/transactions/schedule-time";
import { useState } from "react";

interface FormModalInterface {
    modal: any;
    api?: any;
};

const ImportModal = ({
    modal,
    api,
}: FormModalInterface) => {
    const [validatedFilePath, setValidatedFilePath] = useState<string | null>(null);

    const importForm = useFormik({
        initialValues: {
            schedule_time_file: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            schedule_time_file: Yup.string().required("Excel file is required"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setSubmitting(true);

                const validationResponse = await validateImportTransactionsScheduleTime(values);

                if (validationResponse.data?.file_path) {
                    setValidatedFilePath(validationResponse.data.file_path);
                }

                if (validationResponse.error) {
                    const isConfirmed = await confirm({
                        title: "Confirm Import",
                        message: `${validationResponse.data.message} Do you want to proceed?`
                    });

                    if (!isConfirmed) return;
                } 

                const importPayload = validatedFilePath
                    ? { file_path: validatedFilePath }
                    : values;

                const importResponse = await importTransactionsScheduleTime(importPayload);

                if (!importResponse.error) {
                    toast.success(importResponse.data.message);
                    modal.onClose();
                    resetForm();
                    setValidatedFilePath(null);
                    if (api?.triggerReload) {
                        api.triggerReload();
                    }
                } else {
                    toast.error(importResponse.data.message);
                }

            } catch (error) {
                toast.error("Unexpected error occurred.");
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Import Schedule Time"
            onClose={() => {
                modal.onClose();
                setValidatedFilePath(null);
            }}
            size="sm"
        >
            <form onSubmit={importForm.handleSubmit}>
                <Textfield
                label="Excel File"
                type="file"
                name="schedule_time_file"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                        importForm.setFieldValue("schedule_time_file", file);
                        setValidatedFilePath(null);
                    }
                }}
                error={importForm.errors.schedule_time_file}
                required
            />

            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end">
                <div className="w-1/2 flex justify-end items-center gap-x-2">
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                            importForm.resetForm();
                            setValidatedFilePath(null);
                        }}
                    />

                    <Button
                        type="submit"
                        label="Submit"
                        onClick={() => {}}
                        loading={importForm.isSubmitting}
                    />
                </div>              
            </div>
            </form>
        </Modal>
    );
};

export default ImportModal;