"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { updatePayrollContributions } from "@/api/compensation/payroll";
import { AuthContext } from "@/context/AuthProvider";
import Checkbox from "@/components/common/Checkbox";

const ContributionCard = ({formHandler} : {formHandler: any}) => {
    const { loading, payrollDetails, setPayrollDetails } = useContext(PayrollContext);
    const { permissions } = useContext(AuthContext);

    return (
        <Card
            size="medium"
            loading={loading}
        >
            <div className="flex justify-between">
                <p className="font-semibold text-red-800 dark:text-red-500">Contributions</p>
                <Checkbox
                    label="Manual Entry"
                    value={1}
                    checked={formHandler.values.is_manual_statutory_entry == 1}
                    onChange={(e) => {
                        if (e.target.checked) {
                            formHandler.setFieldValue("is_manual_statutory_entry", 1);
                        } else {
                            formHandler.setFieldValue("is_manual_statutory_entry", 0);
                        }
                    }}
                />
            </div>
            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={2}>
                    <Textfield
                        disabled={payrollDetails.status == "final" || formHandler.values.is_manual_statutory_entry == 0}
                        label="EE SSS"
                        name="employee_sss"
                        type="number"
                        value={formHandler.values.employee_sss}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.employee_sss}
                        onBlur={() => {
                            formHandler.setFieldValue("save_changes", false);
                            formHandler.submitForm();
                        }}
                    />
                    <Textfield
                        disabled={payrollDetails.status == "final" || formHandler.values.is_manual_statutory_entry == 0}
                        label="ER SSS"
                        name="employer_sss"
                        type="number"
                        value={formHandler.values.employer_sss}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.employer_sss}
                        onBlur={() => {
                            formHandler.setFieldValue("save_changes", false);
                            formHandler.submitForm();
                        }}
                    />
                    <Textfield
                        disabled={payrollDetails.status == "final" || formHandler.values.is_manual_statutory_entry == 0}
                        label="EE Pagibig"
                        name="employee_pagibig"
                        type="number"
                        value={formHandler.values.employee_pagibig}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.employee_pagibig}
                        onBlur={() => {
                            formHandler.setFieldValue("save_changes", false);
                            formHandler.submitForm();
                        }}
                    />
                    <Textfield
                        disabled={payrollDetails.status == "final" || formHandler.values.is_manual_statutory_entry == 0}
                        label="ER Pagibig"
                        name="employer_pagibig"
                        type="number"
                        value={formHandler.values.employer_pagibig}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.employer_pagibig}
                        onBlur={() => {
                            formHandler.setFieldValue("save_changes", false);
                            formHandler.submitForm();
                        }}
                    />
                    <Textfield
                        disabled={payrollDetails.status == "final" || formHandler.values.is_manual_statutory_entry == 0}
                        label="EE Philhealth"
                        name="employee_philhealth"
                        type="number"
                        value={formHandler.values.employee_philhealth}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.employee_philhealth}
                        onBlur={() => {
                            formHandler.setFieldValue("save_changes", false);
                            formHandler.submitForm();
                        }}
                    />
                    <Textfield
                        disabled={payrollDetails.status == "final" || formHandler.values.is_manual_statutory_entry == 0}
                        label="ER Philhealth"
                        name="employer_philhealth"
                        type="number"
                        value={formHandler.values.employer_philhealth}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.employer_philhealth}
                        onBlur={() => {
                            formHandler.setFieldValue("save_changes", false);
                            formHandler.submitForm();
                        }}
                    />
                    <Textfield
                        disabled={payrollDetails.status == "final" || formHandler.values.is_manual_statutory_entry == 0}
                        label="Withholding Tax"
                        name="withholding_tax"
                        type="number"
                        value={formHandler.values.withholding_tax}
                        onChange={formHandler.handleChange}
                        error={formHandler.errors.withholding_tax}
                        onBlur={() => {
                            formHandler.setFieldValue("save_changes", false);
                            formHandler.submitForm();
                        }}
                    />
                </Grid>
            </form>
        </Card>
    );
};

export default ContributionCard;
