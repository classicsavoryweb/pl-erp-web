import PageTitle from "@/components/common/PageTitle";
import BankAccountTypeCard from "@/components/modules/maintenance/bank-account-types/BankAccountType";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Bank Account Types"
            />
            <BankAccountTypeCard/>
        </>
    );
};

export default Page;