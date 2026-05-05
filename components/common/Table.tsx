"use client";
import { COLUMNTYPES } from "@/constants/column";
import _ from "lodash";
import TableLoader from "./TableLoader";
import ActionDropDown from "./ActionDropDown";
import moment from 'moment';
import Badge from "./Badge";
import EmptyState from "./EmptyState";
import Checkbox from "./Checkbox";
import { useEffect, useState } from "react";
import SortColumn from "./SortColumn";

interface columnSetting {
    columnHead: string;
    path: string;
    columnType: typeof COLUMNTYPES[keyof typeof COLUMNTYPES],
    function?: (data:any) => any;
    sort?: boolean;
};

type ActionType = {
    label: string;
    onClick: (data: any) => void;
    permission?: string | string[];
    disabled?: boolean;
};

interface TableInterface {
    dataSet: any[];
    columnSettings: columnSetting[];
    dataKey?: string;
    loading?: boolean;
    withActions?: boolean;
    paginator?: any;
    actions?: ActionType[];
    withCheckBox?: boolean;
    onCheck?: (e: any) => void;
    canSortColumns?: boolean;
    onSort?: (e: any) => void;
    smallText?: boolean;
    initialSelectedRows?: any[];
    resetRows?: boolean;
    permissions?: string[];
};

const Table = ({
    dataSet = [],
    columnSettings,
    dataKey = "id",
    loading = false,
    withActions = false,
    paginator,
    actions,
    withCheckBox = false,
    onCheck,
    canSortColumns,
    onSort,
    smallText,
    initialSelectedRows = [],
    resetRows = false,
    permissions = [],
}: TableInterface) => {

    const currentPage = paginator && paginator.paginationData.current_page;
    const totalPages = paginator && paginator.paginationData.last_page;
    const [selectedRows, setSelectedRows] = useState<any[]>(initialSelectedRows);
    moment.locale('eng');

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

    useEffect(() => {
        setSelectedRows(initialSelectedRows);
    }, [resetRows]);

    return (

        <div className={`relative my-1 w-full ${smallText ? "text-[12px]" : "text-[13px]"}`}>
            <div className="overflow-x-auto">
            <table className="table-auto w-full rounded-md dark:text-slate-200 dark:bg-neutral-800">
                <thead className="bg-red-800">
                    <tr>
                        { withCheckBox &&
                            <th
                                className="text-left p-2 border-slate-300 dark:border-neutral-700 border-1 text-zinc-100 hover:cursor-pointer"
                                onClick={() => {
                                    let newDataset = [];
                                    if (selectedRows.length === dataSet.length) {
                                        newDataset = [];
                                    } else {
                                        newDataset = dataSet.map((data) => {
                                            const val = _.get(data, dataKey);
                                            return val;
                                        })
                                    }

                                    setSelectedRows(newDataset);
                                    onCheck && onCheck(newDataset);
                                }}
                            >
                                Select All
                            </th>
                        }
                        {
                            columnSettings.map((settings, key) => {
                                return (
                                    <th key={key}
                                        className={`
                                            text-left p-2 border-slate-300 dark:border-neutral-700 border-1 text-zinc-100
                                        `}
                                    >
                                        { canSortColumns 
                                            ?
                                            <div className="flex justify-between items-center">
                                                <p>
                                                    {settings.columnHead}
                                                </p>
                                                { (canSortColumns && settings.sort) &&
                                                    <SortColumn
                                                        sortColumn={(sortSetting) => {
                                                            onSort && onSort(sortSetting);
                                                        }}
                                                        path={settings.path}
                                                    />
                                                }
                                            </div>
                                            :
                                            <p>
                                                {settings.columnHead}
                                            </p>
                                        }
                                    </th>
                                )
                            })
                        }
                        {   withActions &&
                            <th
                                className="text-left p-2 border-slate-300 dark:border-neutral-700 border-1 text-zinc-100"
                            >
                                Action
                            </th>
                        }
                    </tr>
                </thead>
                <tbody>
                        { loading &&
                            <tr>
                                <td colSpan={withActions ? columnSettings.length + 1 : columnSettings.length} className="w-full p-2">
                                    <TableLoader/>
                                </td>
                            </tr>
                        }
                        { (!loading && dataSet.length > 0 ) &&
                            dataSet.map((data, idx) => {
                                const val = _.get(data, dataKey);
                                return (
                                    <tr key={idx}>
                                        { withCheckBox &&
                                            <td
                                                className={` py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700`}
                                            >
                                                <div
                                                    className="flex justify-center"
                                                >
                                                    <Checkbox
                                                        checked={selectedRows.includes(Number(val))}
                                                        value={val}
                                                        onChange={(e:any) => {
                                                            const value = e.target.value;
                                                            var selectedTransactions = selectedRows;
                                                            if (e.target.checked) {
                                                                selectedTransactions = [
                                                                    ...selectedTransactions,
                                                                    Number(value)
                                                                ] 
                                                            } else {
                                                                selectedTransactions = selectedTransactions.filter(sel => Number(sel) !== Number(value))
                                                            }

                                                            setSelectedRows(selectedTransactions);
                                                            onCheck && onCheck(selectedTransactions);
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        }
                                        {
                                            columnSettings.map((settings, key) => {
                                                const columnData = _.get(data, settings.path) || "—";
                                                return (
                                                    <td
                                                        key={key}
                                                        className={`py-[10px] px-2 border-1 border-slate-300 dark:border-neutral-700 max-w-[350px]`}
                                                    >
                                                        { settings.columnType === COLUMNTYPES.string &&
                                                            columnData
                                                        }
                                                        { (settings.columnType === COLUMNTYPES.timestamp) &&
                                                            <>
                                                                {
                                                                    columnData === "—" 
                                                                    ? "—" 
                                                                    : moment(columnData).format("MMMM DD, YYYY HH:mm:ss A")
                                                                }
                                                            </>
                                                        }
                                                        { (settings.columnType === COLUMNTYPES.date) &&
                                                            <>
                                                                {
                                                                    columnData === "—" 
                                                                    ? "—" 
                                                                    : moment(columnData).format("MMMM DD, YYYY")     
                                                                }
                                                            </>
                                                        }
                                                        { (settings.columnType === COLUMNTYPES.timekeeping) &&
                                                            <>
                                                                {
                                                                    columnData == "0" || columnData == "—" || columnData == null
                                                                    ? "—" 
                                                                    : Math.floor(columnData * 2) / 2    
                                                                }
                                                            </>
                                                        }
                                                        { (settings.columnType === COLUMNTYPES.minutes) &&
                                                            <>
                                                                {
                                                                    columnData == "0"  
                                                                    ? "—" 
                                                                    : Math.floor(Number(columnData)) 
                                                                }
                                                            </>
                                                        }
                                                        { settings.columnType === COLUMNTYPES.function &&
                                                            settings.function && settings.function(data)
                                                        }
                                                        { settings.columnType === COLUMNTYPES.amount && 
                                                            <>
                                                                {
                                                                    columnData == "" || columnData == null || isNaN(columnData)
                                                                    ? "—" 
                                                                    : Number(columnData).toLocaleString('en-US', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    })
                                                                }
                                                            </>
                                                        }
                                                        { settings.columnType === COLUMNTYPES.status &&
                                                            <Badge status={["inactive", "voided"].includes(String(columnData).toLowerCase()) ? "danger" : "success"} label={columnData}/>
                                                        }
                                                    </td>
                                                )
                                            })
                                        }
    
                                        { withActions && actions &&
                                            <td
                                                className="px-2 border-1 border-slate-300 dark:border-neutral-700 "
                                            >
                                                <ActionDropDown
                                                    data={data}
                                                    actions={actions}
                                                    permissions={permissions}
                                                />
                                            </td>
                                        }
                                    </tr>       
                                )})
                        }
                        { (!loading && dataSet.length) === 0 &&
                            <tr>
                                <td colSpan={withActions ? columnSettings.length + 1 : columnSettings.length} className="w-full p-2 text-center">
                                    <EmptyState/>
                                    <p className="">No data available...</p>
                                </td>
                            </tr>

                        }
                </tbody>
            </table>          
            </div>
            { !loading && paginator && dataSet.length > 0 &&
                <div
                    className="w-full  flex justify-between items-center pt-2"
                >
                    <p className="dark:text-slate-200">Showing {paginator.paginationData.from} to {paginator.paginationData.to} of {paginator.paginationData.total} records.</p>

                    <div className="flex gap-x-1 justify-end items-center">
                        {currentPage > 1 && (
                            <button
                                className="px-2 text-gray-600  bg-red-200 hover:bg-red-800 hover:text-slate-50 hover:cursor-pointer"
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
                                        
                                        ${paginator.paginationData.current_page === item ? "bg-red-800 text-slate-50" : "bg-red-200 text-gray-600 hover:bg-red-800 hover:text-slate-50 hover:cursor-pointer"}
                                    `}
                                    onClick={() => paginator.paginationData.current_page !== item && paginator.onClickSetPageNumber(Number(item))}
                                >
                                    {item}
                                </button>
                            );
                        })}

                        {currentPage < totalPages && (
                            <button
                                className="px-2  bg-red-200 hover:bg-red-800 hover:text-slate-50 hover:cursor-pointer text-gray-600"
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
