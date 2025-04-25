
interface BoxInterface {
    label: string;
    value: any;
    onChange: (e:any) => void;
};

const Checkbox = ({
    label,
    value,
    onChange
}: BoxInterface) => {
    return (
        <div className="py-1">
            <div className="flex items-center gap-x-2">
                <input type="checkbox" value={value} onChange={onChange} className="w-4 h-4 accent-red-500"/>
                <p className="text-sm">{label}</p>
            </div>
        </div>
    );
};

export default Checkbox