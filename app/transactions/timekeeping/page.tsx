import PageTitle from "@/components/common/PageTitle";
import TimeKeepingTableCard from "@/components/modules/transactions/time-keeping/TimeKeepingTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Daily Timekeeping"
            />
            <TimeKeepingTableCard/>
        </>
    );
};

export default Page;