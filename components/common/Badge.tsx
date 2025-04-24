interface BadgeStatus {
    status?: "danger" | "default" | "warning" | "success";
    label: string | number;
};

const Badge = ({
    status = "default",
    label
}: BadgeStatus) => {
    return (
            <p
                className={`inline-block px-2 py-1 m-[2px]
                    ${status === "default" && "bg-zinc-500"}
                    ${status === "danger" && "bg-red-600"}
                    ${status === "warning" && "bg-orange-600"}
                    ${status === "success" && "bg-green-600"}
                    text-slate-50
                    text-[10px]
                    rounded-full
                    text-center
                `}
            >
                {label}
            </p>
    );
};

export default Badge;