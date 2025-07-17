import PageTitle from "@/components/common/PageTitle";
import OvertimeTableCard from "@/components/modules/transactions/overtime/OvertimeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Overtime"
            />
            <OvertimeTableCard/>
        </>
    );
};

export default Page;