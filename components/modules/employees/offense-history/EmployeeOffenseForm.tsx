"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeOffense, updateEmployeeOffense } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Dropdown from "@/components/common/Dropdown";
import Grid from "@/components/common/Grid";
import OffenseDropDown from "../../generic/OffenseDropDown";
import OffenseActionDropDown from "../../generic/OffenseActionDropDown";
import SanctionDropDown from "../../generic/SanctionDropDown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const EmployeeOffenseForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = action === "add" ? addEmployeeOffense : updateEmployeeOffense; 

    const formHandler = useFormik({
        initialValues: {
            id: "",
            offense_id : "",
            sanction_id : "",
            transgression : "",
            repetition : "",
            summary : "",
            date_committed : "",
            offense_action : "",
            date_served_ao : "",
            suspension_dates : "",
            date_served_da : "",
            remarks : "",
            attachment : "",
            attachment_file_name : "",
            attached_file : "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            offense_id : Yup.string().required("Offense is required."),
            sanction_id : Yup.string().required("Sanction is required."),
            transgression : Yup.string().required("Transgression is required."),
            repetition : Yup.string().required("Repetition is required."),
            summary : Yup.string().required("Summary is required."),
            date_committed : Yup.string().required("Date committed is required."),
            offense_action : Yup.string().required("Offense action is required."),
            date_served_ao : Yup.string().required("Date served of AO is required."),
            suspension_dates : Yup.string().required("Suspension dates is required."),
            date_served_da : Yup.string().required("Date served of DA is required."),
            remarks : Yup.string().required("Remarks is required."),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            api(String(employeeNumber), values)
            .then((resp) => {
                if (!resp.error) {
                    toast.success(resp.data.message);
                    resetForm();
                    onSubmitCallback();
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered")
            }).finally(() => {
                setSubmitting(false);
            })
        }
    });

    useEffect(() => {
        if (action === "edit" && modal.isShowing) {
            formHandler.setValues(data);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={() => {
                modal.onClose();
                formHandler.resetForm();
            }}
            title={ action === "add" ? "Add Offense" : "Edit Offense"}
            size="lg"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <Grid cols={2}>
                <OffenseDropDown
                    label="Offense"
                    required
                    name="offense_id"
                    value={Number(formHandler.values.offense_id) || ""}
                    error={formHandler.errors.offense_id}
                    onChange={formHandler.handleChange}
                    placeholder="select offense"
                />
                <Dropdown
                    label="Transgression"
                    required
                    name="transgression"
                    value={formHandler.values.transgression || ""}
                    error={formHandler.errors.transgression}
                    onChange={formHandler.handleChange}
                    placeholder="select transgression"
                    options={[
                        {label: "1st Degree", value: "1st Degree"},
                        {label: "2nd Degree", value: "2nd Degree"},
                        {label: "3rd Degree", value: "3rd Degree"},
                        {label: "4th Degree", value: "4th Degree"},
                        {label: "5th Degree", value: "5th Degree"},
                    ]}
                />
                <Dropdown
                    label="Repetition"
                    required
                    name="repetition"
                    placeholder="select repetition"
                    value={formHandler.values.repetition || ""}
                    error={formHandler.errors.repetition}
                    onChange={formHandler.handleChange}
                    options={[
                        {label: "1st", value: "1st"},
                        {label: "2nd", value: "2nd"},
                        {label: "3rd", value: "3rd"},
                        {label: "4th", value: "4th"},
                        {label: "5th", value: "5th"},
                        {label: "6th", value: "6th"},
                        {label: "7th", value: "7th"},
                        {label: "8th", value: "8th"},
                    ]}
                />
            </Grid>
            <TextArea
                label="Summary"
                name="summary"
                placeholder="enter summary"
                value={formHandler.values.summary || ""}
                error={formHandler.errors.summary}
                onChange={formHandler.handleChange}
                required
            />
            <Grid
                cols={2}
            >
                <OffenseActionDropDown
                    label="Offense Action"
                    required
                    name="offense_action"
                    value={formHandler.values.offense_action || ""}
                    error={formHandler.errors.offense_action}
                    onChange={formHandler.handleChange}
                    placeholder="select offense action"
                />
                <Textfield
                    type="date"
                    label="Date Committed"
                    required
                    name="date_committed"
                    value={formHandler.values.date_committed || ""}
                    error={formHandler.errors.date_committed}
                    onChange={formHandler.handleChange}
                />
                <Textfield
                    type="date"
                    label="Date Served of AO"
                    required
                    name="date_served_ao"
                    value={formHandler.values.date_served_ao || ""}
                    error={formHandler.errors.date_served_ao}
                    onChange={formHandler.handleChange}
                />
                <SanctionDropDown
                    label="Sanction"
                    required
                    name="sanction_id"
                    value={ Number(formHandler.values.sanction_id) || ""}
                    error={formHandler.errors.sanction_id}
                    onChange={formHandler.handleChange}
                    placeholder="select sanction"
                />
                <Textfield
                    type="date"
                    label="Date Served of DA"
                    required
                    name="date_served_da"
                    value={formHandler.values.date_served_da || ""}
                    error={formHandler.errors.date_served_da}
                    onChange={formHandler.handleChange}
                />
            </Grid>
            <TextArea
                label="Suspension Dates"
                name="suspension_dates"
                placeholder="enter suspension dates"
                value={formHandler.values.suspension_dates || ""}
                error={formHandler.errors.suspension_dates}
                onChange={formHandler.handleChange}
                required
            />
            <TextArea
                label="Remarks"
                name="remarks"
                placeholder="enter remarks"
                value={formHandler.values.remarks || ""}
                error={formHandler.errors.remarks}
                onChange={formHandler.handleChange}
                required
            />
            { action === "edit" &&
                <Textfield
                    type="file"
                    label="Attachment"
                    name="attachment"
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                            formHandler.setFieldValue("attachment", file);
                        }
                    }}
                />
            }
            { formHandler.values.attachment &&
                <a
                    href={`${formHandler.values.attached_file}`}
                    target="_blank"
                    download={formHandler.values.attachment_file_name}
                    className="text-blue-700 underline"
                >
                    {formHandler.values.attachment_file_name}
                </a>
            }
            <Button
                loading={formHandler.isSubmitting}
                onClick={() => {}}
                label="Submit"
                type="submit"
            />
        </form>
        </Modal>
    );
};

export default EmployeeOffenseForm;