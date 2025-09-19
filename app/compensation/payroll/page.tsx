import PageTitle from "@/components/common/PageTitle";
import PayrollTableCard from "@/components/modules/compensation/payroll/PayrollTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Payroll"
            />
            <PayrollTableCard/>
        </>
    );
};

export default Page;