import PageTitle from "@/components/common/PageTitle";
import EmployeeOffensesTableCard from "@/components/modules/reports/offenses/EmployeeOffensesTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Employee Offenses"
            />
            <EmployeeOffensesTableCard/>
        </>
    );
};

export default Page;