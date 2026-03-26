"use client";

import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import { useState } from "react";
import Textfield from "@/components/common/Textfield";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { importEmployeeDeductions } from "@/api/compensation/employee-deductions";

interface FormModalInterface {
    modal: any;
    onSubmitCallback?: () => void;
}

interface DuplicateCrfRow {
    row_number: number;
    crf_num: string;
    employee_number: string;
    employee_name: string;
    deduction_id: number;
    deduction_description: string;
    duplicate_in: string[];
}

const ImportEmployeeDeductionsModal = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {
    const [duplicateRows, setDuplicateRows] = useState<DuplicateCrfRow[]>([]);
    const [duplicateMessage, setDuplicateMessage] = useState("");
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    const closeDuplicateModal = () => {
        setShowDuplicateModal(false);
        setDuplicateRows([]);
        setDuplicateMessage("");
    };

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
                const payload = { ...values };
                setSubmitting(true);
                modal.onClose();
                resetForm();

                importEmployeeDeductions(payload)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success(resp.data.message || "Imported successfully");
                            if (onSubmitCallback) {
                                onSubmitCallback();
                            }
                        } else {
                            if (resp.data?.type === "duplicate_crf" && Array.isArray(resp.data?.duplicates)) {
                                setDuplicateRows(resp.data.duplicates);
                                setDuplicateMessage(resp.data.message || "");
                                setShowDuplicateModal(true);
                                return;
                            }

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
        <>
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

            <Modal
                isShowing={showDuplicateModal}
                title="Duplicate CRF Numbers"
                onClose={closeDuplicateModal}
                size="lg"
            >
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-red-600">
                        {duplicateMessage || "Error: Duplicated CRF is detected."}
                    </p>
                    <p className="text-sm text-slate-600">
                        No data was imported. Remove the duplicate CRF entries below, then upload the file again.
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                        Duplicate Count: {duplicateRows.length}
                    </p>

                    <div className="max-h-[55vh] overflow-auto rounded border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-slate-100 text-left">
                                <tr>
                                    <th className="px-3 py-2 font-semibold">Excel Row</th>
                                    <th className="px-3 py-2 font-semibold">Employee Name</th>
                                    <th className="px-3 py-2 font-semibold">Employee ID</th>
                                    <th className="px-3 py-2 font-semibold">Deduction</th>
                                    <th className="px-3 py-2 font-semibold">CRF No.</th>
                                    <th className="px-3 py-2 font-semibold">Duplicate In</th>
                                </tr>
                            </thead>
                            <tbody>
                                {duplicateRows.map((duplicateRow) => (
                                    <tr key={`${duplicateRow.row_number}-${duplicateRow.crf_num}`} className="border-t border-slate-200">
                                        <td className="px-3 py-2">{duplicateRow.row_number}</td>
                                        <td className="px-3 py-2">{duplicateRow.employee_name}</td>
                                        <td className="px-3 py-2">{duplicateRow.employee_number}</td>
                                        <td className="px-3 py-2">
                                            {duplicateRow.deduction_description} ({duplicateRow.deduction_id})
                                        </td>
                                        <td className="px-3 py-2">{duplicateRow.crf_num}</td>
                                        <td className="px-3 py-2">{duplicateRow.duplicate_in.join(", ")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ImportEmployeeDeductionsModal;
