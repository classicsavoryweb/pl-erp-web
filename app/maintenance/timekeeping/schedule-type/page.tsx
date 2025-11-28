import PageTitle from "@/components/common/PageTitle";
import ScheduleTypeTableCard from "@/components/modules/maintenance/schedule-type/ScheduleTypeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Schedule Type"
            />

            <ScheduleTypeTableCard/>
        </>
    );
};

export default Page;