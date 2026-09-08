import { createUser, editUser } from "@/api/users";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import RolesMultiSelect from "../generic/RolesMultiSelect";
import { useEffect } from "react";
import Dropdown from "@/components/common/Dropdown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditUsersForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const updateUsersForm = useFormik({
        initialValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            role_ids: [] as (string | number)[],
            employee_number: "",
            password: "",
            confirm_password: "",
            status: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            first_name: Yup.string().required("First name is required."),
            last_name: Yup.string().required("Last name is required."),
            email: Yup.string().required("Email is required."),
            employee_number: Yup.string().required("Employee number is required."),
            role_ids: Yup.array().min(1, "At least one role is required."),
            status: Yup.string().required("Status is required."),
            password: Yup.string(),
            confirm_password: Yup.string().when('password', (password, schema) =>
                String(password) !== ""
                    ? schema
                        .oneOf([Yup.ref('password')], 'Passwords must match.')
                        .required('Please confirm your password')
                    : schema.notRequired()
            ),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {

            const isConfirmed = await confirm({
                title: "Edit User",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                editUser(values, formValue.id)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("User updated successfully");
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
            updateUsersForm.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Update User"
            onClose={() => {
                modal.onClose();
                updateUsersForm.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={updateUsersForm.handleSubmit}>
                <Textfield
                    label="First name"
                    placeholder="enter first name"
                    name="first_name"
                    value={updateUsersForm.values.first_name}
                    required
                    onChange={updateUsersForm.handleChange}
                    error={updateUsersForm.errors.first_name}
                />
                <Textfield
                    label="Middle name"
                    placeholder="enter middle name"
                    name="middle_name"
                    value={updateUsersForm.values.middle_name}
                    onChange={updateUsersForm.handleChange}
                    error={updateUsersForm.errors.middle_name}
                />
                <Textfield
                    label="Last name"
                    placeholder="enter last name"
                    name="last_name"
                    value={updateUsersForm.values.last_name}
                    required
                    onChange={updateUsersForm.handleChange}
                    error={updateUsersForm.errors.last_name}
                />
                <Textfield
                    label="Employee number"
                    placeholder="enter employee number"
                    name="employee_number"
                    value={updateUsersForm.values.employee_number}
                    required
                    onChange={updateUsersForm.handleChange}
                    error={updateUsersForm.errors.employee_number}
                />
                <Textfield
                    label="Email"
                    placeholder="enter email"
                    name="email"
                    type="email"
                    value={updateUsersForm.values.email}
                    required
                    onChange={updateUsersForm.handleChange}
                    error={updateUsersForm.errors.email}
                />
                <RolesMultiSelect
                    label="Roles"
                    value={updateUsersForm.values.role_ids}
                    onChange={(roleIds) => updateUsersForm.setFieldValue("role_ids", roleIds)}
                    error={updateUsersForm.errors.role_ids as string | undefined}
                    required
                />
                <Dropdown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    onChange={updateUsersForm.handleChange}
                    value={updateUsersForm.values.status}
                    error={updateUsersForm.errors.status}
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
                    label="Password"
                    placeholder="enter password"
                    name="password"
                    type="password"
                    value={updateUsersForm.values.password}
                    required
                    onChange={updateUsersForm.handleChange}
                    error={updateUsersForm.errors.password}
                />
                <Textfield
                    label="Confirm password"
                    placeholder="enter confirm password"
                    name="confirm_password"
                    type="password"
                    value={updateUsersForm.values.confirm_password}
                    required
                    onChange={updateUsersForm.handleChange}
                    error={updateUsersForm.errors.confirm_password}
                />
                
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                updateUsersForm.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={updateUsersForm.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditUsersForm;