"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

const BILLS = [1000, 500, 200, 100, 50, 20];
const COINS = [10, 5, 1, 0.25];

const formatAmount = (value: number) =>
    value.toLocaleString("en-PH", { style: "currency", currency: "PHP" });

export interface DenominationEntry {
    value: number;
    quantity: number;
}

interface Props {
    modal: any;
    changeAmount: number;
    loading: boolean;
    onConfirm: (denominations: DenominationEntry[]) => void;
    onCancel: () => void;
}

const PostLiquidationDenominationModal = ({ modal, changeAmount, loading, onConfirm, onCancel }: Props) => {
    const [quantities, setQuantities] = useState<Record<string, string>>({});

    useEffect(() => {
        if (modal.isShowing) setQuantities({});
    }, [modal.isShowing]);

    const handleQtyChange = (denom: number, value: string) => {
        if (value === "" || /^\d+$/.test(value)) {
            setQuantities((prev) => ({ ...prev, [String(denom)]: value }));
        }
    };

    const computeSubtotal = (denom: number) => {
        const qty = parseInt(quantities[String(denom)] || "0", 10);
        return isNaN(qty) ? 0 : Math.round(qty * denom * 100) / 100;
    };

    const total = [...BILLS, ...COINS].reduce(
        (sum, d) => Math.round((sum + computeSubtotal(d)) * 100) / 100,
        0
    );

    const difference = Math.round((total - changeAmount) * 100) / 100;
    const isValid = difference === 0 && total > 0;

    const handleSubmit = () => {
        if (!isValid) return;
        const result = [...BILLS, ...COINS]
            .filter((d) => parseInt(quantities[String(d)] || "0", 10) > 0)
            .map((d) => ({ value: d, quantity: parseInt(quantities[String(d)], 10) }));
        onConfirm(result);
    };

    const renderRows = (denoms: number[]) =>
        denoms.map((d) => {
            const subtotal = computeSubtotal(d);
            return (
                <tr key={d} className="border-t dark:border-neutral-700">
                    <td className="px-3 py-2 whitespace-nowrap">{formatAmount(d)}</td>
                    <td className="px-3 py-2 w-28">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={quantities[String(d)] ?? ""}
                            onChange={(e) => handleQtyChange(d, e.target.value)}
                            placeholder="0"
                            className="w-full text-center border-2 border-slate-300 dark:border-neutral-700 rounded-md py-1 px-2 text-sm focus:outline-none focus:border-slate-400 dark:bg-neutral-800"
                        />
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums w-32 whitespace-nowrap">
                        {subtotal > 0 ? formatAmount(subtotal) : "—"}
                    </td>
                </tr>
            );
        });

    return (
        <Modal
            isShowing={modal.isShowing}
            onClose={onCancel}
            title="Return Change — Denomination Breakdown"
            size="md"
        >
            <div className="mb-4 p-3 bg-gray-100 dark:bg-neutral-800 rounded flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-neutral-400 font-semibold">Change Amount</span>
                <span className="font-bold text-red-700 dark:text-red-400 text-base tabular-nums">
                    {formatAmount(changeAmount)}
                </span>
            </div>

            <div className="overflow-x-auto border dark:border-neutral-700 rounded">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-neutral-800">
                        <tr>
                            <th className="text-left px-3 py-2">Denomination</th>
                            <th className="text-center px-3 py-2">Qty (pcs)</th>
                            <th className="text-right px-3 py-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                colSpan={3}
                                className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-neutral-900"
                            >
                                Bills
                            </td>
                        </tr>
                        {renderRows(BILLS)}
                        <tr>
                            <td
                                colSpan={3}
                                className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-neutral-900"
                            >
                                Coins
                            </td>
                        </tr>
                        {renderRows(COINS)}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-slate-300 dark:border-neutral-600 font-semibold">
                            <td className="px-3 py-2" colSpan={2}>
                                Total
                            </td>
                            <td
                                className={`px-3 py-2 text-right tabular-nums ${
                                    isValid
                                        ? "text-green-600 dark:text-green-400"
                                        : total > 0
                                        ? "text-red-500"
                                        : ""
                                }`}
                            >
                                {formatAmount(total)}
                            </td>
                        </tr>
                        {!isValid && total > 0 && (
                            <tr>
                                <td colSpan={3} className="px-3 pb-2 text-right text-xs text-red-500">
                                    {difference > 0
                                        ? `Over by ${formatAmount(difference)}`
                                        : `Short by ${formatAmount(Math.abs(difference))}`}
                                </td>
                            </tr>
                        )}
                    </tfoot>
                </table>
            </div>

            <hr className="mt-5 mb-3 border-slate-200 dark:border-neutral-700" />
            <div className="flex justify-end gap-x-2">
                <Button label="Cancel" variant="secondary" type="button" onClick={onCancel} />
                <Button
                    label="Confirm & Post"
                    loading={loading}
                    disabled={!isValid}
                    onClick={handleSubmit}
                />
            </div>
        </Modal>
    );
};

export default PostLiquidationDenominationModal;
