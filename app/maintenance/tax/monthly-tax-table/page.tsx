import PageTitle from "@/components/common/PageTitle";
import TaxTableCard from "@/components/modules/maintenance/tax/TaxTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Monthly Tax Table"
            />
            <TaxTableCard/>
        </>
    );
};

export default Page;