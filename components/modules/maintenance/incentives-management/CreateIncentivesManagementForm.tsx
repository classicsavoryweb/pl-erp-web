"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import confirm from "@/components/common/Confirm";
import { createIncentivesManagement } from "@/api/maintenance/incentives-management";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateIncentivesManagementForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>({});

    const createFormHandler = useFormik({
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
                title: "Create incentives",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createIncentivesManagement(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Incentives created successfully");
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

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Incentives"
            onClose={() => {
                modal.onClose();
                setEmployee({});
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <SearchEmployeeDropDown
                    label="Employee"
                    placeholder="select employee"
                    name="employee_id"
                    onChange={(e) => {
                        setEmployee(e.target.value);
                        createFormHandler.setFieldValue("employee_id", e.target.value.id);
                    }}
                    value={employee}
                    error={createFormHandler.errors.employee_id}
                    required
                />
                { Object.entries(employee).length > 0 &&
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
                    value={createFormHandler.values.amount}
                    required
                    onChange={(e) => {
                        const value = e.target.value;
                        createFormHandler.setFieldValue("amount", value);
                        createFormHandler.setFieldValue("max_amount", value);
                    }}
                    error={createFormHandler.errors.amount}
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
                                createFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateIncentivesManagementForm;