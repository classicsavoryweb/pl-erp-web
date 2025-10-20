import PageTitle from "@/components/common/PageTitle";
import TardinessSanctionTableCard from "@/components/modules/maintenance/tardiness-sanctions/TardinessSanctionTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Tardiness Sanctions"
            />
            <TardinessSanctionTableCard/>
        </>
    );
};

export default Page;