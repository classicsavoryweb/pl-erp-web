import PageTitle from "@/components/common/PageTitle";
import EmployeeTableCard from "@/components/modules/employees/EmployeeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Employee Tracking"
            />
            <EmployeeTableCard/>
        </>
    );
};

export default Page;