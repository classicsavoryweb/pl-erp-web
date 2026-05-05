"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { PayrollContext } from "@/context/PayrollProvider";
import { useFormik } from "formik";
import moment from "moment";
import { useContext } from "react";
import * as Yup from "yup";

interface ModalInterface {
    modal: any;
    type: "undertime" | "tardiness";
    payrollFormhandler: any;
};

const AddDateDeductionHoursModal = ({
    modal,
    type,
    payrollFormhandler
}: ModalInterface) => {
    const {payrollDetails} = useContext(PayrollContext);

    const handler = useFormik({
        initialValues: {
            date: "",
            minutes: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            minutes: Yup.number().required("Minutes is required").min(1, "Cannot accept less than 1") ,
            date: Yup.date()
            .required('Date is required')
            .test(
            'in-cutoff-date',
            `Date must be in the cutoff`,
            function (value) {  
                return moment(value).isBetween(
                    moment(payrollDetails.start_date),
                    moment(payrollDetails.end_date),
                    undefined, 
                    "[]"
                );
            }),
        }),
        onSubmit: (values, {resetForm, setErrors}) => {
            let field = type == "tardiness"
                ? "tardiness_minutes"
                : "undertime_minutes";

            const updatedMinutes = [...payrollFormhandler.values[field]];

            const exists = updatedMinutes.some(item =>
                moment(item.date).isSame(values.date, 'day')
            );

            if (!exists) {
                updatedMinutes.push({
                    date: values.date,
                    minutes: values.minutes,
                });

                updatedMinutes.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
                payrollFormhandler.setFieldValue(field, updatedMinutes);
                resetForm();
            } else {
                setErrors({
                    date: `Date is already existing`
                });
            }
        }
    });
    return (
        <Modal
            isShowing={modal.isShowing}
            title="Add Date"
            onClose={() => {
                modal.onClose();
                handler.resetForm();
            }}
            size="sm"
        >
            <form onSubmit={handler.handleSubmit}>
                <Textfield
                    label="Date"
                    type="date"
                    name="date"
                    onChange={handler.handleChange}
                    value={handler.values.date}
                    error={handler.errors.date}
                />
                <Textfield
                    label="Minutes"
                    type="number"
                    name="minutes"
                    onChange={handler.handleChange}
                    value={handler.values.minutes}
                    error={handler.errors.minutes}
                />
                <Button
                    type="submit"
                    onClick={() => {}}
                    label="Add Date"
                />
            </form>
        </Modal>
    );
};

export default AddDateDeductionHoursModal;