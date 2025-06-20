import PageTitle from "@/components/common/PageTitle";
import EmploymentStatusTableCard from "@/components/modules/reports/employment-status/EmploymentStatusTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Employment Status Report"
            />
            <EmploymentStatusTableCard/>
        </>
    );
};

export default Page;