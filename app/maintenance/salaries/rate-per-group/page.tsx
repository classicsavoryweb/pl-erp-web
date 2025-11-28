import PageTitle from "@/components/common/PageTitle";
import RatesTableCard from "@/components/modules/maintenance/rates/RatesTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Rate per Group"
            />
            <RatesTableCard/>
        </>
    );
};

export default Page;