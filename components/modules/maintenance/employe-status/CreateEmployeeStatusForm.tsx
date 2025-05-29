import { createEmployeeStatus } from "@/api/employee-status";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateEmployeeStatusForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createEmployeeStatusForm = useFormik({
        initialValues: {
            type: "",
            description: "",
            status: "active",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            type: Yup.string().required("Type is required."),
            description: Yup.string().required("Description is required."),
            status: Yup.string().required("Status is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Create Employee Status",
                message: "Are you sure you want to create?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createEmployeeStatus(values)
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

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create new employee status"
            onClose={() => {
                modal.onClose();
                createEmployeeStatusForm.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createEmployeeStatusForm.handleSubmit}>
                <Dropdown
                    label="Type"
                    placeholder="select type"
                    name="type"
                    onChange={createEmployeeStatusForm.handleChange}
                    value={createEmployeeStatusForm.values.type}
                    error={createEmployeeStatusForm.errors.type}
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
                    value={createEmployeeStatusForm.values.description}
                    required
                    onChange={createEmployeeStatusForm.handleChange}
                    error={createEmployeeStatusForm.errors.description}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={createEmployeeStatusForm.values.status}
                    required
                    onChange={createEmployeeStatusForm.handleChange}
                    error={createEmployeeStatusForm.errors.status}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createEmployeeStatusForm.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={createEmployeeStatusForm.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateEmployeeStatusForm;