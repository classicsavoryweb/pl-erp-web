import PageTitle from "@/components/common/PageTitle";
import TardinessDisablerTableCard from "@/components/modules/administrator/tardiness-disabler/TardinessDisablerTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Tardiness Disabler"
            />
            <TardinessDisablerTableCard/>
        </>
    );
};

export default Page;
