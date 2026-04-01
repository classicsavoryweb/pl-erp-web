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
