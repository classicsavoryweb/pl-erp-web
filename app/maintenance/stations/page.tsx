import PageTitle from "@/components/common/PageTitle";
import StationTableCard from "@/components/modules/maintenance/station/StationTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Stations"
            />

            <StationTableCard/>
        </>
    );
};

export default Page;