"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import { createSalaryPosition } from "@/api/salary-positions";
import PositionDropDown from "../../generic/PositionDropDown";
import RateCategoryDropDown from "../../generic/RateCategoryDropDown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateSalaryPositionForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createFormHandler = useFormik({
        initialValues: {
            position_id: "",
            basic_salary: "",
            rate_category: "",
            status: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            position_id: Yup.string().required("Position is required."),
            basic_salary: Yup.string().required("Basic Salary is required."),
            rate_category: Yup.string().required("Rate Category is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            createSalaryPosition(values)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("Salary position created successfully");
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
    });

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create salary positions"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <PositionDropDown
                    label="Position"
                    value={createFormHandler.values.position_id}
                    error={createFormHandler.errors.position_id}
                    placeholder="select position"
                    onChange={createFormHandler.handleChange}
                    required
                    name="position_id"
                />
                <Textfield
                    label="Basic Salary"
                    placeholder="enter basic salary"
                    name="basic_salary"
                    value={createFormHandler.values.basic_salary}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.basic_salary}
                />
                <RateCategoryDropDown
                    label="Rate Category"
                    placeholder="select rate category"
                    name="rate_category"
                    value={createFormHandler.values.rate_category}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.rate_category}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createFormHandler.values.status}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.status}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
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

export default CreateSalaryPositionForm;