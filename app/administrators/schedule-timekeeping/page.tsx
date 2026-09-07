import PageTitle from "@/components/common/PageTitle";
import ScheduleTimeKeepingTableCard from "@/components/modules/administrator/schedule-timekeeping/ScheduleTimeKeepingTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Schedule Timekeeping"
            />
            <ScheduleTimeKeepingTableCard/>
        </>
    );
};

export default Page;