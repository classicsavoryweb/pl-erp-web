
interface BoxInterface {
    label?: string;
    value: any;
    onChange: (e:any) => void;
    checked?: boolean;
    highlight?: boolean;
};

const Checkbox = ({
    label,
    value,
    onChange,
    checked,
    highlight = false
}: BoxInterface) => {
    return (
        <div className="py-1">
            <div className="flex items-center gap-x-2">
                <input type="checkbox" checked={checked} value={value} onChange={onChange} className="w-4 h-4 accent-red-500"/>
                { label && <p className={`text-sm ${highlight ? "font-semibold" : ""}`}>{label}</p> }
            </div>
        </div>
    );
};

export default Checkbox