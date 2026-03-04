import PageTitle from "@/components/common/PageTitle";
import ExportDeductionReportForm from "@/components/modules/reports/payroll/deductions/ExportDeductionReportForm";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Deductions"
            />
            <div className="w-[550px]">
                <ExportDeductionReportForm/>
            </div>
        </>
    );
};

export default Page;