"use client";
import { COLUMNTYPES } from "@/constants/column";
import _ from "lodash";
import TableLoader from "./TableLoader";

interface columnSetting {
    columnHead: string;
    path: string;
    columnType: typeof COLUMNTYPES[keyof typeof COLUMNTYPES],
    function?: (data:any) => any;
};

interface TableInterface {
    dataSet: any[];
    columnSettings: columnSetting[];
    dataKey?: string;
    loading?: boolean;
    withActions?: boolean;
    paginator?: any;
};

const Table = ({
    dataSet = [],
    columnSettings,
    dataKey = "id",
    loading = false,
    withActions = false,
    paginator
}: TableInterface) => {

    return (
        <div className="relative my-2 w-full overflow-hidden overflow-x-auto">
            <table className="w-full rounded-md min-w-[1000px]">
                <thead className="bg-gray-100">
                    <tr>
                        {
                            columnSettings.map((settings, key) => {
                                return (
                                    <th key={key}
                                        className="text-left p-2 border-slate-400 border-1 text-gray-500"
                                    >
                                        {settings.columnHead}
                                    </th>
                                )
                            })
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
                                                    className="p-2 border-1 border-slate-300 text-sm text-md"
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
                        { paginator.paginationData.links.map((link: any, key: number) => {
                            if (link.url) {
                                return (
                                    <button
                                        key={key}
                                        className={`
                                            px-2
                                            text-md
                                            ${link.active ? "bg-red-600 text-slate-50" : "bg-red-200 hover:bg-red-600 hover:text-slate-50 hover:cursor-pointer"}
                                        `}
                                        onClick={() => {
                                            if (!link.active) {
                                                if (link.label === "Next &raquo;") {
                                                    paginator.onClickSetPageNumber(paginator.paginationData.current_page + 1);
                                                } else if (link.label === "&laquo; Previous") {
                                                    paginator.onClickSetPageNumber(paginator.paginationData.current_page - 1);
                                                } else {
                                                    paginator.onClickSetPageNumber(Number(link.label));
                                                }
                                            }
                                        }}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </button>
                                )
                            }
                        })

                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default Table;