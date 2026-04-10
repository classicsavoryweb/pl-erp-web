import PageTitle from "@/components/common/PageTitle";
import ExportIncentiveReportForm from "@/components/modules/reports/payroll/incentive-report/ExportIncentiveReportForm";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Incentive Report"
            />
            <div className="w-[550px]">
                <ExportIncentiveReportForm/>
            </div>
        </>
    );
};

export default Page;