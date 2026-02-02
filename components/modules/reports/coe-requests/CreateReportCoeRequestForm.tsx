import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Textfield from "@/components/common/Textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CoeReasonDropDown from "../../generic/CoeReasonDropDown";
import Dropdown from "@/components/common/Dropdown";
import { addReportsCoeRequest } from "@/api/reports/reports-coe-request";
import SearchEmployeeDropDown from "../../generic/SearchEmployeeDropDown";
import Badge from "@/components/common/Badge";
import { useState } from "react";
import TextArea from "@/components/common/TextArea";
import Grid from "@/components/common/Grid";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
};

const CreateReportCoeRequestForm = ({
    modal,
    onSubmitCallback
}: FormModalInterface) => {
    const [employeeStatus, setStatus] = useState<string>("");
    const [employmentStatus, setEmployment] = useState<string>("");
    const createFormHandler = useFormik({
        initialValues: {
            coe_reason: "",
            employee: "",
            coe_format: "Normal Format",
            include_salary: "No",
            employee_number: "",
            places: "",
            leave_from: "",
            leave_to: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            coe_reason: Yup.string().required("COE Reason is required."),
            coe_format: Yup.string().required("COE Format is required."),
            employee_number: Yup.string().required("Employee is required."),
            include_salary: Yup.string().required("Include Salary is required."),
            leave_from: Yup.string().when("coe_reason", (coe_reason, schema) => {
                if ( String(coe_reason) === "Certificate of Leave - Special") {
                    return schema.required("Leave from is required.");
                }
                return schema.notRequired();
            }),
            leave_to: Yup.string().when("coe_reason", (coe_reason, schema) => {
                if ( String(coe_reason) === "Certificate of Leave - Special") {
                    return schema.required("Leave to is required.");
                }
                return schema.notRequired();
            }),
            places: Yup.string().when("coe_reason", (coe_reason, schema) => {
                if (
                    String(coe_reason) === "Travel Purposes only" ||
                    String(coe_reason) === "Certificate of Leave - Special" ||
                    String(coe_reason) === "Travel Purposes - Special"
                ) {
                    return schema.required("Places is required.");
                }
                return schema.notRequired();
            }),
        }),
        onSubmit: (values, {resetForm, setSubmitting}) => {
            setSubmitting(true);
            addReportsCoeRequest(values)
            .then((resp) => {
                if(!resp.error) {
                    toast.success("COE Request created successfully");
                    onSubmitCallback();
                    modal.onClose();
                    setStatus("");
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
        <Modal
            isShowing={modal.isShowing}
            title="Create COE Request"
            onClose={() => {
                modal.onClose();
                createFormHandler.resetForm();
            }}
            loading={modal.loading}
            size="md"
        >
            <form onSubmit={createFormHandler.handleSubmit}>
                <SearchEmployeeDropDown
                    label="Employee"
                    placeholder="select employee"
                    name="employee"
                    required
                    onChange={(e) => {
                        const employeeDetails = e.target.value;
                        setStatus(employeeDetails.status);
                        setEmployment(employeeDetails.employee_status.description);
                        createFormHandler.setFieldValue("employee", employeeDetails);
                        createFormHandler.setFieldValue("coe_format", employeeDetails.status === "active" ? "Normal Format" : "Special Format");
                        createFormHandler.setFieldValue("employee_number", employeeDetails.employee_number);
                        createFormHandler.setFieldValue("coe_reason", "whatever legal purpose it may serve");
                    }}
                    value={createFormHandler.values.employee}
                    error={createFormHandler.errors.employee_number}
                    status="all"
                />
                { createFormHandler.values.employee &&
                    <div className="flex gap-x-2 items-center">
                        <Badge
                            label={employeeStatus}
                            status={employeeStatus === "active" ? "success" : "danger"}
                        />
                        { employeeStatus === "inactive" &&
                            <>
                                <p>-</p>
                                <p>{employmentStatus}</p>
                            </>
                        }
                    </div>
                }
                <Dropdown
                    label="COE Format"
                    placeholder="select format"
                    name="coe_format"
                    value={createFormHandler.values.coe_format}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.coe_format}
                    options={[
                        {
                            label: "Normal Format",
                            value: "Normal Format",
                        },
                        {
                            label: "Special Format",
                            value: "Special Format",
                        },
                    ]}
                    disabled={employeeStatus === "inactive"}
                />
                <Dropdown
                    label="Include Salary"
                    placeholder="select option"
                    name="include_salary"
                    value={createFormHandler.values.include_salary}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.include_salary}
                    options={[
                        {
                            label: "Yes",
                            value: "Yes",
                        },
                        {
                            label: "No",
                            value: "No",
                        },
                    ]}
                    disabled={employeeStatus === "inactive"}
                />
                <CoeReasonDropDown
                    label="COE Reason"
                    placeholder="select reason"
                    name="coe_reason"
                    value={createFormHandler.values.coe_reason}
                    required
                    onChange={createFormHandler.handleChange}
                    error={createFormHandler.errors.coe_reason}
                    disabled={employeeStatus === "inactive"}
                />
                { createFormHandler.values.coe_reason === "Certificate of Leave - Special" &&
                    <Grid
                        cols={2}
                    >
                        <Textfield
                            type="date"
                            label="Date From"
                            name="leave_from"
                            value={createFormHandler.values.leave_from}
                            onChange={createFormHandler.handleChange}
                            error={createFormHandler.errors.leave_from}
                            required
                        />
                        <Textfield
                            type="date"
                            label="Date To"
                            name="leave_to"
                            value={createFormHandler.values.leave_to}
                            onChange={createFormHandler.handleChange}
                            error={createFormHandler.errors.leave_to}
                            required
                        />
                    </Grid>
                } 
                { (
                    createFormHandler.values.coe_reason === "Travel Purposes only" ||
                    createFormHandler.values.coe_reason === "Certificate of Leave - Special" ||
                    createFormHandler.values.coe_reason === "Travel Purposes - Special"
                ) &&
                    <TextArea
                        placeholder="enter places"
                        label="Country/ Place"
                        name="places"
                        value={createFormHandler.values.places}
                        required
                        onChange={createFormHandler.handleChange}
                        error={createFormHandler.errors.places}
                    /> 
                } 

                <hr className="mt-6 pb-2 text-slate-300"/>
                <div className="flex justify-end">
                    <div className="w-1/2 flex justify-end items-center gap-x-2">
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onClick={() => {
                                modal.onClose();
                                setStatus("");
                                createFormHandler.resetForm();
                            }}
                        />

                        <Button
                            type="submit"
                            label="Submit"
                            loading={createFormHandler.isSubmitting}
                            onClick={() => {}}
                        />
                    </div>              
                </div>
            </form>
        </Modal>
    );
};

export default CreateReportCoeRequestForm;