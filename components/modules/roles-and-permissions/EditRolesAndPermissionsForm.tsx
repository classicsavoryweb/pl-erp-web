import { getAllPermissions, updateOrCreateRolesAndPermissions } from "@/api/roles-and-permissions";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import confirm from "@/components/common/Confirm";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue?: any;
};

type RoleForm = {
    key_word: string;
    name: string;
    permissions: string[];
};

const EditRolesAndPermissionsForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const [permissions, setPermissions] = useState<any>([]);
    const [filteredPermissions, setFilteredPermissions] = useState<any>([]);

    const createRole = useFormik<RoleForm>({
        initialValues: {
            key_word: "",
            name: "",
            permissions: []
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Role name is required."),
            permissions: Yup.array().min(1, "At least one permission is required.")
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            const isConfirmed = await confirm({
                title: "Edit Roles and Permissions",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                updateOrCreateRolesAndPermissions(values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Role and permissions saved successfully");
                        onSubmitCallback();
                        resetForm();
                        modal.onClose();
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
                    setFilteredPermissions(resp.data.permissions);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                modal.setLoading(false);
            });
        }
    }, [modal.isShowing]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = createRole.values.key_word?.toLowerCase() || "";

        if (keyword) {
            const filtered = permissions.filter((permission: any) =>
                permission.name.toLowerCase().includes(keyword)
            );
            setFilteredPermissions(filtered);
        } else {
            setFilteredPermissions(permissions);
        }
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title= "Edit roles and permissions"
            onClose={() => {
                modal.onClose();
                createRole.resetForm();
            }}
            loading={modal.loading}
            size="entireScreen"
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
                    cols={4}
                >
                    <Textfield
                        name="key_word"
                        label=""
                        placeholder="search for permission"
                        value={createRole.values.key_word || ""}
                        onChange={(e) => {
                            createRole.handleChange(e);
                            handleSearchChange(e);
                        }}
                    />
                </Grid>

                <div className="max-h-[600px] overflow-y-auto">
                    <Grid
                        cols={4}
                    >
                        {
                            filteredPermissions.map((permission: any, key: number) => {
                                const isChecked = createRole.values.permissions.includes(permission.name);

                                return (
                                    <div key={key} className={` ${String(permission.name).includes("module") ? "col-span-4 pt-[10px]" : ""}`}>
                                        <Checkbox
                                            highlight={String(permission.name).includes("module")}
                                            label={permission.name}
                                            value={permission.name}
                                            checked={isChecked}
                                            onChange={(e: any) => {
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
                                    </div>
                                );
                            })
                        }
                    </Grid>
                </div>

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end gap-x-2">
                    <div>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                createRole.resetForm();
                            }}
                        />
                    </div>
                    <div>
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