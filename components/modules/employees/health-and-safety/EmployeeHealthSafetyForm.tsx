"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeContract, addEmployeeHealthAndSafety, editEmployeeHealthAndSafety, updateEmployeeContract } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import Dropdown from "@/components/common/Dropdown";
import DiagnosisDropDown from "../../generic/DiagnosisDropDown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
};

const EmployeeHealthSafetyForm = ({
    modal,
    onSubmitCallback,
    action,
    data
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = action === "add" ? addEmployeeHealthAndSafety : editEmployeeHealthAndSafety; 

    const formHandler = useFormik({
        initialValues: {
            id: "",
            employee_id  : "",
            diagnosis_id : "",
            consultation_date : "",
            last_duty_date : "",
            hso : "",
            chief_complaint : "",
            attending_physician : "",
            physician_name : "",
            swab_test : "No",
            swab_test_date : "",
            swab_test_type : "",
            swab_test_result : "",
            return_to_work_date : "",
            quarantine_period_from : "",
            quarantine_period_to : "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            consultation_date: Yup.string().required("Consultation Date is required."),
            hso: Yup.string().required("HSO is required."),
            chief_complaint: Yup.string().required("Chief Complaint is required."),
            attending_physician : Yup.string().required("Attending Physician is required."),
            physician_name : Yup.string().required("Physician Name is required."),
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
            title={ action === "add" ? "Add Health and Safety" : "Edit Health and Safety"}
            size="md"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <Textfield
                type="date"
                label="Consultation Date"
                required
                name="consultation_date"
                value={formHandler.values.consultation_date || ""}
                error={formHandler.errors.consultation_date}
                onChange={formHandler.handleChange}
            />
            <Textfield
                label="HSO"
                required
                placeholder="enter hso"
                name="hso"
                value={formHandler.values.hso || ""}
                error={formHandler.errors.hso}
                onChange={formHandler.handleChange}
            />
            <Textfield
                type="date"
                label="Last Duty Date"
                name="last_duty_date"
                value={formHandler.values.last_duty_date || ""}
                error={formHandler.errors.last_duty_date}
                onChange={formHandler.handleChange}
            />
            <TextArea
                label="Chief Complaint"
                name="chief_complaint"
                placeholder="enter chief complaint"
                value={formHandler.values.chief_complaint || ""}
                error={formHandler.errors.chief_complaint}
                onChange={formHandler.handleChange}
                required
            />
            <Dropdown
                label="Attending Physician"
                name="attending_physician"
                placeholder="select attending physician"
                value={formHandler.values.attending_physician || ""}
                error={formHandler.errors.attending_physician}
                onChange={formHandler.handleChange}
                options ={[
                    {
                        label: "Company Physician Consultant",
                        value: "Company Physician Consultant"
                    },
                    {
                        label: "Other Doctor",
                        value: "Other Doctor"
                    },
                ]}
                required
            />
            <Textfield
                label="Physician Name"
                required
                placeholder="enter physician name"
                name="physician_name"
                value={formHandler.values.physician_name || ""}
                error={formHandler.errors.physician_name}
                onChange={formHandler.handleChange}
            />
            <DiagnosisDropDown
                label="Diagnosis"
                placeholder="select diagnosis"
                name="diagnosis_id"
                value={Number(formHandler.values.diagnosis_id)}
                error={formHandler.errors.diagnosis_id}
                onChange={formHandler.handleChange}
            />
            <Dropdown
                label="Swab Test"
                name="swab_test"
                placeholder="select swab test"
                value={formHandler.values.swab_test}
                error={formHandler.errors.swab_test}
                onChange={formHandler.handleChange}
                options ={[
                    {
                        label: "Yes",
                        value: "Yes"
                    },
                    {
                        label: "No",
                        value: "No"
                    },
                ]}
            />
            { formHandler.values.swab_test === "Yes" &&
                <>
                    <Textfield
                        type="date"
                        label="Swab Test Date"
                        name="swab_test_date"
                        value={formHandler.values.swab_test_date || ""}
                        error={formHandler.errors.swab_test_date}
                        onChange={formHandler.handleChange}
                    />
                    <Dropdown
                        label="Swab Test Type"
                        name="swab_test_type"
                        placeholder="select swab test type"
                        value={formHandler.values.swab_test_type || ""}
                        error={formHandler.errors.swab_test_type}
                        onChange={formHandler.handleChange}
                        options ={[
                            {
                                label: "RT-PCR",
                                value: "RT-PCR"
                            },
                            {
                                label: "Rapid Antigen",
                                value: "Rapid Antigen"
                            },
                        ]}
                    />
                    <Dropdown
                        label="Swab Test Result"
                        name="swab_test_result"
                        placeholder="select swab test result"
                        value={formHandler.values.swab_test_result || ""}
                        error={formHandler.errors.swab_test_result}
                        onChange={formHandler.handleChange}
                        options ={[
                            {
                                label: "Negative",
                                value: "Negative"
                            },
                            {
                                label: "Positive",
                                value: "Positive"
                            },
                        ]}
                    />
                </>
            }

            <Textfield
                type="date"
                label="Quarantine Period From"
                name="quarantine_period_from"
                value={formHandler.values.quarantine_period_from || ""}
                error={formHandler.errors.quarantine_period_from}
                onChange={formHandler.handleChange}
            />
            <Textfield
                type="date"
                label="Quarantine Period To"
                name="quarantine_period_to"
                value={formHandler.values.quarantine_period_to || ""}
                error={formHandler.errors.quarantine_period_to}
                onChange={formHandler.handleChange}
            />
            <Textfield
                type="date"
                label="Date Returned to Work"
                name="return_to_work_date"
                value={formHandler.values.return_to_work_date || ""}
                error={formHandler.errors.return_to_work_date}
                onChange={formHandler.handleChange}
            />
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

export default EmployeeHealthSafetyForm;