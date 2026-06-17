"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editLastPayDeductionDetails } from "@/api/compensation/last-pay";

interface FormModalInterface {
    modal: any;
    formValue: any;
    onUpdated?: (updatedDeduction: any) => void;
}

const EditLastPayDeductionDetails = ({
    modal,
    formValue,
    onUpdated
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            amount: "",
            employee_deduction_id: "",
        },
        validateOnChange: false,
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            onUpdated && onUpdated({
                amount: values.amount,
                employee_deduction_id: values.employee_deduction_id,
            });
            modal.onClose();
        }
    });

    useEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Amount"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Amount"
                    name="amount"
                    type="number"
                    value={editFormHandler.values.amount}
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.amount}
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
                                editFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={editFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditLastPayDeductionDetails;
