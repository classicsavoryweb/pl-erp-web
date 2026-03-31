import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { generateEntries } from "@/api/compensation/entries";
import CutOffDropDown from "../../generic/CutOffDropDown";
import FinalizedCutOffDropDown from "../../generic/FinalizedCutOffDropDown";
import { getCurrentCutoff } from "@/helper/cutoff";
import { useCutOffStore } from "@/stores/useCutOffStore";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useEffect } from "react";

interface DateRangeConfirmModalForm {
    modal: any;
    sendToApsys?: boolean;
    finalizedOnly?: boolean;
}

const convertDate = (mmdd: string) => {
    if (!mmdd) return "";
    const year = new Date().getFullYear();
    return `${year}-${mmdd}`;
};

const DateRangeConfirmModal = ({
    modal,
    sendToApsys = true,
    finalizedOnly = false,
}: DateRangeConfirmModalForm) => {
    const currentCutoff = getCurrentCutoff();
    const { cut_offs, getCutOffs } = useCutOffStore();

    useAsyncEffect(() => {
        if (finalizedOnly) {
            getCutOffs();
        }
    }, [finalizedOnly]);

    const formHandler = useFormik({
        initialValues: {
            action: "generate",
            selected_cutoff: finalizedOnly ? "" : currentCutoff.range,
            date_from: finalizedOnly ? "" : convertDate(currentCutoff.start_time),
            date_to: finalizedOnly ? "" : convertDate(currentCutoff.end_time),
            send_to_apsys: sendToApsys,
        },
        validationSchema: Yup.object({
            selected_cutoff: Yup.string().required("Cut off range is required"),
        }),
        validateOnChange: false,
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            if (values.action === "generate") {
                generateEntries({
                    ...values
                })
                .then((resp) => {
                    if (!resp.error) {
                        resetForm();
                        modal.onClose();
                        toast.success(resp.data.message);
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    setSubmitting(false);
                });
            }
        }
    });

    useEffect(() => {
        if (!modal.isShowing || !finalizedOnly || cut_offs.length === 0) {
            return;
        }

        const latestFinalizedCutoff = cut_offs[0];

        formHandler.setValues((prevValues) => ({
            ...prevValues,
            selected_cutoff: String(latestFinalizedCutoff.id),
            date_from: latestFinalizedCutoff.start_date,
            date_to: latestFinalizedCutoff.end_date,
            send_to_apsys: sendToApsys,
        }));
    }, [modal.isShowing, finalizedOnly, cut_offs, sendToApsys]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Generate Entries"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                {finalizedOnly ? (
                    <FinalizedCutOffDropDown
                        name="selected_cutoff"
                        value={formHandler.values.selected_cutoff}
                        onChange={(e) => {
                            formHandler.setFieldValue("selected_cutoff", String(e.target.value));
                            formHandler.setFieldValue("date_from", e.target.obj?.start_date || "");
                            formHandler.setFieldValue("date_to", e.target.obj?.end_date || "");
                        }}
                        required
                        error={formHandler.errors.selected_cutoff}
                    />
                ) : (
                    <CutOffDropDown
                        value={formHandler.values.selected_cutoff}
                        onChange={(e) => {
                            formHandler.setFieldValue("selected_cutoff", e.target.value);

                            const dateFrom = convertDate(e.target.obj?.start_time);
                            const dateTo = convertDate(e.target.obj?.end_time);

                            formHandler.setFieldValue("date_from", dateFrom);
                            formHandler.setFieldValue("date_to", dateTo);
                        }}
                        required
                        error={formHandler.errors.selected_cutoff}
                    />
                )}
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
                        label="Submit"
                        loading={formHandler.isSubmitting}
                        onClick={() => {}}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default DateRangeConfirmModal;
