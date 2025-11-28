import PageTitle from "@/components/common/PageTitle";
import ContributionsAndTaxTableCard from "@/components/modules/maintenance/contributions-and-tax/ContributionsAndTaxTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Contributions and Tax Set-up"
            />
            <ContributionsAndTaxTableCard/>
        </>
    );
};

export default Page;