"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editOvertime } from "@/api/transactions/overtime";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditOvertimeForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
        initialValues: {
            employee: "",
            branch: "",
            date: "",
            regular_overtime: "",
            legal_holiday_overtime: "",
            special_holiday_overtime: "",
            night_diff_overtime: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee: Yup.string().required("Employee is required."),
            branch: Yup.string().required("Branch is required."),
            date: Yup.string().required("Date is required."),
            regular_overtime: Yup.string().required("Regular overtime is required."),
            legal_holiday_overtime: Yup.string().required("Legal holiday overtime is required."),
            special_holiday_overtime: Yup.string().required("Special holiday overtime is required."),
            night_diff_overtime: Yup.string().required("Night diff overtime is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Overtime",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editOvertime(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Overtime updated successfully");
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
            title="Edit overtime"
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
                    name="employee"
                    value={editFormHandler.values.employee}
                    disabled
                />
                <Textfield
                    label="Branch"
                    name="branch"
                    value={editFormHandler.values.branch}
                    disabled
                />
                <Textfield
                    label="Date"
                    placeholder="enter date"
                    name="date"
                    type="date"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.date}
                    error={editFormHandler.errors.date}
                    required
                />
                <Textfield
                    label="Regular Overtime"
                    placeholder="enter overtime"
                    name="regular_overtime"
                    type="number"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.regular_overtime}
                    error={editFormHandler.errors.regular_overtime}
                    required
                />
                <Textfield
                    label="Night Diff Overtime"
                    placeholder="enter night diff overtime"
                    name="night_diff_overtime"
                    type="number"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.night_diff_overtime}
                    error={editFormHandler.errors.night_diff_overtime}
                    required
                />
                <Textfield
                    label="Legal Holiday Overtime"
                    placeholder="enter legal holiday overtime"
                    name="legal_holiday_overtime"
                    type="number"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.legal_holiday_overtime}
                    error={editFormHandler.errors.legal_holiday_overtime}
                    required
                />
                <Textfield
                    label="Special Holiday Overtime"
                    placeholder="enter special holiday overtime"
                    name="special_holiday_overtime"
                    type="number"
                    onChange={editFormHandler.handleChange}
                    value={editFormHandler.values.special_holiday_overtime}
                    error={editFormHandler.errors.special_holiday_overtime}
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

export default EditOvertimeForm;