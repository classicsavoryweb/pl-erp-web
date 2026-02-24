"use client";
import Accordion from "@/components/common/Accordion";
import EmployeeAuditLogs from "@/components/modules/employees/EmployeeAuditLogs";
import EmployeeDetailsCard from "@/components/modules/employees/EmployeeDetailsCard";
import EmployeeBankDetailsHistory from "@/components/modules/employees/bank-history/BankDetailsHistory";
import EmployeeBranchHistory from "@/components/modules/employees/branch-history/EmployeeBranchHistory";
import EmployeeContractHistory from "@/components/modules/employees/contract-history/EmployeeContractHistory";
import EmployeeOffenseHistory from "@/components/modules/employees/offense-history/EmployeeOffenseHistory";
import EmployeePositionHistory from "@/components/modules/employees/position-history/EmployeePositionHistory";
import EmployeeRequirementsList from "@/components/modules/employees/requirements/EmployeeRequirementsList";
import EmployeeTraingingHistory from "@/components/modules/employees/trainings/EmployeeTrainingHistory";
import EmployeeVaccinationHistory from "@/components/modules/employees/vaccinnation/EmployeeVaccinationHistory";
import EmployeePromotionHistory from "@/components/modules/employees/promotion-history/EmployeePromotionHistory";
import { AuthContext } from "@/context/AuthProvider";
import { useParams } from "next/navigation";
import { useContext } from "react";

const Page = () => {

    const { permissions } = useContext(AuthContext);
    const params = useParams();
    const employeeNumber = params["employee-number"];

    return (
        <>
            <title>{`${employeeNumber} | Classic Savory ERP`}</title>
            <div className="w-11/12">
                <EmployeeDetailsCard/>
            </div>
            <p className="pt-5 font-semibold text-red-800 dark:text-red-500">Employee History Logs</p>
            { permissions.includes("view_employee_position") &&
                <div className="w-full">
                    <Accordion
                        title="Positions"
                    >
                        <EmployeePositionHistory/>
                    </Accordion>
                </div>
            }

            { permissions.includes("view_promotion_history") && 
                <div className="w-full">
                      <Accordion
                        title="Promotion"
                    >
                        <EmployeePromotionHistory/>
                    </Accordion>
                </div>
            }

            { permissions.includes("view_employee_branches") && 
                <div className="w-full">
                    <Accordion
                        title="Branches"
                    >
                        <EmployeeBranchHistory/>
                    </Accordion>
                </div>
            }

            { permissions.includes("view_employee_contracts") &&
                <div className="w-full">
                    <Accordion
                        title="Contracts"
                    >
                        <EmployeeContractHistory/>
                    </Accordion>
                </div>
            }

            { permissions.includes("view_employee_offenses") &&
                <div className="w-full">
                    <Accordion
                        title="Offenses"
                    >
                        <EmployeeOffenseHistory/>
                    </Accordion>
                </div>
            }

            { permissions.includes("view_employee_bank_details") &&
                <div className="w-full">
                    <Accordion
                        title="Bank Details"
                    >
                        <EmployeeBankDetailsHistory/>
                    </Accordion>
                </div>
            }

            { permissions.includes("view_employee_requirements") &&
                <div className="w-full">
                    <Accordion
                        title="Requirements"
                    >
                        <EmployeeRequirementsList/>
                    </Accordion>
                </div>
            }

            { permissions.includes("view_employee_training_titles") &&
                <div className="w-full">
                    <Accordion
                        title="Trainings"
                    >
                        <EmployeeTraingingHistory/>
                    </Accordion>
                </div>
            }

            { permissions.includes("view_employee_vaccination") &&
                <div className="w-full">
                    <Accordion
                        title="Vaccination"
                    >
                        <EmployeeVaccinationHistory/>
                    </Accordion>
                </div>
            }

            { permissions.includes("view_employee_audit_logs") &&
                <div className="w-full">
                    <Accordion
                        title="Audit Logs"
                    >
                        <EmployeeAuditLogs/>
                    </Accordion>
                </div>
            }

            {/* <div className="w-full">
                <Accordion
                    title="Health and Safety"
                >
                    <EmployeeHealthSafetyHistory/>
                </Accordion>
            </div> */}
        </>
    );
};

export default Page;