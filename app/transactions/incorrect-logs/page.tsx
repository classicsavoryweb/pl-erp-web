import PageTitle from "@/components/common/PageTitle";
import IncorrectLogsTableCard from "@/components/modules/transactions/incorrect-logs/IncorrectLogsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Incorrect Logs"
            />
            <IncorrectLogsTableCard/>
        </>
    );
};

export default Page;