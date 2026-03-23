import PageTitle from "@/components/common/PageTitle";
import ExportTimekeepingSummaryListReportForm from "@/components/modules/reports/timekeeping/summary-list/ExportTimekeepingSummaryListReportForm";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Summary List"
            />
            <div className="w-[550px]">
                <ExportTimekeepingSummaryListReportForm/>
            </div>
        </>
    );
};

export default Page;