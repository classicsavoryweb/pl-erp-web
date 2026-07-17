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
import SearchEmployeeDropDown from "../../../generic/SearchEmployeeDropDown";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getBranches } from "@/api/branches";
import { editPettyCashApprover } from "@/api/maintenance/petty-cash-approver";
import { useEffect, useState } from "react";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditApproverForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {
    const api = useApiCall();
    const [filteredBranches, setFilteredBranches] = useState<any[]>([]);
    const [branchKeyword, setBranchKeyword] = useState("");

    const editFormHandler = useFormik({
        initialValues: {
            id: "",
            description: "",
            use_same_range: true,
            min_amount: "",
            max_amount: "",
            status: "active",
            branch_ids: [] as number[],
            employees: [] as any[],
        },
        validateOnChange: false,
        validate: (values) => {
            const errors: any = {};
            if (!values.description) {
                errors.description = "Description is required.";
            }
            if (values.use_same_range) {
                if (values.min_amount === "" || values.min_amount === null || values.min_amount === undefined) {
                    errors.min_amount = "Minimum amount is required.";
                }
                if (values.max_amount === "" || values.max_amount === null || values.max_amount === undefined) {
                    errors.max_amount = "Maximum amount is required.";
                } else if (Number(values.max_amount) < Number(values.min_amount)) {
                    errors.max_amount = "Max amount must be greater than or equal to min amount.";
                }
            }
            if (!values.branch_ids || values.branch_ids.length === 0) {
                errors.branch_ids_error = "At least one branch must be tagged.";
            }
            if (!values.employees || values.employees.length === 0) {
                errors.employees_error = "At least one employee must be selected.";
            } else if (!values.use_same_range) {
                const employeeErrors = values.employees.map((emp: any) => {
                    const empErr: any = {};
                    if (emp.min_amount === "" || emp.min_amount === null || emp.min_amount === undefined) {
                        empErr.min_amount = "Required";
                    }
                    if (emp.max_amount === "" || emp.max_amount === null || emp.max_amount === undefined) {
                        empErr.max_amount = "Required";
                    } else if (Number(emp.max_amount) < Number(emp.min_amount)) {
                        empErr.max_amount = "Max < Min";
                    }
                    return Object.keys(empErr).length > 0 ? empErr : null;
                });
                if (employeeErrors.some(err => err !== null)) {
                    errors.employees = employeeErrors;
                }
            }
            return errors;
        },
        onSubmit: async (values, { setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Edit Approver Group",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editPettyCashApprover(values, Number(values.id))
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Approver group updated successfully");
                            onSubmitCallback();
                            modal.onClose();
                            setBranchKeyword("");
                        } else {
                            toast.error(resp.data.message || "Error updating approver group");
                        }
                    })
                    .catch(() => {
                        toast.error("Error encountered");
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
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
                .finally(() => {
                    api.setLoading(false);
                });
        }
    }, [modal.isShowing]);

    useEffect(() => {
        if (modal.isShowing && formValue) {
            const mappedEmployees = formValue.employees
                ? formValue.employees.map((e: any) => ({
                    employee_id: e.id,
                    full_name: e.full_name,
                    position_name: e.current_position?.description ?? "N/A",
                    min_amount: e.pivot?.min_amount ?? "",
                    max_amount: e.pivot?.max_amount ?? ""
                }))
                : [];
            const mappedBranches = formValue.branches
                ? formValue.branches.map((b: any) => b.id)
                : [];

            editFormHandler.setValues({
                id: formValue.id ?? "",
                description: formValue.description ?? "",
                use_same_range: formValue.use_same_range ?? true,
                min_amount: formValue.min_amount ?? "",
                max_amount: formValue.max_amount ?? "",
                status: formValue.status ?? "active",
                branch_ids: mappedBranches,
                employees: mappedEmployees
            });
        }
    }, [modal.isShowing, formValue]);

    const getIdsByBranchType = (typeLabel: string) =>
        api.dataSet
            .filter((branch: any) => String(branch.type).toLowerCase() === typeLabel.toLowerCase())
            .map((branch: any) => branch.id);

    const areAllTypeSelected = (typeLabel: string) => {
        const ids = getIdsByBranchType(typeLabel);
        return ids.length > 0 && ids.every((id: number) => editFormHandler.values.branch_ids.includes(id));
    };

    const handleTypeToggle = (typeLabel: string, checked: boolean) => {
        const ids = getIdsByBranchType(typeLabel);
        const current = editFormHandler.values.branch_ids;
        if (checked) {
            const merged = Array.from(new Set([...current, ...ids]));
            editFormHandler.setFieldValue("branch_ids", merged);
        } else {
            const removed = current.filter((id) => !ids.includes(id));
            editFormHandler.setFieldValue("branch_ids", removed);
        }
    };

    const handleBranchCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, value: number) => {
        const current = [...editFormHandler.values.branch_ids];
        if (e.target.checked) {
            if (!current.includes(value)) {
                current.push(value);
            }
        } else {
            const index = current.indexOf(value);
            if (index !== -1) {
                current.splice(index, 1);
            }
        }
        editFormHandler.setFieldValue("branch_ids", current);
    };

    const handleAddEmployee = (empObj: any) => {
        if (!empObj) return;
        const exists = editFormHandler.values.employees.some(
            (emp: any) => emp.employee_id === empObj.id
        );

        if (!exists) {
            const newEmp = {
                employee_id: empObj.id,
                full_name: `${empObj.last_name}, ${empObj.first_name} ${empObj.middle_name || ""}`,
                position_name: empObj.current_position?.description ?? "N/A",
                min_amount: "",
                max_amount: ""
            };
            editFormHandler.setFieldValue("employees", [...editFormHandler.values.employees, newEmp]);
        } else {
            toast.warning("Employee is already added.");
        }
    };

    const handleRemoveEmployee = (empId: number) => {
        const current = editFormHandler.values.employees.filter((emp: any) => emp.employee_id !== empId);
        editFormHandler.setFieldValue("employees", current);
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Approver Group"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
                setBranchKeyword("");
            }}
            loading={modal.loading}
            size="xl"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-3">
                        <Textfield
                            label="Description"
                            placeholder="enter description"
                            name="description"
                            type="text"
                            value={editFormHandler.values.description}
                            required
                            onChange={editFormHandler.handleChange}
                            error={editFormHandler.errors.description}
                        />

                        <div className="mt-4 flex items-center gap-x-2">
                            <input
                                id="edit_use_same_range"
                                name="use_same_range"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-red-500"
                                checked={editFormHandler.values.use_same_range}
                                onChange={(e) => {
                                    editFormHandler.setFieldValue("use_same_range", e.target.checked);
                                }}
                            />
                            <label htmlFor="edit_use_same_range" className="text-sm font-medium text-gray-700 dark:text-neutral-300 select-none">
                                Same range for all employees
                            </label>
                        </div>

                        {editFormHandler.values.use_same_range && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <Textfield
                                    label="Min Amount"
                                    placeholder="enter minimum amount"
                                    name="min_amount"
                                    type="number"
                                    value={editFormHandler.values.min_amount}
                                    required
                                    onChange={editFormHandler.handleChange}
                                    error={editFormHandler.errors.min_amount}
                                />
                                <Textfield
                                    label="Max Amount"
                                    placeholder="enter maximum amount"
                                    name="max_amount"
                                    type="number"
                                    value={editFormHandler.values.max_amount}
                                    required
                                    onChange={editFormHandler.handleChange}
                                    error={editFormHandler.errors.max_amount}
                                />
                            </div>
                        )}

                        <div className="mt-4">
                            <ActiveInactiveDropDown
                                label="Status"
                                placeholder="select status"
                                name="status"
                                value={editFormHandler.values.status}
                                required
                                onChange={editFormHandler.handleChange}
                                error={editFormHandler.errors.status}
                            />
                        </div>

                        <div className="mt-6 border-t dark:border-neutral-700 pt-4">
                            <h3 className="font-semibold text-sm mb-2">Select Employees</h3>
                            <SearchEmployeeDropDown
                                label="Employee"
                                placeholder="select employee to add"
                                name="employee_select"
                                onChange={(e) => {
                                    handleAddEmployee(e.target.value);
                                }}
                                value=""
                            />
                            {(editFormHandler.errors as any).employees_error && (
                                <p className="text-red-500 text-xs mt-1">{(editFormHandler.errors as any).employees_error}</p>
                            )}

                            <div className="mt-4 max-h-[220px] overflow-y-auto border dark:border-neutral-700 rounded p-2 bg-slate-50 dark:bg-neutral-800">
                                {editFormHandler.values.employees.length === 0 ? (
                                    <p className="text-gray-500 dark:text-neutral-400 text-xs text-center py-4">No employees added yet.</p>
                                ) : (
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b dark:border-neutral-700 text-left text-gray-600 dark:text-neutral-400">
                                                <th className="pb-1 w-40">Name / Position</th>
                                                {!editFormHandler.values.use_same_range && (
                                                    <>
                                                        <th className="pb-1 w-20">Min</th>
                                                        <th className="pb-1 w-20">Max</th>
                                                    </>
                                                )}
                                                <th className="pb-1 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editFormHandler.values.employees.map((emp: any, index: number) => {
                                                const rowErrors = editFormHandler.errors.employees
                                                    ? (editFormHandler.errors.employees as any)[index]
                                                    : null;

                                                return (
                                                    <tr key={emp.employee_id} className="border-b dark:border-neutral-700 last:border-0">
                                                        <td className="py-2">
                                                            <div className="font-medium">{emp.full_name}</div>
                                                            <div className="text-gray-500 dark:text-neutral-400 text-[10px]">{emp.position_name}</div>
                                                        </td>
                                                        {!editFormHandler.values.use_same_range && (
                                                            <>
                                                                <td className="py-1">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Min"
                                                                        className={`w-20 p-1 border rounded bg-white dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-600 ${rowErrors?.min_amount ? "border-red-500" : ""}`}
                                                                        value={emp.min_amount}
                                                                        onChange={(e) => {
                                                                            const updated = [...editFormHandler.values.employees];
                                                                            updated[index].min_amount = e.target.value;
                                                                            editFormHandler.setFieldValue("employees", updated);
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="py-1">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Max"
                                                                        className={`w-20 p-1 border rounded bg-white dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-600 ${rowErrors?.max_amount ? "border-red-500" : ""}`}
                                                                        value={emp.max_amount}
                                                                        onChange={(e) => {
                                                                            const updated = [...editFormHandler.values.employees];
                                                                            updated[index].max_amount = e.target.value;
                                                                            editFormHandler.setFieldValue("employees", updated);
                                                                        }}
                                                                    />
                                                                </td>
                                                            </>
                                                        )}
                                                        <td className="py-1 text-right">
                                                            <button
                                                                type="button"
                                                                className="text-red-500 hover:text-red-700 font-medium"
                                                                onClick={() => handleRemoveEmployee(emp.employee_id)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {!editFormHandler.values.use_same_range && editFormHandler.values.employees.length > 0 && (
                                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 italic">
                                    ℹ️ Set the minimum and maximum approval amount per employee above.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="col-span-3 border-l dark:border-neutral-700 pl-4">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-sm">Branches</p>
                            <div className="flex gap-2 text-xs">
                                <Checkbox
                                    label={"Branch"}
                                    value="branch"
                                    checked={areAllTypeSelected("Branch")}
                                    onChange={(e) => handleTypeToggle("Branch", e.target.checked)}
                                />
                                <Checkbox
                                    label={"Head Office"}
                                    value="head_office"
                                    checked={areAllTypeSelected("Head Office")}
                                    onChange={(e) => handleTypeToggle("Head Office", e.target.checked)}
                                />
                                <Checkbox
                                    label={"Select All"}
                                    value="select_all"
                                    checked={api.dataSet.length > 0 && editFormHandler.values.branch_ids.length === api.dataSet.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            const allBranchIds = api.dataSet.map((data) => data.id);
                                            editFormHandler.setFieldValue("branch_ids", allBranchIds);
                                        } else {
                                            editFormHandler.setFieldValue("branch_ids", []);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <Textfield
                            name="key_word"
                            label=""
                            placeholder="search for branch"
                            value={branchKeyword}
                            onChange={(e) => {
                                setBranchKeyword(e.target.value);
                                const keyword = e.target.value.trim().toLowerCase();
                                if (keyword) {
                                    const filtered = api.dataSet.filter((branch) =>
                                        String(branch.name).toLowerCase().includes(keyword)
                                    );
                                    setFilteredBranches(filtered);
                                } else {
                                    setFilteredBranches(api.dataSet);
                                }
                            }}
                        />
                        {(editFormHandler.errors as any).branch_ids_error && (
                            <p className="text-red-500 text-xs mt-1">{(editFormHandler.errors as any).branch_ids_error}</p>
                        )}
                        <div className="max-h-[350px] overflow-y-auto p-2 border dark:border-neutral-700 rounded bg-slate-50 dark:bg-neutral-800 mt-2">
                            <Grid cols={1}>
                                {filteredBranches.map((branch, key) => (
                                    <Checkbox
                                        label={branch.name}
                                        key={key}
                                        value={branch.id}
                                        checked={editFormHandler.values.branch_ids.includes(branch.id)}
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
                                editFormHandler.resetForm();
                                setBranchKeyword("");
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={editFormHandler.isSubmitting}
                            onClick={() => { }}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default EditApproverForm;
