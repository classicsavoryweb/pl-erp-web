"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Dropdown from "@/components/common/Dropdown";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editScheduleMasterlist } from "@/api/schedule-masterlist";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditScheduleMasterlistForm = ({
    modal,
    onSubmitCallback,
    formValue
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

    const editFormHandler = useFormik({
        initialValues: {
            start_time: "",
            end_time: "",
            selection: "",
            classification: "",
            time_break: "",
            total_hours: "",
            days: "",
            required: "",
            status: "",
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
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Schedule",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editScheduleMasterlist(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Schedule updated successfully");
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

    useEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit schedule"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Start Time"
                    placeholder="enter start time"
                    name="start_time"
                    type="time"
                    value={editFormHandler.values.start_time}
                    required
                    onChange={(e) => {
                        const updatedStart = e.target.value;
                        const endTime = editFormHandler.values.end_time;

                        editFormHandler.handleChange(e); 

                        if (updatedStart && endTime) {
                            const totalHours = calculateTotalHours(updatedStart, endTime);
                            editFormHandler.setFieldValue('total_hours', totalHours);
                            editFormHandler.setFieldValue('selection', `${updatedStart} TO ${endTime}`);
                        }
                    }}
                    error={editFormHandler.errors.start_time}
                />
                <Textfield
                    label="End Time"
                    placeholder="enter end time"
                    name="end_time"
                    type="time"
                    value={editFormHandler.values.end_time}
                    required
                    onChange={(e) => {
                        const updatedEnd = e.target.value;
                        const startTime = editFormHandler.values.start_time;

                        editFormHandler.handleChange(e); 

                        if (startTime && updatedEnd) {
                            const totalHours = calculateTotalHours(startTime, updatedEnd);
                            editFormHandler.setFieldValue('total_hours', totalHours);
                            editFormHandler.setFieldValue('selection', `${startTime} TO ${updatedEnd}`);
                        }
                    }}
                    error={editFormHandler.errors.end_time}
                />
                <Textfield
                    label="Selection"
                    placeholder="enter selection"
                    name="selection"
                    type="text"
                    value={editFormHandler.values.selection}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.selection}
                />
                <Dropdown
                    label="Classification"
                    placeholder="enter classification"
                    name="classification"
                    value={editFormHandler.values.classification}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.classification}
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
                    value={editFormHandler.values.time_break}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.time_break}
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
                    value={editFormHandler.values.total_hours}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.total_hours}
                />
                <Textfield
                    label="Days"
                    placeholder="enter days"
                    name="days"
                    type="text"
                    value={editFormHandler.values.days}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.days}
                />
                <Dropdown
                    label="Required"
                    placeholder="select if required"
                    name="required"
                    required
                    value={editFormHandler.values.required}
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.required}
                    options={[
                        {
                            label: "Yes",
                            value: "Yes"
                        },
                        {
                            label: "No",
                            value: "No"
                        }
                    ]}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editFormHandler.values.status}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.status}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={editFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditScheduleMasterlistForm;