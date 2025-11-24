"use client";

import { editBiotimePunches } from "@/api/transactions/actual-time";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import * as Yup from "yup";
import BranchDropDown from "../../generic/BranchDropDown";
import Grid from "@/components/common/Grid";

interface FormModalInterface {
    modal: any;
    data: any[];
    selectedLog: string;
    onSubmitCallBack: () => void;
}

type PunchFormValues = {
    punches: { punch_time: string, newPunch?: boolean, branch_id: string }[]; 
    punches_count: string;
    date: string;
};

const EditActualTimeModal = ({
    modal,
    data = [],
    selectedLog,
    onSubmitCallBack
}: FormModalInterface) => {

    const formHandler = useFormik<PunchFormValues>({
        initialValues: {
            punches: [{ punch_time: "", newPunch: true, branch_id: "" }],
            punches_count: "",
            date: "",
        },
        validationSchema: Yup.object().shape({
            punches: Yup.array().of(
            Yup.object().shape({
                punch_time: Yup.string().required("Punch time is required"),
            })),
        }),
        validate: (values) => {
            const errors: any = {};
            if (values.punches && values.date) {
                const selectedDate = moment(values.date).startOf('day');
                const nextDay = moment(values.date).add(1, 'day').startOf('day');
                
                const timesOnSelectedDate: Record<string, number[]> = {};
                const timesOnNextDay: Record<string, number[]> = {};

                values.punches.forEach((punch, index) => {
                    if (punch.punch_time) {
                        const punchTimeStr = moment(punch.punch_time).format('HH:mm');
                        const punchDate = moment(punch.punch_time).startOf('day');

                        if (punchDate.isSame(selectedDate)) {
                            if (!timesOnSelectedDate[punchTimeStr]) {
                                timesOnSelectedDate[punchTimeStr] = [];
                            }
                            timesOnSelectedDate[punchTimeStr].push(index);
                        } else if (punchDate.isSame(nextDay)) {
                            if (!timesOnNextDay[punchTimeStr]) {
                                timesOnNextDay[punchTimeStr] = [];
                            }
                            timesOnNextDay[punchTimeStr].push(index);
                        } else {
                            if (!errors.punches) errors.punches = [];
                            if (!errors.punches[index]) errors.punches[index] = {};
                            errors.punches[index].punch_time = 'Must be same date as selected or next day.';
                        }
                    }
                });

                Object.entries(timesOnSelectedDate).forEach(([time, indices]) => {
                    if (indices.length > 1) {
                        if (!errors.punches) errors.punches = [];
                        indices.forEach((i) => {
                            if (!errors.punches[i]) errors.punches[i] = {};
                            errors.punches[i].punch_time = 'Must be no same time from same date.';
                        });
                    }
                });

                Object.entries(timesOnNextDay).forEach(([time, indices]) => {
                    if (indices.length > 1) {
                        if (!errors.punches) errors.punches = [];
                        indices.forEach((i) => {
                            if (!errors.punches[i]) errors.punches[i] = {};
                            errors.punches[i].punch_time = 'Must be no same time from same date.';
                        });
                    }
                });
            }
            return errors;
        },

        onSubmit: async (values) => {
            if (values.punches.length !== 2 && values.punches.length !== 4) {
                toast.error("You can only submit 2 or 4 number of punches");
                return;
            }

            const isConfirmed = await confirm({
                title: "Edit Biotime Punches",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                editBiotimePunches(values, selectedLog)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success(resp.data.message);
                            modal.onClose();
                            onSubmitCallBack();
                        } else {
                            toast.error(resp.data.message);
                        }
                    })
                    .catch(() => {
                        toast.error("Error encountered");
                    });
            }
        }
    });

    useEffect(() => {
        if (data && data.length > 0) {
            const punchesWithFlag = data.map(punch => ({
                ...punch,
                newPunch: false
            }));

            if (punchesWithFlag[0]?.punch_time) {
                const firstPunchDate = moment(punchesWithFlag[0].punch_time).format('YYYY-MM-DD');
                formHandler.setFieldValue("date", firstPunchDate);
                formHandler.setFieldValue("punches", punchesWithFlag);
            }
        } 
    }, [data, selectedLog]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Biotime Logs"
            onClose={() => {
                modal.onClose();
            }}
            loading={modal.loading}
            size="lg"
        >
            <Textfield
                type="date"
                label="Date"
                name="date"
                value={formHandler.values.date || ""}
                error={formHandler.errors.date}
                disabled
            />

            <div className="flex justify-end">
                <div>
                    <Button
                        label="Add"
                        onClick={() => {
                            formHandler.setFieldValue("punches", [
                                ...formHandler.values.punches,
                                { punch_time: "", newPunch: true },
                            ]);
                        }}
                    />
                </div>
            </div>

            <form onSubmit={formHandler.handleSubmit}>
                {formHandler.values.punches.map((punch: any, index) => (
                    <div key={index}>
                        {punch.newPunch && (
                            <div className="flex justify-end text-red-500">
                                <p
                                    className="z-1 pt-3 mb-[-22px] hover:text-red-800  hover:cursor-pointer"
                                    onClick={() => {
                                        const updatedPunches = [...formHandler.values.punches];
                                        updatedPunches.splice(index, 1);
                                        formHandler.setFieldValue("punches", updatedPunches, false);
                                    }}
                                >
                                    Remove
                                </p>
                            </div>
                        )}
                        <Grid cols={2} key={index}>
                            <Textfield
                                type="datetime-local"
                                label={`Punch Time #${index + 1}`}
                                value={punch.punch_time}
                                onChange={(e) => {
                                    const updatedPunches: any = [...formHandler.values.punches];
                                    updatedPunches[index] = {
                                        ...updatedPunches[index],
                                        punch_time: e.target.value.replace("T", " ") + ":00"
                                    };
                                    formHandler.setFieldValue('punches', updatedPunches);
                                }}
                                error={
                                    formHandler.touched.punches?.[index]?.punch_time &&
                                    typeof (formHandler.errors.punches as { punch_time?: string }[] | undefined)?.[index]?.punch_time === "string"
                                        ? (formHandler.errors.punches as { punch_time?: string }[])[index].punch_time
                                        : ""
                                }
                            />
                            <BranchDropDown
                                label={`Biometric Branch #${index + 1}`}
                                value={Number(punch.branch_id ?? 125)}
                                name="branch_id"
                                placeholder="select branch"
                                onChange={(e) => {
                                    const updatedPunches: any = [...formHandler.values.punches];
                                    updatedPunches[index] = {
                                        ...updatedPunches[index],
                                        branch_id: e.target.value
                                    };
                                    formHandler.setFieldValue('punches', updatedPunches);
                                }}
                            />
                        </Grid>
                    </div>
                ))}

                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Submit"
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
                            }}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditActualTimeModal;
