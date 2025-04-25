import PageTitle from "@/components/common/PageTitle"
import Authenticated from "@/components/layouts/Authenticated"

const Page = () => {
    return (
        <Authenticated>
            <PageTitle
                title="Change password"
            />
        </Authenticated>
    )
};

export default Page;