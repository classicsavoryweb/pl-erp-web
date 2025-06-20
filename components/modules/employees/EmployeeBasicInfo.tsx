interface InfoInterface{
    label: string,
    detail: string,
}

const EmployeeBasicInfo = ({
    label,
    detail
}: InfoInterface) => {
    return (
        <div className="flex justify-start gap-x-2">
            <p className="text-sm min-w-[150px] max-w-[150px]  font-semibold text-gray-500">{label}:</p>
            <p className="text-sm">{detail || "—"}</p>
        </div>
    );
};

export default EmployeeBasicInfo;