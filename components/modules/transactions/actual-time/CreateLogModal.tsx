"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import EmployeeDropDown from "../../generic/EmployeeDropDown";
import BranchDropDown from "../../generic/BranchDropDown";
import confirm from "@/components/common/Confirm";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { toast } from "react-toastify";
import { useState } from "react";
import { createBiotimeLog } from "@/api/transactions/actual-time";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

type PunchFormValues = {
    employee_number: string;
    time_keeping: {
        punches: { punch_time: string}[];
        date: string;
        branch_id: string;
    }[];
    branch_id: string;
    overwrite?: boolean;
};

const CreateLogModal = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const [data, setData] = useState<any>([]);

    const formHandler = useFormik<PunchFormValues>({
        initialValues: {
            time_keeping: [
                {
                    punches: [
                        { punch_time: "" },
                        { punch_time: "" },
                        { punch_time: "" },
                        { punch_time: "" },
                    ],
                    branch_id: "",
                    date: "",
                },
            ],
            employee_number: "",
            branch_id: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_number: Yup.string().required("Employee is required"),
            time_keeping: Yup.array()
            .of(
                Yup.object().shape({
                branch_id: Yup.string().required("Branch is required"),
                date: Yup.string().required("Date is required"),
                punches: Yup.array()
                    .of(
                    Yup.object().shape({
                        punch_time: Yup.string().required("Punch time is required"),
                    })
                    )
                    .min(1, "At least one punch is required"),
                })
            )
            .min(1),
        }),
        validate: (values) => {
            const errors: any = {};

            values.time_keeping.forEach((tk, tkIndex) => {
            if (tk.punches && tk.date) {
                const selectedDate = moment(tk.date).startOf("day");
                const nextDay = moment(tk.date).add(1, "day").startOf("day");

                const timesOnSelectedDate: Record<string, number[]> = {};
                const timesOnNextDay: Record<string, number[]> = {};

                tk.punches.forEach((punch, index) => {
                if (punch.punch_time) {
                    const punchTimeStr = moment(punch.punch_time).format("HH:mm");
                    const punchDate = moment(punch.punch_time).startOf("day");

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
                    errors.time_keeping = errors.time_keeping || [];
                    errors.time_keeping[tkIndex] = errors.time_keeping[tkIndex] || {
                        punches: [],
                    };
                    errors.time_keeping[tkIndex].punches[index] = {
                        punch_time: "Must be same date as selected or next day.",
                    };
                    }
                }
                });

                Object.entries(timesOnSelectedDate).forEach(([_, indices]) => {
                if (indices.length > 1) {
                    errors.time_keeping = errors.time_keeping || [];
                    errors.time_keeping[tkIndex] = errors.time_keeping[tkIndex] || {
                    punches: [],
                    };
                    indices.forEach((i) => {
                    errors.time_keeping[tkIndex].punches[i] = {
                        punch_time: "Must be no same time from same date.",
                    };
                    });
                }
                });

                Object.entries(timesOnNextDay).forEach(([_, indices]) => {
                if (indices.length > 1) {
                    errors.time_keeping = errors.time_keeping || [];
                    errors.time_keeping[tkIndex] = errors.time_keeping[tkIndex] || {
                    punches: [],
                    };
                    indices.forEach((i) => {
                    errors.time_keeping[tkIndex].punches[i] = {
                        punch_time: "Must be no same time from same date.",
                    };
                    });
                }
                });
            }
            });

            return errors;
        },
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            let hasThreeLogs = false;
            const dates = values.time_keeping.map(tk => tk.date);
            const duplicates = dates.filter((date, idx) => dates.indexOf(date) !== idx);

            if (duplicates.length > 0) {
                toast.error("You cannot have duplicate dates in time keeping");
            }

            values.time_keeping.map((tk) => {
                if (tk.punches.length === 1) {
                    toast.error("You cannot submit only 1 punch");
                    hasThreeLogs = true;
                    return;
                }
            });

            if (hasThreeLogs || duplicates.length > 0) {
                return;
            }

            const payload = {
                ...values,
                time_keeping: values.time_keeping.map((tk) => ({
                    ...tk,
                    punches: tk.punches.map((punch) => ({
                        ...punch,
                        punch_time: punch.punch_time
                            ? moment(punch.punch_time, "YYYY-MM-DDTHH:mm").format("YYYY-MM-DD HH:mm:ss")
                            : punch.punch_time,
                    })),
                })),
            };

            try {
                setSubmitting(true);
                const response = await createBiotimeLog(payload);

                if (!response.error) {
                    toast.success(response.data.message);
                    modal.onClose();
                    resetForm();
                    onSubmitCallback();
                } else {
                    if (response.data.message === "Existing") {
                        const isConfirmed = await confirm({
                        title: "Biotime Already Exists",
                        message: "Do you want to overwrite?",
                        });
    
                        if (isConfirmed) {
                            createBiotimeLog({
                                ...payload,
                                overwrite: true,
                            }).then((resp) => {
                                if (!resp.error) {
                                    toast.success(resp.data.message);
                                    modal.onClose();
                                    resetForm();
                                    onSubmitCallback();
                                } else {
                                    toast.error(resp.data.message);
                                }
                            }).catch(() => {
                                    toast.error("Error encountered");
                            });
                        }
                    } else {
                        toast.error(response.data.message);
                    }
                }
            } catch {
                toast.error("Error encountered");
            } finally {
                setSubmitting(false);
            }
        },
    });


    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Biotime Logs"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
                setData([]);
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <p>Employee Details</p>
                <EmployeeDropDown
                    label="Employee"
                    placeholder="select employee"
                    onChange={(e) => {
                        formHandler.handleChange(e);
                        formHandler.setFieldValue("branch_id", e.target.obj.branch_id);
                        const new_time_keeping = formHandler.values.time_keeping;
                        new_time_keeping.forEach((tk) => {
                            tk.branch_id = e.target.obj.branch_id;
                        });

                        formHandler.setFieldValue("time_keeping", new_time_keeping, false);
                    }}
                    name="employee_number"
                    value={formHandler.values.employee_number}
                    error={formHandler.errors.employee_number}
                    required
                />

                { formHandler.values.time_keeping.map((timekeep, key) => {
                    return (
                        <div key={key}>
                            { key !== 0 &&
                                <hr className="mt-5 text-gray-300"/>
                            }
                            <div className="mt-5 flex justify-between items-center">
                                <p>Log Details</p>

                                { key !== 0 &&
                                    <p
                                        className=" text-red-500 hover:text-blue-950 dark:text-red-500 hover:cursor-pointer"
                                        onClick={() => {
                                            const updatedLogs = [...formHandler.values.time_keeping];
                                            updatedLogs.splice(key, 1)
                                            formHandler.setFieldValue("time_keeping", updatedLogs, false);
                                        }}
                                    >
                                        Remove
                                    </p>
                                }
                            </div>
                            <BranchDropDown
                                label="Biometric Branch"
                                placeholder="select branch"
                                onChange={formHandler.handleChange}
                                name={`time_keeping[${key}].branch_id`}
                                value={Number(timekeep.branch_id)}
                                error={
                                    (formHandler.errors.time_keeping as any)?.[key]?.branch_id || ""
                                }
                                required
                            />
                            <Textfield
                                type="date"
                                label="Date"
                                name={`time_keeping[${key}].date`}
                                onChange={(e) => {
                                    const newDate = e.target.value;
                                    const updatedPunches: any = [...formHandler.values.time_keeping];
                                    updatedPunches[key].date = newDate;
                                    updatedPunches[key].punches = updatedPunches[key].punches.map((punch: any) => {
                                        if (punch.punch_time === "") {
                                            return { punch_time: `${newDate}T00:00` };
                                        } else {
                                            return { punch_time: "" };
                                        }
                                    });
                                    formHandler.setFieldValue("time_keeping", updatedPunches, false);
                                }}
                                error={
                                    (formHandler.errors.time_keeping as any)?.[key]?.date || ""
                                }
                                required
                            />
                            <div className="flex justify-end">
                                <div>
                                    <Button
                                        label="Add"
                                        type="button"
                                        onClick={() => {
                                            const updatedLogs = [...formHandler.values.time_keeping];
                                            updatedLogs[key].punches.push({ punch_time: `${updatedLogs[key].date}T00:00` });
                                            formHandler.setFieldValue("time_keeping",updatedLogs, false)
                                        }}
                                    />            
                                </div>
                            </div>
                            
                            { formHandler.values.time_keeping[key].punches.map((punch, index) => {
                                return (
                                    <div key={index}>
                                        {index >= 0 && (
                                            <div className="flex justify-end text-red-500">
                                                <p
                                                    className="z-1 pt-3 mb-[-22px] hover:text-blue-950 dark:text-red-500  hover:cursor-pointer"
                                                    onClick={() => {
                                                        const updatedLogs = [...formHandler.values.time_keeping];
                                                        updatedLogs[key].punches.splice(index, 1)
                                                        formHandler.setFieldValue("time_keeping",updatedLogs, false)
                                                    }}
                                                >
                                                    Remove
                                                </p>
                                            </div>
                                        )}
                                        <Textfield
                                            key={index}
                                            type="datetime-local"
                                            label={`Punch Time #${index + 1}`}
                                            value={punch.punch_time}
                                            onChange={(e) => {
                                                const updatedPunches:any = [...formHandler.values.time_keeping];
                                                updatedPunches[key].punches[index] = {
                                                    punch_time: e.target.value
                                                }
                                                formHandler.setFieldValue("time_keeping", updatedPunches, false);
                                            }}
                                            error={
                                                (formHandler.errors.time_keeping as any)?.[key]?.punches[index]?.punch_time || ""
                                            }
                                        />
                                    </div>
                                )
                            })
                            }
                        </div>
                    )
                })   
                }

                <div className="pt-7 flex justify-center">
                    <button
                        type="button"
                        className="font-semibold tracking-wider text-gray-400 hover:text-gray-500  hover:cursor-pointer"
                        onClick={() => {
                            const newSet = [ ...formHandler.values.time_keeping,
                                {
                                    punches: [
                                        { punch_time: "" },
                                        { punch_time: "" },
                                        { punch_time: "" },
                                        { punch_time: "" },
                                    ],
                                    branch_id: formHandler.values.branch_id,
                                    date: "",
                                } 
                            ];

                            formHandler.setFieldValue("time_keeping", newSet, false);
                        }}
                    >
                        <p>ADD ANOTHER DATE</p>
                    </button>
                </div>
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Submit"
                            type="submit"
                            onClick={() => {}}
                            loading={formHandler.isSubmitting}
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

export default CreateLogModal;
