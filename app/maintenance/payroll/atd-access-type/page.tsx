import PageTitle from "@/components/common/PageTitle";
import ATDAccessTypeTableCard from "@/components/modules/maintenance/atd-access-type/ATDAccessTypeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="ATD Access Type"
            />
            <ATDAccessTypeTableCard />
        </>
    );
};

export default Page;
