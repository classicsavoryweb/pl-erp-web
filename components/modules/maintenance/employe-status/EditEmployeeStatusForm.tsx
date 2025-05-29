import { createEmployeeStatus, editEmployeeStatus } from "@/api/employee-status";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditEmployeeStatusForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const updateEmployeeStatusForm = useFormik({
        initialValues: {
            type: "",
            description: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            type: Yup.string().required("Type is required."),
            description: Yup.string().required("Description is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit Employee Status",
                message: "Are you sure you wantn to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editEmployeeStatus(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Employee status created successfully");
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

    useEffect(() => {
        if (modal.isShowing) {
            updateEmployeeStatusForm.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create new employee status"
            onClose={() => {
                modal.onClose();
                updateEmployeeStatusForm.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={updateEmployeeStatusForm.handleSubmit}>
                <Dropdown
                    label="Type"
                    placeholder="select type"
                    name="type"
                    onChange={updateEmployeeStatusForm.handleChange}
                    value={updateEmployeeStatusForm.values.type}
                    error={updateEmployeeStatusForm.errors.type}
                    required
                    options={[
                        {
                            label: "Active",
                            value: "active"
                        },
                        {
                            label: "Inactive",
                            value: "inactive"
                        }
                    ]}
                />
                <Textfield
                    label="Description"
                    placeholder="enter description"
                    name="description"
                    type="text"
                    value={updateEmployeeStatusForm.values.description}
                    required
                    onChange={updateEmployeeStatusForm.handleChange}
                    error={updateEmployeeStatusForm.errors.description}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={updateEmployeeStatusForm.values.status}
                    required
                    onChange={updateEmployeeStatusForm.handleChange}
                    error={updateEmployeeStatusForm.errors.status}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                updateEmployeeStatusForm.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={updateEmployeeStatusForm.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditEmployeeStatusForm;