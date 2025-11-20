import PageTitle from "@/components/common/PageTitle";
import EntriesTableCard from "@/components/modules/compensation/entries/EntriesTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Entries To Post"
            />
            <EntriesTableCard/>
        </>
    );
};

export default Page;