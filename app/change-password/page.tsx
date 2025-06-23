import PageTitle from "@/components/common/PageTitle"
import Authenticated from "@/components/layouts/Authenticated"
import ChangePasswordForm from "@/components/modules/change-password/ChangePasswordForm";

const Page = () => {
    return (
        <Authenticated>
            <PageTitle
                title="Change Password"
            />
            <div className="w-3/10">
                <ChangePasswordForm/>
            </div>
        </Authenticated>
    )
};

export default Page;