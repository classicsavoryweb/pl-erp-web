"use client";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext } from "react";
import Badge from "@/components/common/Badge";
import { getTenure } from "@/helper/tenure";
import { EmployeeContext } from "@/context/EmployeeProvider";
import moment from "moment";
import { toast } from "react-toastify";
import { canEditRestrictedRecords } from "@/helper/restriction";
import { AuthContext } from "@/context/AuthProvider"; 
import Textfield from "@/components/common/Textfield";
import Grid from "@/components/common/Grid";
import TextArea from "@/components/common/TextArea";

const EmployeeDetailsCard = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const router = useRouter();
    const {employee, loading} = useContext(EmployeeContext);
    const { permissions } = useContext(AuthContext);

    return (
        <div className="flex gap-x-4">
            <div className="w-7/12">
                <Card
                    loading={loading}
                    size="medium"
                >
                    <div className="flex justify-between pb-5">
                        <div className="flex justify-start items-center gap-x-10">
                            <img
                                src={ employee.profile_picture 
                                    ? employee.profile_picture 
                                    : employee.gender === "Male" 
                                        ? "/images/profile-pic-male.svg"
                                        : "/images/profile-pic-female.svg"
                                }
                                // width={140}
                                // height={140}
                                alt="profile picture"
                                className="rounded-full object-fit h-[140px] w-[150px]"
                            />
                            <div>
                                <p className="text-2xl font-semibold">{employee.last_name}, {employee.first_name} {employee.middle_name && String(employee.middle_name).charAt(0) + "."}</p>
                                <p className="text-md font-semibold text-gray-500 dark:text-gray-300">{employee.current_position?.description} - {employee.employee_number}</p>
                                <p className="text-md font-semibold text-gray-500 dark:text-gray-300">
                                    {getTenure(employee.date_hired, employee.separation_date)}
                                </p>
                                <p className="text-md font-semibold text-gray-500 dark:text-gray-300">{employee.employee_status?.description}</p>
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
                                    if (!canEditRestrictedRecords(permissions, "EMPLOYEES", "EMPLOYEE", employee.employee_number, 0)) {
                                        return;
                                    }
                                    router.push(`/employees/edit/${employeeNumber}`)
                                }}
                            />
                        </div>
                    </div>

                    <p className="text-md font-semibold text-blue-950 dark:text-gray-300">Employment Details</p>
                    <Grid cols={2}>
                        <Textfield
                            disabled
                            label="Employee Number"
                            value={employee.employee_number}
                        />
                        <Textfield
                            disabled
                            label="Biometric Number"
                            value={employee.biometric_number}
                        />
                        <Textfield
                            disabled
                            label="Date Hired"
                            value={ moment(employee.date_hired).format("MMMM DD, YYYY")}
                        />
                        <Textfield
                            disabled
                            label="Employment Type"
                            value={employee.type}
                        />
                        <Textfield
                            disabled
                            label="Regularization Date"
                            value={ employee.regularization_date ? moment(employee.regularization_date).format("MMMM DD, YYYY") : "—" }
                        />
                        { employee.status === "inactive" &&
                            <>
                                <Textfield
                                    disabled
                                    label="Date Separated"
                                    value={employee.separation_date ? moment(employee.separation_date).format("MMMM DD, YYYY") : "—" }
                                />
                                <Textfield
                                    disabled
                                    label="Separation Reason"
                                    value={employee.separation?.description}
                                />
                            </>
                        }
                        <Textfield
                            disabled
                            label="2nd Employee Number"
                            value={employee.employee_number_2}
                        />
                    </Grid>
                </Card>

                <div className="py-[2px]"/>
                <Card
                    loading={loading}
                    size="medium"
                >
                    <p className="text-md font-semibold text-blue-950 dark:text-gray-300">Personal Details</p>
                    <Grid cols={2}>
                        <Textfield
                            disabled
                            label="First Name"
                            value={employee.first_name}
                        />
                        <Textfield
                            disabled
                            label="Middle Name"
                            value={employee.middle_name}
                        />
                        <Textfield
                            disabled
                            label="Last Name"
                            value={employee.last_name}
                        />
                        <Textfield
                            disabled
                            label="Civil Status"
                            value={employee.civil_status}
                        />
                        <Textfield
                            disabled
                            label="Birthday"
                            value={employee.birthday ? moment(employee.birthday).format("MMMM DD, YYYY") : "—" }
                        />
                        <Textfield
                            disabled
                            label="Age"
                            value={employee.age}
                        />
                        <Textfield
                            disabled
                            label="Birthplace"
                            value={employee.birthplace}
                        />
                        <Textfield
                            disabled
                            label="Gender"
                            value={employee.gender}
                        />
                        <Textfield
                            disabled
                            label="Height"
                            value={employee.height}
                        /> 
                    </Grid>
                </Card>

                <div className="py-[2px]"/>
                <Card
                    loading={loading}
                    size="medium"
                >
                    <p className="text-md font-semibold text-blue-950 dark:text-gray-300">Contact Details</p>
                    <Grid cols={2}>
                        <Textfield
                            disabled
                            label="Email"
                            value={employee.email}
                        />
                        <Textfield
                            disabled
                            label="Contact Number"
                            value={employee.contact_number}
                        />
                        <Textfield
                            disabled
                            label="Present Address"
                            value={employee.address}
                        />
                        <Textfield
                            disabled
                            label="Permanent Address"
                            value={employee.provincial_address}
                        />
                        <Textfield
                            disabled
                            label="Region"
                            value={employee.region}
                        />
                    </Grid>
                </Card>

                <div className="py-[2px]"/>
                <Card
                    loading={loading}
                    size="medium"
                >
                    <p className="text-md font-semibold text-blue-950 dark:text-gray-300">Government Identification</p>
                    <Grid cols={2}>
                        <Textfield
                            disabled
                            label="TIN"
                            value={employee.tin}
                        />
                        <Textfield
                            disabled
                            label="SSS"
                            value={employee.sss}
                        />
                        <Textfield
                            disabled
                            label="PAGIBIG"
                            value={employee.pagibig}
                        />
                        <Textfield
                            disabled
                            label="Philhealth"
                            value={employee.philhealth}
                        />
                        <Textfield
                            disabled
                            label="Tax Type"
                            value={employee.tax_type}
                        />
                    </Grid>
                </Card>

                <div className="py-[2px]"/>
                <Card
                    loading={loading}
                    size="medium"
                >
                    <p className="font-semibold text-blue-950 dark:text-gray-300">Emergency Contact</p>
                    <Grid cols={2}>
                        <Textfield
                            disabled
                            label="Contact Name"
                            value={employee.emergency_contact_name}
                        />
                        <Textfield
                            disabled
                            label="Contact Number"
                            value={employee.emergency_contact_number}
                        />
                        <Textfield
                            disabled
                            label="Relationship"
                            value={employee.emergency_contact_relationship}
                        />
                        <Textfield
                            disabled
                            label="Address"
                            value={employee.emergency_contact_address}
                        />
                    </Grid>
                </Card>
            </div>

            <div className="w-5/12">
                <Card
                    loading={loading}
                >
                    <p className="font-semibold text-blue-950 dark:text-gray-300">Position</p>
                    <Textfield
                        disabled
                        label="Description"
                        value={employee.current_position?.description}
                    />
                    <Textfield
                        disabled
                        label="Date Started"
                        value={employee.positions && moment(employee.positions[employee.positions.length - 1]?.pivot.date_started).format("MMMM DD, YYYY")}
                    />
                    <Textfield
                        disabled
                        label="Station"
                        value={employee.station?.name}
                    />
                </Card>
                <div className="py-[2px]"/>
                <Card
                    loading={loading}
                >
                    <p className="font-semibold text-blue-950 dark:text-gray-300">Branch</p>
                    <Textfield
                        disabled
                        label="Current Branch"
                        value={employee.current_branch?.name}
                    />
                    <Textfield
                        disabled
                        label="Region"
                        value={employee.current_branch?.location}
                    />
                    <Textfield
                        disabled
                        label="Company"
                        value={employee.current_branch?.company}
                    />
                    <Textfield
                        disabled
                        label="Date Assigned"
                        value={employee.branches && moment(employee.branches[employee.branches.length - 1]?.pivot.date_assigned).format("MMMM DD, YYYY")}
                    />
                    <Textfield
                        disabled
                        label="Home Branch"
                        value={employee.home_branch?.name}
                    />
                    <Textfield
                        disabled
                        label="Region"
                        value={employee.home_branch?.location}
                    />
                    <div className="py-3">
                        <hr className=" text-slate-300" />
                    </div>
                    <Textfield
                        disabled
                        label="Branch OIC"
                        value={employee.current_branch?.branch_head}
                    />
                    <Textfield
                        disabled
                        label="Group Head"
                        value={employee.current_branch?.group_head}
                    />
                </Card>

                <div className="py-[2px]"/>
                <Card
                    loading={loading}
                >
                    <p className="font-semibold text-blue-950 dark:text-gray-300">Education</p>
                    <Textfield
                        disabled
                        label="College"
                        value={employee.education?.college}
                    />
                    <Textfield
                        disabled
                        label="Course"
                        value={employee.education?.course}
                    />
                    <Textfield
                        disabled
                        label="Address"
                        value={employee.education?.college_address}
                    />
                    <Textfield
                        disabled
                        label="Duration"
                        value={employee.education?.college_date_started && employee.education?.college_date_graduated}
                    />
                    <div className="py-3">
                        <hr className=" text-slate-300" />
                    </div>
                    <Textfield
                        disabled
                        label="Highschool"
                        value={employee.education?.highschool}
                    />
                    <Textfield
                        disabled
                        label="Address"
                        value={employee.education?.highschool_address}
                    />
                    <Textfield
                        disabled
                        label="Duration"
                        value={employee.education?.highschool_date_started && employee.education?.highschool_date_graduated}
                    />
                </Card>
                
                { employee.dependents && employee.dependents.length > 0 &&
                    <>
                        <div className="py-[2px]"/>
                        <Card
                            loading={loading}
                        >
                            <p className="font-semibold text-blue-950 dark:text-gray-300">Dependents</p>
                            { employee.dependents &&
                                employee.dependents.map((dependent: any, idx: number) => {
                                    return (
                                        <div
                                            className="pt-1"
                                            key={idx}
                                        >
                                            <Textfield
                                                disabled
                                                label="Name"
                                                value={dependent.dependent_name}
                                            />
                                            <Textfield
                                                disabled
                                                label="Birthday"
                                                value={moment(dependent.birthday).format("MMMM DD, YYYY")}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </Card>
                    </>
                }
                { employee.schedule &&
                    <>
                        <div className="py-[2px]"/>
                        <Card
                            loading={loading}
                        >
                            <p className="font-semibold text-blue-950 dark:text-gray-300">Schedule Details</p>
                            <Textfield
                                disabled
                                label="Schedule Type"
                                value={employee.schedule.schedule_type?.name}
                            />
                            <Textfield
                                disabled
                                label="Flexible Schedule"
                                value={employee.schedule.flexible_schedule}
                            />
                            <Textfield
                                disabled
                                label="Incentive Leave"
                                value={employee.schedule.incentive_leave}
                            />
                        </Card>
                    </>
                }
                    <div className="py-[2px]"/>
                    <Card
                        loading={loading}
                    >
                        <p className="text-md font-semibold text-blue-950 dark:text-gray-300">Others</p>
                        <TextArea
                            disabled
                            label="Remarks"
                            value={employee.remarks}
                        />
                </Card>
            </div>
        </div>
    );
};

export default EmployeeDetailsCard;