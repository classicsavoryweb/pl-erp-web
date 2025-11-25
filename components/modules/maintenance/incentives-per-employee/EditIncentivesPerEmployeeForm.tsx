"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editIncentivesPerEmployee } from "@/api/maintenance/incentives-per-employee";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditIncentivesPerEmployeeForm = ({
    modal,
    onSubmitCallback,
    formValue,
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            employee: formValue.employee || {},
            employee_id: formValue.employee.id,
            amount: 0,
            max_amount: 0,
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            amount: Yup.string().required("Amount is required."),
            employee_id: Yup.string().required("Employee is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Incentive",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editIncentivesPerEmployee(values, formValue.id).then((resp) => {
                    if(!resp.error) {
                        toast.success("Incentive updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally((() => {
                    setSubmitting(false);
                }));
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
            title="Edit Incentive"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Employee"
                    name="employee_full_name"
                    value={editFormHandler.values.employee.full_name || ""}
                    disabled
                    required
                />

                {editFormHandler.values.employee && editFormHandler.values.employee.current_position &&
                    <Textfield
                        label="Current Position"
                        value={editFormHandler.values.employee.current_position.description}
                        disabled
                    />
                }
                
                <Textfield
                    label="Amount"
                    placeholder="enter amount"
                    name="amount"
                    type="text"
                    value={editFormHandler.values.amount}
                    required
                    onChange={(e) => {
                        const value = e.target.value;
                        editFormHandler.setFieldValue("amount", value);
                        editFormHandler.setFieldValue("max_amount", value);
                    }}
                    error={editFormHandler.errors.amount}
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

export default EditIncentivesPerEmployeeForm;