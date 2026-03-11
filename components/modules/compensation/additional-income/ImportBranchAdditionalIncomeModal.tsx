"use client";

import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import { importBranchAdditionalIncome } from "@/api/compensation/branch-additional-income";

interface FormModalInterface {
    modal: any;
    cutoffStart: string;
    cutoffEnd: string;
    year: number;
    onSubmitCallback?: () => void;
}

const ImportBranchAdditionalIncomeModal = ({
    modal,
    cutoffStart,
    cutoffEnd,
    year,
    onSubmitCallback
}: FormModalInterface) => {
    const importForm = useFormik({
        initialValues: {
            additional_income_file: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            additional_income_file: Yup.string().required("Excel file is required"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            importBranchAdditionalIncome({
                ...values
            })
                .then((resp) => {
                    if (!resp.error) {
                        toast.success(resp.data.message || "Imported successfully");
                        modal.onClose();
                        resetForm();
                        if (onSubmitCallback) {
                            onSubmitCallback();
                        }
                    } else {
                        toast.error(resp.data.message || "Import failed");
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    setSubmitting(false);
                });
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Import Additional Income"
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
                    name="additional_income_file"
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                            importForm.setFieldValue("additional_income_file", file);
                        }
                    }}
                    error={importForm.errors.additional_income_file}
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

export default ImportBranchAdditionalIncomeModal;
