"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";

interface Option {
    label: string;
    value: any;
}

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: { target: { name: string; value: any } }) => void;
    error?: string;
    value?: any;
    required?: boolean;
    api: (payload: any) => Promise<any>;
}

const DebounceSearchableDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required,
    api,
}: SelectInterface) => {
    const [toggle, setToggle] = useState(false);
    const [keyWord, setKeyWord] = useState("");
    const [options, setOptions] = useState<Option[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLabel = useMemo(() => {
        return options.find((opt) => opt.label === value?.last_name + ", "+value?.first_name + " " + value?.middle_name)?.label || placeholder;
    }, [value, options, placeholder, loading]);

    useEffect(() => {
        if (toggle) setHighlightedIndex(-1);
    }, [toggle, keyWord]);

    const handleSelect = (selected: Option) => {
        onChange({ target: { name, value: selected.value } });
        setToggle(false);
        setKeyWord("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!toggle || options.length === 0) return;

        if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0
        );
        } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1
        );
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(options[highlightedIndex]);
        } else if (e.key === "Escape") {
        setToggle(false);
        }
    };

    useEffect(() => {
        if (!toggle) return;

        const delayDebounce = setTimeout(() => {
            setLoading(true);
            api({
                keyWord: keyWord
            }).then((resp:any) => {
                const data = resp.data;
                const newDataSet = data.map((emp: any) => {
                    return (
                        {
                            label: emp.last_name + ", " + emp.first_name + " " + emp.middle_name,
                            value: emp
                        }
                    );
                })

                setOptions(newDataSet);
            }).finally(() => setLoading(false));
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [keyWord]);

    useEffect(() => {
        setLoading(true);
        api({})
        .then((resp:any) => {
            const data = resp.data;
            const newDataSet = data.map((emp: any) => {
                return (
                    {
                        label: emp.last_name + ", " + emp.first_name + " " + emp.middle_name,
                        value: emp
                    }
                );
            })

            setOptions(newDataSet);
        })
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setToggle(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    return (
        <div className="relative py-1" ref={dropdownRef}>
        <p className="mb-[-2px]">
            {label}
            {required && <span className="text-red-400">*</span>}
        </p>

        <div className="relative">
            <button
            type="button"
            className={`w-full h-[40px] rounded-md focus:outline-none hover:cursor-pointer border-2 ${
                error ? "border-red-400" : "border-slate-300 focus:border-slate-400"
            } p-2 text-left`}
            onClick={() => setToggle((prev) => !prev)}
            >
            <div className="flex justify-between items-center">
                <p className="truncate">{selectedLabel}</p>
                {toggle ? (
                <ExpandLessOutlinedIcon style={{ width: "25px", height: "25px" }} />
                ) : (
                <ExpandMoreOutlinedIcon style={{ width: "25px", height: "25px" }} />
                )}
            </div>
            </button>

            {toggle && (
            <div className="absolute flex flex-col items-start w-full z-50 shadow-lg bg-white rounded-lg overflow-auto max-h-[250px]">
                <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 focus:outline-none border border-slate-200"
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                />

                {loading ? (
                <div className="w-full px-2 p-[6px] text-slate-400">Loading...</div>
                ) : options.length > 0 ? (
                options.map((opt, idx) => (
                    <div
                    key={idx}
                    className={`w-full border-b border-b-slate-200 px-2 p-[6px] hover:bg-slate-100 hover:cursor-pointer ${
                        idx === highlightedIndex ? "bg-slate-100 font-medium" : ""
                    }`}
                    onClick={() => handleSelect(opt)}
                    >
                    {opt.label}
                    </div>
                ))
                ) : (
                <div className="w-full px-2 p-[6px] text-slate-400">No results found</div>
                )}
            </div>
            )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
    );
};

export default DebounceSearchableDropDown;
