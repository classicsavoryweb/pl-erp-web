import PageTitle from "@/components/common/PageTitle";
import TardinessTableCard from "@/components/modules/reports/tardiness/TardinessTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Tardiness"
            />

            <TardinessTableCard/>
        </>
    );
};

export default Page;