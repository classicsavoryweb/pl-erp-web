"use client";

import Modal from "@/components/common/Modal";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateTimeKeepingUndertime } from "@/api/transactions/time-keeping";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import moment from "moment";

interface EditUndertimeModalProps {
    modal: any;
    data: any;
    onSubmitCallback?: () => void;
}

const EditUndertimeModal = ({
    modal,
    data,
    onSubmitCallback
}: EditUndertimeModalProps) => {
    const scheduleType = data?.employee?.schedule?.schedule_type?.name ?? "Normal Schedule";
    const halfDayHours = scheduleType === "Compressed Schedule" ? 4.75 : 4;

    const initialUndertimeMinutes = useMemo(() => {
        const total = Number(data?.undertime ?? 0);
        const hours = Math.floor(total / 60);
        const minutes = total % 60;
        return { hours, minutes };
    }, [data?.undertime]);

    const initialTardinessMinutes = useMemo(() => {
        const total = Number(data?.tardiness ?? 0);
        const hours = Math.floor(total / 60);
        const minutes = total % 60;
        return { hours, minutes };
    }, [data?.tardiness]);

    const initialTag = useMemo(() => {
        if (data?.manual_tag) return data.manual_tag;
        const hasTardiness = Number(data?.tardiness ?? 0) > 0;
        const hasUndertime = Number(data?.undertime ?? 0) > 0;
        if (hasTardiness && hasUndertime) return "tardiness_undertime";
        if (hasTardiness) return "tardiness";
        if (!data?.final_worked_hours) return "undertime";
        const finalHours = Number(data.final_worked_hours);
        if (Math.abs(finalHours - halfDayHours) < 0.01) {
            return "halfday";
        }
        return "undertime";
    }, [data?.final_worked_hours, halfDayHours]);

    const formHandler = useFormik({
        enableReinitialize: true,
        initialValues: {
            timekeeping_id: data?.id ?? "",
            tag: initialTag,
            undertime_hours: initialUndertimeMinutes.hours,
            undertime_minutes: initialUndertimeMinutes.minutes,
            tardiness_hours: initialTardinessMinutes.hours,
            tardiness_minutes: initialTardinessMinutes.minutes,
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            timekeeping_id: Yup.string().required(),
            tag: Yup.string().required("Tag is required"),
            undertime_hours: Yup.number().min(0, "Hours must be 0 or higher").when("tag", {
                is: (value: string) => ["undertime", "halfday", "tardiness_undertime"].includes(value),
                then: schema => schema.required("Hours is required"),
                otherwise: schema => schema.notRequired(),
            }),
            undertime_minutes: Yup.number().min(0, "Minutes must be 0 or higher").max(59, "Minutes must be 0-59").when("tag", {
                is: (value: string) => ["undertime", "halfday", "tardiness_undertime"].includes(value),
                then: schema => schema.required("Minutes is required"),
                otherwise: schema => schema.notRequired(),
            }),
            tardiness_hours: Yup.number().min(0, "Hours must be 0 or higher").when("tag", {
                is: (value: string) => ["tardiness", "tardiness_undertime", "tardiness_halfday"].includes(value),
                then: schema => schema.required("Hours is required"),
                otherwise: schema => schema.notRequired(),
            }),
            tardiness_minutes: Yup.number().min(0, "Minutes must be 0 or higher").max(59, "Minutes must be 0-59").when("tag", {
                is: (value: string) => ["tardiness", "tardiness_undertime", "tardiness_halfday"].includes(value),
                then: schema => schema.required("Minutes is required"),
                otherwise: schema => schema.notRequired(),
            }),
        }),
        onSubmit: async (values, { resetForm }) => {
            const isConfirmed = await confirm({
                title: "Update Timekeeping",
                message: "Are you sure you want to save changes?"
            });

            if (!isConfirmed) {
                return;
            }

            updateTimeKeepingUndertime({
                timekeeping_id: values.timekeeping_id,
                tag: values.tag,
                hours: Number(values.undertime_hours),
                minutes: Number(values.undertime_minutes),
                tardiness_hours: Number(values.tardiness_hours),
                tardiness_minutes: Number(values.tardiness_minutes),
            })
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Timekeeping updated");
                    modal.onClose();
                    onSubmitCallback && onSubmitCallback();
                    resetForm();
                } else {
                    toast.error(resp.data.message);
                }
            })
            .catch(() => {
                toast.error("Error encountered");
            });
        }
    });

    useEffect(() => {
        if (!modal.isShowing) {
            formHandler.resetForm();
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Adjustment"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={2}>
                    <Textfield
                        label="Employee"
                        value={data?.employee?.full_name ?? ""}
                        disabled
                        name="employee"
                    />
                    <Textfield
                        label="Date"
                        value={data?.date ? moment(data.date).format("YYYY-MM-DD") : ""}
                        disabled
                        name="date"
                    />
                </Grid>

                <Grid cols={1}>
                    <Dropdown
                        label="Tag"
                        placeholder="select tag"
                        name="tag"
                        value={formHandler.values.tag}
                        onChange={formHandler.handleChange}
                        error={typeof formHandler.errors.tag === "string" ? formHandler.errors.tag : undefined}
                        options={[
                            { label: "Tag as Undertime", value: "undertime" },
                            { label: "Tag as Halfday", value: "halfday" },
                            { label: "Tag as Tardiness", value: "tardiness" },
                            { label: "Tag as Tardiness with Undertime", value: "tardiness_undertime" },
                            { label: "Tag as Tardiness with Halfday", value: "tardiness_halfday" },
                        ]}
                    />
                </Grid>

                {(["tardiness", "tardiness_undertime", "tardiness_halfday"].includes(formHandler.values.tag)) &&
                    <p className="mt-2 text-sm text-slate-600">
                        Enter tardiness hours and minutes.
                    </p>
                }

                {(["tardiness", "tardiness_undertime", "tardiness_halfday"].includes(formHandler.values.tag)) &&
                    <Grid cols={2}>
                        <Textfield
                            type="number"
                            label="Tardiness Hours"
                            name="tardiness_hours"
                            value={formHandler.values.tardiness_hours}
                            onChange={formHandler.handleChange}
                            error={formHandler.errors.tardiness_hours}
                            required
                        />
                        <Textfield
                            type="number"
                            label="Tardiness Minutes"
                            name="tardiness_minutes"
                            value={formHandler.values.tardiness_minutes}
                            onChange={formHandler.handleChange}
                            error={formHandler.errors.tardiness_minutes}
                            required
                        />
                    </Grid>
                }

                {(["undertime", "halfday", "tardiness_undertime"].includes(formHandler.values.tag)) &&
                    <>
                        <p className="mt-2 text-sm text-slate-600">
                            Enter undertime hours and minutes.
                        </p>
                        <Grid cols={2}>
                            <Textfield
                                type="number"
                                label="Undertime Hours"
                                name="undertime_hours"
                                value={formHandler.values.undertime_hours}
                                onChange={formHandler.handleChange}
                                error={formHandler.errors.undertime_hours}
                                required
                            />
                            <Textfield
                                type="number"
                                label="Undertime Minutes"
                                name="undertime_minutes"
                                value={formHandler.values.undertime_minutes}
                                onChange={formHandler.handleChange}
                                error={formHandler.errors.undertime_minutes}
                                required
                            />
                        </Grid>
                    </>
                }

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Save"
                            type="submit"
                            onClick={() => {}}
                        />
                    </div>
                    <div>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditUndertimeModal;
