"use client";
import { COLUMNTYPES } from "@/constants/column";
import _ from "lodash";

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
};

const Table = ({
    dataSet = [],
    columnSettings,
    dataKey = "id",
}: TableInterface) => {

    return (
        <div className="relative my-2 w-full overflow-hidden overflow-x-auto">
            <table className="w-full border border-collapse border-slate-400 rounded-md min-w-[1000px]">
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
                        { dataSet.map((data, idx) => {
                            return (
                                <tr key={idx}>
                                    {
                                        columnSettings.map((settings, key) => {
                                            const columnData = _.get(data, settings.path) || "—";
                                            return (
                                                <td
                                                    key={key}
                                                    className="p-2 border-1 border-slate-300 text-sm text-gray-500"
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
        </div>
    );
};

export default Table;