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

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateHolidayForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {
    const createFormHandler = useFormik<{
        date: string,
        holiday_type: string,
        branch_id: string[], 
        description: string,
        required_days: string,
        required_for: string,
    }>({
        initialValues: {
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

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getBranches()
                .then((resp) => {
                    if (!resp.error) {
                        api.setDataSet(resp.data.branches);
                    }
                })
                .finally(() => {
                    api.setLoading(false);
                });
        }
    }, [modal.isShowing]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, value: number) => {
        if (e.target.checked) {
            createFormHandler.setFieldValue("branch_id", [
                ...createFormHandler.values.branch_id,
                e.target.value
            ]);
        } else {
            const ids = createFormHandler.values.branch_id;
            const newIds = ids.filter((id) => id === e.target.value);
            createFormHandler.setFieldValue("branch_id", newIds)
        }
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
                        <Checkbox
                            label={"Select All"}
                            value={api.dataSet}
                            onChange={(e) => {
                                const ids = api.dataSet.map((data) => data.id);
                                if (e.target.checked) {
                                    createFormHandler.setFieldValue("branch_id", ids);
                                } else {
                                    createFormHandler.setFieldValue("branch_id", []);
                                }
                            }}
                        />
                    </div>
                    <div
                        className="max-h-[350px] overflow-hidden overflow-y-auto p-3"
                    >
                        <Grid cols={2}>
                            {api.dataSet.map((data, key) => (
                                <Checkbox
                                    label={data.name}
                                    key={key}
                                    value={data.id}
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