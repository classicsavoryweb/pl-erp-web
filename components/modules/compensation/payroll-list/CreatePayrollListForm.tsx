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
import { createPayrollList, getBankDetails } from "@/api/compensation/payroll-list";
import Dropdown from "@/components/common/Dropdown";
import TextArea from "@/components/common/TextArea";
import Grid from "@/components/common/Grid";
import Checkbox from "@/components/common/Checkbox";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useApiCall } from "@/hooks/api-call";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreatePayrollListForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const [employee, setEmployee] = useState<any>(null);
    const [employeeBankAccount, setemployeeBankAccount] = useState<any>(null);
    const api = useApiCall();

    const createFormHandler = useFormik({
        initialValues: {
            employee_id: "",
            is_included: 1,
            is_statutory_only: 0,
            is_mancom: 0,
            is_on_maternity_leave: 0,
            is_bank: 0,
            is_hold: 0,
            has_complete_documents: 0,
            remarks: "",
            description: "",
            account_no: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_id: Yup.string().required("Employee is required."),
            is_included: Yup.string().required("Payroll status is required."),
            is_statutory_only: Yup.string().required("Payroll Type is required."),
            is_bank: Yup.string().required("Payroll Type is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Payroll",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                
                try {
                    const resp = await createPayrollList(values);
                    if(!resp.error) {
                        toast.success("Payroll created successfully");
                        setEmployee({});
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                } catch {
                    toast.error("Error encountered");
                } finally {
                    setSubmitting(false);
                }
            }
        }
    });

    useAsyncEffect(() => {
        api.setLoading(false);

        if (modal.isShowing && employee) {
            api.setLoading(true);
            getBankDetails(employee.id, {})
            .then((resp) => {
                if (!resp.error) {
                    setemployeeBankAccount(resp.data);
                } else {
                    setemployeeBankAccount(null);
                }
            })
            .finally(() => {
                api.setLoading(false);
            });
        }
    }, [employee, modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Payroll"
            onClose={() => {
                modal.onClose();
                setEmployee({});
                setemployeeBankAccount({});
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
                <div className="mb-2">
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
                </div>
                <Grid cols={3}>
                    <Checkbox
                        label="Complete Docs"
                        checked={createFormHandler.values.has_complete_documents === 1}
                        value="has_complete_documents"
                        onChange={(e) => {
                            if (e.target.checked) {
                                createFormHandler.setFieldValue("has_complete_documents", 1);
                            } else {
                                createFormHandler.setFieldValue("has_complete_documents", 0);
                            }
                        }}
                    />
                    <Checkbox
                        label="Mancom"
                        checked={createFormHandler.values.is_mancom === 1}
                        value="is_mancom"
                        onChange={(e) => {
                            if (e.target.checked) {
                                createFormHandler.setFieldValue("is_mancom", 1);
                                createFormHandler.setFieldValue("is_on_maternity_leave", 0);
                            } else {
                                createFormHandler.setFieldValue("is_mancom", 0);
                            }
                        }}
                    />
                    <Checkbox
                        label="On Maternity Leave"
                        checked={createFormHandler.values.is_on_maternity_leave === 1}
                        value="is_on_maternity_leave"
                        onChange={(e) => {
                            if (e.target.checked) {
                                createFormHandler.setFieldValue("is_on_maternity_leave", 1);
                                createFormHandler.setFieldValue("is_mancom", 0);
                            } else {
                                createFormHandler.setFieldValue("is_on_maternity_leave", 0);
                            }
                        }}
                    />
                </Grid>
                <p className="my-[2px]">
                    Transaction Mode<span className="text-red-400">*</span>
                </p>
                <Grid cols={3}>
                    <Checkbox
                        label="Bank"
                        checked={createFormHandler.values.is_bank === 1}
                        value="is_bank"
                        onChange={(e) => {
                            if (e.target.checked) {
                                createFormHandler.setFieldValue("is_bank", 1);
                            } else {
                                createFormHandler.setFieldValue("is_bank", 0);
                            }
                        }}
                    />
                    <Checkbox
                        label="Cash"
                        checked={createFormHandler.values.is_bank === 0}
                        value="is_bank"
                        onChange={(e) => {
                            if (e.target.checked) {
                                createFormHandler.setFieldValue("is_bank", 0);
                            } else {
                                createFormHandler.setFieldValue("is_bank", 1);
                            }
                        }}
                    />
                    <Checkbox
                        label="Hold"
                        checked={createFormHandler.values.is_hold === 1}
                        value="is_hold"
                        onChange={(e) => {
                            if (e.target.checked) {
                                createFormHandler.setFieldValue("is_hold", 1);
                            } else {
                                createFormHandler.setFieldValue("is_hold", 0);
                            }
                        }}
                    />
                </Grid>

                {createFormHandler.values.is_bank === 1 && employeeBankAccount && (
                    <Grid cols={2}>
                        <Textfield
                            disabled
                            label="Account Type"
                            name="description"
                            value={employeeBankAccount?.bank_account_type?.description}
                        />
                        <Textfield
                            disabled
                            label="Account No."
                            name="account_no"
                            value={employeeBankAccount?.bank_number}
                        />
                    </Grid>
                )}

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
                                setemployeeBankAccount({});
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