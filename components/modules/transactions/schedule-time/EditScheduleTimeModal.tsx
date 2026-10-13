"use client";

import { editBiotimePunches, getBiotimePunchDeletionLogs } from "@/api/transactions/actual-time";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Accordion from "@/components/common/Accordion";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import * as Yup from "yup";
import BranchDropDown from "../../generic/BranchDropDown";
import Grid from "@/components/common/Grid";
import Timeline from "../../generic/Timeline";
import ScheduleMasterlistDropDown from "../../generic/ScheduleMasterlistDropDown";
import { editScheduleTime } from "@/api/transactions/schedule-time";

interface FormModalInterface {
    modal: any;
    data: any;
    onSubmitCallBack: () => void;
}

const EditScheduleTimeModal = ({
    modal,
    data,
    onSubmitCallBack
}: FormModalInterface) => {

    const formHandler = useFormik({
        initialValues: {
            date: "",
            id: "",
            timetable: "",
        },
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            setSubmitting(true);

            const isConfirmed = await confirm({
                title: "Edit Schedule",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                try {
                    const resp = await editScheduleTime(values, values.id);
                    
                    if (!resp.error) {
                        toast.success(resp.data.message);
                        onSubmitCallBack();
                        modal.onClose();
                    } else {
                        toast.error(resp.data.message);
                    }
                } catch (error) {
                    toast.error("Error encountered");
                } finally {
                    setSubmitting(false);
                }
            }
        }
    });

    useEffect(() => {
        if (modal.isShowing) {
            formHandler.setValues({
                date: data.date,
                id: data.id,
                timetable: data.timetable
            })
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Schedule"
            onClose={() => {
                modal.onClose();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Textfield
                    label="Employee Name"
                    name="date"
                    value={data?.employee?.full_name ?? ""}
                    disabled
                />
                <Textfield
                    type="date"
                    label="Date"
                    name="date"
                    value={formHandler.values.date || ""}
                    error={formHandler.errors.date}
                    disabled
                />
                <ScheduleMasterlistDropDown
                    name="timetable"
                    placeholder="select timetable"
                    label="Time Table"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.timetable}
                    error={formHandler.errors.timetable}
                    required
                />
                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                            }}
                        />
                    </div>
                    <div>
                        <Button
                            label="Submit"
                            type="submit"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditScheduleTimeModal;
