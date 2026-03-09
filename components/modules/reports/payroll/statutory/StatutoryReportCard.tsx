"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Dropdown from "@/components/common/Dropdown";
import Button from "@/components/common/Button";
import { toast } from "react-toastify";
import { exportPayrollStatutoryReport } from "@/api/reports/reports-payroll-statutory";

const StatutoryReportCard = () => {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 10 }, (_, i) => {
        const year = currentYear - i;
        return { label: String(year), value: String(year) };
    });

    const currentMonth = new Date().getMonth() + 1;
    const monthOptions = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ].map((month, index) => ({
        label: month,
        value: index + 1
    }));

    const formHandler = useFormik({
        initialValues: {
            year: String(currentYear),
            month: String(currentMonth),
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            year: Yup.string().required("Year is required."),
            month: Yup.string().required("Month is required."),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Statutory Payroll",
                message: "Are you sure you want to export statutory payroll?"
            });

            if (isConfirmed) {
                setSubmitting(true);

                try {
                    const response: any = await exportPayrollStatutoryReport(values);

                    if (response?.error) {
                        const message = response?.data?.message ?? response?.message ?? "Error encountered";
                        toast.error(message);
                        return;
                    }

                    let blob: Blob | null = null;

                    if (response instanceof Blob) {
                        blob = response;
                    } else if (response?.data instanceof Blob) {
                        blob = response.data;
                    } else if (response?.data instanceof ArrayBuffer) {
                        blob = new Blob([response.data], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        });
                    } else if (response instanceof ArrayBuffer) {
                        blob = new Blob([response], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        });
                    }

                    if (!blob) {
                        const message = response?.message ?? response?.data?.message ?? "Invalid file response";
                        toast.error(message);
                        return;
                    }

                    if (blob.type && !blob.type.includes("spreadsheetml")) {
                        const text = await blob.text();
                        try {
                            const parsed = JSON.parse(text);
                            const message = parsed?.message ?? parsed?.data?.message ?? "Error encountered";
                            toast.error(message);
                        } catch {
                            toast.error("Invalid file response");
                        }
                        return;
                    }
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    const paddedMonth = String(values.month).padStart(2, "0");

                    a.href = downloadUrl;
                    a.download = `STATUTORY-PAYROLL-${values.year}-${paddedMonth}.xlsx`;
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
                    <Dropdown
                        label="Year"
                        placeholder="Select year"
                        name="year"
                        value={formHandler.values.year}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.year}
                        options={yearOptions}
                    />
                    <Dropdown
                        label="Month"
                        placeholder="Select month"
                        name="month"
                        value={formHandler.values.month}
                        required
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.month}
                        options={monthOptions}
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

export default StatutoryReportCard;
