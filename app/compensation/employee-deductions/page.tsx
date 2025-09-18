import PageTitle from "@/components/common/PageTitle";
import EmployeeDeductionsTableCard from "@/components/modules/compensation/employee-deductions/EmployeeDeductionsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Employee Deductions"
            />

            <EmployeeDeductionsTableCard/>
        </>
    );
};

export default Page;