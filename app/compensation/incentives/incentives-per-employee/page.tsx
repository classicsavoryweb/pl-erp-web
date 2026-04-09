import PageTitle from "@/components/common/PageTitle";
import IncentivesPerEmployeeTableCard from "@/components/modules/maintenance/incentives-per-employee/IncentivesPerEmployeeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Rank and File Per Employee"
            />
            <IncentivesPerEmployeeTableCard/>
        </>
    );
};

export default Page;