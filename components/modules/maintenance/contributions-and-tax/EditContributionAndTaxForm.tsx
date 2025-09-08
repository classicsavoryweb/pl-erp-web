"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import VendorDropDown from "../../generic/VendorDropDown";
import AccountDropDown from "../../generic/AccountDropDown";
import confirm from "@/components/common/Confirm";
import { editContributionAndTax } from "@/api/maintenance/contributions-and-tax";
interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditContributionAndTaxForm = ({
    modal,
    onSubmitCallback,
    formValue,
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            id: "",
            vendor_id: "",
            debit_id: "",
            credit_id: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            vendor_id: Yup.string().required("Vendor account is required."),
            debit_id: Yup.string().required("Debit account is required."),
            credit_id: Yup.string().required("Credit account is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Contribution and Tax",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editContributionAndTax(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Contribution and tax updated successfully");
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

    const getContributionType = (id: number) => {
        if ([1, 2, 3, 7].includes(id)) {
            return "EMPLOYEE CONTRIBUTION";
        } else if ([4, 5, 6, 8].includes(id)) {
            return "EMPLOYER CONTRIBUTION";
        }
        return "";
    };

    const getContributionName = (id: number) => {
        if ([1, 4].includes(id)) {
            return "Social Security System";
        } else if ([2, 5].includes(id)) {
            return "Philippines Health Insurance Corporation";
        } else if ([3, 6].includes(id)) {
            return "Home Development Mutual Fund";
        } else if (id === 7) {
            return "Withholding Tax";
        } else if (id === 8) {
            return "Non-Taxable Adjustment";
        }
        return "";
    };

    const contributionType = getContributionType(formValue.id);
    const contributionName = getContributionName(formValue.id);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Contribution and Tax"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <div className="flex text-gray-600 mt-3 font-semibold pb-1 mb-1">
                    <span>{contributionType} - {contributionName}</span>
                </div>
                <VendorDropDown
                    label="Vendor Account"
                    placeholder="select vendor"
                    name="vendor_id"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.vendor_id}
                    error={editFormHandler.errors.vendor_id}
                    required
                />
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

export default EditContributionAndTaxForm;