import PageTitle from "@/components/common/PageTitle";
import BranchesTableCard from "@/components/modules/maintenance/branches/BranchesTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Branches"
            />
            <BranchesTableCard/>
        </>
    );
};

export default Page;