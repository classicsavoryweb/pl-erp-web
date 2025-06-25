import PageTitle from "@/components/common/PageTitle";
import SanctionsTableCard from "@/components/modules/maintenance/sanctions/SanctionsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Sanctions"
            />
            <SanctionsTableCard/>
        </>
    );
};

export default Page;