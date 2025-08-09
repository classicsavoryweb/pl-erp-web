"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Grid from "@/components/common/Grid";
import Checkbox from "@/components/common/Checkbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Dropdown from "@/components/common/Dropdown";
import confirm from "@/components/common/Confirm";
import { editHoliday } from "@/api/holidays";
import { getBranches } from "@/api/branches";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useEffect, useState } from "react";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
}

const EditHolidayForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik<{
        key_word: string,
        date: string,
        holiday_type: string,
        branch_id: number[], 
        description: string,
        required_days: string,
        required_for: string,
    }>({
        initialValues: {
            key_word: "",
            date: "",
            holiday_type: "",
            branch_id: [], 
            description: "",
            required_days: "",
            required_for: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            date: Yup.string().required("Date is required."),
            holiday_type: Yup.string().required("Holiday type is required."),
            branch_id: Yup.array().required("Branch is required."), 
            description: Yup.string().required("Description is required."),
            required_days: Yup.string().required("Required days is required."),
            required_for: Yup.string().required("Required for is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Holiday",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editHoliday(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Holiday updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally((() => {
                    setSubmitting(false);
                }));
            }
        }
    });

    const api = useApiCall();
    const [filteredBranches, setFilteredBranches] = useState<any[]>([]);

    const getIdsByBranchType = (typeLabel: string) =>
        api.dataSet
            .filter((branch: any) => String(branch.type).toLowerCase() === typeLabel.toLowerCase())
            .map((branch: any) => branch.id);

    const areAllTypeSelected = (typeLabel: string) => {
        const ids = getIdsByBranchType(typeLabel);
        return ids.length > 0 && ids.every((id: number) => editFormHandler.values.branch_id.includes(id));
    };

    const handleTypeToggle = (typeLabel: string, checked: boolean) => {
        const ids = getIdsByBranchType(typeLabel);
        const current = editFormHandler.values.branch_id;
        if (checked) {
            const merged = Array.from(new Set([...current, ...ids]));
            editFormHandler.setFieldValue("branch_id", merged);
        } else {
            const removed = current.filter((id) => !ids.includes(id));
            editFormHandler.setFieldValue("branch_id", removed);
        }
    };

    useAsyncEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
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


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const keyword = (e.target.value || '').trim().toLowerCase();
            if (keyword) {
                const filtered = api.dataSet.filter((branch: any) =>
                    String(branch.name).toLowerCase().includes(keyword)
                );
                setFilteredBranches(filtered);
            } else {
                setFilteredBranches(api.dataSet);
            }
        };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, value: number) => {
        const { checked } = e.target;
        const current = editFormHandler.values.branch_id;

        if (checked) {
            if (!current.includes(value)) {
            editFormHandler.setFieldValue("branch_id", [...current, value]);
            }
        } else {
            const updated = current.filter((id) => id !== value);
            editFormHandler.setFieldValue("branch_id", updated);
        }
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit holiday"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="lg"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Textfield
                    label="Date"
                    placeholder="enter date"
                    name="date"
                    type="date"
                    value={editFormHandler.values.date}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.date}
                />
                <Dropdown
                    label="Holiday Type"
                    placeholder="select holiday type"
                    name="holiday_type"
                    value={editFormHandler.values.holiday_type}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.holiday_type}
                    options={[
                        {
                            label: "Legal Holiday",
                            value: "LH"
                        },
                        {
                            label: "Special Holiday",
                            value: "SH"
                        }
                    ]}
                />

                <div className="py-3">
                    <div className="flex justify-between items-center">
                        <p>Branches</p>
                        <div className="flex gap-2">
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
                                checked={api.dataSet.length > 0 && editFormHandler.values.branch_id.length === api.dataSet.length}
                                onChange={(e) => {
                                    const ids = api.dataSet.map((data) => data.id);
                                    if (e.target.checked) {
                                        editFormHandler.setFieldValue("branch_id", ids);
                                    } else {
                                        editFormHandler.setFieldValue("branch_id", []);
                                    }
                                }}
                            />
                        </div>
                    </div>
                        <Textfield
                            name="key_word"
                            label=""
                            placeholder="search for branch"
                            value={editFormHandler.values.key_word || ""}
                            onChange={(e) => {
                                editFormHandler.handleChange(e);
                                handleSearchChange(e);
                            }}
                        />
                    <div
                        className="max-h-[350px] overflow-hidden overflow-y-auto p-3"
                    >
                        <Grid cols={2}>
                            {filteredBranches.map((data, key) => (
                                <Checkbox
                                    label={data.name}
                                    key={key}
                                    value={data.id}
                                    checked={ editFormHandler.values.branch_id.includes(data.id) }
                                    onChange={(e) => handleCheckboxChange(e, data.id)}
                                />
                            ))}
                        </Grid>
                    </div>
                </div>

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
                <Textfield
                    label="Required Days"
                    placeholder="enter required days"
                    name="required_days"
                    type="number"
                    value={editFormHandler.values.required_days}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.required_days}
                />
                <Dropdown
                    label="Required for"
                    placeholder="select branch"
                    name="required_for"
                    value={editFormHandler.values.required_for ?? ""}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.required_for}
                    options={[
                        {
                            label: "Both",
                            value: "BOTH"
                        },
                        {
                            label: "Head Office",
                            value: "HEAD OFFICE"
                        },
                        {
                            label: "Branch",
                            value: "BRANCH"
                        },
                        {
                            label: "None",
                            value: "NONE"
                        },
                    ]}
                />
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={editFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditHolidayForm;