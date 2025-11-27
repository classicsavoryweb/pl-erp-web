import PageTitle from "@/components/common/PageTitle";
import LastPayTableCard from "@/components/modules/compensation/last-pay/LastPayTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Last Pay"
            />
            <LastPayTableCard/>
        </>
    );
};

export default Page;