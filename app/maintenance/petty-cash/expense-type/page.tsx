import PageTitle from "@/components/common/PageTitle";
import ExpenseTypeTableCard from "@/components/modules/maintenance/petty-cash/expense-type/ExpenseTypeTableCard";

const Page = () => {
    return (
        <>
            <PageTitle
                title="Expense Type"
            />
            <ExpenseTypeTableCard/>
        </>
    );
};

export default Page;
