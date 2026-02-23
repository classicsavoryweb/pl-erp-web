import PageTitle from "@/components/common/PageTitle";
import EntriesTableCard from "@/components/modules/compensation/entries/EntriesTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="For Review Entries"
            />
            <EntriesTableCard title="For Review Entries" showTag={false}/>
        </>
    );
};

export default Page;
