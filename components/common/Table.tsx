"use client";
import { COLUMNTYPES } from "@/constants/column";
import _ from "lodash";
import TableLoader from "./TableLoader";
import ActionDropDown from "./ActionDropDown";

interface columnSetting {
    columnHead: string;
    path: string;
    columnType: typeof COLUMNTYPES[keyof typeof COLUMNTYPES],
    function?: (data:any) => any;
};

type ActionType = {
    label: string;
    onClick: (data: any) => void;
};

interface TableInterface {
    dataSet: any[];
    columnSettings: columnSetting[];
    dataKey?: string;
    loading?: boolean;
    withActions?: boolean;
    paginator?: any;
    actions?: ActionType[]
};

const Table = ({
    dataSet = [],
    columnSettings,
    dataKey = "id",
    loading = false,
    withActions = false,
    paginator,
    actions
}: TableInterface) => {

    const currentPage = paginator.paginationData.current_page;
    const totalPages = paginator.paginationData.last_page;

    const getCustomLinks = () => {
        let pages: (string | number)[] = [];

        pages.push(1);
        if (totalPages >= 2) pages.push(2);

        if (currentPage > 4) pages.push("...");

        if (currentPage > 2 && currentPage < totalPages - 1) pages.push(currentPage);

        if (currentPage < totalPages - 3) pages.push("...");

        if (totalPages - 1 > 2) pages.push(totalPages - 1);
        if (totalPages > 2) pages.push(totalPages);

        return pages;
    };


    return (
        <div className="relative my-2 w-full">
            <table className="w-full rounded-md overflow-x-auto">
                <thead className="bg-red-800">
                    <tr>
                        {
                            columnSettings.map((settings, key) => {
                                return (
                                    <th key={key}
                                        className="text-left p-2 border-slate-300 border-1 text-zinc-100"
                                    >
                                        {settings.columnHead}
                                    </th>
                                )
                            })
                        }
                        {   withActions &&
                            <th
                                className="text-left p-2 border-slate-300 border-1 text-zinc-100"
                            >
                                Action
                            </th>
                        }
                    </tr>
                </thead>
                <tbody>
                        { loading
                            ?
                                <tr><td colSpan={withActions ? columnSettings.length + 1 : columnSettings.length} className="w-full p-2"><TableLoader/></td></tr>
                            :
                            dataSet.map((data, idx) => {
                            return (
                                <tr key={idx}>
                                    {
                                        columnSettings.map((settings, key) => {
                                            const columnData = _.get(data, settings.path) || "—";
                                            return (
                                                <td
                                                    key={key}
                                                    className=" py-1 px-2 border-1 border-slate-300 text-sm text-md"
                                                >
                                                    { settings.columnType === COLUMNTYPES.string &&
                                                       columnData
                                                    }

                                                    { settings.columnType === COLUMNTYPES.function &&
                                                        settings.function && settings.function(data)
                                                    }
                                                </td>
                                            )
                                        })
                                    }

                                    { withActions && actions &&
                                        <td
                                            className="py-1 px-2 border-1 border-slate-300 text-sm text-md"
                                        >
                                            <ActionDropDown
                                                data={data}
                                                actions={actions}
                                            />
                                        </td>
                                    }
                                </tr>       
                            )})
                        } 
                </tbody>
            </table>
            { !loading && dataSet.length > 0 &&
                <div
                    className="w-full text-md flex justify-between items-center pt-2"
                >
                    <p>Showing records {paginator.paginationData.from} to {paginator.paginationData.to} of {paginator.paginationData.total} records.</p>

                    <div className="flex gap-x-1 justify-end items-center">
                        {currentPage > 1 && (
                            <button
                                className="px-2 text-md bg-red-200 hover:bg-red-800 hover:text-slate-50 hover:cursor-pointer"
                                onClick={() => paginator.onClickSetPageNumber(currentPage - 1)}
                            >
                                Previous
                            </button>
                        )}

                        {getCustomLinks().map((item, key) => {
                            if (item === "...") {
                                return <span key={key} className="px-2">...</span>;
                            }

                            return (
                                <button
                                    key={key}
                                    className={`
                                        px-2
                                        text-md
                                        ${paginator.paginationData.current_page === item ? "bg-red-800 text-slate-50" : "bg-red-200 hover:bg-red-800 hover:text-slate-50 hover:cursor-pointer"}
                                    `}
                                    onClick={() => paginator.onClickSetPageNumber(Number(item))}
                                >
                                    {item}
                                </button>
                            );
                        })}

                        {currentPage < totalPages && (
                            <button
                                className="px-2 text-md bg-red-200 hover:bg-red-800 hover:text-slate-50 hover:cursor-pointer"
                                onClick={() => paginator.onClickSetPageNumber(currentPage + 1)}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default Table;