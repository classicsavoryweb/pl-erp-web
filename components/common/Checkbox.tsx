

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
                <input type="checkbox" id={`check-${label}`} checked={checked} value={value} onChange={onChange} className="w-4 h-4 accent-red-500 cursor-pointer"/>
                { label && <label htmlFor={`check-${label}`} className={`${highlight ? "font-semibold" : "text-xs"} cursor-pointer`}>{label}</label> }
            </div>
        </div>
    );
};

export default Checkbox