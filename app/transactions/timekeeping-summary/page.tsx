import PageTitle from "@/components/common/PageTitle";
import TimeKeepingSummaryTableCard from "@/components/modules/transactions/timekeeping-summary/TimeKeepingSummaryTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Timekeeping Summary"
            />
            <TimeKeepingSummaryTableCard/>
        </>
    );
};

export default Page;