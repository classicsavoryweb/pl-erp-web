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
import { editIncentivesPosition } from "@/api/maintenance/incentives-position";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditIncentivesPositionForm = ({
    modal,
    onSubmitCallback,
    formValue,
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            description: "",
            position_id: "",
            amount: 0,
            oic_additional_amount: 0,
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            amount: Yup.string().required("Amount is required."),
            oic_additional_amount: Yup.string().required("Amount is required."),
            position_id: Yup.string().required("Position is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Edit Incentive",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                try {
                    const resp = await editIncentivesPosition(values, formValue.id);
                    if(!resp.error) {
                        toast.success("Incentive updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                } catch {
                    toast.error("Error encountered");
                } finally {
                    setSubmitting(false);
                }
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
                    label="Position"
                    name="position_id"
                    value={editFormHandler.values.description}
                    disabled
                    required
                />
                <Textfield
                    label="Amount"
                    placeholder="enter amount"
                    name="amount"
                    type="number"
                    value={editFormHandler.values.amount}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.amount}
                />
                <Textfield
                    label="OIC Additional Amount"
                    placeholder="enter additional amount"
                    name="oic_additional_amount"
                    type="number"
                    value={editFormHandler.values.oic_additional_amount}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.oic_additional_amount}
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

export default EditIncentivesPositionForm;