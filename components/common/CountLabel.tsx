import { formatNumber } from "@/helper/amount";

interface CountLabel {
    label: string;
    count: number;
};

const CountLabel = ({
    label,
    count
}: CountLabel) => {
    return (
        <div>
            <p className="text-[10px] font-medium leading-5 text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-sm font-semibold">
                {formatNumber(count)}
            </p>
        </div>
    );
};

export default CountLabel;