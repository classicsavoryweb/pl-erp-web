import Modal from "@/components/common/Modal";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import confirm from "@/components/common/Confirm";
import Grid from "@/components/common/Grid";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import Textfield from "@/components/common/Textfield";
import { useState, useEffect } from "react";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getTimeKeeping } from "@/api/transactions/time-keeping";
import LoadingState from "@/components/common/LoadingState";
import Dropdown from "@/components/common/Dropdown";
import ScheduleMasterlistDropDown from "../../generic/ScheduleMasterlistDropDown";
import { createAdjustments } from "@/api/transactions/adjustments";
import BranchDropDown from "../../generic/BranchDropDown";
import { getCurrentCutoff } from "@/helper/cutoff";

type PunchFormValues = {
    punches: { punch_time: string }[];
    employee_number: string;
    date: string;
    type: string;
    schedule: string;
    branch_id: string;
    punches_count: string;
};

interface FormModalInterface {
    modal: any;
    callBack: () => void;
};

const CreateAdjustmentsModal = ({
    modal,
    callBack
}: FormModalInterface) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>([]);

    const formHandler = useFormik<PunchFormValues>({
        initialValues: {
            employee_number: "",
            date: "",
            punches: [{ punch_time: ""}],
            punches_count: "",
            type: "",
            schedule: "",
            branch_id: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_number: Yup.string().required("Employee is required."),
            date: Yup.string().required("Date is required.").test(
                'past-dates',
                'Date must not be in the future or current cut off.',
                function (value) {
                    const { start_time } = getCurrentCutoff();
                    return moment(value).isBefore(moment(start_time).format('YYYY-MM-DD'));
                }),
            punches: Yup.array()
            .of(Yup.object().shape({
                punch_time: Yup.string().required("Punch time is required"),
            }))
            .min(1, "At least one punch is required"),
            type: Yup.string().required("Adjustment type is required."),
            schedule: Yup.string().required("Schedule is required."),
            branch_id: Yup.string().required("Branch is required.")
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
        onSubmit: async (values, {resetForm}) => {
            if (values.punches.length !== 2 && values.punches.length !== 4) {
                toast.error("You can only submit 2 or 4 number of punches");
                return;
            }

            const isConfirmed = await confirm({
                title: "Create Adjustment",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                createAdjustments(values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Adjustment saved successfully");
                        callBack();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        }
    });

    const createDefaultPunches = (selectedDate: string) => {
        const selectedDateFormatted = moment(selectedDate).format('YYYY-MM-DD');   
        return [
            { punch_time: `${selectedDateFormatted}` },
        ];
    };

    useAsyncEffect(() => {
        if (formHandler.values.employee_number, formHandler.values.date) {
            setLoading(true);
            getTimeKeeping({
                employee_number: formHandler.values.employee_number,
                date: formHandler.values.date
            }).then((resp) => {
                if (!resp.error) {
                    if (resp.data) {
                        setData(resp.data);
                        formHandler.setFieldValue("punches", resp.data.biotime_log.punches);
                        formHandler.setFieldValue("schedule", resp.data.schedule.timetable);
                        formHandler.setFieldValue("branch_id", resp.data.branch_id);
                    } else {
                        setData([]);
                        const defaultPunches = createDefaultPunches(formHandler.values.date);
                        formHandler.setFieldValue("punches", defaultPunches);
                        formHandler.setFieldValue("schedule", "");
                        formHandler.setFieldValue("branch_id", "");
                    }
                } else {
                    toast.error("Error fetching timekeeping details.");
                }
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [formHandler.values.employee_number, formHandler.values.date]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Adjustments"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
                setData([]);
            }}
            size="lg"
        >
            <form onSubmit={formHandler.handleSubmit}>
            <Grid cols={2}>
                <EmployeeDropDown
                    label="Employee"
                    name="employee_number"
                    placeholder="select employee"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.employee_number}
                    error={formHandler.errors.employee_number}
                    required
                />

                <Textfield
                    type="date"
                    label="Date"
                    name="date"
                    value={formHandler.values.date || ""}
                    onChange={(e) => {
                        formHandler.handleChange(e);

                        const newDate = e.target.value;
                        const punches = formHandler.values.punches || [];

                        const punchesMatchDate = punches.every(punch => {
                            if (!punch.punch_time) return true;
                            const punchDate = moment(punch.punch_time).format('YYYY-MM-DD');
                            const selectedDate = moment(newDate).format('YYYY-MM-DD');
                            return punchDate === selectedDate;
                        });

                        if (punches.length > 0 && !punchesMatchDate) {
                            const defaultPunches = createDefaultPunches(newDate);
                            formHandler.setFieldValue("punches", defaultPunches);
                        }
                    }}
                    error={formHandler.errors.date}
                    required
                />

                <BranchDropDown
                    label="Branch"
                    name="branch_id"
                    placeholder="select branch"
                    onChange={formHandler.handleChange}
                    value={Number(formHandler.values.branch_id)}
                    error={formHandler.errors.branch_id}
                    required
                />

                <Dropdown
                    name="type"
                    placeholder="select type"
                    label="Adjust Type"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.type ?? ""}
                    error={formHandler.errors.type}
                    options={[
                        {
                            label: "Incomplete Logs",
                            value: "Incomplete Logs",
                        },
                        {
                            label: "No Logs with Schedule",
                            value: "No Logs with Schedule",
                        },
                        {
                            label: "Incorrect Schedule",
                            value: "Incorrect Schedule",
                        },
                        {
                            label: "Blank Schedule with Logs",
                            value: "Blank Schedule with Logs",
                        },
                    ]}
                    required
                />
            </Grid>
            { (formHandler.values.employee_number && formHandler.values.date) &&
                <>
                    <p className="mt-3">Biotime Log Details</p>
                    { loading &&
                        <div className="flex justify-center">
                            <LoadingState/>
                        </div>
                    }
                    { !loading &&
                        <div className="flex justify-end my-[-10px]">
                            <div>
                                <Button
                                    label="Add"
                                    onClick={() => {
                                        formHandler.setFieldValue("punches", [
                                            ...formHandler.values.punches,
                                            { punch_time: "" },
                                        ]);
                                    }}
                                />
                            </div>
                        </div>
                    }
                    <Grid cols={2}>
                        {!loading && formHandler.values.punches.map((punch: any, index: number) => (
                            <div key={index}>
                                {index >= 0 && (
                                    <div className="flex justify-end text-red-500">
                                        <p
                                            className="z-1 pt-3 mb-[-22px] hover:text-red-800 text-sm hover:cursor-pointer"
                                            onClick={() => {
                                                const updatedPunches = [...formHandler.values.punches];
                                                updatedPunches.splice(index, 1);
                                                formHandler.setFieldValue("punches", updatedPunches);
                                            }}
                                        >
                                            Remove
                                        </p>
                                    </div>
                                )}
                                <Textfield
                                    type="datetime-local"
                                    label={`Punch Time #${index + 1}`}
                                    value={punch.punch_time ? moment(punch.punch_time).format('YYYY-MM-DDTHH:mm') : ""}
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
                            </div>
                        ))}
                    </Grid>
                </>
            }
            <p className="mt-3">Adjustments</p>
            <Grid cols={2}>
                <ScheduleMasterlistDropDown
                    name="schedule"
                    placeholder="select schedule"
                    label="Schedule"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.schedule}
                    error={formHandler.errors.schedule}
                    required
                />
            </Grid>

            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end gap-x-2">
                <div> 
                    <Button
                        label="Submit"
                        type="submit"
                        onClick={() => {
                        }}
                    />            
                </div>
                <div> 
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                            formHandler.resetForm();
                            setData([]);
                        }}
                    />            
                </div>
            </div>
            </form>
        </Modal>
    );
};

export default CreateAdjustmentsModal;