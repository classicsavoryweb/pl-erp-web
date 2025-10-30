"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useContext, useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { PayrollContext } from "@/context/PayrollProvider";
import { editPayrollDeductionDetails } from "@/api/compensation/payroll";
interface FormModalInterface {
    modal: any;
    formValue: any;
}

const EditDeductionDetails = ({
    modal,
    formValue
}: FormModalInterface) => {

    const {payrollDetails, setPayrollDetails} = useContext(PayrollContext);

    const editFormHandler = useFormik({
        initialValues: {
            deduction_id: "",
            deducted_amount: "",
            monthly_amortization: "",
            balance: "",
            type: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            deduction_id: Yup.string().required("Deduction ID is required."),
            deducted_amount: Yup.number()
            .min(1, "Cannot accept 0 or below")
            .required("Amount is required.")
            .test(
            'same-or-equal-to-balance',
            `Amount must be less than or equal to remaining balance`,
            function (value) {
                const { balance } = this.parent;
                if (!value || !balance) return true;
                return parseFloat(String(value)) <= parseFloat(String(balance));
            }),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Edit Deduction",
                message: "Are you sure you want to save changes?"
            });

            if(isConfirmed) {
                setSubmitting(true);
                editPayrollDeductionDetails(payrollDetails.id, {
                    deduction_id: values.deduction_id,
                    deducted_amount: values.deducted_amount
                }).then((resp) => {
                    if (!resp.error) {
                        setPayrollDetails(resp.data.details);
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
                });
            }

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
            title="Edit Deduction"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Deduction Type"
                    name="type"
                    value={editFormHandler.values.type}
                    disabled
                />
                <Textfield
                    label="Monthly Amortization"
                    name="monthly_amortization"
                    value={editFormHandler.values.monthly_amortization}
                    disabled
                />
                <Textfield
                    label="Balance"
                    name="balance"
                    value={editFormHandler.values.balance}
                    disabled
                />
                <Textfield
                    label="Amount To Deduct"
                    name="deducted_amount"
                    type="number"
                    value={editFormHandler.values.deducted_amount}
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.deducted_amount}
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

export default EditDeductionDetails;