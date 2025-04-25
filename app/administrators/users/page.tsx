import PageTitle from "@/components/common/PageTitle";
import UsersTableCard from "@/components/modules/users/UsersTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Users"
            />

            <UsersTableCard/>
        </>
    );
};

export default Page;