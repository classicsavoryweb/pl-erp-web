import PageTitle from "@/components/common/PageTitle";
import PeriodDefinitionTableCard from "@/components/modules/maintenance/period-definition/PeriodDefinitionTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Period Definition"
            />
            <PeriodDefinitionTableCard/>
        </>
    );
};

export default Page;