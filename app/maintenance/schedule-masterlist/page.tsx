import PageTitle from "@/components/common/PageTitle";
import ScheduleMasterlistTableCard from "@/components/modules/maintenance/schedule-masterlist/ScheduleMasterlistTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Schedule Masterlist"
            />
            <ScheduleMasterlistTableCard/>
        </>
    );
};

export default Page;