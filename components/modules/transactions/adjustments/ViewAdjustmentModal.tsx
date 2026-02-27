"use client";

import { editAdjustments, getAdjustment } from "@/api/transactions/adjustments";
import Button from "@/components/common/Button";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useState } from "react";
import { toast } from "react-toastify";

interface FormModalInterface {
    modal: any;
    id: number | string;
    onUpdated?: () => void;
};

const ViewAdjustmentModal = ({
    modal,
    id,
    onUpdated
}: FormModalInterface) => {

    const api = useApiCall();
    const [originalTimeKeeping, setOriginalTimeKeeping] = useState<any[]>([]);
    const [adjustedTimeKeeping, setAdjustedTimeKeeping] = useState<any[]>([]);
    const [adjustmentDetails, setAdjustmentDetails] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editValues, setEditValues] = useState<any>({
        taxable_amount: "",
        correct_amount_paid: ""
    });

    const columnSettings = [
        {
            columnHead: "Actual Worked Hours",
            path: "worked_hours",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                return (
                    <p className="font-semibold">
                        {Math.floor((data.worked_hours ?? 0) * 2) / 2 }
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
                        {Math.floor((data.final_worked_hours ?? 0) * 2) / 2 }
                    </p>
                );
            }
        },
        {
            columnHead: "Tardiness",
            path: "tardiness",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                if (data.tardiness == 0 || data.tardiness == null) {
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
                if (data.undertime == 0 || data.undertime == null) {
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
    
    useAsyncEffect(() => {
        if ( modal.isShowing ) {
            api.setLoading(true);
            getAdjustment(String(id))
            .then((resp) => {
                if (!resp.error) {
                    setAdjustedTimeKeeping([{...resp.data.adjustment_timekeeping}]);
                    setOriginalTimeKeeping([{...resp.data.original_timekeeping}]);
                    setAdjustmentDetails(resp.data.adjustment);
                    setEditValues({
                        taxable_amount: resp.data.adjustment?.taxable_amount ?? "",
                        correct_amount_paid: resp.data.adjustment?.correct_amount_paid ?? ""
                    });
                    setIsEditing(false);
                } else {
                    toast.error("Error fetching adjustment details");
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [id, modal.isShowing]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Adjustment Details"
            onClose={() => {
                modal.onClose();
                setAdjustedTimeKeeping([]);
                setOriginalTimeKeeping([]);
                setIsEditing(false);
                onUpdated?.();
            }}
            loading={api.loading}
            size="xxl"
        >
            <p>Original Timekeeping</p>
            <Table
                columnSettings={[
                    {
                        columnHead: "Schedule",
                        path: "schedule.timetable",
                        columnType: COLUMNTYPES.string
                    },
                    ...columnSettings
                ]}
                dataSet={originalTimeKeeping}
                smallText
            />
            <p className="mt-3">Adjusted Timekeeping</p>
            <Table
                columnSettings={columnSettings}
                dataSet={adjustedTimeKeeping}
                smallText
            />
            <p className="mt-3">Adjustment Details</p>
            <Grid cols={3}>
                <Textfield
                    label="Date"
                    disabled={true}
                    value={adjustmentDetails.date ?? ""}
                />
                <Textfield
                    label="Adjustment Type"
                    disabled={true}
                    value={adjustmentDetails.type ?? ""}
                />
                <Textfield
                    label="Schedule"
                    disabled={true}
                    value={adjustmentDetails.actual_schedule ?? ""}
                />
                <Textfield
                    label="Amount Paid"
                    disabled={true}
                    value={adjustmentDetails.amount_paid ?? ""}
                />
                <Textfield
                    label="Adjusted Amount"
                    disabled={!isEditing}
                    type="text"
                    value={editValues.correct_amount_paid ?? ""}
                    onChange={(e) => {
                        setEditValues((prev: any) => ({
                            ...prev,
                            correct_amount_paid: e.target.value
                        }));
                    }}
                />
                <Textfield
                    label="Taxable Adjustment"
                    disabled={!isEditing}
                    type="text"
                    value={editValues.taxable_amount ?? ""}
                    onChange={(e) => {
                        setEditValues((prev: any) => ({
                            ...prev,
                            taxable_amount: e.target.value
                        }));
                    }}
                />
            </Grid>
            <hr className="mt-6 pb-2 text-slate-300"/>
            <div className="flex justify-end gap-x-2">
                {adjustmentDetails.status !== "Adjusted" && !isEditing && (
                    <div className="w-[120px]">
                        <Button
                            label="Edit"
                            onClick={() => {
                                setEditValues({
                                    taxable_amount: adjustmentDetails.taxable_amount ?? "",
                                    correct_amount_paid: adjustmentDetails.correct_amount_paid ?? ""
                                });
                                setIsEditing(true);
                            }}
                        />
                    </div>
                )}
                {adjustmentDetails.status !== "Adjusted" && isEditing && (
                    <div className="w-[120px]">
                        <Button
                            label="Save"
                            variant="success"
                            loading={saving}
                            onClick={() => {
                                const taxableAmount = Number(editValues.taxable_amount);
                                const correctAmountPaid = Number(editValues.correct_amount_paid);

                                if (Number.isNaN(taxableAmount) || Number.isNaN(correctAmountPaid)) {
                                    toast.error("Please enter valid amounts");
                                    return;
                                }

                                setSaving(true);
                                editAdjustments({
                                    taxable_amount: taxableAmount,
                                    correct_amount_paid: correctAmountPaid
                                }, String(id))
                                .then((resp) => {
                                    if (!resp.error) {
                                        toast.success(resp.data.message || "Adjustment updated");
                                        setAdjustmentDetails(resp.data.adjustment);
                                        setEditValues({
                                            taxable_amount: resp.data.adjustment?.taxable_amount ?? "",
                                            correct_amount_paid: resp.data.adjustment?.correct_amount_paid ?? ""
                                        });
                                        setIsEditing(false);
                                        onUpdated?.();
                                    } else {
                                        toast.error(resp.data.message || "Unable to update adjustment");
                                    }
                                })
                                .catch(() => {
                                    toast.error("Error encountered");
                                })
                                .finally(() => {
                                    setSaving(false);
                                });
                            }}
                        />
                    </div>
                )}
                {adjustmentDetails.status !== "Adjusted" && isEditing && (
                    <div className="w-[120px]">
                        <Button
                            label="Cancel Edit"
                            variant="secondary"
                            onClick={() => {
                                setEditValues({
                                    taxable_amount: adjustmentDetails.taxable_amount ?? "",
                                    correct_amount_paid: adjustmentDetails.correct_amount_paid ?? ""
                                });
                                setIsEditing(false);
                            }}
                        />
                    </div>
                )}
                <div className="w-[120px]">
                    <Button
                        label="Close"
                        variant="secondary"
                        onClick={() => {
                            modal.onClose();
                            setAdjustedTimeKeeping([]);
                            setOriginalTimeKeeping([]);
                            setIsEditing(false);
                            onUpdated?.();
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ViewAdjustmentModal;
