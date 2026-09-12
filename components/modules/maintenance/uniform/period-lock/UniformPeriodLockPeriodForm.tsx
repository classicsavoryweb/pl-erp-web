"use client";

import { saveUniformPeriodLockPeriod } from "@/api/maintenance/uniform-period-lock";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import UniformPeriodLockStatusDropDown from "./UniformPeriodLockStatusDropDown";

interface Props {
    modal: any;
    formValue?: any;
    onSubmitCallback: () => void;
}

const defaultValues = {
    issuance_id: "",
    receiving_id: "",
    date_from: "",
    date_to: "",
    issuance_status: "inactive",
    receiving_status: "inactive",
};

const UniformPeriodLockPeriodForm = ({ modal, formValue, onSubmitCallback }: Props) => {
    const isEdit = Boolean(formValue?.issuance?.id || formValue?.receiving?.id);

    const form = useFormik({
        initialValues: defaultValues,
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            date_from: Yup.string().required("Date from is required."),
            date_to: Yup.string().required("Date to is required."),
            issuance_status: Yup.string().required("Issuance lock is required."),
            receiving_status: Yup.string().required("Receiving lock is required."),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const isConfirmed = await confirm({
                title: isEdit ? "Update Date Period" : "Create Date Period",
                message: "Are you sure you want to submit?",
            });
            if (!isConfirmed) return;

            try {
                setSubmitting(true);
                const resp = await saveUniformPeriodLockPeriod(values);

                if (!resp.error) {
                    toast.success(isEdit ? "Date period updated successfully" : "Date period created successfully");
                    onSubmitCallback();
                    modal.onClose();
                    form.resetForm({ values: defaultValues });
                } else {
                    toast.error(resp.data?.message ?? "Unable to save date period.");
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
                issuance_id: formValue.issuance?.id ?? "",
                receiving_id: formValue.receiving?.id ?? "",
                date_from: formValue.date_from ?? "",
                date_to: formValue.date_to ?? "",
                issuance_status: formValue.issuance?.status ?? "inactive",
                receiving_status: formValue.receiving?.status ?? "inactive",
            });
        } else {
            form.resetForm({ values: defaultValues });
        }
    }, [formValue]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title={isEdit ? "Edit Date Period" : "Create Date Period"}
            onClose={() => {
                modal.onClose();
                form.resetForm({ values: defaultValues });
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={form.handleSubmit}>
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
                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                    <UniformPeriodLockStatusDropDown
                        label="Issuance Lock"
                        name="issuance_status"
                        value={form.values.issuance_status}
                        required
                        onChange={form.handleChange}
                        error={form.errors.issuance_status}
                    />
                    <UniformPeriodLockStatusDropDown
                        label="Receiving Lock"
                        name="receiving_status"
                        value={form.values.receiving_status}
                        required
                        onChange={form.handleChange}
                        error={form.errors.receiving_status}
                    />
                </div>
                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                form.resetForm({ values: defaultValues });
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

export default UniformPeriodLockPeriodForm;
