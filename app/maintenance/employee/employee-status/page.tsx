import PageTitle from "@/components/common/PageTitle";
import EmployeeStatusCard from "@/components/modules/maintenance/employe-status/StatusTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Employee Status"
            />

            <EmployeeStatusCard/>
        </>
    );
};

export default Page;