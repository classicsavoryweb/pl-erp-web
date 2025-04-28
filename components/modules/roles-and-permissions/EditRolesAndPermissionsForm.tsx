import { getAllPermissions, updateOrCreateRolesAndPermissions } from "@/api/roles-and-permissions";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue?: any;
};

type RoleForm = {
    name: string;
    permissions: string[];
};

const EditRolesAndPermissionsForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const [permissions, setPermissions] = useState<any>([]);

    const createRole = useFormik<RoleForm>({
        initialValues: {
            name: "",
            permissions: []
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Role name is required."),
            permissions: Yup.array().min(1, "At least one permission is required.")
        }),
        onSubmit: (values, {setSubmitting, resetForm}) => {
            setSubmitting(true);

            updateOrCreateRolesAndPermissions(values)
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Role and permissions saved successfully");
                    onSubmitCallback();
                    resetForm();
                    modal.onClose();
                } else {
                    toast.error("Saving role and permissions failed.");
                }
            })
            .catch(() => {
                toast.error("Error encountered");
            })
            .finally(() => {
                setSubmitting(false);
            });
        }
    });

    useAsyncEffect(() => {
        if (modal.isShowing) {
            if (formValue) {
                createRole.setValues(formValue);
            }
            modal.setLoading(true);
            getAllPermissions()
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching permissions");
                } else {
                    setPermissions(resp.data.permissions);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                modal.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title= "Edit roles and permissions"
            onClose={() => {
                modal.onClose();
                createRole.resetForm();
            }}
            loading={modal.loading}
            size="lg"
        >
            <form onSubmit={createRole.handleSubmit}>
                <Textfield
                    name="name"
                    label="Role Name"
                    required
                    onChange={createRole.handleChange}
                    error={createRole.errors.name}
                    value={createRole.values.name}
                    placeholder="enter role name"
                    disabled
                />

                <p>Permissions<span className="text-red-400">*</span></p>
                <p className="text-red-400">{createRole.errors.permissions}</p>

                <Grid
                    cols={2}
                >
                    { permissions.map((permission: any, key:number) => {
                        return (
                            <Checkbox
                                key={key}
                                label={permission.name}
                                value={permission.name}
                                checked={createRole.values.permissions.includes(permission.name)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const selectedPermissions = createRole.values.permissions;
                        
                                    if (e.target.checked) {
                                        createRole.setFieldValue("permissions", [...selectedPermissions, value]);
                                    } else {
                                        const updatedPermissions = selectedPermissions.filter((permission) => permission !== value);
                                        createRole.setFieldValue("permissions", updatedPermissions);
                                    }
                                }}
                            />
                        )
                    })

                    }                    
                </Grid>

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createRole.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={createRole.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditRolesAndPermissionsForm;