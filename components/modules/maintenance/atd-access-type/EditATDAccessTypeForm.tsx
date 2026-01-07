"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import ActiveInactiveDropDown from "@/components/modules/generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";
import { editATDAccessType } from "@/api/maintenance/atd-access-type";
import { getAllRoles } from "@/api/roles-and-permissions";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Dropdown from "@/components/common/Dropdown";
import Checkbox from "@/components/common/Checkbox";
import Grid from "@/components/common/Grid";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditATDAccessTypeForm = ({
    modal,
    onSubmitCallback,
    formValue,
}: FormModalInterface) => {
    const [roles, setRoles] = useState<any[]>([]);

    useAsyncEffect(() => {
        getAllRoles()
        .then((resp) => {
            if (!resp.error) {
                const mapped = resp.data.roles.map((role: any) => ({
                    label: role.name,
                    value: role.id,
                }));
                setRoles(mapped);
            }
        })
        .catch(() => {
            setRoles([]);
        });
    }, []);

    const formHandler = useFormik({
        initialValues: {
            id: "",
            category: "",
            roles: [] as string[],
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            category: Yup.string().required("Category is required."),
            roles: Yup.array().min(1, "Select at least one role."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Edit ATD Access Type",
                message: "Are you sure you want to save changes?",
            });

            if (isConfirmed) {
                setSubmitting(true);
                editATDAccessType(values, Number(values.id))
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("ATD Access Type updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
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
        },
    });

    useEffect(() => {
        if (modal.isShowing) {
            formHandler.setValues({
                id: formValue?.id || "",
                category: formValue?.category || "",
                roles: Array.isArray(formValue?.roles)
                    ? formValue.roles.map((r: any) => String(typeof r === "object" ? r.id ?? r.value ?? r : r))
                    : formValue?.role
                        ? [String(formValue.role.id ?? formValue.role)]
                        : [],
                status: formValue?.status || "",
            });
        }
    }, [modal.isShowing, formValue]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit ATD Access Type"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <Dropdown
                    label="Category"
                    placeholder="select category"
                    name="category"
                    value={formHandler.values.category}
                    required
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.category}
                    options={[
                        { label: "SSS", value: "SSS" },
                        { label: "Pag-ibig", value: "Pag-ibig" },
                        { label: "Philhealth", value: "Philhealth" },
                        { label: "Company", value: "Company" },
                        { label: "N/A", value: "N/A" },
                    ]}
                />
                <div className="mt-3">
                    <p className="mb-[-2px]">
                        Roles <span className="text-red-400">*</span>
                    </p>
                    <div className="border border-slate-200 rounded-md p-2 dark:border-neutral-700">
                        <Grid cols={2}>
                        {roles.map((role) => (
                            <Checkbox
                                key={role.value}
                                label={role.label}
                                value={role.value}
                                checked={formHandler.values.roles.includes(String(role.value))}
                                onChange={(e: any) => {
                                    const val = String(e.target.value);
                                    const has = formHandler.values.roles.includes(val);
                                    const next = has
                                        ? formHandler.values.roles.filter((r) => r !== val)
                                        : [...formHandler.values.roles, val];
                                    formHandler.setFieldValue("roles", next);
                                }}
                            />
                        ))}
                        </Grid>
                    </div>
                    {formHandler.errors.roles && (
                        <p className="text-red-400 text-sm">{String(formHandler.errors.roles)}</p>
                    )}
                </div>


                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={formHandler.values.status}
                    required
                    onChange={formHandler.handleChange}
                    error={formHandler.errors.status}
                />

                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Save"
                            loading={formHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditATDAccessTypeForm;
