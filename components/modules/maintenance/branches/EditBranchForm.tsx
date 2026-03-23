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
import AccountDropDown from "../../generic/AccountDropDown";
import Dropdown from "@/components/common/Dropdown";
import CompanyDropDown from "../../generic/CompanyDropDown";
import RateCodeDropDown from "../../generic/RateCodeDropDown";
import BranchEmployeeDropDown from "../../generic/BranchEmployeeDropDown";
import confirm from "@/components/common/Confirm";
import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";



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

    const { permissions } = useContext(AuthContext); 

    const editBranchFormHandler = useFormik({
        initialValues: {
            name : "" ,
            branch_number : "" ,
            branch_email : "" ,
            status : "" ,
            travel_time : "",
            device_name : "",
            short_name : "" ,
            type : "" ,
            address : "" ,
            location : "" ,
            date_open : "" ,
            company : "" ,
            branch_head_employee_number: "",
            group_head_employee_number: "",
            rate_code: "",
            kitchen_oic_employee_number: "",
            mancom_employee_number: "",
            expense_debit: "",
            expense_credit: "",
            advance_debit: "",
            advance_credit: "",
            ho_13th_debit: "",
            ho_13th_debit_1: "",
            ho_13th_credit: "",
            branch_ho_13th_debit: "",
            branch_ho_13th_debit_1: "",
            branch_ho_13th_credit: "",
            branch_ho_stat_debit: "",
            branch_ho_stat_credit: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Branch name is required."),
            branch_number: Yup.string().required("Branch number is required."),
            branch_email: Yup.string().required("Branch email is required."),
            status: Yup.string().required("Status is required."),
            //travel_time: Yup.string().required("Travel time is required."),
            //device_name: Yup.string().required("Device name is required."),
            short_name: Yup.string().required("Short name is required."),
            type: Yup.string().required("Type is required."),
            address: Yup.string().required("Address is required."),
            location: Yup.string().required("Location is required."),
            date_open: Yup.string().required("Date opened is required."),
            company: Yup.string().required("Company is required."),
            rate_code: Yup.string().required("Rate code is required."),
            // expense_debit: Yup.string().required("Expense debit is required."),
            // expense_credit: Yup.string().required("Expense credit is required."),
            // advance_debit: Yup.string().required("Advance debit is required."),
            // advance_credit: Yup.string().required("Advance credit is required."),
            // ho_13th_debit: Yup.string().required("13th allocation debit is required."),
            // ho_13th_debit_1: Yup.string().required("13th allocation debit is required."),
            // ho_13th_credit: Yup.string().required("13th allocation credit is required."),
            // branch_ho_13th_debit: Yup.string().required("13th allocation debit is required."),
            // branch_ho_13th_debit_1: Yup.string().required("13th allocation debit is required."),
            // branch_ho_13th_credit: Yup.string().required("13th allocation credit is required."),
            // branch_ho_stat_debit: Yup.string().required("Statutory debit is required."),
            // branch_ho_stat_credit: Yup.string().required("Statutory credit is required."),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Edit Branch",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
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
            title="Edit Branch"
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
                        label="Branch Name"
                        placeholder="enter branch name"
                        name="name"
                        value={editBranchFormHandler.values.name}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.name}
                        disabled={!permissions.includes("perform_branches")}
                    />
                    <Textfield
                        label="Short Name"
                        placeholder="enter short name"
                        name="short_name"
                        value={editBranchFormHandler.values.short_name}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.short_name}
                        disabled={!permissions.includes("perform_branches")}
                    />
                </Grid>
                <Grid cols={2}>
                    <Textfield
                        label="Branch Number"
                        placeholder="enter branch number"
                        name="branch_number"
                        value={editBranchFormHandler.values.branch_number}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.branch_number}
                        disabled={!permissions.includes("perform_branches")}
                    />
                    <Textfield
                        label="Address"
                        placeholder="enter address"
                        name="address"
                        value={editBranchFormHandler.values.address}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.address}
                        disabled={!permissions.includes("perform_branches")}
                    />
                </Grid>
                <Grid cols={2}>
                    <Textfield
                        label="Location"
                        placeholder="enter location"
                        name="location"
                        value={editBranchFormHandler.values.location}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.location}
                        disabled={!permissions.includes("perform_branches")}
                    />
                    <Textfield
                        label="Date Opened"
                        placeholder="enter date opened"
                        name="date_open"
                        type="date"
                        value={editBranchFormHandler.values.date_open}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.date_open}
                        disabled={!permissions.includes("perform_branches")}
                    />
                </Grid>
                <Grid cols={2}>
                    <CompanyDropDown
                        label="Company"
                        placeholder="select company"
                        name="company"
                        value={editBranchFormHandler.values.company}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.company}
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                        
                    />
                    <Textfield
                        label="Branch Email"
                        placeholder="enter branch email"
                        name="branch_email"
                        value={editBranchFormHandler.values.branch_email}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.branch_email}
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                </Grid>
                <Grid cols={2}>
                    <RateCodeDropDown
                        label="Rate Code"
                        placeholder="select rate code"
                        name="rate_code"
                        value={editBranchFormHandler.values.rate_code}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.rate_code}
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />

                    <BranchEmployeeDropDown
                        label="Branch OIC"
                        placeholder="select branch oic"
                        name="branch_head_employee_number"
                        value={editBranchFormHandler.values.branch_head_employee_number || ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.branch_head_employee_number}
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                        allowClear
                    />
                </Grid>
                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Group Head"
                        placeholder="select group head"
                        name="group_head_employee_number"
                        value={editBranchFormHandler.values.group_head_employee_number || ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.group_head_employee_number}
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                        allowClear
                    />
                    <BranchEmployeeDropDown
                        label="Kitchen OIC"
                        placeholder="select kitchen oic"
                        name="kitchen_oic_employee_number"
                        value={editBranchFormHandler.values.kitchen_oic_employee_number || ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.kitchen_oic_employee_number}
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                        allowClear
                    />
                </Grid>
                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Mancom"
                        placeholder="select mancom"
                        name="mancom_employee_number"
                        value={editBranchFormHandler.values.mancom_employee_number || ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.mancom_employee_number}
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                        allowClear
                    />
                </Grid>

                <p className="mt-3">Timekeeping</p>
                <Grid cols={2}>
                    <Textfield
                        type="number"
                        label="Travel Time"
                        placeholder="enter travel time"
                        name="travel_time"
                        value={editBranchFormHandler.values.travel_time ?? ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.travel_time}
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                    <Textfield
                        label="Device Name"
                        placeholder="enter device name"
                        name="device_name"
                        value={editBranchFormHandler.values.device_name ?? ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.device_name}
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                        
                    />
                </Grid>

                <p className="mt-3">Accounts</p>
                <Grid cols={2}>
                    <AccountDropDown
                        label="Expense Debit"
                        placeholder="select debit account"
                        name="expense_debit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.expense_debit}
                        error={editBranchFormHandler.errors.expense_debit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                    <AccountDropDown
                        label="Expense credit"
                        placeholder="select credit account"
                        name="expense_credit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.expense_credit}
                        error={editBranchFormHandler.errors.expense_credit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                </Grid>
                <Grid cols={2}>
                    <AccountDropDown
                        label="Advance Debit"
                        placeholder="select debit account"
                        name="advance_debit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.advance_debit}
                        error={editBranchFormHandler.errors.advance_debit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                    <AccountDropDown
                        label="Advance credit"
                        placeholder="select credit account"
                        name="advance_credit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.advance_credit}
                        error={editBranchFormHandler.errors.advance_credit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                </Grid>
                <Grid cols={2}>
                    <AccountDropDown
                        label="13th Monthly Allocation (HO/HO) Debit"
                        placeholder="select debit account"
                        name="ho_13th_debit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.ho_13th_debit}
                        error={editBranchFormHandler.errors.ho_13th_debit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                    <AccountDropDown
                        label="13th Monthly Allocation (HO/HO) Debit"
                        placeholder="select debit account"
                        name="ho_13th_debit_1"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.ho_13th_debit_1}
                        error={editBranchFormHandler.errors.ho_13th_debit_1}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                </Grid>
                <Grid cols={2}>
                    <AccountDropDown
                        label="13th Monthly Allocation (HO/HO) Credit"
                        placeholder="select credit account"
                        name="ho_13th_credit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.ho_13th_credit}
                        error={editBranchFormHandler.errors.ho_13th_credit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                    <AccountDropDown
                        label="13th Monthly Allocation (Branch/HO) Debit"
                        placeholder="select debit account"
                        name="branch_ho_13th_debit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.branch_ho_13th_debit}
                        error={editBranchFormHandler.errors.branch_ho_13th_debit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                </Grid>
                <Grid cols={2}>
                    <AccountDropDown
                        label="13th Monthly Allocation (Branch/HO) Debit"
                        placeholder="select debit account"
                        name="branch_ho_13th_debit_1"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.branch_ho_13th_debit_1}
                        error={editBranchFormHandler.errors.branch_ho_13th_debit_1}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                    <AccountDropDown
                        label="13th Monthly Allocation (Branch/HO) Credit"
                        placeholder="select credit account"
                        name="branch_ho_13th_credit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.branch_ho_13th_credit}
                        error={editBranchFormHandler.errors.branch_ho_13th_credit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                </Grid>

                <Grid cols={2}>
                    <AccountDropDown
                        label="Statutory Allocation (Branch/HO) Debit"
                        placeholder="select debit account"
                        name="branch_ho_stat_debit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.branch_ho_stat_debit}
                        error={editBranchFormHandler.errors.branch_ho_stat_debit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                    <AccountDropDown
                        label="Statutory Allocation (Branch/HO) Credit"
                        placeholder="select credit account"
                        name="branch_ho_stat_credit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.branch_ho_stat_credit}
                        error={editBranchFormHandler.errors.branch_ho_stat_credit}
                        required
                        disabled={!permissions.includes("perform_branches") && !permissions.includes("edit_branches")}
                    />
                </Grid>

                <Grid cols={2}>
                    <Dropdown
                        label="Type"
                        placeholder="select type"
                        name="type"
                        value={editBranchFormHandler.values.type}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.type}
                        disabled={!permissions.includes("perform_branches")}
                        options={[
                            {
                                label: "Head Office",
                                value: "Head Office"
                            },
                            {
                                label: "Branch",
                                value: "Branch"
                            }
                        ]}
                    />
                    <ActiveInactiveDropDown
                        label="Status"
                        placeholder="select status"
                        name="status"
                        value={editBranchFormHandler.values.status}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.status}
                        disabled={!permissions.includes("perform_branches")}
                    />
                </Grid>

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
