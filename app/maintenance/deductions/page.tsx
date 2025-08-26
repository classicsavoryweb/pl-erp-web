import PageTitle from "@/components/common/PageTitle";
import DeductionsTableCard from "@/components/modules/maintenance/deductions/DeductionsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Deductions"
            />
            <DeductionsTableCard/>
        </>
    );
};

export default Page;