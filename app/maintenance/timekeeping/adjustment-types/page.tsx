import PageTitle from "@/components/common/PageTitle";
import AdjustmentTypesTableCard from "@/components/modules/maintenance/adjustment-type/AdjustmentTypeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Adjustment Types"
            />
            <AdjustmentTypesTableCard/>
        </>
    );
};

export default Page;