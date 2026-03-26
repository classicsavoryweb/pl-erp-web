"use client";

import Card from "@/components/common/Card";
import Checkbox from "@/components/common/Checkbox";
import Dropdown from "@/components/common/Dropdown";
import Grid from "@/components/common/Grid";
import { useFormik } from "formik";
import { useState } from "react";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import BranchDropDown from "../../generic/BranchDropDown";
import Button from "@/components/common/Button";
import FinalizedPayDateDropDown from "../../generic/FinalizedPayDateDropDown";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { exportPayslips, submitPayslips } from "../../../../api/compensation/pay-slip";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import PayslipPDF from "../../pdf/PayslipPDF";
import moment from "moment";

const PaySlipReportForm = () => {

    const [exporting, setExporting] = useState(false);

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
            pay_date_to: Yup.string().when('pay_date', {
                is: (value:string) => String(value) === "0",
                then: schema =>
                schema
                    .required("Pay Date To is required")
                    .test(
                    "not-greater",
                    "Pay Date To cannot be earlier",
                    function (value) {
                        const { pay_date_from } = this.parent;
                        if (!pay_date_from || !value) return true;
                        return Number(pay_date_from) <= Number(value);
                    }
                    ),
                otherwise: schema => schema.notRequired(),
            }),
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

    const isHistory = formHandler.values.payslip === "history";
    const isRange = String(formHandler.values.pay_date) === "0";
    const hasBranchSelection =
        formHandler.values.type === "Branch" &&
        String(formHandler.values.branch_id) !== "" &&
        String(formHandler.values.branch_id) !== "0";
    const hasEmployeeSelection =
        formHandler.values.type === "Employee" &&
        String(formHandler.values.employee_id) !== "";
    const hasSelectedEntity = hasBranchSelection || hasEmployeeSelection;
    const hasValidDateSelection = isRange
        ? String(formHandler.values.pay_date_from) !== "" &&
          String(formHandler.values.pay_date_to) !== ""
        : String(formHandler.values.pay_date) !== "";

    const showExportButton = isHistory && hasSelectedEntity && hasValidDateSelection;

    const handleExport = async () => {
        if (!isHistory) {
            toast.error("Export is only available for Payslip History.");
            return;
        }

        if (!hasSelectedEntity) {
            toast.error(
                formHandler.values.type === "Employee"
                    ? "Please select an employee."
                    : "Please select a branch or employee."
            );
            return;
        }

        if (isRange) {
            if (!formHandler.values.pay_date_from || !formHandler.values.pay_date_to) {
                toast.error("Please select a pay date range.");
                return;
            }
        } else if (!formHandler.values.pay_date) {
            toast.error("Please select a pay date.");
            return;
        }

        setExporting(true);
        try {
            const resp = await exportPayslips({
                ...formHandler.values,
                send_email: false,
            });

            if (resp.error) {
                toast.error(resp.data?.message ?? "Error encountered");
                return;
            }

            const payrolls = resp.data?.data ?? [];
            if (!Array.isArray(payrolls) || payrolls.length === 0) {
                toast.info("No payroll found for the selected filters.");
                return;
            }

            const sortedPayrolls = [...payrolls].sort((a, b) =>
                String(a?.pay_date ?? "").localeCompare(String(b?.pay_date ?? ""))
            );
            const blob = await pdf(<PayslipPDF payrolls={sortedPayrolls} />).toBlob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const firstPayroll = sortedPayrolls[0];
            const lastPayroll = sortedPayrolls[sortedPayrolls.length - 1];
            const selectedEmployee = formHandler.values.employee as any;
            const branchName =
                firstPayroll?.timekeeping_branch?.name ??
                firstPayroll?.employee?.current_branch?.name ??
                "BRANCH";
            const selectedEmployeeName = selectedEmployee
                ? `${selectedEmployee.last_name ?? ""}, ${selectedEmployee.first_name ?? ""} ${selectedEmployee.middle_name ?? ""}`.trim()
                : "";
            const employeeName =
                firstPayroll?.employee?.full_name ??
                (selectedEmployeeName || "EMPLOYEE");
            const employeeNumber =
                firstPayroll?.employee?.employee_number ??
                selectedEmployee?.employee_number ??
                "";
            const fileTarget = formHandler.values.type === "Employee"
                ? [employeeName, employeeNumber].filter(Boolean).join("-")
                : branchName;
            const dateLabel = isRange
                ? `${moment(firstPayroll?.pay_date ?? moment()).format("YYYY-MM-DD")}-${moment(lastPayroll?.pay_date ?? moment()).format("YYYY-MM-DD")}`
                : (firstPayroll?.pay_date
                    ? moment(firstPayroll.pay_date).format("YYYY-MM-DD")
                    : moment().format("YYYY-MM-DD"));
            const safeTarget = String(fileTarget).toUpperCase().replace(/\s+/g, "-");
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `${safeTarget}-PAYSLIP-${dateLabel}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            toast.error("Error encountered");
        } finally {
            setExporting(false);
        }
    };

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

                <Grid cols={showExportButton ? 3 : 2}>
                    <Button
                        label="Reset"
                        variant="secondary"
                        onClick={() => {
                            formHandler.resetForm();
                        }}
                    />
                    {showExportButton && (
                        <Button
                            type="button"
                            label="Export"
                            variant="success"
                            loading={exporting}
                            onClick={handleExport}
                        />
                    )}
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
