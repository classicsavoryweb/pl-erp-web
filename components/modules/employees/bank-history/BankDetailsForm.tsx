"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeBankDetails, updateEmployeeBankDetails } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import BankAccountTypeDropDown from "../../generic/BankAccounTypeDropDown";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getBankAccountTypes } from "@/api/bank-account-types";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const BankDetailsForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const [accountTypeData, setAccountTypeData] = useState<any[]>([]);
    const api = action === "add" ? addEmployeeBankDetails : updateEmployeeBankDetails; 

    const formHandler = useFormik({
        initialValues: {
            id: "",
            bank_number: "",
            bank_account_type_id: "",
            remarks: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            bank_number: Yup.string().required("Bank number is required.")
            .test(
            'len-match',
                function (value) {
                    const { bank_account_type_id } = this.parent;
                    const matchedAccountType = accountTypeData.find((item) => item.id === Number(bank_account_type_id));
                    const requiredLength = matchedAccountType?.number_length;
                    if (!requiredLength || !value) return true;
                    const isValid = value.length === Number(requiredLength);

                    return isValid
                    ? true
                    : this.createError({
                        message: `Bank number must be exactly ${requiredLength} digits.`,
                    });
                }
            ),
            bank_account_type_id: Yup.string().required("Bank account type is required."),
            remarks: Yup.string().required("Remarks is required."),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            api(String(employeeNumber), values)
            .then((resp) => {
                if (!resp.error) {
                    toast.success(resp.data.message);
                    resetForm();
                    onSubmitCallback();
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered")
            }).finally(() => {
                setSubmitting(false);
            })
        }
    });

    useEffect(() => {
        if (action === "edit" && modal.isShowing) {
            formHandler.setValues(data);
        }
    }, [modal.isShowing]);

    useAsyncEffect(async () => {
        if (modal.isShowing) {
            modal.setLoading(true);
            getBankAccountTypes().then((resp) => {
                if (!resp.error) {
                    setAccountTypeData(resp.data.bank_account_types);
                } else {
                    toast.error("Error fetching bank account types");
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                modal.setLoading(false);
            })
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title={ action === "add" ? "Add Bank Details" : "Edit Bank Details"}
            size="md"
            loading={modal.loading}
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <BankAccountTypeDropDown
                label="Bank Account Type"
                required
                name="bank_account_type_id"
                value={formHandler.values.bank_account_type_id || ""}
                error={formHandler.errors.bank_account_type_id}
                onChange={formHandler.handleChange}
                placeholder="select bank account type"
            />
            <Textfield
                label="Bank Number"
                required
                name="bank_number"
                value={formHandler.values.bank_number || ""}
                error={formHandler.errors.bank_number}
                onChange={formHandler.handleChange}
                placeholder="enter bank number"
            />
            <TextArea
                label="Remarks"
                name="remarks"
                placeholder="enter remarks"
                value={formHandler.values.remarks || ""}
                error={formHandler.errors.remarks}
                onChange={formHandler.handleChange}
                required
            />
            <Button
                loading={formHandler.isSubmitting}
                onClick={() => {}}
                label="Submit"
                type="submit"
            />
        </form>
        </Modal>
    );
};

export default BankDetailsForm;