import Card from "@/components/common/Card";

interface CardInterface {
    title: string;
    displayReport: number | string;
    loading?: boolean;
    type?: "text" | "number";
};

const SummaryCardCount = ({
    title,
    displayReport,
    loading = false,
    type = "number"
}: CardInterface ) => {
    return (
        <div className="bg-zinc-50 w-full my-2 p-3 rounded-md border-l-5 border-red-700 dark:bg-neutral-900 dark:text-slate-300">
            { loading ?
                <>
                    <div className="animate-pulse duration-500 space-y-2">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-600  rounded w-3/4" />
                        <div className="h-8 bg-zinc-200 dark:bg-zinc-600 rounded w-1/3" />
                    </div>  
                </>
                :
                <>
                    <p>{title}</p>
                    { type == "number"
                        ? <p className="text-xl font-medium">{displayReport.toLocaleString('en-US')}</p>  
                        : <p className="text-xl font-medium">{displayReport}</p>  
                    } 
                </>
            }
        </div>
    )
};

export default SummaryCardCount;