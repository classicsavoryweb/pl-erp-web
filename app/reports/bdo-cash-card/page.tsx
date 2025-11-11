import PageTitle from "@/components/common/PageTitle";
import BDOCashCardTableCard from "@/components/modules/reports/bdo-cash-card/BDOCashCardTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="BDO Cash Card"
            />

            <BDOCashCardTableCard/>
        </>
    );
};

export default Page;