"use client";
import { getEmployee } from "@/api/employee";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import EmployeeBasicInfo from "./EmployeeBasicInfo";
import Grid from "@/components/common/Grid";
import Badge from "@/components/common/Badge";
import { getTenure } from "@/helper/tenure";

const EmployeeDetailsCard = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const [employee, setEmployee] = useState<any>({});
    const api = useApiCall();

    useAsyncEffect(() => {
        getEmployee(String(employeeNumber))
        .then((resp) => {
            if (!resp.error) {
                console.log(resp.data.employee);
                setEmployee(resp.data.employee);
            } else {
                toast.error(resp.data.message); 
            }

        }).catch(() => {
            toast.error("Error fetching employee details");
        }).finally(() => {
            api.setLoading(false);
        });
    }, []);

    return (
        <Card
            loading={api.loading}
        >
            <div className="flex justify-between pb-5">
                <div className="flex justify-start items-center gap-x-10">
                    <Image
                        src={ employee.gender === "Male" ? "/images/profile-pic-male.svg" : "/images/profile-pic-female.svg"}
                        width={140}
                        height={140}
                        alt="profile picture"
                    />
                    <div>
                        <p className="text-2xl font-semibold">{employee.last_name}, {employee.first_name}</p>
                        <p className="text-md font-semibold">{employee.current_position?.description} - {employee.employee_number}</p>
                        <p className="text-md font-semibold">
                            {getTenure(employee.date_hired)}
                        </p>
                        <p className="text-md font-semibold">{employee.employee_status?.description}</p>
                        <Badge
                            status={employee.employee_status?.type === "active" ? "success" : "danger"}
                            label={employee.employee_status?.type}
                        />
                    </div>
                </div>
                <div>
                    <Button
                        label="Edit"
                        onClick={() => {}}
                    />
                </div>
            </div>

            <hr className=" text-slate-300" />
            <div className="py-5">
                <p className="text-md font-semibold">Employment Details:</p>
                <Grid cols={2}>
                    <div>
                        <EmployeeBasicInfo
                            label="Employee Number"
                            detail={employee.employee_number}
                        />
                        <EmployeeBasicInfo
                            label="Biometric Number"
                            detail={employee.biometric_number}
                        />
                        <EmployeeBasicInfo
                            label="Date Hired"
                            detail={employee.date_hired}
                        />
                        <EmployeeBasicInfo
                            label="Employment Type"
                            detail={employee.type}
                        />
                        <EmployeeBasicInfo
                            label="Regularization Date"
                            detail={employee.regularization_date}
                        />
                    </div>
                    <div>
                        <EmployeeBasicInfo
                            label="Branch"
                            detail={employee.current_branch?.name}
                        />
                        <EmployeeBasicInfo
                            label="Home Branch"
                            detail={employee.home_branch?.name}
                        />
                        <EmployeeBasicInfo
                            label="Branch Head"
                            detail={employee.current_branch?.branch_head}
                        />
                        <EmployeeBasicInfo
                            label="Group Head"
                            detail={employee.current_branch?.group_head}
                        />
                    </div>
                </Grid>
            </div>

            <hr className=" text-slate-300" />
            <div className="py-5">
                <p className="text-md font-semibold">Personal Details:</p>
                <Grid cols={2}>
                    <div>
                        <EmployeeBasicInfo
                            label="Full name"
                            detail={`${employee.last_name}, ${employee.first_name} ${employee.middle_name}`}
                        />
                        <EmployeeBasicInfo
                            label="Civil status"
                            detail={employee.civil_status}
                        />
                        <EmployeeBasicInfo
                            label="Birthday"
                            detail={employee.date_hired}
                        />
                        <EmployeeBasicInfo
                            label="Birthplace"
                            detail={employee.birthplace}
                        />
                        <EmployeeBasicInfo
                            label="Gender"
                            detail={employee.gender}
                        />
                    </div>
                    <div>
                        <EmployeeBasicInfo
                            label="Height"
                            detail={employee.height}
                        />
                    </div>
                </Grid>
            </div>

            <hr className=" text-slate-300" />
            <div className="py-5">
                <p className="text-md font-semibold">Contact Details:</p>
                <EmployeeBasicInfo
                    label="Email"
                    detail={employee.email}
                />
                <EmployeeBasicInfo
                    label="Contact number"
                    detail={employee.contact_number}
                />
                <EmployeeBasicInfo
                    label="Address"
                    detail={employee.address}
                />
                <EmployeeBasicInfo
                    label="Region"
                    detail={employee.region}
                />
            </div>

            <hr className=" text-slate-300" />
            <div className="pt-5">
                <p className="text-md font-semibold">Government Identification:</p>
                <EmployeeBasicInfo
                    label="TIN"
                    detail={employee.tin}
                />
                <EmployeeBasicInfo
                    label="SSS"
                    detail={employee.sss}
                />
                <EmployeeBasicInfo
                    label="PAGIBIG"
                    detail={employee.pagibig}
                />
                <EmployeeBasicInfo
                    label="Philhealth"
                    detail={employee.philhealth}
                />
                <EmployeeBasicInfo
                    label="Tax Type"
                    detail={employee.tax_type}
                />
            </div>
        </Card>
    );
};

export default EmployeeDetailsCard;