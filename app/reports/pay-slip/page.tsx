import PageTitle from "@/components/common/PageTitle";
import PaySlipReportForm from "@/components/modules/reports/pay-slip/PaySlipReportForm";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Pay Slip"
            />
            <div className="w-[550px]">
                <PaySlipReportForm/>
            </div>
        </>
    );
};

export default Page;