"use client";

import { getAdjustment } from "@/api/transactions/adjustments";
import Button from "@/components/common/Button";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FormModalInterface {
    modal: any;
    data: any
};

const ViewTimeKeepingModal = ({
    modal,
    data
}: FormModalInterface) => {

    const [originalTimeKeeping, setOriginalTimeKeeping] = useState<any[]>([]);
    const [adjustedTimeKeeping, setAdjustedTimeKeeping] = useState<any[]>([]);

    const columnSettings = [
        {
            columnHead: "Date",
            path: "date",
            columnType: COLUMNTYPES.date,
        },
        {
            columnHead: "Schedule",
            path: "schedule.timetable",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Actual Worked Hours",
            path: "worked_hours",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p className="font-semibold">
                        {Math.floor(data.worked_hours * 2) / 2 }
                    </p>
                );
            }
        },
        {
            columnHead: "Final Worked Hours",
            path: "final_worked_hours",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p className="font-semibold">
                        {Math.floor(data.final_worked_hours * 2) / 2 }
                    </p>
                );
            }
        },
        {
            columnHead: "Tardiness",
            path: "tardiness",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.tardiness == 0) {
                    return "—";
                }

                return (
                    <p className="font-semibold text-red-500">
                        {Math.floor(Number(data.tardiness)) }
                    </p>
                );
            }
        },
        {
            columnHead: "Undertime",
            path: "undertime",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.undertime == 0) {
                    return "—";
                }

                return (
                    <p className="font-semibold text-red-500">
                        {Math.floor(Number(data.undertime)) }
                    </p>
                );
            }
        },
        {
            columnHead: "Computed Overtime",
            path: "regular_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Night Diff Hours",
            path: "night_diff_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Night Diff Overtime",
            path: "night_diff_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday Hours",
            path: "legal_holiday_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Legal Holiday Overtime",
            path: "legal_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday Hours",
            path: "special_holiday_hours",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Special Holiday Overtime",
            path: "special_holiday_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Approved Overtime",
            path: "approved_overtime",
            columnType: COLUMNTYPES.timekeeping
        },
        {
            columnHead: "Travel Time",
            path: "travel_time",
            columnType: COLUMNTYPES.timekeeping
        },
    ];

    useEffect(() => {
        if (modal.isShowing) {
            setOriginalTimeKeeping([{...data.timekeeping}]);
            setAdjustedTimeKeeping([{...data.adjustment_timekeeping}]);
        }
    }, [modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Timekeeping"
            onClose={() => {
                modal.onClose();
            }}
            size="xxl"
        >
            { data.timekeeping_id &&
                <>
                    <p>Original Timekeeping</p>
                    <Table
                        columnSettings={columnSettings}
                        dataSet={originalTimeKeeping}
                        smallText
                    />
                </>
            }
            { data.adjustment_timekeeping_id &&
                <>
                    <p className="mt-3">Adjusted Timekeeping</p>
                    <Table
                        columnSettings={columnSettings}
                        dataSet={adjustedTimeKeeping}
                        smallText
                    />
                </>
            }
            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end">
                <div>
                    <Button
                        label="Cancel"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                        }}
                    />            
                </div>
            </div>
        </Modal>
    );
};

export default ViewTimeKeepingModal;