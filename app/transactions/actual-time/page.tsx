import PageTitle from "@/components/common/PageTitle";
import ActualTimeTableCard from "@/components/modules/transactions/actual-time/ActualTimeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Actual Logs"
            />

            <ActualTimeTableCard/>
        </>
    );
};

export default Page;