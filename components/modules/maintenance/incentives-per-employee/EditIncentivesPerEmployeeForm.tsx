"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import confirm from "@/components/common/Confirm";
import { editIncentivesPerEmployee } from "@/api/maintenance/incentives-per-employee";
import { getEmployee } from "@/api/employee";

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

    const [employee, setEmployee] = useState<any>({});
    const api = useApiCall();

    const editFormHandler = useFormik({
        initialValues: {
            employee_id: "",
            amount: "",
            max_amount: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            amount: Yup.string().required("Amount is required."),
            employee_id: Yup.string().required("Employee is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Incentives",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editIncentivesPerEmployee(values, formValue.id).then((resp) => {
                    if(!resp.error) {
                        toast.success("Incentives updated successfully");
                        setEmployee({});
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

    useAsyncEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);

            api.setLoading(true);
            getEmployee(formValue.employee_number).then((resp: any) => {
                if (!resp.error && resp.data.employee) {
                    const employeeData = resp.data.employee;
                    setEmployee(employeeData);
                    editFormHandler.setFieldValue("employee_id", employeeData.id);
                } else {
                    setEmployee({});
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                setEmployee({});
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Incentives"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <SearchEmployeeDropDown
                    label="Employee"
                    placeholder="select employee"
                    name="employee"
                    onChange={(e) => {
                        const selectedEmployee = e.target.value;
                        setEmployee(selectedEmployee);
                        editFormHandler.setFieldValue("employee_id", selectedEmployee.id);
                    }}
                    value={employee}
                    error={editFormHandler.errors.employee_id}
                    required
                />

                { Object.entries(employee).length > 0 && employee.current_position &&
                    <Textfield
                        label="Current Position"
                        value={employee.current_position.description}
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
                                setEmployee({});
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