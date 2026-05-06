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
import AccountDropDown from "./BranchAccountDropDown";
import Dropdown from "@/components/common/Dropdown";
import CompanyDropDown from "../../generic/CompanyDropDown";
import RateCodeDropDown from "../../generic/RateCodeDropDown";
import BranchEmployeeDropDown from "../../generic/BranchEmployeeDropDown";
import confirm from "@/components/common/Confirm";
import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";
import RegionDropDown from "../../generic/RegionDropDown";



interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    formValue: any;
};

const SectionDivider = ({ label }: { label: string }) => (
    <div className="mt-4 mb-2 flex items-center gap-3">
        <div className="h-[2px] flex-1 bg-slate-400 dark:bg-neutral-600" />
        <p className="text-sm font-bold uppercase text-slate-600 dark:text-neutral-300">{label}</p>
        <div className="h-[2px] flex-1 bg-slate-400 dark:bg-neutral-600" />
    </div>
);

const EditBranchForm = ({
    modal,
    onSubmitCallback,
    formValue
}: FormModalInterface) => {

    const { permissions } = useContext(AuthContext); 
    const canEditAllBranches = permissions.includes("edit_branches_all");
    const canEditBranchOic = canEditAllBranches || permissions.includes("edit_branches_oic");
    const oicEditableFields = [
        "branch_head_employee_number",
        "branch_head_date_appointed",
        "kitchen_oic_employee_number",
        "kitchen_oic_date_appointed",
        "kitchen_oic_2_employee_number",
        "kitchen_oic_2_date_appointed",
        "group_head_employee_number",
        "mancom_employee_number",
    ];

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
            branch_head_date_appointed: "",
            group_head_employee_number: "",
            rate_code: "",
            kitchen_oic_employee_number: "",
            kitchen_oic_date_appointed: "",
            kitchen_oic_2_employee_number: "",
            kitchen_oic_2_date_appointed: "",
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
        validationSchema: Yup.object().shape(canEditAllBranches ? {
            name: Yup.string().required("Branch name is required."),
            branch_number: Yup.string().required("Branch number is required."),
            branch_email: Yup.string().required("Branch email is required."),
            status: Yup.string().required("Status is required."),
            short_name: Yup.string().required("Short name is required."),
            type: Yup.string().required("Type is required."),
            address: Yup.string().required("Address is required."),
            location: Yup.string().required("Region is required."),
            date_open: Yup.string().required("Date opened is required."),
            company: Yup.string().required("Company is required."),
            rate_code: Yup.string().required("Rate code is required."),
        } : {}),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            if (!canEditBranchOic) {
                toast.error("You do not have permission to edit branches.");
                return;
            }

            const isConfirmed = await confirm({
                title: "Edit Branch",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                const payload = canEditAllBranches
                    ? values
                    : Object.fromEntries(
                        Object.entries(values).filter(([key]) => oicEditableFields.includes(key))
                    );

                editBranch(payload, formValue.id)
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

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const getDateAppointedMin = (
        employeeNumber?: string | null,
        originalEmployeeNumber?: string | null,
        originalDateAppointed?: string | null
    ) => {
        if (
            employeeNumber
            && originalEmployeeNumber
            && employeeNumber === originalEmployeeNumber
            && originalDateAppointed
        ) {
            return originalDateAppointed;
        }

        return getCurrentDate();
    };

    const handleOicChange = (
        e: any,
        employeeField: string,
        dateField: string,
        originalEmployeeNumber?: string | null,
        originalDateAppointed?: string | null
    ) => {
        const employeeNumber = e.target.value || "";
        const previousEmployeeNumber = originalEmployeeNumber || "";
        const previousDateAppointed = originalDateAppointed || "";
        const dateAppointed = !employeeNumber
            ? ""
            : (employeeNumber === previousEmployeeNumber ? previousDateAppointed : getCurrentDate());

        editBranchFormHandler.setFieldValue(employeeField, employeeNumber);
        editBranchFormHandler.setFieldValue(dateField, dateAppointed);
    };

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
                        disabled={!canEditAllBranches}
                    />
                    <Textfield
                        label="Short Name"
                        placeholder="enter short name"
                        name="short_name"
                        value={editBranchFormHandler.values.short_name}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.short_name}
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
                    />
                    <Textfield
                        label="Address"
                        placeholder="enter address"
                        name="address"
                        value={editBranchFormHandler.values.address}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.address}
                        disabled={!canEditAllBranches}
                    />
                </Grid>
                <Grid cols={2}>
                    <RegionDropDown
                        label="Region"
                        placeholder="select region"
                        name="location"
                        value={editBranchFormHandler.values.location}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.location}
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
                        
                    />
                    <Textfield
                        label="Branch Email"
                        placeholder="enter branch email"
                        name="branch_email"
                        value={editBranchFormHandler.values.branch_email}
                        required
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.branch_email}
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
                    />
                </Grid>
                <SectionDivider label="Branch OIC" />
                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Branch OIC"
                        placeholder="select branch oic"
                        name="branch_head_employee_number"
                        value={editBranchFormHandler.values.branch_head_employee_number || ""}
                        onChange={(e: any) => handleOicChange(
                            e,
                            "branch_head_employee_number",
                            "branch_head_date_appointed",
                            formValue?.branch_head_employee_number,
                            formValue?.branch_head_date_appointed
                        )}
                        error={editBranchFormHandler.errors.branch_head_employee_number}
                        disabled={!canEditBranchOic}
                        allowClear
                    />
                    <Textfield
                        label="Date Appointed"
                        placeholder="date appointed"
                        name="branch_head_date_appointed"
                        type="date"
                        value={editBranchFormHandler.values.branch_head_date_appointed || ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.branch_head_date_appointed}
                        disabled={
                            !canEditBranchOic
                            || !editBranchFormHandler.values.branch_head_employee_number
                        }
                    />
                </Grid>
                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Kitchen OIC"
                        placeholder="select kitchen oic"
                        name="kitchen_oic_employee_number"
                        value={editBranchFormHandler.values.kitchen_oic_employee_number || ""}
                        onChange={(e: any) => handleOicChange(
                            e,
                            "kitchen_oic_employee_number",
                            "kitchen_oic_date_appointed",
                            formValue?.kitchen_oic_employee_number,
                            formValue?.kitchen_oic_date_appointed
                        )}
                        error={editBranchFormHandler.errors.kitchen_oic_employee_number}
                        disabled={!canEditBranchOic}
                        allowClear
                    />
                    <Textfield
                        label="Date Appointed"
                        placeholder="date appointed"
                        name="kitchen_oic_date_appointed"
                        type="date"
                        value={editBranchFormHandler.values.kitchen_oic_date_appointed || ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.kitchen_oic_date_appointed}
                        disabled={
                            !canEditBranchOic
                            || !editBranchFormHandler.values.kitchen_oic_employee_number
                        }
                    />
                </Grid>
                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Kitchen OIC 2"
                        placeholder="select kitchen oic 2"
                        name="kitchen_oic_2_employee_number"
                        value={editBranchFormHandler.values.kitchen_oic_2_employee_number || ""}
                        onChange={(e: any) => handleOicChange(
                            e,
                            "kitchen_oic_2_employee_number",
                            "kitchen_oic_2_date_appointed",
                            formValue?.kitchen_oic_2_employee_number,
                            formValue?.kitchen_oic_2_date_appointed
                        )}
                        error={editBranchFormHandler.errors.kitchen_oic_2_employee_number}
                        disabled={!canEditBranchOic}
                        allowClear
                    />
                    <Textfield
                        label="Date Appointed"
                        placeholder="date appointed"
                        name="kitchen_oic_2_date_appointed"
                        type="date"
                        value={editBranchFormHandler.values.kitchen_oic_2_date_appointed || ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.kitchen_oic_2_date_appointed}
                        disabled={
                            !canEditBranchOic
                            || !editBranchFormHandler.values.kitchen_oic_2_employee_number
                        }
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
                        disabled={!canEditBranchOic}
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
                        disabled={!canEditBranchOic}
                        allowClear
                    />
                </Grid>

                <SectionDivider label="Timekeeping" />
                <Grid cols={2}>
                    <Textfield
                        type="number"
                        label="Travel Time"
                        placeholder="enter travel time"
                        name="travel_time"
                        value={editBranchFormHandler.values.travel_time ?? ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.travel_time}
                        disabled={!canEditAllBranches}
                    />
                    <Textfield
                        label="Device Name"
                        placeholder="enter device name"
                        name="device_name"
                        value={editBranchFormHandler.values.device_name ?? ""}
                        onChange={editBranchFormHandler.handleChange}
                        error={editBranchFormHandler.errors.device_name}
                        disabled={!canEditAllBranches}
                        
                    />
                </Grid>

                <SectionDivider label="Accounts" />
                <Grid cols={2}>
                    <AccountDropDown
                        label="Expense Debit"
                        placeholder="select debit account"
                        name="expense_debit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.expense_debit}
                        error={editBranchFormHandler.errors.expense_debit}
                        required
                        disabled={!canEditAllBranches}
                    />
                    <AccountDropDown
                        label="Expense credit"
                        placeholder="select credit account"
                        name="expense_credit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.expense_credit}
                        error={editBranchFormHandler.errors.expense_credit}
                        required
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
                    />
                    <AccountDropDown
                        label="Advance credit"
                        placeholder="select credit account"
                        name="advance_credit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.advance_credit}
                        error={editBranchFormHandler.errors.advance_credit}
                        required
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
                    />
                    <AccountDropDown
                        label="13th Monthly Allocation (HO/HO) Debit"
                        placeholder="select debit account"
                        name="ho_13th_debit_1"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.ho_13th_debit_1}
                        error={editBranchFormHandler.errors.ho_13th_debit_1}
                        required
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
                    />
                    <AccountDropDown
                        label="13th Monthly Allocation (Branch/HO) Debit"
                        placeholder="select debit account"
                        name="branch_ho_13th_debit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.branch_ho_13th_debit}
                        error={editBranchFormHandler.errors.branch_ho_13th_debit}
                        required
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
                    />
                    <AccountDropDown
                        label="13th Monthly Allocation (Branch/HO) Credit"
                        placeholder="select credit account"
                        name="branch_ho_13th_credit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.branch_ho_13th_credit}
                        error={editBranchFormHandler.errors.branch_ho_13th_credit}
                        required
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
                    />
                    <AccountDropDown
                        label="Statutory Allocation (Branch/HO) Credit"
                        placeholder="select credit account"
                        name="branch_ho_stat_credit"
                        onChange={editBranchFormHandler.handleChange}
                        value={editBranchFormHandler.values.branch_ho_stat_credit}
                        error={editBranchFormHandler.errors.branch_ho_stat_credit}
                        required
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
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
                        disabled={!canEditAllBranches}
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
