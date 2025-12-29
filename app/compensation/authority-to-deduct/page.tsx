import PageTitle from "@/components/common/PageTitle";
import ATDTableCard from "@/components/modules/compensation/atd/ATDTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Authority To Deduct"
            />
            <ATDTableCard/>
        </>
    );
};

export default Page;