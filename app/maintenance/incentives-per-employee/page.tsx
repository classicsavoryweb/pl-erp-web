import PageTitle from "@/components/common/PageTitle";
import IncentivesPerEmployeeTableCard from "@/components/modules/maintenance/incentives-per-employee/IncentivesPerEmployeeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Incentives | Rank and File per Employee"
            />
            <IncentivesPerEmployeeTableCard/>
        </>
    );
};

export default Page;