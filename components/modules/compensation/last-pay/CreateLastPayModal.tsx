import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useState, useEffect } from "react";
import HoldedEmployeeDropDown from "../../generic/HoldedEmployeeDropDown";
import LastPayDetails from "./LastPayDetails";
import { useFormik } from "formik";
import confirm from "@/components/common/Confirm";
import * as Yup from "yup";
import { createLastPayRecord, previewLastPayComputation } from "@/api/compensation/last-pay";
import { toast } from "react-toastify";
import EmployeeForLastPayDropDown from "../../generic/EmployeeForLastPayDropDown";

interface ModalInterface {
    modal: any;
    callBack: () => void;
}

const CreateLastPayModal = ({
    modal,
    callBack
}: ModalInterface
) => {

    const [selectedEmployee, setSelectedEmployee] = useState<any>({});
    const [show, setShowing] = useState<boolean>(false);

    const formHandler = useFormik({
        initialValues: {
            incentives : 0,
            meal_allowance : 0,
            payroll_hold : 0,
            sales : 0,
            sl_vl : 0,
            tax_refund : 0,
            thirteenth_month : 0,
            total_deductions : 0,
            last_pay : 0,
            year : 0,
            sss_loans: "No",
            sss_loans_details: [],
            company_deductions: [],
            government_deductions: [],
            additional_fields: [],
            save_changes: false
        },
        validationSchema: Yup.object().shape({
            payroll_hold: Yup.number().required("Payroll is required").min(0, "Amount cannot be negative"),
            tax_refund: Yup.number().required("Tax Refund is required").min(0, "Amount cannot be negative"),
            sales: Yup.number().required("Sales Incentives is required").min(0, "Amount cannot be negative"),
            incentives: Yup.number().required("Incentives is requried").min(0, "Amount cannot be negative"),
            sl_vl: Yup.number().required("SL/VL is required").min(0, "Amount cannot be negative"),
            meal_allowance: Yup.number().required("Meal Allowance is required").min(0, "Amount cannot be negative"),
            thirteenth_month: Yup.number().min(0, "Amount cannot be negative"),
        }),
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting, setValues}) => {
            let isConfirmed = false;
            if (values.save_changes) {
                isConfirmed = await confirm({
                    title: "Last Pay",
                    message: "Are you sure you want to submit?"
                });
            } else {
                isConfirmed = true;
            }

            if (isConfirmed) {
                try {
                    const resp = await previewLastPayComputation(selectedEmployee.employee_number, values);
                    if (!resp.error) {
                        formHandler.setValues({
                            ...resp.data,
                            sss_loans: values.sss_loans
                        });

                        if (values.save_changes) {
                            toast.success("Last pay successfully created");
                            callBack();
                            formHandler.resetForm();
                            setSelectedEmployee({});
                            setShowing(false);
                            modal.onClose();
                        }
                    } else {
                        toast.error("Computation error");
                    }
                } catch (error) {
                    toast.error("Error encountered");
                }
            }
        }
    });

    useEffect(() => {
        if (modal.isShowing) {
            const handleKeyDown = (e: any) => {
                if (e.key === "Tab") {
                    formHandler.setFieldValue("save_changes", false);
                    formHandler.submitForm();
                }
            };
    
            window.addEventListener("keydown", handleKeyDown);
    
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Last Pay Record"
            onClose={() => {
                modal.onClose();
                setShowing(false);
                setSelectedEmployee({});
            }}
            size="md"
        >
            <EmployeeForLastPayDropDown
                label = "Employee"
                placeholder = "select employee"
                name = "employee_id"
                onChange= {(e) => {
                    setSelectedEmployee(e.target.value);
                    setShowing(true);
                }}
                value={selectedEmployee}
            />
            { show &&
            <LastPayDetails
                employeeNumber={selectedEmployee.employee_number}
                formHandler={formHandler}
                isOpen={modal.isShowing}
            />
            }

        </Modal>
    );
};

export default CreateLastPayModal;
