"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import moment from "moment";
import { exportBankAccountHistory } from "@/api/reports/bank-account-history";

const BankAccountHistoryExportForm = () => {

    const formHandler = useFormik({
        initialValues: {
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            status: Yup.string().required("Status is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const confirmed = await confirm({
                title: "Bank Account History",
                message: "Are you sure you want to export?"
            });

            if (confirmed) {
                setSubmitting(true);
                try {
                    const response = await exportBankAccountHistory(values);
                    const blob = new Blob([response.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });

                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');

                    a.href = downloadUrl;
                    a.download = `BANK_ACCOUNT_HISTORY_REPORT_${moment().format('YYYY-MM-DD')}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } catch {
                    toast.error("Error encountered");
                } finally {
                    setSubmitting(false);
                }
            }
        }
    });

    return (
        <Card>
            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={2}>
                    <ActiveInactiveDropDown
                        withAllOption
                        label="Status"
                        placeholder="select status"
                        name="status"
                        onChange={formHandler.handleChange}
                        value={formHandler.values.status}
                        error={formHandler.errors.status}
                        required
                    />
                </Grid>
                <div className="mt-[100px]"/>
                <Grid cols={2}>
                    <Button
                        label="Reset"
                        variant="secondary"
                        onClick={() => {
                            formHandler.resetForm();
                        }}
                    />
                    <Button
                        type="submit"
                        label="Submit"
                        loading={formHandler.isSubmitting}
                        onClick={() => {}}
                    />
                </Grid> 
            </form>
        </Card>
    );
};

export default BankAccountHistoryExportForm;