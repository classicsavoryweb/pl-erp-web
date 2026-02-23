import PageTitle from "@/components/common/PageTitle";
import EntriesTableCard from "@/components/modules/compensation/entries/EntriesTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Final Entries"
            />
            <EntriesTableCard title="Final Entries" showTag={false}/>
        </>
    );
};

export default Page;
