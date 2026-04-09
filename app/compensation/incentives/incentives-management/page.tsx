import PageTitle from "@/components/common/PageTitle";
import IncentivesManagementTableCard from "@/components/modules/maintenance/incentives-management/IncentivesManagementTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Incentives Management"
            />
            <IncentivesManagementTableCard/>
        </>
    );
};

export default Page;