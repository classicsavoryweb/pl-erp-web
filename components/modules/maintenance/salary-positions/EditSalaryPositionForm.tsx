import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import { useEffect } from "react";
import PositionDropDown from "../../generic/PositionDropDown";
import RateCategoryDropDown from "../../generic/RateCategoryDropDown";
import { editSalaryPosition } from "@/api/salary-positions";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditSalaryPositionForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editFormHandler = useFormik({
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
            editSalaryPosition(values, formValue.id)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("Rate updated successfully");
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

    useEffect(() => {
        if (modal.isShowing) {
            editFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit rate"
            onClose={() => {
                modal.onClose();
                editFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editFormHandler.handleSubmit}>
                <PositionDropDown
                    label="Position"
                    value={Number(editFormHandler.values.position_id)}
                    error={editFormHandler.errors.position_id}
                    placeholder="select position"
                    onChange={editFormHandler.handleChange}
                    required
                    name="position_id"
                />
                <Textfield
                    label="Basic Salary"
                    placeholder="enter basic salary"
                    name="basic_salary"
                    value={editFormHandler.values.basic_salary}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.basic_salary}
                />
                <RateCategoryDropDown
                    label="Rate Category"
                    placeholder="select rate category"
                    name="rate_category"
                    value={editFormHandler.values.rate_category}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.rate_category}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editFormHandler.values.status}
                    required
                    onChange={editFormHandler.handleChange}
                    error={editFormHandler.errors.status}
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

export default EditSalaryPositionForm;