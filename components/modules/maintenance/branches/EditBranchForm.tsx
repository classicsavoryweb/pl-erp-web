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
import Grid from "@/components/common/Grid";
import CompanyDropDown from "../../generic/CompanyDropDown";
import RateCodeDropDown from "../../generic/RateCodeDropDown";
import EmployeeDropDown from "../../generic/EmployeeDropDown";

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
            branch_email : "" ,
            status : "" ,
            short_name : "" ,
            address : "" ,
            location : "" ,
            date_open : "" ,
            company : "" ,
            branch_head_employee_number: "",
            group_head_employee_number: "",
            rate_code: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Branch name is required."),
            branch_email: Yup.string().required("Branch email is required."),
            status: Yup.string().required("Status is required."),
            short_name: Yup.string().required("Short name is required."),
            address: Yup.string().required("Address is required."),
            location: Yup.string().required("Location is required."),
            date_open: Yup.string().required("Date opened is required."),
            company: Yup.string().required("Company is required."),
            rate_code: Yup.string().required("Rate code is required."),
            branch_head_employee_number: Yup.string().required("Branch head is required."),
            group_head_employee_number: Yup.string().required("Group head is required.")
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            editBranch(values, formValue.id)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("Branch updated successfully");
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
            size="lg"
        >
            <form onSubmit={editBranchFormHandler.handleSubmit}>
            <Grid cols={2}>
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
                        label="Short name"
                        placeholder="enter short name"
                        name="short_name"
                        value={editBranchFormHandler.values.short_name}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.short_name}
                    />
                </Grid>
                <Grid
                    cols={2}
                >
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
                </Grid>
                <Grid
                    cols={2}
                >
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
                    <CompanyDropDown
                        label="Company"
                        placeholder="select company"
                        name="company"
                        value={editBranchFormHandler.values.company}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.company}
                    />
                </Grid>
                <Grid cols={2}>
                    <Textfield
                        label="Branch email"
                        placeholder="enter branch email"
                        name="branch_email"
                        value={editBranchFormHandler.values.branch_email}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.branch_email}
                    />
                    <RateCodeDropDown
                        label="Rate code"
                        placeholder="select rate code"
                        name="rate_code"
                        value={editBranchFormHandler.values.rate_code}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.rate_code}
                    />
                </Grid>
                <EmployeeDropDown
                    label="Branch head"
                    placeholder="select branch head"
                    name="branch_head_employee_number"
                    value={editBranchFormHandler.values.branch_head_employee_number}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.branch_head_employee_number}
                />
                <EmployeeDropDown
                    label="Group head"
                    placeholder="select group head"
                    name="group_head_employee_number"
                    value={editBranchFormHandler.values.group_head_employee_number}
                    required
                    onChange={editBranchFormHandler.handleChange}
                    error={editBranchFormHandler.errors.group_head_employee_number}
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