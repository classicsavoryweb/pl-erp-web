"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import confirm from "@/components/common/Confirm";
import { toast } from "react-toastify";
import { updatePayrollContributions } from "@/api/compensation/payroll";
import { AuthContext } from "@/context/AuthProvider";

const ContributionCard = () => {
    const { loading, payrollDetails, setPayrollDetails } = useContext(PayrollContext);
    const { permissions } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const canEdit = payrollDetails.status !== "final" && permissions.includes("perform_compensation_payroll");

    const formHandler = useFormik({
        enableReinitialize: true,
        initialValues: {
            employee_sss: payrollDetails.employee_sss ?? 0,
            employer_sss: payrollDetails.employer_sss ?? 0,
            employee_pagibig: payrollDetails.employee_pagibig ?? 0,
            employer_pagibig: payrollDetails.employer_pagibig ?? 0,
            employee_philhealth: payrollDetails.employee_philhealth ?? 0,
            employer_philhealth: payrollDetails.employer_philhealth ?? 0,
            withholding_tax: payrollDetails.withholding_tax ?? 0,
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_sss: Yup.number().min(0, "Must be 0 or higher").required("Required"),
            employer_sss: Yup.number().min(0, "Must be 0 or higher").required("Required"),
            employee_pagibig: Yup.number().min(0, "Must be 0 or higher").required("Required"),
            employer_pagibig: Yup.number().min(0, "Must be 0 or higher").required("Required"),
            employee_philhealth: Yup.number().min(0, "Must be 0 or higher").required("Required"),
            employer_philhealth: Yup.number().min(0, "Must be 0 or higher").required("Required"),
            withholding_tax: Yup.number().min(0, "Must be 0 or higher").required("Required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Update Contributions",
                message: "Are you sure you want to save changes?"
            });

            if (!isConfirmed) return;

            setSubmitting(true);
            updatePayrollContributions(payrollDetails.id, values)
            .then((resp) => {
                if (!resp.error) {
                    toast.success(resp.data.message);
                    setPayrollDetails(resp.data.details);
                    setIsEditing(false);
                } else {
                    toast.error(resp.data.message);
                }
            })
            .catch(() => {
                toast.error("Error encountered");
            })
            .finally(() => {
                setSubmitting(false);
            });
        }
    });

    useEffect(() => {
        if (!canEdit) {
            setIsEditing(false);
        }
    }, [canEdit]);

    const displayValue = (value: string | number) => {
        return value;
    };

    const handleNonNegativeChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (raw === "") {
            formHandler.setFieldValue(field, "");
            return;
        }

        const parsed = Number(raw);
        if (Number.isNaN(parsed)) {
            return;
        }

        formHandler.setFieldValue(field, Math.max(0, parsed));
    };

    return (
        <Card
            size="medium"
            loading={loading}
        >
            <div className="flex items-center justify-between gap-x-2">
                <p className="font-semibold text-red-800 dark:text-red-500">Contributions</p>
                {canEdit && !isEditing &&
                    <div className="shrink-0">
                        <Button
                            label="Edit"
                            type="button"
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                }
            </div>
            <form onSubmit={formHandler.handleSubmit}>
                <Grid cols={2}>
                    <Textfield
                        disabled={!isEditing}
                        label="EE SSS"
                        name="employee_sss"
                        type="number"
                        value={displayValue(formHandler.values.employee_sss)}
                        onChange={handleNonNegativeChange("employee_sss")}
                        error={typeof formHandler.errors.employee_sss === "string" ? formHandler.errors.employee_sss : undefined}
                    />
                    <Textfield
                        disabled={!isEditing}
                        label="ER SSS"
                        name="employer_sss"
                        type="number"
                        value={displayValue(formHandler.values.employer_sss)}
                        onChange={handleNonNegativeChange("employer_sss")}
                        error={typeof formHandler.errors.employer_sss === "string" ? formHandler.errors.employer_sss : undefined}
                    />
                    <Textfield
                        disabled={!isEditing}
                        label="EE Pagibig"
                        name="employee_pagibig"
                        type="number"
                        value={displayValue(formHandler.values.employee_pagibig)}
                        onChange={handleNonNegativeChange("employee_pagibig")}
                        error={typeof formHandler.errors.employee_pagibig === "string" ? formHandler.errors.employee_pagibig : undefined}
                    />
                    <Textfield
                        disabled={!isEditing}
                        label="ER Pagibig"
                        name="employer_pagibig"
                        type="number"
                        value={displayValue(formHandler.values.employer_pagibig)}
                        onChange={handleNonNegativeChange("employer_pagibig")}
                        error={typeof formHandler.errors.employer_pagibig === "string" ? formHandler.errors.employer_pagibig : undefined}
                    />
                    <Textfield
                        disabled={!isEditing}
                        label="EE Philhealth"
                        name="employee_philhealth"
                        type="number"
                        value={displayValue(formHandler.values.employee_philhealth)}
                        onChange={handleNonNegativeChange("employee_philhealth")}
                        error={typeof formHandler.errors.employee_philhealth === "string" ? formHandler.errors.employee_philhealth : undefined}
                    />
                    <Textfield
                        disabled={!isEditing}
                        label="ER Philhealth"
                        name="employer_philhealth"
                        type="number"
                        value={displayValue(formHandler.values.employer_philhealth)}
                        onChange={handleNonNegativeChange("employer_philhealth")}
                        error={typeof formHandler.errors.employer_philhealth === "string" ? formHandler.errors.employer_philhealth : undefined}
                    />
                    <Textfield
                        disabled={!isEditing}
                        label="Withholding Tax"
                        name="withholding_tax"
                        type="number"
                        value={displayValue(formHandler.values.withholding_tax)}
                        onChange={handleNonNegativeChange("withholding_tax")}
                        error={typeof formHandler.errors.withholding_tax === "string" ? formHandler.errors.withholding_tax : undefined}
                    />
                </Grid>
                {isEditing &&
                    <div className="flex justify-end gap-x-2 mt-2">
                        <Button
                            label="Cancel"
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                formHandler.resetForm();
                                setIsEditing(false);
                            }}
                        />
                        <Button
                            label="Save"
                            type="submit"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                }
            </form>
        </Card>
    );
};

export default ContributionCard;