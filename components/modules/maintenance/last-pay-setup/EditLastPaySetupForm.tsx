"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import AccountDropDown from "../../generic/AccountDropDown";
import { editLastPaySetup } from "@/api/maintenance/last-pay-setup";
interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditLastPaySetupForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            id: "",
            debit_id: "",
            credit_id: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            debit_id: Yup.string().required("Debit account is required."),
            credit_id: Yup.string().required("Credit account is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Last Pay Setup",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editLastPaySetup(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Last pay setup updated successfully");
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

    const getContributionName = (id: number) => {
        if (id === 1) {
            return "13th Month";
        } else if (id === 2) {
            return "SL/VL";
        } else if (id === 3) {
            return "Tax Refund";
        } else if (id === 4) {
            return "Incentives (HO Setup)";
        } else if (id === 5) {
            return "Sales Incentives";
        } else if (id === 6) {
            return "Meal Allowance";
        } else if (id === 7) {
            return "Incentives (Store Setup)";
        } else if (id === 8) {
            return "SSS Loans (Amortization Setup)";
        } else if (id === 9) {
            return "SSS Loans (For Remittance Setup)";
        }
        return "";
    };

    const contributionName = getContributionName(formValue.id);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Last Pay Setup"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <div className="flex mt-3 font-semibold pb-1 mb-1">
                    <span>{contributionName}</span>
                </div>
                <AccountDropDown
                    label="Debit Account"
                    placeholder="select debit account"
                    name="debit_id"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.debit_id}
                    error={editFormHandler.errors.debit_id}
                    required
                />
                <AccountDropDown
                    label="Credit Account"
                    placeholder="select credit account"
                    name="credit_id"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.credit_id}
                    error={editFormHandler.errors.credit_id}
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

export default EditLastPaySetupForm;