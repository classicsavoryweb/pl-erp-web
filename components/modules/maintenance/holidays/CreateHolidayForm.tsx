"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import Grid from "@/components/common/Grid";
import Checkbox from "@/components/common/Checkbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import Dropdown from "@/components/common/Dropdown";
import { createHoliday } from "@/api/holidays";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getBranches } from "@/api/branches";
import { useEffect, useState } from "react";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateHolidayForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {
    const createFormHandler = useFormik<{
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
            required_for: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            date: Yup.string().required("Date is required."),
            holiday_type: Yup.string().required("Holiday type is required."),
            branch_id: Yup.array().required("Branch is required."), 
            description: Yup.string().required("Description is required."),
            required_days: Yup.string().required("Required days is required."),
        }),
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const isConfirmed = await confirm({
                title: "Create Holiday",
                message: "Are you sure you want to create?"
            });
            if (isConfirmed) {
                setSubmitting(true);
                createHoliday(values)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Holiday created successfully");
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
        return ids.length > 0 && ids.every((id: number) => createFormHandler.values.branch_id.includes(id));
    };

    const handleTypeToggle = (typeLabel: string, checked: boolean) => {
        const ids = getIdsByBranchType(typeLabel);
        const current = createFormHandler.values.branch_id;
        if (checked) {
            const merged = Array.from(new Set([...current, ...ids]));
            createFormHandler.setFieldValue("branch_id", merged);
        } else {
            const removed = current.filter((id) => !ids.includes(id));
            createFormHandler.setFieldValue("branch_id", removed);
        }
    };

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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, value: number) => {
        const current = [...createFormHandler.values.branch_id];
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
        createFormHandler.setFieldValue("branch_id", current);
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create Holiday"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="lg"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <Textfield
                    label="Date"
                    placeholder="enter date"
                    name="date"
                    type="date"
                    value={createFormHandler.values.date}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.date}
                />
                <Dropdown
                    label="Holiday Type"
                    placeholder="select holiday type"
                    name="holiday_type"
                    value={createFormHandler.values.holiday_type}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.holiday_type}
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
                                checked={api.dataSet.length > 0 && createFormHandler.values.branch_id.length === api.dataSet.length}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        const allBranchIds = api.dataSet.map((data) => data.id);
                                        createFormHandler.setFieldValue("branch_id", allBranchIds);
                                    } else {
                                        createFormHandler.setFieldValue("branch_id", []);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <Textfield
                        name="key_word"
                        label=""
                        placeholder="search for branch"
                        value={createFormHandler.values.key_word}
                        onChange={(e) => {
                            createFormHandler.setFieldValue("key_word", e.target.value);
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
                    <div className="max-h-[350px] overflow-hidden overflow-y-auto p-3">
                        <Grid cols={2}>
                            {filteredBranches.map((data, key) => (
                                <Checkbox
                                    label={data.name}
                                    key={key}
                                    value={data.id}
                                    checked={createFormHandler.values.branch_id.includes(data.id)}
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
                    value={createFormHandler.values.description}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.description}
                />
                <Textfield
                    label="Required Days"
                    placeholder="enter required days"
                    name="required_days"
                    type="number"
                    value={createFormHandler.values.required_days}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.required_days}
                />
                <Dropdown
                    label="Required for"
                    placeholder="select"
                    name="required_for"
                    value={createFormHandler.values.required_for ?? ""}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.required_for}
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
                <hr className="mt-6 pb-2 text-slate-300" />
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createFormHandler.resetForm();
                            }}
                        />
                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default CreateHolidayForm;