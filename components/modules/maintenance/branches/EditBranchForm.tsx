"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import { editBranch } from "@/api/branches";
import { useEffect } from "react";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const EditBranchForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const editBranchFormHandler = useFormik({
        initialValues: {
            name : "" ,
            branch_number : "" ,
            status : "" ,
            mall_admin : "" ,
            short_name : "" ,
            address : "" ,
            location : "" ,
            date_open : "" ,
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Branch name is required."),
            branch_number: Yup.string().required("Branch number is required."),
            status: Yup.string().required("Status is required."),
            mall_admin: Yup.string().required("Mall admin is required."),
            short_name: Yup.string().required("Short name is required."),
            address: Yup.string().required("Address is required."),
            location: Yup.string().required("Location is required."),
            date_open: Yup.string().required("Date opened is required."),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            editBranch(values, formValue.id)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("Station created successfully");
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
            editBranchFormHandler.setValues(formValue);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Edit branch"
            onClose={() => {
                modal.onClose();
                editBranchFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={editBranchFormHandler.handleSubmit}>
                <Textfield
                    label="Branch name"
                    placeholder="enter branch name"
                    name="name"
                    value={editBranchFormHandler.values.name}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.name}
                />
                <Textfield
                    label="Branch number"
                    placeholder="enter branch number"
                    name="branch_number"
                    value={editBranchFormHandler.values.branch_number}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.branch_number}
                />
                <Textfield
                    label="Mall admin"
                    placeholder="enter mall admin"
                    name="mall_admin"
                    value={editBranchFormHandler.values.mall_admin}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.mall_admin}
                />
                <Textfield
                    label="Short name"
                    placeholder="enter short name"
                    name="short_name"
                    value={editBranchFormHandler.values.short_name}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.short_name}
                />
                <Textfield
                    label="Address"
                    placeholder="enter address"
                    name="address"
                    value={editBranchFormHandler.values.address}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.address}
                />
                <Textfield
                    label="Location"
                    placeholder="enter location"
                    name="location"
                    value={editBranchFormHandler.values.location}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.location}
                />
                <Textfield
                    label="Date opened"
                    placeholder="enter date opened"
                    name="date_open"
                    type="date"
                    value={editBranchFormHandler.values.date_open}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.date_open}
                />
                <ActiveInactiveDropDown
                    label="Status"
                    placeholder="select status"
                    name="status"
                    value={editBranchFormHandler.values.status}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.status}
                />

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                editBranchFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={editBranchFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default EditBranchForm;