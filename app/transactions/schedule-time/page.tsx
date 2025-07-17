import PageTitle from "@/components/common/PageTitle";
import ScheduleTimeTableCard from "@/components/modules/transactions/schedule-time/ScheduleTimeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Actual Schedule"
            />
            <ScheduleTimeTableCard/>
        </>
    );
};

export default Page;