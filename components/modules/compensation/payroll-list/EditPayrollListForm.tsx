"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editPayrollList } from "@/api/compensation/payroll-list";
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

    const editFormHandler = useFormik({
        initialValues: {
            employee: formValue.employee || {},
            employee_id: formValue.employee.id,
            is_included: 0,
            is_statutory_only: 0,
            is_mancom: 0,
            is_on_maternity_leave: 0,
            is_bank: 0,
            is_hold: 0,
            remarks: "",
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
                title: "Edit Payroll",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editPayrollList(values, formValue.id).then((resp) => {
                    if(!resp.error) {
                        toast.success("Payroll updated successfully");
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
                <Textfield
                    label="Employee"
                    name="employee_full_name"
                    value={editFormHandler.values.employee.full_name || ""}
                    disabled
                    required
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
                <div className="mb-2">
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
                </div>
                <Grid cols={2}>
                    <div className="mb-2">
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
                    </div>
                    <div className="mb-2">
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
                    </div>
                </Grid>

                <p className="mb-[-2px]">
                    Transaction Mode<span className="text-red-400">*</span>
                </p>
                <Grid cols={3}>
                    <Checkbox
                        label="Bank"
                        checked={editFormHandler.values.is_bank === 1}
                        value="is_bank"
                        onChange={(e) => {
                            if (e.target.checked) {
                                editFormHandler.setFieldValue("is_bank", 1);
                            } else {
                                editFormHandler.setFieldValue("is_bank", 0);
                            }
                        }}
                    />
                    <Checkbox
                        label="Cash"
                        checked={editFormHandler.values.is_bank === 0}
                        value="is_bank"
                        onChange={(e) => {
                            if (e.target.checked) {
                                editFormHandler.setFieldValue("is_bank", 0);
                            } else {
                                editFormHandler.setFieldValue("is_bank", 1);
                            }
                        }}
                    />

                    <Checkbox
                        label="Hold"
                        checked={editFormHandler.values.is_hold === 1}
                        value="is_hold"
                        onChange={(e) => {
                            if (e.target.checked) {
                                editFormHandler.setFieldValue("is_hold", 1);
                            } else {
                                editFormHandler.setFieldValue("is_hold", 0);
                            }
                        }}
                    />
                </Grid>

                {editFormHandler.values.is_bank === 1 && editFormHandler.values.employee.latest_bank_details &&
                    <Grid cols={2}>
                        <Textfield
                            disabled
                            label="Account Type"
                            name="description"
                            value={editFormHandler.values.employee.latest_bank_details.bank_account_type.description}
                        />
                        <Textfield
                            disabled
                            label="Account No."
                            name="account_no"
                            value={editFormHandler.values.employee.latest_bank_details.bank_number}
                        />
                    </Grid>
                }

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