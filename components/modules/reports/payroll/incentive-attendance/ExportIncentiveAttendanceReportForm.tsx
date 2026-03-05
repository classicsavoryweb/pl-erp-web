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

const ExportIncentiveAttendanceReportForm  = () => {
    
    const formHandler = useFormik({
        initialValues: {

        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({

        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Incentive Attendance",
                message: "Are you sure you want to export attendance?"
            });

            if (isConfirmed) {
                setSubmitting(true);

                try {

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