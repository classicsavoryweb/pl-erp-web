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
import { editPayrollList } from "@/api/compensation/payroll-list";
import { getEmployee } from "@/api/employee";
import Dropdown from "@/components/common/Dropdown";
import TextArea from "@/components/common/TextArea";
import Grid from "@/components/common/Grid";
import Checkbox from "@/components/common/Checkbox";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditPayrollListForm = ({
    modal,
    onSubmitCallback,
    formValue,
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>({});
    const api = useApiCall();

    const editFormHandler = useFormik({
        initialValues: {
            employee_id: "",
            is_included: "",
            is_statutory_only: "",
            is_mancom: 0,
            is_on_maternity_leave: 0,
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
                title: "Edit Payroll",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editPayrollList(values, formValue.id).then((resp) => {
                    if(!resp.error) {
                        toast.success("Payroll updated successfully");
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
            title="Edit Payroll"
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
                    disabled
                />
                <Dropdown
                    label="Payroll Status"
                    placeholder="select status"
                    name="is_included"
                    value={editFormHandler.values.is_included}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.is_included}
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
                    value={editFormHandler.values.is_statutory_only}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.is_statutory_only}
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
                <Grid cols={2}>
                    <Checkbox
                        label="Is Mancom"
                        checked={editFormHandler.values.is_mancom === 1}
                        value="is_mancom"
                        onChange={(e) => {
                            if (e.target.checked) {
                                editFormHandler.setFieldValue("is_mancom", 1);
                                editFormHandler.setFieldValue("is_on_maternity_leave", 0);
                            } else {
                                editFormHandler.setFieldValue("is_mancom", 0);
                            }
                        }}
                    />
                    <Checkbox
                        label="Is On Maternity Leave"
                        checked={editFormHandler.values.is_on_maternity_leave === 1}
                        value="is_on_maternity_leave"
                        onChange={(e) => {
                            if (e.target.checked) {
                                editFormHandler.setFieldValue("is_on_maternity_leave", 1);
                                editFormHandler.setFieldValue("is_mancom", 0);
                            } else {
                                editFormHandler.setFieldValue("is_on_maternity_leave", 0);
                            }
                        }}
                    />
                </Grid>
                <TextArea
                    label="Remarks"
                    name="remarks"
                    value={editFormHandler.values.remarks ?? ""}
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.remarks}
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

export default EditPayrollListForm;