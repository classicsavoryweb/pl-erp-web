"use client";

import {
    createUniformPeriodLock,
    editUniformPeriodLock,
} from "@/api/maintenance/uniform-period-lock";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import ActiveInactiveDropDown from "@/components/modules/generic/ActiveInactiveDropDown";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface Props {
    modal: any;
    formValue?: any;
    onSubmitCallback: () => void;
    lockType: "Issuance" | "Receiving";
}

const defaultValues = {
    period_name: "",
    lock_type: "Issuance",
    date_from: "",
    date_to: "",
    status: "active",
};

const UniformPeriodLockForm = ({ modal, formValue, onSubmitCallback, lockType }: Props) => {
    const isEdit = Boolean(formValue?.id);
    const initialValues = { ...defaultValues, lock_type: lockType };

    const form = useFormik({
        initialValues,
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            period_name: Yup.string().required("Period name is required."),
            lock_type: Yup.string().required("Lock type is required."),
            date_from: Yup.string().required("Date from is required."),
            date_to: Yup.string().required("Date to is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const isConfirmed = await confirm({
                title: isEdit ? "Update Uniform Period" : "Create Uniform Period",
                message: "Are you sure you want to submit?",
            });
            if (!isConfirmed) return;

            try {
                setSubmitting(true);
                const resp = isEdit
                    ? await editUniformPeriodLock(formValue.id, { ...values, lock_type: lockType })
                    : await createUniformPeriodLock({ ...values, lock_type: lockType });

                if (!resp.error) {
                    toast.success(isEdit ? "Uniform period updated successfully" : "Uniform period created successfully");
                    onSubmitCallback();
                    modal.onClose();
                    form.resetForm({ values: initialValues });
                } else {
                    toast.error(resp.data?.message ?? "Unable to save uniform period.");
                }
            } catch {
                toast.error("Error encountered");
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (formValue) {
            form.setValues({
                period_name: formValue.period_name ?? "",
                lock_type: lockType,
                date_from: formValue.date_from ?? "",
                date_to: formValue.date_to ?? "",
                status: formValue.status ?? "active",
            });
        } else {
            form.setFieldValue("lock_type", lockType);
        }
    }, [formValue, lockType]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title={isEdit ? "Edit Uniform Period" : "Create Uniform Period"}
            onClose={() => {
                modal.onClose();
                form.resetForm({ values: initialValues });
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={form.handleSubmit}>
                <Textfield
                    label="Period Name"
                    placeholder="enter period name"
                    name="period_name"
                    value={form.values.period_name}
                    required
                    onChange={form.handleChange}
                    error={form.errors.period_name}
                />
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                    <Textfield
                        label="Date From"
                        type="date"
                        name="date_from"
                        value={form.values.date_from}
                        required
                        onChange={form.handleChange}
                        error={form.errors.date_from}
                    />
                    <Textfield
                        label="Date To"
                        type="date"
                        name="date_to"
                        value={form.values.date_to}
                        required
                        onChange={form.handleChange}
                        error={form.errors.date_to}
                    />
                </div>
                <ActiveInactiveDropDown
                    label="Status"
                    name="status"
                    value={form.values.status}
                    required
                    onChange={form.handleChange}
                    error={form.errors.status}
                />
                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                form.resetForm({ values: initialValues });
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={form.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default UniformPeriodLockForm;
