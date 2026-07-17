"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Grid from "@/components/common/Grid";
import Checkbox from "@/components/common/Checkbox";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import ActiveInactiveDropDown from "../../../generic/ActiveInactiveDropDown";
import UserEmployeeDropDown from "../../../generic/UserEmployeeDropDown";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getBranches } from "@/api/branches";
import { editPettyCashCustodian } from "@/api/maintenance/petty-cash-custodian";
import { useEffect, useState } from "react";

const formatAmount = (value: number) => {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditCustodianForm = ({ modal, onSubmitCallback, formValue }: FormModalInterface) => {
    const api = useApiCall();
    const [filteredBranches, setFilteredBranches] = useState<any[]>([]);
    const [branchKeyword, setBranchKeyword] = useState("");
    const isActive = formValue?.status === "active";

    const formHandler = useFormik({
        initialValues: {
            id: "" as string | number,
            user_id: "" as string | number,
            selected_user: null as any,
            total_cash_fund: "",
            status: "active",
            branch_ids: [] as number[],
        },
        validateOnChange: false,
        validate: (values) => {
            const errors: any = {};
            if (!values.user_id) {
                errors.user_id = "Custodian is required.";
            }
            if (!values.status) {
                errors.status = "Status is required.";
            }
            if (!values.branch_ids || values.branch_ids.length === 0) {
                errors.branch_ids_error = "At least one branch must be selected.";
            }
            return errors;
        },
        onSubmit: async (values, { setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Edit Custodian",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editPettyCashCustodian(
                    {
                        user_id: values.user_id,
                        total_cash_fund: values.total_cash_fund,
                        status: values.status,
                        branch_ids: values.branch_ids,
                    },
                    Number(values.id)
                )
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Custodian updated successfully");
                            onSubmitCallback();
                            modal.onClose();
                            setBranchKeyword("");
                        } else {
                            toast.error(resp.data.message || "Error updating custodian");
                        }
                    })
                    .catch(() => toast.error("Error encountered"))
                    .finally(() => setSubmitting(false));
            }
        }
    });

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getBranches()
                .then((resp) => {
                    if (!resp.error) {
                        api.setDataSet(resp.data.branches);
                        setFilteredBranches(resp.data.branches);
                    }
                })
                .finally(() => api.setLoading(false));
        }
    }, [modal.isShowing]);

    useEffect(() => {
        if (modal.isShowing && formValue) {
            formHandler.setValues({
                id: formValue.id ?? "",
                user_id: formValue.user_id ?? "",
                selected_user: formValue.user ?? null,
                total_cash_fund: formValue.total_cash_fund ?? "",
                status: formValue.status ?? "active",
                branch_ids: formValue.branches?.map((b: any) => b.id) ?? [],
            });
        }
    }, [modal.isShowing, formValue]);

    const getIdsByBranchType = (typeLabel: string) =>
        api.dataSet
            .filter((branch: any) => String(branch.type).toLowerCase() === typeLabel.toLowerCase())
            .map((branch: any) => branch.id);

    const areAllTypeSelected = (typeLabel: string) => {
        const ids = getIdsByBranchType(typeLabel);
        return ids.length > 0 && ids.every((id: number) => formHandler.values.branch_ids.includes(id));
    };

    const handleTypeToggle = (typeLabel: string, checked: boolean) => {
        const ids = getIdsByBranchType(typeLabel);
        const current = formHandler.values.branch_ids;
        if (checked) {
            formHandler.setFieldValue("branch_ids", Array.from(new Set([...current, ...ids])));
        } else {
            formHandler.setFieldValue("branch_ids", current.filter((id) => !ids.includes(id)));
        }
    };

    const handleBranchCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, value: number) => {
        const current = [...formHandler.values.branch_ids];
        if (e.target.checked) {
            if (!current.includes(value)) current.push(value);
        } else {
            const index = current.indexOf(value);
            if (index !== -1) current.splice(index, 1);
        }
        formHandler.setFieldValue("branch_ids", current);
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Custodian"
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
                setBranchKeyword("");
            }}
            loading={modal.loading}
            size="xl"
        >
            <form onSubmit={formHandler.handleSubmit}>
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-3">
                        <UserEmployeeDropDown
                            label="Employee"
                            placeholder="select employee"
                            name="user_select"
                            value={formHandler.values.selected_user}
                            required
                            disabled
                            onChange={(e) => {
                                const user = e.target.value;
                                formHandler.setFieldValue("user_id", user?.id ?? "");
                                formHandler.setFieldValue("selected_user", user);
                            }}
                            error={(formHandler.errors as any).user_id}
                        />

                        <div className="mt-4">
                            <Textfield
                                label="Total Cash Fund"
                                name="total_cash_fund"
                                value={formHandler.values.total_cash_fund !== "" ? formatAmount(Number(formHandler.values.total_cash_fund)) : ""}
                                disabled
                                onChange={formHandler.handleChange}
                                error={formHandler.errors.total_cash_fund}
                            />
                        </div>

                        <div className="mt-4">
                            <ActiveInactiveDropDown
                                label="Status"
                                placeholder="select status"
                                name="status"
                                value={formHandler.values.status}
                                required
                                disabled={!isActive}
                                onChange={formHandler.handleChange}
                                error={formHandler.errors.status}
                            />
                        </div>
                    </div>

                    <div className="col-span-3 border-l dark:border-neutral-700 pl-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-sm">Branches</p>
                            <div className="flex gap-2 text-xs">
                                <Checkbox
                                    label="Branch"
                                    value="branch"
                                    checked={areAllTypeSelected("Branch")}
                                    onChange={(e) => handleTypeToggle("Branch", e.target.checked)}
                                />
                                <Checkbox
                                    label="Head Office"
                                    value="head_office"
                                    checked={areAllTypeSelected("Head Office")}
                                    onChange={(e) => handleTypeToggle("Head Office", e.target.checked)}
                                />
                                <Checkbox
                                    label="Select All"
                                    value="select_all"
                                    checked={api.dataSet.length > 0 && formHandler.values.branch_ids.length === api.dataSet.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            formHandler.setFieldValue("branch_ids", api.dataSet.map((d: any) => d.id));
                                        } else {
                                            formHandler.setFieldValue("branch_ids", []);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <Textfield
                            name="branch_keyword"
                            label=""
                            placeholder="search for branch"
                            value={branchKeyword}
                            disabled={!isActive}
                            onChange={(e) => {
                                setBranchKeyword(e.target.value);
                                const keyword = e.target.value.trim().toLowerCase();
                                if (keyword) {
                                    setFilteredBranches(
                                        api.dataSet.filter((branch: any) =>
                                            String(branch.name).toLowerCase().includes(keyword)
                                        )
                                    );
                                } else {
                                    setFilteredBranches(api.dataSet);
                                }
                            }}
                        />
                        {(formHandler.errors as any).branch_ids_error && (
                            <p className="text-red-500 text-xs mt-1">{(formHandler.errors as any).branch_ids_error}</p>
                        )}
                        <div className="max-h-[350px] overflow-y-auto p-2 border dark:border-neutral-700 rounded bg-slate-50 dark:bg-neutral-800 mt-2">
                            <Grid cols={1}>
                                {filteredBranches.map((branch, key) => (
                                    <Checkbox
                                        label={branch.name}
                                        key={key}
                                        value={branch.id}
                                        checked={formHandler.values.branch_ids.includes(branch.id)}
                                        onChange={(e) => handleBranchCheckboxChange(e, branch.id)}
                                    />
                                ))}
                            </Grid>
                        </div>
                    </div>
                </div>

                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                formHandler.resetForm();
                                setBranchKeyword("");
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={formHandler.isSubmitting}
                            onClick={() => { }}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditCustodianForm;
