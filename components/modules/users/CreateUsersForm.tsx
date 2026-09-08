import { createUser } from "@/api/users";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import RolesMultiSelect from "../generic/RolesMultiSelect";
import SearchEmployeeDropDown from "../generic/SearchEmployeeDropDown";
import confirm from "@/components/common/Confirm";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateUsersForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {
    const createUserForm = useFormik({
        initialValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            role_ids: [] as (string | number)[],
            employee_number: "",
            password: "",
            confirm_password: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            first_name: Yup.string().required("First name is required."),
            last_name: Yup.string().required("Last name is required."),
            email: Yup.string().required("Email is required."),
            employee_number: Yup.string().required("Employee number is required."),
            password: Yup.string().required("Password is required."),
            role_ids: Yup.array().min(1, "At least one role is required."),
            confirm_password: Yup.string().required("Confirm password is required.")
                .oneOf([Yup.ref('password')], "Passwords must match.")
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Create User",
                message: "Are you sure you want to save?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createUser(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("User created successfully");
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
            title="Create new user"
            onClose={() => {
                modal.onClose();
                createUserForm.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <SearchEmployeeDropDown
                label="Employee"
                name="employee"
                onChange={(event) => {
                    const emp = event.target.value;
                    createUserForm.setValues({
                        first_name: emp.first_name,
                        middle_name: emp.middle_name ?? "",
                        last_name: emp.last_name,
                        email: emp.email,
                        role_ids: [],
                        employee_number: emp.employee_number,
                        password: "",
                        confirm_password: "",
                    })
                }}
                placeholder="select employee"
                status="active"
            />
            <form onSubmit={createUserForm.handleSubmit}>
                <Textfield
                    label="First name"
                    placeholder="enter first name"
                    name="first_name"
                    value={createUserForm.values.first_name}
                    required
                    onChange={createUserForm.handleChange}
                    error={createUserForm.errors.first_name}
                />
                <Textfield
                    label="Middle name"
                    placeholder="enter middle name"
                    name="middle_name"
                    value={createUserForm.values.middle_name}
                    onChange={createUserForm.handleChange}
                    error={createUserForm.errors.middle_name}
                />
                <Textfield
                    label="Last name"
                    placeholder="enter last name"
                    name="last_name"
                    value={createUserForm.values.last_name}
                    required
                    onChange={createUserForm.handleChange}
                    error={createUserForm.errors.last_name}
                />
                <Textfield
                    label="Employee number"
                    placeholder="enter employee number"
                    name="employee_number"
                    value={createUserForm.values.employee_number}
                    required
                    onChange={createUserForm.handleChange}
                    error={createUserForm.errors.employee_number}
                />
                <Textfield
                    label="Email"
                    placeholder="enter email"
                    name="email"
                    type="email"
                    value={createUserForm.values.email}
                    required
                    onChange={createUserForm.handleChange}
                    error={createUserForm.errors.email}
                />
                <RolesMultiSelect
                    label="Roles"
                    value={createUserForm.values.role_ids}
                    onChange={(roleIds) => createUserForm.setFieldValue("role_ids", roleIds)}
                    error={createUserForm.errors.role_ids as string | undefined}
                    required
                />
                <Textfield
                    label="Password"
                    placeholder="enter password"
                    name="password"
                    type="password"
                    value={createUserForm.values.password}
                    required
                    onChange={createUserForm.handleChange}
                    error={createUserForm.errors.password}
                />
                <Textfield
                    label="Confirm password"
                    placeholder="enter confirm password"
                    name="confirm_password"
                    type="password"
                    value={createUserForm.values.confirm_password}
                    required
                    onChange={createUserForm.handleChange}
                    error={createUserForm.errors.confirm_password}
                />
                
                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createUserForm.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={createUserForm.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateUsersForm;