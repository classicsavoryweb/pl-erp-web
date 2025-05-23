import PageTitle from "@/components/common/PageTitle";
import ReportCoeRequestsTableCard from "@/components/modules/reports/coe-requests/ReportCoeRequestsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="COE Requests"
            />
            <ReportCoeRequestsTableCard/>
        </>
    );
};

export default Page;