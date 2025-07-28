import PageTitle from "@/components/common/PageTitle";
import AdjustmentsTableCard from "@/components/modules/transactions/adjustments/AdjustmentsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Adjustments"
            />

            <AdjustmentsTableCard/>
        </>
    );
};

export default Page;