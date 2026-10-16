interface BadgeStatus {
    status?: "danger" | "default" | "warning" | "success" | "purpose";
    label: string | number;
};

const Badge = ({
    status = "default",
    label
}: BadgeStatus) => {
    return (
        <div>
            <span
                className={`inline-block px-2 py-1
                    ${status === "default" && "bg-zinc-700"}
                    ${status === "danger" && "bg-red-800"}
                    ${status === "warning" && "bg-orange-600"}
                    ${status === "success" && "bg-green-800"}
                    ${status === "purpose" && "bg-blue-950"}
                    text-slate-50
                    text-[10px]
                    rounded-full
                    text-center
                `}
            >
                {label}
            </span>
        </div>
    );
};

export default Badge;