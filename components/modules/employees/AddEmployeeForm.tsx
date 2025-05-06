"use client";

import Card from "@/components/common/Card";
import Grid from "@/components/common/Grid";
import EmployeeTypeDropDown from "../generic/EmployeeTypeDropDown";
import AgencyDropDown from "../generic/AgencyDropDown";
import * as Yup from "yup";
import { useFormik } from "formik";
import Textfield from "@/components/common/Textfield";
import Button from "@/components/common/Button";
import GenderDropDown from "../generic/GenderDropDown";
import BranchDropDown from "../generic/BranchDropDown";
import PositionDropDown from "../generic/PositionDropDown";
import { addEmployee } from "@/api/employee";
import { toast } from "react-toastify";
import Dropdown from "@/components/common/Dropdown";

const AddEmployeeForm = () => {

    const addEmployeeHandler = useFormik({
        initialValues: {
            type: "",
            agency_id: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            gender: "",
            position_id: "",
            branch_id: "",
            home_branch_id: "",
            date_hired: "",
            birthday: "",
            contact_number: "",
            contract_duration: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            type: Yup.string().required("Type is required"),
            first_name: Yup.string().required("First name is required"),
            last_name: Yup.string().required("Last name is required"),
            gender: Yup.string().required("Gender is required"),
            position_id: Yup.string().required("Position is required"),
            branch_id: Yup.string().required("Branch is required"),
            home_branch_id: Yup.string().required("Home branch is required"),
            date_hired: Yup.string().required("Date hired is required"),
            birthday: Yup.string().required("Birthday is required"),
            contract_duration: Yup.string().required("Contract duration is required"),
            contact_number: Yup.string().required("Contact number is required")
                .min(11, "Minimum of 11 characters")
                .max(13, "Minimum of 13 characters"),
            agency_id: Yup.string().when('type', (type, schema) =>
                String(type) === "agency"
                    ? schema.required('Agency is required')
                    : schema.notRequired())
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            addEmployee(values)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("Employee added successfully");
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

    return (
        <Card>
            <form
                onSubmit={addEmployeeHandler.handleSubmit}
            >
                <Grid
                    cols={2}
                >
                    <EmployeeTypeDropDown
                        label="Type"
                        name="type"
                        placeholder="select type"
                        onChange={addEmployeeHandler.handleChange}
                        value={addEmployeeHandler.values.type}
                        error={addEmployeeHandler.errors.type}
                        required
                    />
                    { addEmployeeHandler.values.type === "agency" &&
                        <AgencyDropDown
                            label="Agency"
                            name="agency_id"
                            placeholder="select agency"
                            onChange={addEmployeeHandler.handleChange}
                            value={addEmployeeHandler.values.agency_id}
                            error={addEmployeeHandler.errors.agency_id}
                            required
                        />
                    }
                </Grid>
                <Textfield
                    label="First name"
                    name="first_name"
                    placeholder="enter first name"
                    onChange={addEmployeeHandler.handleChange}
                    value={addEmployeeHandler.values.first_name}
                    error={addEmployeeHandler.errors.first_name}
                    required
                />
                <Textfield
                    label="Middle name"
                    name="middle_name"
                    placeholder="enter middle name"
                    onChange={addEmployeeHandler.handleChange}
                    value={addEmployeeHandler.values.middle_name}
                    error={addEmployeeHandler.errors.middle_name}
                />
                <Textfield
                    label="Last name"
                    name="last_name"
                    placeholder="enter last name"
                    onChange={addEmployeeHandler.handleChange}
                    value={addEmployeeHandler.values.last_name}
                    error={addEmployeeHandler.errors.last_name}
                    required
                />
                <Grid cols={2}>
                    <GenderDropDown
                        label="Gender"
                        name="gender"
                        placeholder="select gender"
                        onChange={addEmployeeHandler.handleChange}
                        value={addEmployeeHandler.values.gender}
                        error={addEmployeeHandler.errors.gender}
                        required
                    />
                    <Textfield
                        label="Birthday"
                        name="birthday"
                        type="date"
                        placeholder="enter date hired"
                        onChange={addEmployeeHandler.handleChange}
                        value={addEmployeeHandler.values.birthday}
                        error={addEmployeeHandler.errors.birthday}
                        required
                    />
                </Grid>
                <Grid cols={2}>
                    <Textfield
                        label="Contact number"
                        name="contact_number"
                        placeholder="enter contact number"
                        onChange={addEmployeeHandler.handleChange}
                        value={addEmployeeHandler.values.contact_number}
                        error={addEmployeeHandler.errors.contact_number}
                        required
                    />
                    <Textfield
                        label="Date hired"
                        name="date_hired"
                        type="date"
                        placeholder="enter date hired"
                        onChange={addEmployeeHandler.handleChange}
                        value={addEmployeeHandler.values.date_hired}
                        error={addEmployeeHandler.errors.date_hired}
                        required
                    />
                </Grid>
                <Grid
                    cols={2}
                >
                    <BranchDropDown
                        label="Branch"
                        name="branch_id"
                        placeholder="select branch"
                        onChange={addEmployeeHandler.handleChange}
                        value={addEmployeeHandler.values.branch_id}
                        error={addEmployeeHandler.errors.branch_id}
                        required
                    />
                    <BranchDropDown
                        label="Home Branch"
                        name="home_branch_id"
                        placeholder="select branch"
                        onChange={addEmployeeHandler.handleChange}
                        value={addEmployeeHandler.values.home_branch_id}
                        error={addEmployeeHandler.errors.home_branch_id}
                        required
                    />
                </Grid>
                <PositionDropDown
                    label="Position"
                    name="position_id"
                    placeholder="select position"
                    onChange={addEmployeeHandler.handleChange}
                    value={addEmployeeHandler.values.position_id}
                    error={addEmployeeHandler.errors.position_id}
                    required
                />
                <Dropdown
                    label="Contract Duration"
                    name="contract_duration"
                    placeholder="select contract duration"
                    onChange={addEmployeeHandler.handleChange}
                    value={addEmployeeHandler.values.contract_duration}
                    error={addEmployeeHandler.errors.contract_duration}
                    options={[
                        {label: "1", value: "1"},
                        {label: "2", value: "2"},
                        {label: "3", value: "3"},
                        {label: "4", value: "4"},
                        {label: "5", value: "5"},
                        {label: "6", value: "6"},
                        {label: "7", value: "7"},
                        {label: "8", value: "8"},
                        {label: "9", value: "9"},
                        {label: "10", value: "10"},
                        {label: "11", value: "11"},
                        {label: "12", value: "12"},
                    ]}
                    required
                />
                <Grid
                    cols={2}
                >
                    <Button
                        label="Reset"
                        variant="secondary"
                        onClick={() => {
                            addEmployeeHandler.resetForm();
                        }}
                    />
                    <Button
                        type="submit"
                        label="Submit"
                        loading={addEmployeeHandler.isSubmitting}
                        onClick={() => {}}
                    />
                </Grid>
            </form>
        </Card>
    );
};

export default AddEmployeeForm;