import Accordion from "@/components/common/Accordion";
import EmployeeAuditLogs from "@/components/modules/employees/EmployeeAuditLogs";
import EmployeeDetailsCard from "@/components/modules/employees/EmployeeDetailsCard";

const Page = () => {
    return (
        <>
            <EmployeeDetailsCard/>
            <p className="pt-5 font-semibold text-red-800">Employee History Logs</p>
            <div className="w-6/8">
                <Accordion
                    title="Audit Logs"
                >
                    <EmployeeAuditLogs/>
                </Accordion>
            </div>
            <div className="w-6/8">
                <Accordion
                    title="Positions"
                >
                    <p></p>
                </Accordion>
            </div>
            <div className="w-6/8">
                <Accordion
                    title="Branches"
                >
                    <p></p>
                </Accordion>
            </div>
            <div className="w-6/8">
                <Accordion
                    title="Offenses"
                >
                    <p></p>
                </Accordion>
            </div>
        </>
    );
};

export default Page;