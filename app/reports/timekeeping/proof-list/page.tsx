import PageTitle from "@/components/common/PageTitle";
import ExportTimekeepingProofListReportForm from "@/components/modules/reports/timekeeping/proof-list/ExportTimekeepingProofListReportForm";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Proof List"
            />
            <div className="w-[550px]">
                <ExportTimekeepingProofListReportForm/>
            </div>
        </>
    );
};

export default Page;