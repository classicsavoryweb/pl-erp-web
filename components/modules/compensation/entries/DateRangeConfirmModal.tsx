"use client";

import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { generateEntries } from "@/api/compensation/entries";
import CutOffDropDown from "../../generic/CutOffDropDown";
import { getCurrentCutoff } from "@/helper/cutoff";
import confirm from "@/components/common/Confirm";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import EntryValidationModal from "./EntryValidationModal";

interface DateRangeConfirmModalForm {
    modal: any;
    sendToApsys?: boolean;
}

const normalizeCutoffDates = (startTime: string, endTime: string, year: string | number) => {
    if (!startTime || !endTime || !year) {
        return {
            dateFrom: "",
            dateTo: "",
        };
    }

    const numericYear = Number(year);
    const startMonth = Number(startTime.split("-")[0]);
    const endMonth = Number(endTime.split("-")[0]);
    const startYear = startMonth === 12 && endMonth === 1 ? numericYear - 1 : numericYear;

    return {
        dateFrom: `${startYear}-${startTime}`,
        dateTo: `${numericYear}-${endTime}`,
    };
};

const DateRangeConfirmModal = ({
    modal,
    sendToApsys = true,
}: DateRangeConfirmModalForm) => {
    const currentCutoff = getCurrentCutoff();
    const currentYear = new Date().getFullYear();
    const currentCutoffDates = normalizeCutoffDates(
        currentCutoff.start_time,
        currentCutoff.end_time,
        currentYear
    );
    const modalTitle = sendToApsys ? "Send Entries to APSYS" : "Generate Entries";
    const submitLabel = sendToApsys ? "Send to APSYS" : "Generate";

    const [validationResponse, setValidationResponse] = useState<any>({});
    const validationModal = useModal();

    const formHandler = useFormik({
        initialValues: {
            action: "generate",
            cutoff: currentCutoff,
            selected_cutoff: currentCutoff.range,
            year: currentYear,
            date_from: currentCutoffDates.dateFrom,
            date_to: currentCutoffDates.dateTo,
            send_to_apsys: sendToApsys,
        },
        validationSchema: Yup.object({
            selected_cutoff: Yup.string().required("Cut off range is required"),
            year: Yup.string().required("Year is required"),
        }),
        validateOnChange: false,
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            if (values.action === "generate") {
                const actionText = values.send_to_apsys
                    ? "send this transaction to APSYS"
                    : "generate entries for this cutoff";

                const isConfirmed = await confirm({
                    title: modalTitle,
                    message: `Are you sure you want to ${actionText} for ${values.selected_cutoff} ${values.year}?`
                });

                if (!isConfirmed) {
                    setSubmitting(false);
                    return;
                }
                try {
                    const resp = await generateEntries({
                        ...values,
                        proceed: "No"
                    });

                    if (!resp.error) {
                        resetForm();
                        modal.onClose();
                        toast.success(resp.data.message);
                    } else {
                        if (resp.status === 409) {
                            setValidationResponse(resp.data.data);
                            modal.onClose();
                            validationModal.onOpen();
                        }
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

    return (
        <>
            <Modal
                isShowing={modal.isShowing}
                title={modalTitle}
                onClose={() => {
                    modal.onClose();
                    formHandler.resetForm();
                }}
                loading={modal.loading}
                size="md"
            >
                <form onSubmit={formHandler.handleSubmit}>
                    <CutOffDropDown
                        value={formHandler.values.selected_cutoff}
                        onChange={(e) => {
                            const nextCutoff = e.target.obj || currentCutoff;
                            const nextDates = normalizeCutoffDates(
                                nextCutoff?.start_time,
                                nextCutoff?.end_time,
                                formHandler.values.year
                            );

                            formHandler.setFieldValue("cutoff", nextCutoff);
                            formHandler.setFieldValue("selected_cutoff", e.target.value);
                            formHandler.setFieldValue("date_from", nextDates.dateFrom);
                            formHandler.setFieldValue("date_to", nextDates.dateTo);
                        }}
                        required
                        error={formHandler.errors.selected_cutoff}
                    />
                    <Dropdown
                        placeholder="select year"
                        label="Year"
                        name="year"
                        value={String(formHandler.values.year)}
                        onChange={(e) => {
                            const nextYear = e.target.value;
                            const nextDates = normalizeCutoffDates(
                                formHandler.values.cutoff?.start_time,
                                formHandler.values.cutoff?.end_time,
                                nextYear
                            );

                            formHandler.handleChange(e);
                            formHandler.setFieldValue("date_from", nextDates.dateFrom);
                            formHandler.setFieldValue("date_to", nextDates.dateTo);
                        }}
                        required
                        error={formHandler.errors.year}
                        options={Array.from({ length: 100 }, (_, i) => {
                            const year = currentYear - i;
                            return {
                                label: year.toString(),
                                value: year.toString(),
                            };
                        })}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label={submitLabel}
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </form>
            </Modal>

            <EntryValidationModal
                modal={validationModal}
                api={generateEntries}
                validationData={validationResponse}
                payload={formHandler.values}
                allocation_id={0}
                type="Payroll"
            />
        </>
    );
};

export default DateRangeConfirmModal;
