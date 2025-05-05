import PageTitle from "@/components/common/PageTitle";
import PositionsTableCard from "@/components/modules/maintenance/positions/PositionsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Positions"
            />
            <PositionsTableCard/>
        </>
    );
};

export default Page;