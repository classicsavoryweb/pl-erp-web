import PageTitle from "@/components/common/PageTitle";
import CSHubTransactionTypeTableCard from "@/components/modules/maintenance/cshub-transaction-type/CSHubTransactionTypeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="CSHub Transaction Type"
            />
            <CSHubTransactionTypeTableCard/>
        </>
    );
};

export default Page;