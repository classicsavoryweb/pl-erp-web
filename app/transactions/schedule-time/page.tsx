import PageTitle from "@/components/common/PageTitle";
import ScheduleTimeTableCard from "@/components/modules/transactions/schedule-time/ScheduleTimeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Schedule Time"
            />
            <ScheduleTimeTableCard/>
        </>
    );
};

export default Page;