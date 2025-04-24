import PageTitle from "@/components/common/PageTitle";
import RolesAndPermissionTableCard from "@/components/modules/roles-and-permissions/RolesAndPermissionTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Roles and Permissions"
            />
            <RolesAndPermissionTableCard/>
        </>
    );
};

export default Page;