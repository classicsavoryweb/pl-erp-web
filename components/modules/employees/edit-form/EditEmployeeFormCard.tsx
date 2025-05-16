"use client";

import { EmployeeContext } from "@/context/EmployeeProvider";
import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import EditEmploymentDetails from "./EditEmploymentDetails";
import EditPersonalDetails from "./EditPersonalDetails";
import EditContactDetails from "./EditContactDetails";
import EditGovernmentIdentification from "./EditGovernmentIdentification";
import OtherDetails from "./OtherDetails";
import EditEmergencyContactDetails from "./EditEmergencyContactDetails";
import EditEducation from "./EditEducation";
import EditDependents from "./EditDependents";
import Button from "@/components/common/Button";
import { updateEmployee } from "@/api/employee";
import { toast } from "react-toastify";

const EditEmployeeFormCard = () => {

    const {employee, loading, triggerReload} = useContext(EmployeeContext);

    const editEmployeeForm = useFormik({
        initialValues: {
            id: "",
            employee_number: "",
            biometric_number: "",
            image: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            civil_status: "",
            gender: "",
            height: "",
            birthday: "",
            birthplace: "",
            address: "",
            provincial_address: "",
            region: "",
            contact_number: "",
            tax_type: "",
            tin: "",
            sss: "",
            philhealth: "",
            pagibig: "",
            referred_by: "",
            remarks: "",
            date_hired: "",
            type: "",
            emergency_contact_name: "",
            emergency_contact_number: "",
            emergency_contact_address: "",
            emergency_contact_relationship: "",
            education_history_id: "",
            agency_id: null,
            employee_status_id: "",
            position_id: "",
            station_id: "",
            branch_id: "",
            home_branch_id: "",
            status: "",
            current_position: {},
            agency: null,
            current_branch: {},
            station: {},
            employee_status: {},
            home_branch: {},
            branches: [],
            positions: [],
            education: {
                employee_id: "",
                employee_number: "",
                college: "",
                college_address: "",
                course: "",
                college_date_started: "",
                college_date_graduated: "",
                highschool: "",
                highschool_address: "",
                highschool_date_started: "",
                highschool_date_graduated: "",
                remarks: null
            },
            dependents: [],
            contracts: []
        },
        validateOnChange: false,
        onSubmit: (values, {setSubmitting}) => {
            setSubmitting(true);
            updateEmployee(employee.employee_number, values)
            .then((resp) => {
                if (!resp.error) {
                    triggerReload();
                    toast.success("Employee record updated successfully.")
                } else {
                    toast.error(resp.data.message);
                }
            }).catch((err) => {
                toast.error("Error encountered")
            }).finally(() => {
                setSubmitting(false);
            });
        }
    });

    useEffect(() => {
        if (!loading) {
            editEmployeeForm.setValues(employee as any);
        }
    }, [employee]);

    return (
        <>
            <form className="w-11/12 " onSubmit={editEmployeeForm.handleSubmit}>
                <div className="flex gap-x-5">
                    <div className="w-7/12">
                        <EditEmploymentDetails
                            loading={loading}
                            formHandler={editEmployeeForm}
                        />
                        <div className="py-[2px]"/>
                        <EditPersonalDetails
                            loading={loading}
                            formHandler={editEmployeeForm}
                        />
                        <div className="py-[2px]"/>
                        <EditContactDetails
                            loading={loading}
                            formHandler={editEmployeeForm}
                        />
                        <div className="py-[2px]"/>
                        <EditDependents
                            loading={loading}
                            formHandler={editEmployeeForm}
                        />
                    </div>
                    <div className="w-5/12">
                        <EditGovernmentIdentification
                            loading={loading}
                            formHandler={editEmployeeForm}
                        />
                        <div className="py-[2px]"/>
                        <EditEducation
                            loading={loading}
                            formHandler={editEmployeeForm}
                        />
                        <div className="py-[2px]"/>
                        <EditEmergencyContactDetails
                            loading={loading}
                            formHandler={editEmployeeForm}
                        />
                        <div className="py-[2px]"/>
                        <OtherDetails
                            loading={loading}
                            formHandler={editEmployeeForm}
                        />
                    </div>
                </div>

                <div className="py-[2px] w-full flex justify-end">
                    <div className="w-1/6">
                        <Button
                            loading={editEmployeeForm.isSubmitting}
                            label="Save changes"
                            type="submit"
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditEmployeeFormCard;