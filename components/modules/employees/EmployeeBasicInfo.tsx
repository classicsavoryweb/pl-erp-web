import Grid from "@/components/common/Grid";

interface InfoInterface{
    label: string,
    detail: string,
}

const EmployeeBasicInfo = ({
    label,
    detail
}: InfoInterface) => {
    return (
        <div className="flex justify-start items-center gap-x-2">
            <p className="text-sm w-[145px] font-semibold">{label}:</p>
            <p className="text-sm">{detail || "—"}</p>
        </div>
    );
};

export default EmployeeBasicInfo;