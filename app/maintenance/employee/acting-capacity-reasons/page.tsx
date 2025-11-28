import PageTitle from "@/components/common/PageTitle";
import ActingCapacityReasonsTableCard from "@/components/modules/maintenance/acting-capacity-reasons/ActingCapacityReasonsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Acting Capacity Reasons"
            />

            <ActingCapacityReasonsTableCard/>
        </>
    );
};

export default Page;