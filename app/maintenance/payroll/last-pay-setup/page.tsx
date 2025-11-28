import PageTitle from "@/components/common/PageTitle";
import LastPaySetupTableCard from "@/components/modules/maintenance/last-pay-setup/LastPaySetupTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Last Pay Setup"
            />
            <LastPaySetupTableCard/>
        </>
    );
};

export default Page;