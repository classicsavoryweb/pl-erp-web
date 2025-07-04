"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import Dropdown from "@/components/common/Dropdown";
import { createScheduleMasterlist } from "@/api/schedule-masterlist";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateScheduleForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const calculateTotalHours = (start: string, end: string) => {
        const startTime = new Date(`1970-01-01T${start}Z`);
        const endTime = new Date(`1970-01-01T${end}Z`);

        let diff = endTime.getTime() - startTime.getTime();

        if (diff < 0) {
            diff += 24 * 60 * 60 * 1000; 
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return (hours + minutes / 60).toFixed(1);
    };

    const createFormHandler = useFormik({
        initialValues: {
            start_time: "",
            end_time: "",
            selection: "",
            classification: "",
            time_break: "",
            total_hours: "",
            days: "1",
            required: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            start_time: Yup.string().required("Start time is required."),
            end_time: Yup.string().required("End time is required."),
            selection: Yup.string().required("Selection is required."),
            classification: Yup.string().required("Classification is required."),
            time_break: Yup.string().required("Break hours is required."),
            total_hours: Yup.string().required("Total hours is required."),
            days: Yup.string().required("Days is required."),
            required: Yup.string().required("Required is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create Schedule",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createScheduleMasterlist(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Schedule created successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally((() => {
                    setSubmitting(false);
                }));
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Schedule"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Textfield
                    label="Start Time"
                    placeholder="enter start time"
                    name="start_time"
                    type="time"
                    value={createFormHandler.values.start_time}
                    required
                    onChange={(e) => {
                        createFormHandler.handleChange(e);
                        const updatedStart = e.target.value;
                        const endTime = createFormHandler.values.end_time;
                        
                        if (updatedStart && endTime) {
                            const totalHours = calculateTotalHours(updatedStart, endTime);
                            createFormHandler.setFieldValue('total_hours', totalHours);
                        }

                        createFormHandler.setFieldValue(
                            'selection',
                            `${updatedStart} TO ${endTime}`,
                        );
                    }}
                    error={createFormHandler.errors.start_time}
                />
                <Textfield
                    label="End Time"
                    placeholder="enter end time"
                    name="end_time"
                    type="time"
                    value={createFormHandler.values.end_time}
                    required
                    onChange={(e) => {
                        createFormHandler.handleChange(e);
                        const updatedEnd = e.target.value;
                        const startTime = createFormHandler.values.start_time;

                        if (startTime && updatedEnd) {
                            const totalHours = calculateTotalHours(startTime, updatedEnd);
                            createFormHandler.setFieldValue('total_hours', totalHours);
                        }

                        createFormHandler.setFieldValue(
                            'selection',
                            `${startTime} TO ${updatedEnd}`
                        );
                    }}
                    error={createFormHandler.errors.end_time}
                />
                <Textfield
                    label="Selection"
                    placeholder="enter selection"
                    name="selection"
                    type="text"
                    value={createFormHandler.values.selection}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.selection}
                />
                <Dropdown
                    label="Classification"
                    placeholder="enter classification"
                    name="classification"
                    value={createFormHandler.values.classification}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.classification}
                    options={[
                        {
                            label: "Opening",
                            value: "Opening"
                        },
                        {
                            label: "Closing",
                            value: "Closing"
                        },
                        {
                            label: "Others",
                            value: "Others"
                        },
                    ]}
                />
                <Dropdown
                    label="Break Hours"
                    placeholder="enter break hours"
                    name="time_break"
                    value={createFormHandler.values.time_break}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.time_break}
                    options={[
                        {
                            label: "00:00:00",
                            value: "00:00:00"
                        },
                        {
                            label: "01:00:00",
                            value: "01:00:00"
                        },
                        {
                            label: "01:20:00",
                            value: "01:20:00"
                        },
                        {
                            label: "02:00:00",
                            value: "02:00:00"
                        },
                    ]}
                />
                <Textfield
                    label="Total Hours"
                    placeholder="enter total hours"
                    name="total_hours"
                    type="text"
                    value={createFormHandler.values.total_hours}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.total_hours}
                />
                <Textfield
                    label="Days"
                    placeholder="enter days"
                    name="days"
                    type="text"
                    value={createFormHandler.values.days}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.days}
                />
                <Dropdown
                    label="Required"
                    placeholder="select if required"
                    name="required"
                    value={createFormHandler.values.required}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.required}
                    options={[
                        {
                            label: "Yes",
                            value: "Yes"
                        },
                        {
                            label: "No",
                            value: "No"
                        },
                    ]}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
        
    );
};

export default CreateScheduleForm;