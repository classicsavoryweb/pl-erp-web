"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Checkbox from "@/components/common/Checkbox";
import Button from "@/components/common/Button";
import { toast } from "react-toastify";
import moment from "moment";
import Dropdown from "@/components/common/Dropdown";
import { exportIncentiveAttendance } from "@/api/reports/report-incentive-attendance";

const ExportIncentiveAttendanceReportForm  = () => {
    
    const formHandler = useFormik({
        initialValues: {
            month: "",
            year: new Date().getFullYear(),
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            month: Yup.string().required("Month is required"),
            year: Yup.string().required("Year is required"),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Incentive Attendance",
                message: "Are you sure you want to export attendance?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                try {
                    const response = await exportIncentiveAttendance(values)
                    
                    const blob = new Blob([response.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });

                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
    
                    a.href = downloadUrl;
                    a.download = `INCENTIVE-ATTENDANCE-${values.month}-${values.year}.xlsx`;
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
                            placeholder="select month"
                            label="Month"
                            name="month"
                            required
                            value={formHandler.values.month}
                            onChange={formHandler.handleChange}
                            options={[
                                    { label: "January", value: "01" },
                                    { label: "February", value: "02" },
                                    { label: "March", value: "03" },
                                    { label: "April", value: "04" },
                                    { label: "May", value: "05" },
                                    { label: "June", value: "06" },
                                    { label: "July", value: "07" },
                                    { label: "August", value: "08" },
                                    { label: "September", value: "09" },
                                    { label: "October", value: "10" },
                                    { label: "November", value: "11" },
                                    { label: "December", value: "12" },
                            ]}
                            error={formHandler.errors.month}
                        />
                        <Dropdown
                            placeholder="select year"
                            label="Year"
                            name="year"
                            required
                            value={String(formHandler.values.year)}
                            onChange={formHandler.handleChange}
                            options={Array.from({ length: 100 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return { label: year.toString(), value: year.toString() };
                            })}
                            error={formHandler.errors.year}
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

export default ExportIncentiveAttendanceReportForm;