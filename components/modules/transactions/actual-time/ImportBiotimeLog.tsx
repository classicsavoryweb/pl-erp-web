import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { useState } from "react";
import { importTransactionsActualLogs } from "@/api/transactions/actual-time";

interface FormModalInterface {
    modal: any;
    api?: any;
};

const ImportBiotimeLog = ({
    modal,
    api,
}: FormModalInterface) => {

    const importForm = useFormik({
        initialValues: {
            actual_log_file: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            actual_log_file: Yup.string().required("Excel file is required"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const isConfirm = await confirm({
                message: "Are you sure you want to proceed?",
                title: "Import Biotime Logs"
            });

            if (isConfirm) {
                setSubmitting(true);
                importTransactionsActualLogs(values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    setSubmitting(false);
                })
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Import Biotime Logs"
            onClose={() => {
                modal.onClose();
            }}
            size="sm"
        >
            <form onSubmit={importForm.handleSubmit}>
                <Textfield
                label="Excel File"
                type="file"
                name="actual_log_file"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                        importForm.setFieldValue("actual_log_file", file);
                    }
                }}
                error={importForm.errors.actual_log_file}
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

export default ImportBiotimeLog;