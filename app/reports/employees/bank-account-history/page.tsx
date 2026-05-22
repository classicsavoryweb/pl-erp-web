import PageTitle from "@/components/common/PageTitle";
import BankAccountHistoryExportForm from "@/components/modules/reports/bank-account-history/BankAccountHistoryExportForm";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Bank Account History"
            />
            <div className="w-[550px]">
                <BankAccountHistoryExportForm/>
            </div>
        </>
    );
};

export default Page;