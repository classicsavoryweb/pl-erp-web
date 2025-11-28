import PageTitle from "@/components/common/PageTitle";
import SalaryPositionsTableCard from "@/components/modules/maintenance/salary-positions/SalaryPositionsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Salary Positions"
            />
            <SalaryPositionsTableCard/>
        </>
    );
};

export default Page;