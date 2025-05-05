import PageTitle from "@/components/common/PageTitle";
import AddEmployeeForm from "@/components/modules/employees/AddEmployeeForm";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Add Employee"
            />
            <div className="w-[500px]">
                <AddEmployeeForm/>
            </div>
        </>
    );
};

export default Page;