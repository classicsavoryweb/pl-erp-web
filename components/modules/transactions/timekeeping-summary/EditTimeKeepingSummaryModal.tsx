"use client";
import { updateTimeKeepingSummary } from "@/api/transactions/time-keeping";
import Button from "@/components/common/Button";
import confirm from "@/components/common/Confirm";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import TextArea from "@/components/common/TextArea";
import Textfield from "@/components/common/Textfield";
import { AuthContext } from "@/context/AuthProvider";
import { canEditRestrictedRecords } from "@/helper/restriction";
import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface ModalInterface {
    modal: any;
    data: any;
    onSubmitCallBack: () => void;
}
const EditTimeKeepingSummaryModal = ({
    modal,
    data,
    onSubmitCallBack
}: ModalInterface) => {

    const {permissions} = useContext(AuthContext);

    useEffect(() => {
        if (modal.isShowing) {
            formHandler.setValues(data);
        }
    }, [modal.isShowing]);

    const formHandler = useFormik({
        initialValues: {
            regular_days: "",
            special_leave: "",
            cancelled_off: "",
            special_holiday: "",
            legal_holiday: "",
            adjustment_amount: "",
            remarks: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            regular_days: Yup.number().min(0, "Must be greater than 0").required("Regular days is required"),
            special_leave: Yup.number().min(0, "Must be greater than 0").required("Special leave is required"),
            cancelled_off: Yup.number().min(0, "Must be greater than 0").required("Cancelled off is required"),
            special_holiday: Yup.number().min(0, "Must be greater than 0").required("Special holiday is required"),
            legal_holiday: Yup.number().min(0, "Must be greater than 0").required("Legal holiday is required"),
            adjustment_amount: Yup.number().required("Taxable adjustment is required")
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            if (
                !canEditRestrictedRecords(permissions, "EMPLOYEE", data.employee.employee_number, 0) ||
                !canEditRestrictedRecords(permissions, "BRANCH", "", data.branch_id)
            ) {
                toast.error("You cannot this record");
                return;
            }

            const isConfirmed = await confirm({
                title: "Timekeeping Summary",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                try {
                    const resp = await updateTimeKeepingSummary(values, data.id);

                    if (!resp.error) {
                        resetForm();
                        modal.onClose();
                        onSubmitCallBack();
                        toast.success("Timekeeping Summary updated successfully")
                    } else {
                        toast.error(resp.data.message);    
                    }
                } catch {
                    toast.error("Error encountered");
                } finally {
                    setSubmitting(false);
                }
            }
        }
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Timekeeping Summary"
            onClose={() => {
                modal.onClose();
            }}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <p className="font-semibold">Working Days</p>
                <Grid cols={2}>
                    <Textfield
                        required
                        type="number"
                        label="Regular Days"
                        name="regular_days"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.regular_days}
                        error={formHandler.errors.regular_days}
                    />
                    <Textfield
                        required
                        type="number"
                        label="Special Leave"
                        name="special_leave"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.special_leave}
                        error={formHandler.errors.special_leave}
                    />
                </Grid>

                <p className="mt-2 font-semibold">Additional Working Hours</p>
                <Grid cols={2}>
                    <Textfield
                        required
                        type="number"
                        label="Cancelled Off"
                        name="cancelled_off"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.cancelled_off}
                        error={formHandler.errors.cancelled_off}
                    />
                    <Textfield
                        required
                        type="number"
                        label="Legal Holiday"
                        name="legal_holiday"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.legal_holiday}
                        error={formHandler.errors.legal_holiday}
                    />
                    <Textfield
                        required
                        type="number"
                        label="Special Holiday"
                        name="special_holiday"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.special_holiday}
                        error={formHandler.errors.special_holiday}
                    />
                </Grid>

                <p className="mt-2 font-semibold">Others</p>
                <Textfield
                    required
                    type="number"
                    label="Taxable Adjustment"
                    name="adjustment_amount"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.adjustment_amount}
                    error={formHandler.errors.adjustment_amount}
                />
                <TextArea
                    label="Remarks"
                    name="remarks"
                    onChange={formHandler.handleChange}
                    value={formHandler.values.remarks}
                    error={formHandler.errors.remarks}
                />

                <Button
                    type="submit"
                    label="Submit"
                    loading={formHandler.isSubmitting}
                    onClick={() => {}}
                />
            </form>
        </Modal>
    );
};

export default EditTimeKeepingSummaryModal;