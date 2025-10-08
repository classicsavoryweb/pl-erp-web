"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Dropdown from "@/components/common/Dropdown";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useEffect } from "react";
import confirm from "@/components/common/Confirm";
import { getPhilhealthPercentageBase, editPhilhealthPercentageBase } from "@/api/maintenance/philhealth-percentage-base";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
}

const EditPhilhealthPercentageBaseForm = ({
    modal,
    onSubmitCallback,
}: FormModalInterface) => {

    const api = useApiCall();
    const formValue = api.dataSet[0]; 

    const editFormHandler = useFormik({
        initialValues: {
            philhealth_formula: "",
            percentage: "",
            philhealth_cap: "",
            philhealth_max: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            philhealth_formula: Yup.string().required("Philhealth formula is required."),
            percentage: Yup.string().required("Percentage is required."),
            philhealth_cap: Yup.string().required("Percentage Cap is required.")
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Philhealth Percentage Base Setup",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editPhilhealthPercentageBase(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Philhealth percentage base updated successfully");
                        onSubmitCallback();
                        modal.onClose();
                        resetForm();
                    } else {
                        toast.error(resp.data.message);
                    }
                }).catch(() => {
                    toast.error("Error encountered");
                }).finally(() => {
                    setSubmitting(false);
                });
            }
        }
    });

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getPhilhealthPercentageBase()
                .then((resp) => {
                    if (!resp.error) {
                        api.setDataSet(resp.data);  
                    }
                })
                .finally(() => {
                    api.setLoading(false);
                });
        }
    }, [modal.isShowing]);

    useEffect(() => {
        if (modal.isShowing && formValue) {
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing, formValue]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit Philhealth Percentage Base Setup"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <Dropdown
                    label="Philhealth Contribution"
                    placeholder="select philhealth contribution"
                    name="philhealth_formula"
                    value={editFormHandler.values.philhealth_formula}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.philhealth_formula}
                    options={[
                        {
                            label: "Philhealth Table",
                            value: "Philhealth Table"
                        },
                        {
                            label: "Percentage Based",
                            value: "Percentage Based"
                        }
                    ]}
                />
                <Textfield
                    label="Percentage Cap"
                    placeholder="enter percentage cap"
                    name="philhealth_cap"
                    type="number"
                    value={editFormHandler.values.philhealth_cap}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.philhealth_cap}
                />
                <Textfield
                    label="Percentage"
                    placeholder="enter percentage"
                    name="percentage"
                    type="number"
                    value={editFormHandler.values.percentage}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.percentage}
                />
                <Textfield
                    label="Max Contribution"
                    placeholder="enter max contribution"
                    name="philhealth_max"
                    type="number"
                    value={editFormHandler.values.philhealth_max}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.philhealth_max}
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

export default EditPhilhealthPercentageBaseForm;
