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
import confirm from "@/components/common/Confirm";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import EditScheduleDetails from "./EditScheduleDetails";
import { AuthContext } from "@/context/AuthProvider";
import { canEditRestrictedRecords } from "@/helper/restriction";

const EditEmployeeFormCard = () => {

    const {permissions} = useContext(AuthContext);
    const {employee, loading, triggerReload} = useContext(EmployeeContext);
    const router = useRouter();

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
            regularization_date: "",
            separation_reason: "",
            separation_date: "",
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
            contracts: [],
            schedule_type: "",
            incentive_leave: "",
            flexible_schedule: "",
        },
        validateOnChange: false,
        validationSchema: Yup.object().shape({
            employee_status_id: Yup.string(),
            status: Yup.string(),
            regularization_date: Yup.string().when('employee_status_id', (status, schema) => 
                Number(status) === 2
                    ? schema.required('Regularization date is required')
                    : schema.notRequired()
            ),
            separation_reason: Yup.string().when('status', (status, schema) => 
                String(status) === "inactive"
                    ? schema.required('Separation reason is required')
                    : schema.notRequired()
            ),
            separation_date: Yup.string().when('status', (status, schema) => 
                String(status) === "inactive"
                    ? schema.required('Date separated is required')
                    : schema.notRequired()
            ),
        }),
        onSubmit:async (values, {setSubmitting}) => {
            if (!canEditRestrictedRecords(permissions, "EMPLOYEES", "EMPLOYEE",employee.employee_number, 0)) {
                return;
            }
            const isConfirmed = await confirm({
            title: "Edit Employee Details",
                message: "Are you sure you want to save changes?"
            });

            if (isConfirmed) {
                setSubmitting(true);
                updateEmployee(employee.employee_number, values)
                .then((resp) => {
                    if (!resp.error) {
                        triggerReload();
                        router.push(`/employees/${employee.employee_number}`);
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
                        <EditScheduleDetails
                            loading={loading}
                            formHandler={editEmployeeForm}
                        />
                        <div className="py-[2px]"/>
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