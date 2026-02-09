"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { PayrollContext } from "@/context/PayrollProvider";
import { useContext, useEffect, useState } from "react";
import Badge from "@/components/common/Badge";
import moment from "moment";

const TardinessHistoryCard = () => {
    const { loading, payrollDetails } = useContext(PayrollContext);

    const columnSettings = [
        {
            columnHead: "Count",
            path: "tardiness_sanction.count",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Year",
            path: "year",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Month",
            path: "month",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return moment().month(data.month - 1).format('MMM')
            }
        },
        {
            columnHead: "Total Minutes",
            path: "total_minutes",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "NTE Status",
            path: "nte_status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                if (data.nte_status) {
                    return (
                        <>
                            <p>{data.nte_status}</p>

                            { data.nte_date_sent &&
                                <>
                                <p className="text-xs">{ moment(data.nte_date_sent).format("MMMM DD, YYYY")}</p>
                                <p className="text-xs">{ moment(data.nte_date_sent).format("HH:mm:ss A")}</p>
                                </>
                            }
                        </>
                    )
                } else {
                    return "—";
                }
            }
        },
        {
            columnHead: "NOD Status",
            path: "da_status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.da_status) {
                    return (
                        <>
                            <p>{data.da_status}</p>

                            { data.da_date_sent &&
                                <>
                                <p className="text-xs">{ moment(data.da_date_sent).format("MMMM DD, YYYY")}</p>
                                <p className="text-xs">{ moment(data.da_date_sent).format("HH:mm:ss A")}</p>
                                </>
                            }
                        </>
                    )
                } else {
                    return "—";
                }
            }
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data:any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                switch(data.status) {
                    case "Approved": 
                        status = "success";
                        break;
                    case "Pending":
                        status = "warning";
                        break;
                    case "Voided":
                        status = "danger";
                        break;
                    default:
                        status = "default";
                        break;
                };

                return <Badge
                    label={data.status}
                    status={status}
                />
            }
        },
        {
            columnHead: "Deduction Status",
            path: "deduction_status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let deduction_status: "default" | "success" | "warning";
                let label: string;

                switch (data.deduction_status) {
                    case 1:
                        deduction_status = "success";
                        label = "Deducted";
                        break;
                    case 0:
                        deduction_status = "warning";
                        label = "Pending";
                        break;
                    default:
                        deduction_status = "default";
                        label = "Unknown";
                        break;
                }

                return (
                    <Badge
                        label={label}
                        status={deduction_status}
                    />
                );
            }
        },
    ];

    return (
        <>
            <Card
                size="medium"
                loading={loading}
            >
                <p className="font-semibold text-red-800 dark:text-red-500">Tardiness History</p>
                <Table
                    dataSet={payrollDetails.tardiness_offenses}
                    columnSettings={columnSettings}
                />
            </Card>
        </>
    );
};

export default TardinessHistoryCard;