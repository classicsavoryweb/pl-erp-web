import PageTitle from "@/components/common/PageTitle";
import DatabaseBackupsTableCard from "@/components/modules/administrator/database-backups/DatabaseBackupsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Database Backups"
            />
            <DatabaseBackupsTableCard/>
        </>
    );
};

export default Page;