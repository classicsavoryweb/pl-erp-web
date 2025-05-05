"use client";
import { useMemo, useState } from "react";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: {
        target: { name: string; value: string }
    }) => void;
    error?: string;
    value?: string|number;
    required?: boolean;
    options: {
        label: string;
        value: string;
    }[];
    loading?: boolean;
}

const SearchableDropDown = ({
    label,
    placeholder,
    name,
    onChange,
    error,
    value,
    required,
    options,
    loading = false
}: SelectInterface) => {
    const [toggle, setToggle] = useState<boolean>(false);
    const [keyWord, setKeyWord] = useState<string>("");

    const selectedLabel = useMemo(() => {
        if (!loading) {
            return options.find(opt => opt.value === value)?.label || placeholder;
        } else {
            return "loading..."
        }
    }, [value, options, placeholder, loading]);

    const filteredOptions = useMemo(() => {
        const keywordLower = keyWord.toLowerCase();
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(keywordLower)
        );
    }, [keyWord, options]);

    const handleSelect = (selected: { label: string; value: string }) => {
        onChange( {
            target:{ name, value: selected.value }
        });
        setToggle(false);
        setKeyWord("");
    };

    return (
        <div className="relative py-1">
            <p className="mb-[-2px]">
                {label}
                {required && <span className="text-red-400">*</span>}
            </p>
            <div className="relative">
                <button
                    type="button"
                    className={`w-full h-[40px] rounded-md focus:outline-none hover:cursor-pointer border-2 ${error ? "border-red-400" : "border-slate-300 focus:border-slate-400"} p-2 text-left`}
                    onClick={() => setToggle(prev => !prev)}
                >
                    <div className="flex justify-between items-center">
                        {selectedLabel}
                        {toggle ? (
                            <ExpandLessOutlinedIcon style={{ width: '25px', height: '25px' }} />
                        ) : (
                            <ExpandMoreOutlinedIcon style={{ width: '25px', height: '25px' }} />
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
                        />
                        {filteredOptions.map((opt, idx) => (
                            <div
                                key={idx}
                                className="w-full border-b border-b-slate-200 px-2 p-[6px] hover:bg-slate-100 hover:cursor-pointer"
                                onClick={() => handleSelect(opt)}
                            >
                                {opt.label}
                            </div>
                        ))}
                        {filteredOptions.length === 0 && (
                            <div className="w-full px-2 p-[6px] text-slate-400">No results found</div>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default SearchableDropDown;
