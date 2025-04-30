import Card from "@/components/common/Card";

interface CardInterface {
    title: string;
    displayReport: number | string;
};

const SummaryCardCount = ({
    title,
    displayReport
}: CardInterface ) => {
    return (
        <div className="bg-zinc-50 w-full my-2 p-4 rounded-md border-l-5 border-red-800">
            <p className="text-md ">{title}</p>
            <p className="text-3xl font-medium">{displayReport}</p>
        </div>
    )
};

export default SummaryCardCount;