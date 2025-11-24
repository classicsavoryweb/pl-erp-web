"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";

interface SelectInterface {
    label: string;
    placeholder?: string;
    name: string;
    onChange: (e: { target: { name: string; value: string, obj?: any } }) => void;
    error?: string;
    value?: string | number;
    required?: boolean;
    options: {
        label: string;
        value: string;
        obj?: any;
    }[];
    loading?: boolean;
    disabled?: boolean;
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
    loading = false,
    disabled = false,
}: SelectInterface) => {
    const [toggle, setToggle] = useState(false);
    const [keyWord, setKeyWord] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLabel = useMemo(() => {
        if (loading) return "loading...";
        return options.find((opt) => opt.value === value)?.label || placeholder;
    }, [value, options, placeholder, loading]);

    const filteredOptions = useMemo(() => {
        const keywordLower = keyWord.toLowerCase();
        return options.filter((opt) =>
        opt.label.toLowerCase().includes(keywordLower)
        );
    }, [keyWord, options]);

    useEffect(() => {
        if (toggle) setHighlightedIndex(-1);
    }, [toggle, keyWord]);

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

    const handleSelect = (selected: { label: string; value: string, obj?: any }) => {
        onChange({ target: { name, value: selected.value, obj:selected.obj   } });
        setToggle(false);
        setKeyWord("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!toggle || filteredOptions.length === 0) return;

        if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(filteredOptions[highlightedIndex]);
        } else if (e.key === "Escape") {
        setToggle(false);
        }
    };

    return (
        <div className="relative py-1" ref={dropdownRef}>
            <p className="mb-[-2px]">
                {label}
                {required && <span className="text-red-400">*</span>}
            </p>

            <div className="relative">
                <button
                type="button"
                className={`w-full h-[40px] rounded-md focus:outline-none border-2 ${
                    error ? "border-red-400" : "border-slate-300 focus:border-slate-400"
                }
                    p-2 text-left
                    ${disabled ? "hover:cursor-not-allowed bg-gray-100" : "hover:cursor-pointer"}
                    `
                }
                onClick={() => setToggle((prev) => !prev)}
                disabled={disabled}
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

                    {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt, idx) => (
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

            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
};

export default SearchableDropDown;
