import Accordion from "@/components/common/Accordion";
import EmployeeAuditLogs from "@/components/modules/employees/EmployeeAuditLogs";
import EmployeeBranchHistory from "@/components/modules/employees/EmployeeBranchHistory";
import EmployeeContractHistory from "@/components/modules/employees/EmployeeContractHistory";
import EmployeeDetailsCard from "@/components/modules/employees/EmployeeDetailsCard";
import EmployeePositionHistory from "@/components/modules/employees/EmployeePositionHistory";

const Page = () => {
    return (
        <>
            <div className="w-11/12">
                <EmployeeDetailsCard/>
            </div>
            <p className="pt-5 font-semibold text-red-800">Employee History Logs</p>
            <div className="w-full">
                <Accordion
                    title="Positions"
                >
                    <EmployeePositionHistory/>
                </Accordion>
            </div>
            <div className="w-full">
                <Accordion
                    title="Branches"
                >
                    <EmployeeBranchHistory/>
                </Accordion>
            </div>
            <div className="w-full">
                <Accordion
                    title="Contracts"
                >
                    <EmployeeContractHistory/>
                </Accordion>
            </div>
            <div className="w-full">
                <Accordion
                    title="Audit Logs"
                >
                    <EmployeeAuditLogs/>
                </Accordion>
            </div>
        </>
    );
};

export default Page;