"use client";

import Card from "@/components/common/Card";
import Checkbox from "@/components/common/Checkbox";
import Dropdown from "@/components/common/Dropdown";
import Grid from "@/components/common/Grid";
import { useFormik } from "formik";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import BranchDropDown from "../../generic/BranchDropDown";
import Button from "@/components/common/Button";
import FinalizedPayDateDropDown from "../../generic/FinalizedPayDateDropDown";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { submitPayslips } from "../../../../api/compensation/pay-slip";
import { toast } from "react-toastify";

const PaySlipReportForm = () => {

    const formHandler = useFormik({
        initialValues: {
            payslip: "current",
            send_email: true,
            type: "",
            pay_date: "",
            employee_id:"",
            branch_id: "",
            pay_date_from: "",
            pay_date_to: "",
            employee: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            type: Yup.string().required("Type is required"),
            branch_id: Yup.string().when("type", (type, schema) =>
                String(type) === "Branch"
                    ? schema.required('Branch is required')
                    : schema.notRequired()
            ),
            employee_id: Yup.string().when("type", (type, schema) =>
                String(type) === "Employee"
                    ? schema.required('Employee is required')
                    : schema.notRequired()
            ),
            pay_date: Yup.string().when('payslip', (keyWord, schema) => 
                String(keyWord) === "history"
                    ? schema.required('Pay Date is required')
                    : schema.notRequired()
            ),
            pay_date_from: Yup.string().when('pay_date', (keyWord, schema) => 
                String(keyWord) === "0"
                    ? schema.required('Pay Date From is required')
                    : schema.notRequired()
            ),
            pay_date_to: Yup.string().when('pay_date', (keyWord, schema) => 
                String(keyWord) === "0"
                    ? schema.required('Pay Date To is required')
                    : schema.notRequired()
            ),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Pay Slip",
                message: "Are you sure you want submit payslip?"
            });

            if (isConfirmed) {
                submitPayslips(values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.info("All payslip queued for processing")
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                });
            }
        }
    });

    return (
        <Card>
            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={3}>
                    <Checkbox
                        label="Current Payslip"
                        value="current"
                        checked={formHandler.values.payslip === "current"}
                        onChange={(e) => {
                            if (e.target.checked) {
                                formHandler.setFieldValue("payslip", e.target.value);
                                formHandler.setFieldValue("pay_date", "");
                                formHandler.setFieldValue("pay_date_from", "");
                                formHandler.setFieldValue("pay_date_to", "");
                            } else {
                                formHandler.setFieldValue("payslip", "");
                            }
                        }}
                    />
                    <Checkbox
                        label="Payslip History"
                        value="history"
                        checked={formHandler.values.payslip === "history"}
                        onChange={(e) => {
                            if (e.target.checked) {
                                formHandler.setFieldValue("payslip", e.target.value);
                            } else {
                                formHandler.setFieldValue("payslip", "");
                            }
                        }}
                    />
                    <Checkbox
                        label="Send Email"
                        value="send_email"
                        checked={formHandler.values.send_email}
                        onChange={(e) => {
                            if (e.target.checked) {
                                formHandler.setFieldValue("send_email", true);
                            } else {
                                formHandler.setFieldValue("send_email", false);
                            }
                        }}
                    />
                </Grid>
                
                <div className="mt-3"/>
                <Grid cols={2}>
                    <Dropdown
                        label="Type"
                        placeholder="select type"
                        name="type"
                        required
                        onChange={formHandler.handleChange}
                        value={formHandler.values.type}
                        error={formHandler.errors.type}
                        options={[
                            {
                                label: "Branch",
                                value: "Branch"
                            },
                            {
                                label: "Employee",
                                value: "Employee"
                            }
                        ]}
                    />

                    { formHandler.values.payslip === "history" &&
                        <FinalizedPayDateDropDown
                            label="Pay Date"
                            placeholder="select select pay date"
                            name="pay_date"
                            required
                            onChange={formHandler.handleChange}
                            value={formHandler.values.pay_date}
                            error={formHandler.errors.pay_date}
                            withRangeOption
                        />
                    }

                    { formHandler.values.type === "Employee" &&
                        <SearchEmployeeDropDown
                            label="Employee"
                            placeholder="select employee"
                            name="employee_id"
                            required
                            onChange={(e) => {
                                const employee = e.target.value;
                                formHandler.setFieldValue("employee", employee);
                                formHandler.setFieldValue("employee_id",employee.id);
                            }}
                            value={formHandler.values.employee}
                            error={formHandler.errors.employee_id}
                        />
                    }

                    { formHandler.values.type === "Branch" &&
                        <BranchDropDown
                            label="Branch"
                            placeholder="select branch"
                            name="branch_id"
                            required
                            onChange={formHandler.handleChange}
                            value={formHandler.values.branch_id}
                            error={formHandler.errors.branch_id}
                            withAllOption
                        />
                    }
                </Grid>

                { (String(formHandler.values.pay_date) === "0" && formHandler.values.payslip === "history")&&
                    <Grid cols={2}>
                        <FinalizedPayDateDropDown
                            label="Pay Date From"
                            placeholder="select select pay date"
                            name="pay_date_from"
                            required
                            onChange={formHandler.handleChange}
                            value={formHandler.values.pay_date_from}
                            error={formHandler.errors.pay_date_from}
                        />
                        <FinalizedPayDateDropDown
                            label="Pay Date To"
                            placeholder="select select pay date"
                            name="pay_date_to"
                            required
                            onChange={formHandler.handleChange}
                            value={formHandler.values.pay_date_to}
                            error={formHandler.errors.pay_date_to}
                        />
                    </Grid>
                }

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

export default PaySlipReportForm;