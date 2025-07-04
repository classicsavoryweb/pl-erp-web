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
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { editHoliday } from "@/api/holidays";
import { getBranches } from "@/api/branches";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";

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
        date: string,
        holiday_type: string,
        branch_id: string[], 
        description: string,
        required_days: string,
    }>({
        initialValues: {
            date: "",
            holiday_type: "",
            branch_id: [], 
            description: "",
            required_days: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            date: Yup.string().required("Date is required."),
            holiday_type: Yup.string().required("Holiday type is required."),
            branch_id: Yup.array().required("Branch is required."), 
            description: Yup.string().required("Description is required."),
            required_days: Yup.string().required("Required days is required."),
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

    useEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing])

    useAsyncEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
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

    const handleCheckboxChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        value: string
    ) => {
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
                            value: "Legal Holiday"
                        },
                        {
                            label: "Special Holiday",
                            value: "Special Holiday"
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
                                    editFormHandler.setFieldValue("branch_id", ids);
                                } else {
                                    editFormHandler.setFieldValue("branch_id", []);
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