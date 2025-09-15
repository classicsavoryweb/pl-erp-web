import PageTitle from "@/components/common/PageTitle";
import CutOffTableCard from "@/components/modules/compensation/cutoff/CutOffTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Cutoff Setup"
            />

            <CutOffTableCard/>
        </>
    );
};

export default Page;