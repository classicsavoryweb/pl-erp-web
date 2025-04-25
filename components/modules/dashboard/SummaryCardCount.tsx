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
        <Card>
            <p className="text-md text-red-600">{title}</p>
            <p className="text-3xl font-medium">{displayReport}</p>
        </Card>
    )
};

export default SummaryCardCount;