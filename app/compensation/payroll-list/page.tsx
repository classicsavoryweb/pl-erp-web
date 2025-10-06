import PageTitle from "@/components/common/PageTitle";
import PayrollListTableCard from "@/components/modules/compensation/payroll-list/PayrollListTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Payroll List"
            />
            <PayrollListTableCard/>
        </>
    );
};

export default Page;