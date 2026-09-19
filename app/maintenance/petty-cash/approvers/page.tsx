import PageTitle from "@/components/common/PageTitle";
import ApproverTableCard from "@/components/modules/maintenance/petty-cash/approvers/ApproverTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Approvers"
            />
            <ApproverTableCard/>
        </>
    );
};

export default Page;
