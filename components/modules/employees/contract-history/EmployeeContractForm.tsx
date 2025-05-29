"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeContract, updateEmployeeContract } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const EmployeeContractForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = action === "add" ? addEmployeeContract : updateEmployeeContract; 

    const formHandler = useFormik({
        initialValues: {
            id: "",
            status: "active",
            contract_number: "",
            contract_start_date: "",
            contract_end_date: "",
            remarks: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            contract_start_date: Yup.string().required("Contract start date is required."),
            contract_end_date: Yup.string().required("Contract end date is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Contract",
                message: "Are you sure you want to save?"
            });
            if (isConfirmed) {
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
                });
            }
        }
    });

    useEffect(() => {
        if (action === "edit" && modal.isShowing) {
            formHandler.setValues(data);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title={ action === "add" ? "Add Contract" : "Edit Contract"}
            size="md"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <Textfield
                type="date"
                label="Contract Start Date"
                required
                name="contract_start_date"
                value={formHandler.values.contract_start_date || ""}
                error={formHandler.errors.contract_start_date}
                onChange={formHandler.handleChange}
            />
            <Textfield
                type="date"
                label="Contract End Date"
                required
                name="contract_end_date"
                value={formHandler.values.contract_end_date || ""}
                error={formHandler.errors.contract_end_date}
                onChange={formHandler.handleChange}
            />
            <TextArea
                label="Remarks"
                name="remarks"
                placeholder="enter remarks"
                value={formHandler.values.remarks || ""}
                error={formHandler.errors.remarks}
                onChange={formHandler.handleChange}
            />
            <ActiveInactiveDropDown
                label="Status"
                name="status"
                placeholder="enter status"
                value={formHandler.values.status || ""}
                error={formHandler.errors.status}
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

export default EmployeeContractForm;