import Card from "@/components/common/Card";

interface CardInterface {
    title: string;
    displayReport: number | string;
    loading?: boolean;
};

const SummaryCardCount = ({
    title,
    displayReport,
    loading = false,
}: CardInterface ) => {
    return (
        <div className="bg-zinc-50 w-full my-2 p-4 rounded-md border-l-5 border-red-700">
            { loading ?
                <>
                    <div className="animate-pulse duration-500 space-y-2">
                        <div className="h-4 bg-zinc-200 rounded w-3/4" />
                        <div className="h-8 bg-zinc-200 rounded w-1/3" />
                    </div>
                </>
                :
                <>
                    <p className="text-md ">{title}</p>
                    <p className="text-3xl font-medium">{displayReport.toLocaleString('en-US')}</p>   
                </>

            }
        </div>
    )
};

export default SummaryCardCount;