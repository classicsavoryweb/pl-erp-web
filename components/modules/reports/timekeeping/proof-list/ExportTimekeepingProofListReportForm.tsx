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
import FinalizedPayDateDropDown from "@/components/modules/generic/FinalizedPayDateDropDown";
import { exportTimeKeepingProoflistReport } from "@/api/reports/reports-timekeeping-summary";

const ExportTimekeepingProofListReportForm  = () => {
    const formHandler = useFormik({
        initialValues: {
            type: "CURRENT",
            pay_date: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            pay_date: Yup.string().when('type', (keyWord, schema) => 
                String(keyWord) === "HISTORY"
                    ? schema.required('Pay Date is required')
                    : schema.notRequired()
            ),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Timekeeping Prooflist",
                message: "Are you sure you want to export?"
            });

            if (isConfirmed) {
                setSubmitting(true);

                try {
                    const response = await exportTimeKeepingProoflistReport(values);
                    const blob = new Blob([response.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });

                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
    
                    a.href = downloadUrl;
                    a.download = `TIMEKEEPING_PROOFLIST_REPORT_${moment().format('YYYY-MM-DD')}.xlsx`;
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
                    <Checkbox
                        value="CURRENT"
                        checked={formHandler.values.type == "CURRENT"}
                        label="Current Cutoff"
                        onChange={(e) => {
                            if (e.target.checked) {
                                formHandler.setFieldValue("type", "CURRENT");
                            } else {
                                formHandler.setFieldValue("type", "HISTORY");
                            }
                        }}
                    />
                    <Checkbox
                        value="HISTORY"
                        checked={formHandler.values.type == "HISTORY"}
                        label="History"
                        onChange={(e) => {
                            if (e.target.checked) {
                                formHandler.setFieldValue("type", "HISTORY");
                            } else {
                                formHandler.setFieldValue("type", "CURRENT");
                            }
                        }}
                    />
                </Grid>

                <div className="mt-3"/>
                <Grid cols={2}>
                    { formHandler.values.type === "HISTORY" &&
                        <FinalizedPayDateDropDown
                            label="Pay Date"
                            placeholder="select select pay date"
                            name="pay_date"
                            required
                            onChange={formHandler.handleChange}
                            value={formHandler.values.pay_date}
                            error={formHandler.errors.pay_date}
                        />
                    }
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

export default ExportTimekeepingProofListReportForm;