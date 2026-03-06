import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useState, useEffect } from "react";
import HoldedEmployeeDropDown from "../../generic/HoldedEmployeeDropDown";
import LastPayDetails from "./LastPayDetails";
import { useFormik } from "formik";
import confirm from "@/components/common/Confirm";
import * as Yup from "yup";
import { createLastPayRecord } from "@/api/compensation/last-pay";
import { toast } from "react-toastify";

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
            sss_loans_details: []
        },
        validationSchema: Yup.object().shape({
            tax_refund: Yup.number().required("Tax Refund is required").min(0, "Amount cannot be negative"),
            sales: Yup.number().required("Sales Incentives is required").min(0, "Amount cannot be negative"),
            incentives: Yup.number().required("Incentives is requried").min(0, "Amount cannot be negative"),
            sl_vl: Yup.number().required("SL/VL is required").min(0, "Amount cannot be negative"),
            meal_allowance: Yup.number().required("Meal Allowance is required").min(0, "Amount cannot be negative"),
            thirteenth_month: Yup.number().min(0, "Amount cannot be negative"),
        }),
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting, setValues}) => {
            const isConfirmed = await confirm({
                title: "Last Pay",
                message: "Are you sure you want to submit?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createLastPayRecord(values, selectedEmployee.employee_number)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Last pay created successfully");
                        setValues({
                            incentives : resp.data.incentives,
                            meal_allowance : resp.data.meal_allowance,
                            payroll_hold : resp.data.payroll_hold,
                            sales : resp.data.sales,
                            sl_vl : resp.data.sl_vl,
                            tax_refund : resp.data.tax_refund,
                            thirteenth_month : resp.data.thirteenth_month,
                            total_deductions : resp.data.total_deductions,
                            last_pay : resp.data.last_pay,
                            year : resp.data.year,
                            sss_loans: resp.data.sss_loans ?? "No",
                            sss_loans_details: []
                        });
                        callBack();
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
            <HoldedEmployeeDropDown
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
