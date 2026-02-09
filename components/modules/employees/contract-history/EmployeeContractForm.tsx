"use client";

import Modal from "@/components/common/Modal"
import Textfield from "@/components/common/Textfield"
import TextArea from "@/components/common/TextArea"
import Button from "@/components/common/Button"
import { useFormik } from "formik"
import * as Yup from "yup";
import { addEmployeeContract, updateEmployeeContract } from "@/api/employee"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ActiveInactiveDropDown from "../../generic/ActiveInactiveDropDown";
import confirm from "@/components/common/Confirm";
import moment from "moment";
import EmploymentStatusDropdown from "../../generic/EmploymentStatusDropDown";

interface FormModalInterface {
    modal: any;
    onSubmitCallback: () => void;
    action: "edit" | "add";
    data: any;
    validationData: any;
    onCloseCallback: () => void;
};

const EmployeeContractForm = ({
    modal,
    onSubmitCallback,
    action,
    data = {
        contract_end_date: "1900-01-01",
        contract_start_date: "1900-01-01",
    },
    validationData,
    onCloseCallback
}: FormModalInterface) => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = action === "add" ? addEmployeeContract : updateEmployeeContract;
    const valData = action === "edit" && validationData ? validationData : {}

    const formHandler = useFormik({
        initialValues: {
            id: "",
            status: "active",
            contract_number: "",
            contract_start_date: "",
            contract_end_date: "",
            remarks: "",
            employee_status: "",
            employment_status: "",
            separation_reason: "",
            separation_date: "",
            regularization_date: ""
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            contract_start_date: Yup.string()
                .required('Contract start date is required')
                .test(
                'future-date',
                `Contract start date must be after ${data.contract_end_date}`,
                function (value) {
                    if (!value || !data.contract_end_date) return true;

                    if (action === "edit") {
                        return true;
                    }

                    return moment(value).isAfter(moment(data.contract_end_date));
                }),
            contract_end_date: Yup.string()
                .required('Contract end date is required')
                .test(
                'future-date',
                'Contract end date must be later than start date',
                function (value) {
                    const { contract_start_date } = this.parent;
                    if (!value || !contract_start_date) return true;

                    return moment(value).isAfter(moment(contract_start_date));
                }),
            status: Yup.string().required("Status is required"),
            employee_status: Yup.string().when("status", (status, schema) => 
                String(status) === "inactive" && action === "edit" && data.status === "active"
                    ? schema.required('Employee Status is required')
                    : schema.notRequired()
            ),
            employment_status:Yup.string().when("employee_status", (status, schema) => 
                String(status) === "active" && action === "edit" && data.status === "active"
                    ? schema.required('Employment Status is required')
                    : schema.notRequired()
            ),
            regularization_date:Yup.string().when(["employee_status", "employment_status"], ([employee_status, employment_status], schema) => 
                String(employee_status) === "active" && action === "edit" && Number(employment_status) === 2 && data.status === "active"
                    ? schema.required('Regularization Date is required')
                    : schema.notRequired()
            )
            .test(
                'future-date',
                `Regularization date must be after ${valData.contract_end_date}`,
                function (value) {
                    if (!value || !valData.contract_end_date) return true;

                    if (action === "add") {
                        return true;
                    }

                    if (Object.entries(valData).length === 0) {
                        return true;
                    }
                    return moment(value).isAfter(moment(valData.contract_end_date));
                }),
            separation_reason:Yup.string().when("employee_status", (status, schema) => 
                String(status) === "inactive" && action === "edit" && data.status === "active"
                    ? schema.required('Separation Reason is required')
                    : schema.notRequired()
            ),
            separation_date:Yup.string().when("employee_status", (status, schema) => 
                String(status) === "inactive" && action === "edit" && data.status === "active"
                    ? schema.required('Separation Date is required')
                    : schema.notRequired()
            ),
        }),
        onSubmit: async (values, {resetForm, setSubmitting}) => {
            const isConfirmed = await confirm({
                title: "Contract",
                message: "Are you sure you want to save?"
            });
            if (isConfirmed) {
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
                });
            }
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
                onCloseCallback();
            }}
            title={ action === "add" ? "Add Contract" : "Edit Contract"}
            size="md"
        >    
        <form onSubmit={formHandler.handleSubmit}>
            <Textfield
                type="date"
                label="Contract Start Date"
                required
                name="contract_start_date"
                value={formHandler.values.contract_start_date || ""}
                error={formHandler.errors.contract_start_date}
                onChange={formHandler.handleChange}
            />
            <Textfield
                type="date"
                label="Contract End Date"
                required
                name="contract_end_date"
                value={formHandler.values.contract_end_date || ""}
                error={formHandler.errors.contract_end_date}
                onChange={formHandler.handleChange}
            />
            <TextArea
                label="Remarks"
                name="remarks"
                placeholder="enter remarks"
                value={formHandler.values.remarks || ""}
                error={formHandler.errors.remarks}
                onChange={formHandler.handleChange}
            />
            <ActiveInactiveDropDown
                label="Contract Status"
                name="status"
                placeholder="enter status"
                value={formHandler.values.status || ""}
                error={formHandler.errors.status}
                onChange={formHandler.handleChange}
                required
            />

            { ( data.status === "active" && action === "edit" && formHandler.values.status === "inactive" ) &&
                <>
                    <p className=" pt-3 font-semibold text-gray-500">Update Employee Details</p>
                    <ActiveInactiveDropDown
                        label="Employee Status"
                        name="employee_status"
                        placeholder="enter status"
                        value={formHandler.values.employee_status || ""}
                        error={formHandler.errors.employee_status}
                        onChange={(e) => {
                            formHandler.handleChange(e);
                            if (e.target.value === "active") {
                                formHandler.setFieldValue("separation_reason", "");
                                formHandler.setFieldValue("separation_date", "");
                            } else {
                                formHandler.setFieldValue("employment_status", "");
                                formHandler.setFieldValue("regularization_date", "");                      
                            }
                        }}
                        required
                    />
                    { formHandler.values.employee_status === "active" &&
                        <>
                            <EmploymentStatusDropdown
                                label="Employment Status"
                                name="employment_status"
                                placeholder="enter status"
                                value={formHandler.values.employment_status || ""}
                                error={formHandler.errors.employment_status}
                                onChange={(e) => {
                                    formHandler.handleChange(e);
                                    if (Number(e.target.value) !== 2) {
                                        formHandler.setFieldValue("regularization_date", ""); 
                                    }
                                }}
                                required
                                type="active"
                            />

                            { Number(formHandler.values.employment_status) === 2 &&
                                <Textfield
                                    type="date"
                                    label="Regularization Date"
                                    required
                                    name="regularization_date"
                                    value={formHandler.values.regularization_date || ""}
                                    error={formHandler.errors.regularization_date}
                                    onChange={formHandler.handleChange}
                                />
                                
                            }
                        </>
                    }
                    { formHandler.values.employee_status === "inactive" &&
                        <>
                            <EmploymentStatusDropdown
                                label="Separation Reason"
                                name="separation_reason"
                                placeholder="enter status"
                                value={formHandler.values.separation_reason || ""}
                                error={formHandler.errors.separation_reason}
                                onChange={formHandler.handleChange}
                                required
                                type="inactive"
                            />

                            <Textfield
                                type="date"
                                label="Separation Date"
                                required
                                name="separation_date"
                                value={formHandler.values.separation_date || ""}
                                error={formHandler.errors.separation_date}
                                onChange={formHandler.handleChange}
                            />
                        </>
                    }
                </>
            }

            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end gap-x-2">
                <div>
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                            formHandler.resetForm();
                        }}
                    />
                </div>     
                <div>
                    <Button
                        type="submit"
                        label="Submit"
                        onClick={() => {}}
                    />         
                </div>
            </div>
        </form>
        </Modal>
    );
};

export default EmployeeContractForm;