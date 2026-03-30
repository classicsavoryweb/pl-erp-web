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
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            date: Yup.date()
            .required('Date is required.')
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
        onSubmit: (values, {resetForm}) => {
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
                    minutes: 0,
                });
                payrollFormhandler.setFieldValue(field, updatedMinutes);
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