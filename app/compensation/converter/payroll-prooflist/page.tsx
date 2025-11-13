import PageTitle from "@/components/common/PageTitle";
import PayrollProofListTableCard from "@/components/modules/compensation/converter/payroll-prooflist/PayrollProofListTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Payroll Prooflist"
            />
            <PayrollProofListTableCard/>
        </>
    );
};

export default Page;