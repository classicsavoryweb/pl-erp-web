import Card from "@/components/common/Card";
import EmployeeDetailsCard from "@/components/modules/employees/EmployeeDetailsCard";

const Page = () => {
    return (
        <>
            <div className="flex gap-x-5">
                <div className="w-1/2">
                    <EmployeeDetailsCard/>
                </div>

                <div className="w-1/3">
                    <Card>
                        <p className="font-semibold">Position</p>
                    </Card>
                    <Card>
                        <p className="font-semibold">Branch</p>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Page;