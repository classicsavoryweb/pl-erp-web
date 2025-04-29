import PageTitle from "@/components/common/PageTitle";
import AgencyTableCard from "@/components/modules/maintenance/agencies/AgencyTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Agencies"
            />

            <AgencyTableCard/>
        </>
    );
};

export default Page;