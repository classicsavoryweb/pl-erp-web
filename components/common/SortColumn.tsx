"use client";

import { useState } from "react";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';

interface SortInterface {
    sortColumn: (e: any) => void;
    path: string;
}

const SortColumn = ({
    sortColumn,
    path
}: SortInterface) => {
    const [order, setOrder] = useState<"ASC" | "DESC" | "" >("");
    return (
        <div className="flex justify-start -space-x-1.5">
            <button
                className={`hover:cursor-pointer`}
                onClick={() => {
                    setOrder("ASC");
                    sortColumn({
                        sortColumn: path,
                        sort: "ASC",
                        submit: true,
                    });
                }}
            >
                <ExpandLessOutlinedIcon
                    className={`${order === "ASC" ? "text-slate-100" : "text-slate-400"}`}
                    style={{ width: '25px', height: '25px' }}
                />
            </button>

            <button
                className={`hover:cursor-pointer`}
                onClick={() => {
                    setOrder("DESC");
                    sortColumn({
                        sortColumn: path,
                        sort: "DESC",
                        submit: true,
                    });
                }}
            >
                <ExpandMoreOutlinedIcon
                    className={`${order === "DESC" ? "text-slate-100" : "text-slate-400"}`}
                    style={{ width: '25px', height: '25px' }}
                />
            </button>
        </div>
    );
};

export default SortColumn;