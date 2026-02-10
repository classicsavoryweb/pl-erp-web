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
    const isEditable = canEdit && isEditing;

    const fields = [
        { label: "EE SSS", name: "employee_sss" },
        { label: "ER SSS", name: "employer_sss" },
        { label: "EE Pagibig", name: "employee_pagibig" },
        { label: "ER Pagibig", name: "employer_pagibig" },
        { label: "EE Philhealth", name: "employee_philhealth" },
        { label: "ER Philhealth", name: "employer_philhealth" },
        { label: "Withholding Tax", name: "withholding_tax" },
    ] as const;

    type ContributionField = (typeof fields)[number]["name"];

    const initialValues = fields.reduce((acc, field) => {
        acc[field.name] = payrollDetails[field.name] ?? 0;
        return acc;
    }, {} as Record<ContributionField, number | string>);

    const validationSchema = Yup.object(
        fields.reduce((acc, field) => {
            acc[field.name] = Yup.number().min(0, "Must be 0 or higher").required("Required");
            return acc;
        }, {} as Record<string, Yup.NumberSchema>)
    );

    const formHandler = useFormik({
        enableReinitialize: true,
        initialValues,
        validateOnChange: false,
        validationSchema,
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

    const handleNonNegativeChange = (field: ContributionField) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
                {canEdit && !isEditable &&
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
                    {fields.map((field) => {
                        const error = (formHandler.errors as Record<ContributionField, string | undefined>)[field.name];
                        return (
                            <Textfield
                                key={field.name}
                                disabled={!isEditable}
                                label={field.label}
                                name={field.name}
                                type="number"
                                value={(formHandler.values as Record<ContributionField, number | string>)[field.name]}
                                onChange={handleNonNegativeChange(field.name)}
                                error={typeof error === "string" ? error : undefined}
                            />
                        );
                    })}
                </Grid>
                {isEditable &&
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
                        />
                    </div>
                }
            </form>
        </Card>
    );
};

export default ContributionCard;
