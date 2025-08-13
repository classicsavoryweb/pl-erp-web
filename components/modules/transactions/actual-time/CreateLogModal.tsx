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
    punches: { punch_time: string }[];
    employee_number: string;
    branch_id: string;
    date: string;
    overwrite?: boolean;
    punches_count: string;
};

const CreateLogModal = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const [data, setData] = useState<any>([]);

    const formHandler = useFormik<PunchFormValues>({
        initialValues: {
            punches: [{punch_time: ""}],
            punches_count: "",
            employee_number: "",
            branch_id: "",
            date: ""
        },
        validationSchema: Yup.object().shape({
            punches: Yup.array()
            .of(Yup.object().shape({
                punch_time: Yup.string().required("Punch time is required"),
            }))
            .min(1, "At least one punch is required"),
            employee_number: Yup.string().required("Employee is required"),
            branch_id: Yup.string().required("Branch is required"),
            date: Yup.string().required("Date is required"),          
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

            const response = await createBiotimeLog(values);
            if (!response.error) {
                toast.success(response.data.message);
                modal.onClose();
                onSubmitCallback();
            } else {
                if (response.data.message === "Existing") {
                    const isConfirmed = await confirm({
                        title: "Biotime Already Exists",
                        message: "Do you want to overwrite?"
                    });

                    if (isConfirmed) {
                        createBiotimeLog({
                            ...values,
                            overwrite: true
                        })
                        .then((resp) => {
                            if (!resp.error) {
                                toast.success(resp.data.message);
                                modal.onClose();
                                resetForm();
                                onSubmitCallback();
                            } else {
                                toast.error(resp.data.message);
                            }
                        })
                        .catch(() => {
                            toast.error("Error encountered");
                        });
                    }
                } else {
                    toast.error(response.data.message);
                }
            }
        }
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
                    }}
                    name="employee_number"
                    value={formHandler.values.employee_number}
                    error={formHandler.errors.employee_number}
                    required
                />
                <BranchDropDown
                    label="Branch"
                    placeholder="select branch"
                    onChange={formHandler.handleChange}
                    name="branch_id"
                    value={Number(formHandler.values.branch_id)}
                    error={formHandler.errors.branch_id}
                    required
                />

                <p className="mt-2">Log Details</p>
                <Textfield
                    type="date"
                    label="Date"
                    name="date"
                    value={formHandler.values.date || ""}
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.date}
                    required
                />
                <div className="flex justify-end">
                    <div>
                        <Button
                            label="Add"
                            type="button"
                            onClick={() => {
                                formHandler.setFieldValue("punches", [
                                    ...formHandler.values.punches,
                                    { punch_time: "" },
                                ], false);
                            }}
                        />            
                    </div>
                </div>

                {formHandler.values.punches.map((punch: any, index) => (
                    <div key={index}>
                        {index >= 0 && (
                            <div className="flex justify-end text-red-500">
                                <p
                                    className="z-1 pt-3 mb-[-22px] hover:text-red-800 text-sm hover:cursor-pointer"
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
                        <Textfield
                            key={index}
                            type="datetime-local"
                            label={`Punch Time #${index + 1}`}
                            value={punch.punch_time}
                            onChange={(e) => {
                                const updatedPunches:any = [...formHandler.values.punches];
                                updatedPunches[index] = {
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
                <hr className="mt-6 pb-2 text-slate-300"/>
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