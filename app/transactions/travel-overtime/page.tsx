import PageTitle from "@/components/common/PageTitle";
import TravelOvertimeTableCard from "@/components/modules/transactions/travel-overtime/TravelOvertimeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Travel Overtime"
            />
            <TravelOvertimeTableCard/>
        </>
    );
};

export default Page;