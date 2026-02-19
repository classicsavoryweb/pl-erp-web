"use client";

import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { importEmployeeDeductions } from "@/api/compensation/employee-deductions";

interface FormModalInterface {
    modal: any;
    onSubmitCallback?: () => void;
}

const ImportEmployeeDeductionsModal = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {
    const importForm = useFormik({
        initialValues: {
            deduction_file: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            deduction_file: Yup.string().required("Excel file is required"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const isConfirm = await confirm({
                message: "Are you sure you want to import employee deductions?",
                title: "Import Employee Deductions"
            });

            if (isConfirm) {
                setSubmitting(true);
                importEmployeeDeductions(values)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Imported successfully");
                            modal.onClose();
                            resetForm();
                            if (onSubmitCallback) {
                                onSubmitCallback();
                            }
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
            title="Import Employee Deductions"
            onClose={() => {
                modal.onClose();
                importForm.resetForm();
            }}
            size="sm"
        >
            <form onSubmit={importForm.handleSubmit}>
                <Textfield
                    label="Excel File"
                    type="file"
                    name="deduction_file"
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                            importForm.setFieldValue("deduction_file", file);
                        }
                    }}
                    error={importForm.errors.deduction_file}
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

export default ImportEmployeeDeductionsModal;
