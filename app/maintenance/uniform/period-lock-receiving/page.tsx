import PageTitle from "@/components/common/PageTitle";
import UniformPeriodLockTableCard from "@/components/modules/maintenance/uniform/period-lock/UniformPeriodLockTableCard";

const Page = () => {
    return (
        <>
            <PageTitle title="Period Lock Receiving" />
            <UniformPeriodLockTableCard lockType="Receiving" />
        </>
    );
};

export default Page;
