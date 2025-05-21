"use client";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext } from "react";
import EmployeeBasicInfo from "./EmployeeBasicInfo";
import Badge from "@/components/common/Badge";
import { getTenure } from "@/helper/tenure";
import { EmployeeContext } from "@/context/EmployeeProvider";

const EmployeeDetailsCard = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const router = useRouter();
    const {employee, loading} = useContext(EmployeeContext);

    return (
        <div className="flex gap-x-5">
            <div className="w-7/12">
                <Card
                    loading={loading}
                    size="big"
                >
                    <div className="flex justify-between pb-5">
                        <div className="flex justify-start items-center gap-x-10">
                            <Image
                                src={ employee.profile_picture 
                                    ? employee.profile_picture 
                                    : employee.gender === "Male" 
                                        ? "/images/profile-pic-male.svg"
                                        : "/images/profile-pic-female.svg"
                                }
                                width={140}
                                height={140}
                                alt="profile picture"
                            />
                            <div>
                                <p className="text-2xl font-semibold">{employee.last_name}, {employee.first_name}</p>
                                <p className="text-md font-semibold text-gray-500">{employee.current_position?.description} - {employee.employee_number}</p>
                                <p className="text-md font-semibold text-gray-500">
                                    {getTenure(employee.date_hired, employee.separation_date)}
                                </p>
                                <p className="text-md font-semibold text-gray-500">{employee.employee_status?.description}</p>
                                <Badge
                                    status={employee.status === "active" ? "success" : "danger"}
                                    label={employee.status}
                                />
                            </div>
                        </div>
                        <div>
                            <Button
                                label="Edit"
                                onClick={() => {
                                    router.push(`/employees/edit/${employeeNumber}`)
                                }}
                            />
                        </div>
                    </div>

                    <hr className=" text-slate-300" />
                    <div className="py-5">
                        <p className="text-md font-semibold text-red-800">Employment Details</p>
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
                            { employee.status === "inactive" &&
                                <>
                                    <EmployeeBasicInfo
                                        label="Date Separated"
                                        detail={employee.separation_date}
                                    />
                                    <EmployeeBasicInfo
                                        label="Separation Reason"
                                        detail={employee.separation_reason}
                                    />
                                </>
                            }
                    </div>

                    <hr className=" text-slate-300" />
                    <div className="py-5">
                        <p className="text-md font-semibold text-red-800">Personal Details</p>
                            <EmployeeBasicInfo
                                label="Full Name"
                                detail={`${employee.last_name}, ${employee.first_name} ${employee.middle_name}`}
                            />
                            <EmployeeBasicInfo
                                label="Civil Status"
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
                            <EmployeeBasicInfo
                                label="Height"
                                detail={employee.height}
                            /> 
                    </div>

                    <hr className=" text-slate-300" />
                    <div className="py-5">
                        <p className="text-md font-semibold text-red-800">Contact Details</p>
                        <EmployeeBasicInfo
                            label="Email"
                            detail={employee.email}
                        />
                        <EmployeeBasicInfo
                            label="Contact Number"
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
                        <p className="text-md font-semibold text-red-800">Government Identification</p>
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
            </div>

            <div className="w-5/12">
                <Card
                    loading={loading}
                >
                    <p className="font-semibold text-red-800">Position</p>
                    <EmployeeBasicInfo
                        label="Description"
                        detail={employee.current_position?.description}
                    />
                    <EmployeeBasicInfo
                        label="Date Started"
                        detail={employee.positions && employee.positions[employee.positions.length - 1]?.pivot.date_started}
                    />
                    <EmployeeBasicInfo
                        label="Station"
                        detail={employee.station?.name}
                    />
                </Card>
                <div className="py-[2px]"/>
                <Card
                    loading={loading}
                >
                    <p className="font-semibold text-red-800">Branch</p>
                    <EmployeeBasicInfo
                        label="Current Branch"
                        detail={employee.current_branch?.name}
                    />
                    <EmployeeBasicInfo
                        label="Company"
                        detail={employee.current_branch?.company}
                    />
                    <EmployeeBasicInfo
                        label="Date Assigned"
                        detail={employee.branches && employee.branches[employee.branches.length - 1]?.pivot.date_assigned}
                    />
                    <EmployeeBasicInfo
                        label="Home Branch"
                        detail={employee.home_branch?.name}
                    />
                    <div className="py-3">
                        <hr className=" text-slate-300" />
                    </div>
                    <EmployeeBasicInfo
                        label="Branch Head"
                        detail={employee.current_branch?.branch_head}
                    />
                    <EmployeeBasicInfo
                        label="Group Head"
                        detail={employee.current_branch?.group_head}
                    />
                </Card>
                { (employee.education && ( employee.education.college || employee.education.highschool)) &&
                    <>
                        <div className="py-[2px]"/>
                        <Card
                            loading={loading}
                        >
                            <p className="font-semibold text-red-800">Education:</p>
                            { employee.education && employee.education?.college &&
                                <>
                                    <EmployeeBasicInfo
                                        label="College"
                                        detail={employee.education?.college}
                                    />
                                    <EmployeeBasicInfo
                                        label="Course"
                                        detail={employee.education?.course}
                                    />
                                    <EmployeeBasicInfo
                                        label="Address"
                                        detail={employee.education?.college_address}
                                    />
                                    <EmployeeBasicInfo
                                        label="Duration"
                                        detail={`${employee.education?.college_date_started} - ${employee.education?.college_date_graduated}`}
                                    />
                                </>
                            }
                            { employee.education && employee.education?.highschool &&
                                <>
                                    { employee.education?.college &&
                                        <div className="py-3">
                                            <hr className=" text-slate-300" />
                                        </div>
                                    }

                                    <EmployeeBasicInfo
                                        label="Highschool"
                                        detail={employee.education?.highschool}
                                    />
                                    <EmployeeBasicInfo
                                        label="Address"
                                        detail={employee.education?.highschool_address}
                                    />
                                    <EmployeeBasicInfo
                                        label="Duration"
                                        detail={`${employee.education?.highschool_date_started} - ${employee.education?.highschool_date_graduated}`}
                                    />
                                </>
                            }
                        </Card>
                    </>
                }
                { employee.dependents && employee.dependents.length > 0 &&
                    <>
                        <div className="py-[2px]"/>
                        <Card
                            loading={loading}
                        >
                            <p className="font-semibold text-red-800">Dependents</p>
                            { employee.dependents &&
                                employee.dependents.map((dependent: any, idx: number) => {
                                    return (
                                        <div
                                            className="pt-1"
                                            key={idx}
                                        >
                                            <EmployeeBasicInfo
                                                label="Name"
                                                detail={dependent.dependent_name}
                                            />
                                            <EmployeeBasicInfo
                                                label="Birthday"
                                                detail={dependent.birthday}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </Card>
                    </>
                }
                <div className="py-[2px]"/>
                <Card
                    loading={loading}
                >
                    <p className="font-semibold text-red-800">Emergency Contact</p>
                    <EmployeeBasicInfo
                        label="Contact Name"
                        detail={employee.emergency_contact_name}
                    />
                    <EmployeeBasicInfo
                        label="Contact Number"
                        detail={employee.emergency_contact_number}
                    />
                    <EmployeeBasicInfo
                        label="Address"
                        detail={employee.emergency_contact_address}
                    />
                    <EmployeeBasicInfo
                        label="Relationship"
                        detail={employee.emergency_contact_relationship}
                    />
                </Card>
            </div>
        </div>
    );
};

export default EmployeeDetailsCard;