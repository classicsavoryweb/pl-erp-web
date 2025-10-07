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
import { createPayrollList } from "@/api/compensation/payroll-list";
import Dropdown from "@/components/common/Dropdown";
import TextArea from "@/components/common/TextArea";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreatePayrollListForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>({});

    const createFormHandler = useFormik({
        initialValues: {
            employee_id: "",
            is_included: 1,
            is_statutory_only: 0,
            remarks: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_id: Yup.string().required("Employee is required."),
            is_included: Yup.string().required("Payroll status is required."),
            is_statutory_only: Yup.string().required("Payroll Type is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Payroll",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createPayrollList(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Payroll created successfully");
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
            title="Create Payroll"
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
                <Dropdown
                    label="Payroll Status"
                    placeholder="select status"
                    name="is_included"
                    value={createFormHandler.values.is_included}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.is_included}
                    options={[
                        {
                            label: "Included",
                            value: 1
                        },
                        {
                            label: "Excluded",
                            value: 0
                        },
                    ]}
                />
                <Dropdown
                    label="Payroll Type"
                    placeholder="select type"
                    name="is_statutory_only"
                    value={createFormHandler.values.is_statutory_only}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.is_statutory_only}
                    options={[
                        {
                            label: "Statutory only",
                            value: 1
                        },
                        {
                            label: "Full payroll",
                            value: 0
                        },
                    ]}
                />
                <TextArea
                    label="Remarks"
                    name="remarks"
                    value={createFormHandler.values.remarks}
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.remarks}
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

export default CreatePayrollListForm;