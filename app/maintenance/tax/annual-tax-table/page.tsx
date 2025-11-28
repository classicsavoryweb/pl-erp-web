import PageTitle from "@/components/common/PageTitle";
import AnnualTaxTableCard from "@/components/modules/maintenance/tax/AnnualTaxTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Annual Tax Table"
            />
            <AnnualTaxTableCard/>
        </>
    );
};

export default Page;