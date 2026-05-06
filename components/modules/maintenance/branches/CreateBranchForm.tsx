"use client";

import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import { createBranch } from "@/api/branches";
import AccountDropDown from "../../generic/AccountDropDown";
import Dropdown from "@/components/common/Dropdown";
import CompanyDropDown from "../../generic/CompanyDropDown";
import BranchEmployeeDropDown from "../../generic/BranchEmployeeDropDown";
import Grid from "@/components/common/Grid";
import RateCodeDropDown from "../../generic/RateCodeDropDown";
import confirm from "@/components/common/Confirm";
import RegionDropDown from "../../generic/RegionDropDown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const SectionDivider = ({ label }: { label: string }) => (
    <div className="mt-4 mb-2 flex items-center gap-3">
        <div className="h-[2px] flex-1 bg-slate-400 dark:bg-neutral-600" />
        <p className="text-sm font-bold uppercase text-slate-600 dark:text-neutral-300">{label}</p>
        <div className="h-[2px] flex-1 bg-slate-400 dark:bg-neutral-600" />
    </div>
);

const CreateBranchForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {

    const createBranchFormHandler = useFormik({
        initialValues: {
            name : "" ,
            branch_email : "" ,
            status : "active" ,
            travel_time : "",
            device_name : "",
            short_name : "" ,
            type : "",
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
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Branch name is required."),
            branch_email: Yup.string().required("Branch email is required."),
            status: Yup.string().required("Status is required."),
            //travel_time: Yup.string().required("Travel time is required."),
            //device_name: Yup.string().required("Device name is required."),
            short_name: Yup.string().required("Short name is required."),
            type: Yup.string().required("Type is required."),
            address: Yup.string().required("Address is required."),
            location: Yup.string().required("Region is required."),
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
                title: "Create Branch",
                message: "Are you sure you want to create?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                createBranch(values)
                .then((resp) => {
                    if(!resp.error) {
                        toast.success("Branch created successfully");
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

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleOicChange = (
        e: any,
        employeeField: string,
        dateField: string
    ) => {
        const employeeNumber = e.target.value || "";

        createBranchFormHandler.setFieldValue(employeeField, employeeNumber);
        createBranchFormHandler.setFieldValue(dateField, employeeNumber ? getCurrentDate() : "");
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Create New Branch"
            onClose={() => {
                modal.onClose();
                createBranchFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="lg"
        >
            <form onSubmit={createBranchFormHandler.handleSubmit}>
                <Grid cols={2}>
                    <Textfield
                        label="Branch Name"
                        placeholder="enter branch name"
                        name="name"
                        value={createBranchFormHandler.values.name}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.name}
                    />
                    <Textfield
                        label="Short Name"
                        placeholder="enter short name"
                        name="short_name"
                        value={createBranchFormHandler.values.short_name}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.short_name}
                    />
                </Grid>
                <Grid
                    cols={2}
                >
                    <Textfield
                        label="Address"
                        placeholder="enter address"
                        name="address"
                        value={createBranchFormHandler.values.address}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.address}
                    />
                    <RegionDropDown
                        label="Region"
                        placeholder="select region"
                        name="location"
                        value={createBranchFormHandler.values.location}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.location}
                    />
                </Grid>
                <Grid
                    cols={2}
                >
                    <Textfield
                        label="Date Opened"
                        placeholder="enter date opened"
                        name="date_open"
                        type="date"
                        value={createBranchFormHandler.values.date_open}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.date_open}
                    />
                    <CompanyDropDown
                        label="Company"
                        placeholder="select company"
                        name="company"
                        value={createBranchFormHandler.values.company}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.company}
                    />
                </Grid>
                <Grid cols={2}>
                    <Textfield
                        label="Branch Email"
                        placeholder="enter branch email"
                        name="branch_email"
                        value={createBranchFormHandler.values.branch_email}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.branch_email}
                    />
                    <RateCodeDropDown
                        label="Rate Code"
                        placeholder="select rate code"
                        name="rate_code"
                        value={createBranchFormHandler.values.rate_code}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.rate_code}
                    />
                </Grid>

                <SectionDivider label="Branch OIC" />
                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Branch OIC"
                        placeholder="select branch oic"
                        name="branch_head_employee_number"
                        value={createBranchFormHandler.values.branch_head_employee_number}
                        onChange={(e: any) => handleOicChange(
                            e,
                            "branch_head_employee_number",
                            "branch_head_date_appointed"
                        )}
                        error={createBranchFormHandler.errors.branch_head_employee_number}
                        allowClear
                    />
                    <Textfield
                        label="Date Appointed"
                        placeholder="date appointed"
                        name="branch_head_date_appointed"
                        type="date"
                        value={createBranchFormHandler.values.branch_head_date_appointed || ""}
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.branch_head_date_appointed}
                        disabled={!createBranchFormHandler.values.branch_head_employee_number}
                    />
                </Grid>

                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Kitchen OIC"
                        placeholder="select kitchen oic"
                        name="kitchen_oic_employee_number"
                        value={createBranchFormHandler.values.kitchen_oic_employee_number}
                        onChange={(e: any) => handleOicChange(
                            e,
                            "kitchen_oic_employee_number",
                            "kitchen_oic_date_appointed"
                        )}
                        error={createBranchFormHandler.errors.kitchen_oic_employee_number}
                        allowClear
                    />
                    <Textfield
                        label="Date Appointed"
                        placeholder="date appointed"
                        name="kitchen_oic_date_appointed"
                        type="date"
                        value={createBranchFormHandler.values.kitchen_oic_date_appointed || ""}
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.kitchen_oic_date_appointed}
                        disabled={!createBranchFormHandler.values.kitchen_oic_employee_number}
                    />
                </Grid>

                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Kitchen OIC 2"
                        placeholder="select kitchen oic 2"
                        name="kitchen_oic_2_employee_number"
                        value={createBranchFormHandler.values.kitchen_oic_2_employee_number}
                        onChange={(e: any) => handleOicChange(
                            e,
                            "kitchen_oic_2_employee_number",
                            "kitchen_oic_2_date_appointed"
                        )}
                        error={createBranchFormHandler.errors.kitchen_oic_2_employee_number}
                        allowClear
                    />
                    <Textfield
                        label="Date Appointed"
                        placeholder="date appointed"
                        name="kitchen_oic_2_date_appointed"
                        type="date"
                        value={createBranchFormHandler.values.kitchen_oic_2_date_appointed || ""}
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.kitchen_oic_2_date_appointed}
                        disabled={!createBranchFormHandler.values.kitchen_oic_2_employee_number}
                    />
                </Grid>

                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Group Head"
                        placeholder="select group head"
                        name="group_head_employee_number"
                        value={createBranchFormHandler.values.group_head_employee_number}
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.group_head_employee_number}
                        allowClear
                    />
                </Grid>

                <Grid cols={2}>
                    <BranchEmployeeDropDown
                        label="Mancom"
                        placeholder="select mancom"
                        name="mancom_employee_number"
                        value={createBranchFormHandler.values.mancom_employee_number}
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.mancom_employee_number}
                        allowClear
                    />
                </Grid>

                <p className="mt-3">Timekeeping</p>
                <Grid
                    cols={2}
                >
                    <Textfield
                        type="number"
                        label="Travel Time"
                        placeholder="enter travel time"
                        name="travel_time"
                        value={createBranchFormHandler.values.travel_time}
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.travel_time}
                    />
                    <Textfield
                        label="Device Name"
                        placeholder="enter device name"
                        name="device_name"
                        value={createBranchFormHandler.values.device_name}
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.device_name}
                    />
                </Grid>

                <p className="mt-3">Accounts</p>
                <Grid cols={2}>
                    <AccountDropDown
                        label="Expense Debit"
                        placeholder="select debit account"
                        name="expense_debit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.expense_debit}
                        error={createBranchFormHandler.errors.expense_debit}
                        required
                    />
                    <AccountDropDown
                        label="Expense Credit"
                        placeholder="select credit account"
                        name="expense_credit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.expense_credit}
                        error={createBranchFormHandler.errors.expense_credit}
                        required
                    />
                </Grid>

                <Grid cols={2}>
                    <AccountDropDown
                        label="Advance Debit"
                        placeholder="select debit account"
                        name="advance_debit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.advance_debit}
                        error={createBranchFormHandler.errors.advance_debit}
                        required
                    />
                    <AccountDropDown
                        label="Advance Credit"
                        placeholder="select credit account"
                        name="advance_credit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.advance_credit}
                        error={createBranchFormHandler.errors.advance_credit}
                        required
                    />
                </Grid>

                <Grid cols={2}>
                    <AccountDropDown
                        label="13th Monthly Allocation (HO/HO) Debit"
                        placeholder="select debit account"
                        name="ho_13th_debit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.ho_13th_debit}
                        error={createBranchFormHandler.errors.ho_13th_debit}
                        required
                    />
                    <AccountDropDown
                        label="13th Monthly Allocation (HO/HO) Debit"
                        placeholder="select debit account"
                        name="ho_13th_debit_1"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.ho_13th_debit_1}
                        error={createBranchFormHandler.errors.ho_13th_debit_1}
                        required
                    />
                </Grid>

                <Grid cols={2}>
                    <AccountDropDown
                        label="13th Monthly Allocation (HO/HO) Credit"
                        placeholder="select credit account"
                        name="ho_13th_credit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.ho_13th_credit}
                        error={createBranchFormHandler.errors.ho_13th_credit}
                        required
                    />
                    <AccountDropDown
                        label="13th Monthly Allocation (Branch/HO) Debit"
                        placeholder="select debit account"
                        name="branch_ho_13th_debit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.branch_ho_13th_debit}
                        error={createBranchFormHandler.errors.branch_ho_13th_debit}
                        required
                    />
                </Grid>

                <Grid cols={2}>
                    <AccountDropDown
                        label="13th Monthly Allocation (Branch/HO) Debit"
                        placeholder="select debit account"
                        name="branch_ho_13th_debit_1"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.branch_ho_13th_debit_1}
                        error={createBranchFormHandler.errors.branch_ho_13th_debit_1}
                        required
                    />
                    <AccountDropDown
                        label="13th Monthly Allocation (Branch/HO) Credit"
                        placeholder="select credit account"
                        name="branch_ho_13th_credit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.branch_ho_13th_credit}
                        error={createBranchFormHandler.errors.branch_ho_13th_credit}
                        required
                    />
                </Grid>

                <Grid cols={2}>
                    <AccountDropDown
                        label="Statutory Allocation (Branch/HO) Debit"
                        placeholder="select debit account"
                        name="branch_ho_stat_debit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.branch_ho_stat_debit}
                        error={createBranchFormHandler.errors.branch_ho_stat_debit}
                        required
                    />
                    <AccountDropDown
                        label="Statutory Allocation (Branch/HO) Credit"
                        placeholder="select credit account"
                        name="branch_ho_stat_credit"
                        onChange={createBranchFormHandler.handleChange}
                        value={createBranchFormHandler.values.branch_ho_stat_credit}
                        error={createBranchFormHandler.errors.branch_ho_stat_credit}
                        required
                    />
                </Grid>

                <Grid cols={2}>
                    <Dropdown
                        label="Type"
                        placeholder="select type"
                        name="type"
                        value={createBranchFormHandler.values.type}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.type}
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
                        value={createBranchFormHandler.values.status}
                        required
                        onChange={createBranchFormHandler.handleChange}
                        error={createBranchFormHandler.errors.status}
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
                                createBranchFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={createBranchFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateBranchForm;
