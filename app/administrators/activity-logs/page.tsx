import PageTitle from "@/components/common/PageTitle";
import ActivityLogsTableCard from "@/components/modules/administrator/activity-logs/ActivityLogsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Activity Logs"
            />
            <ActivityLogsTableCard/>
        </>
    );
};

export default Page;