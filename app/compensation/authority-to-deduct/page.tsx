import PageTitle from "@/components/common/PageTitle";
import ATDTableCard from "@/components/modules/compensation/atd/ATDTableCard";
import EmployeeDeductionsTableCard from "@/components/modules/compensation/employee-deductions/EmployeeDeductionsTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Authority To Deduct"
            />
            <ATDTableCard/>
        </>
    );
};

export default Page;