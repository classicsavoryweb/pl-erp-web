import PageTitle from "@/components/common/PageTitle";
import CashIssuanceTableCard from "@/components/modules/petty-cash/cash-issuance/CashIssuanceTableCard";

const CashIssuancePage = () => {
    return (
        <>
            <PageTitle title="Cash Issuance" />
            <CashIssuanceTableCard />
        </>
    );
};

export default CashIssuancePage;
