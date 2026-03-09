import PageTitle from "@/components/common/PageTitle";
import StatutoryReportCard from "@/components/modules/reports/payroll/statutory/StatutoryReportCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Statutory"
            />
            <div className="w-[550px]">
                <StatutoryReportCard/>
            </div>
        </>
    );
};

export default Page;
