"use client";

import { getTaxRefundComputation } from "@/api/compensation/last-pay";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { formatNumber } from "@/helper/amount";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    data: any;
}

const TaxRefundComputationModal = ({
    modal,
    data,
}: ModalInterface) => {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!modal.isShowing || !data?.id) {
            setReport(null);
            setLoading(false);
            setError(false);
            return;
        }

        setLoading(true);
        setError(false);
        getTaxRefundComputation(data.id)
            .then((resp) => {
                if (!resp?.error) {
                    setReport(resp.data);
                } else {
                    setError(true);
                    toast.error(resp?.data?.message ?? "Error fetching tax refund computation");
                }
            })
            .catch(() => {
                setError(true);
                toast.error("Error fetching tax refund computation");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [modal.isShowing, data?.id]);

    const rows = report?.rows ?? [];
    const totals = report?.totals ?? {};
    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Tax Refund Computation"
            onClose={modal.onClose}
            loading={loading}
            error={error}
            size="entireScreen"
        >
            <style jsx global>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 10mm;
                    }

                    body * {
                        visibility: hidden;
                    }

                    .tax-refund-print-area,
                    .tax-refund-print-area * {
                        visibility: visible;
                    }

                    .tax-refund-print-area {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        max-width: none !important;
                        min-height: auto !important;
                        box-shadow: none !important;
                        border: 1px solid #000 !important;
                    }

                    .tax-refund-print-wrapper {
                        background: #fff !important;
                        padding: 0 !important;
                    }

                    .tax-refund-no-print {
                        display: none !important;
                    }
                }
            `}</style>
            <div className="tax-refund-no-print flex justify-end mb-3">
                <div className="w-[120px]">
                    <Button
                        label="Print"
                        onClick={handlePrint}
                        disabled={!report}
                    />
                </div>
            </div>
            <div className="tax-refund-print-wrapper bg-neutral-400 p-6">
                <div className="tax-refund-print-area bg-white text-black mx-auto w-full max-w-[1120px] min-h-[620px] px-8 py-7 shadow-lg border border-neutral-900">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-lg font-bold">SAVORY FASTFOOD INC.</p>
                            <p className="text-sm font-bold">TAX REFUND COMPUTATION REPORT</p>
                        </div>
                        <p className="text-xs font-bold">
                            DATE PRINTED : <span className="ml-3">{report?.date_printed ?? moment().format("MM/DD/YYYY")}</span>
                        </p>
                    </div>

                    <div className="mt-14">
                        <p className="text-xs font-bold">{report?.employee?.full_name}</p>
                        <p className="text-xs">
                            {report?.employee?.employee_number}
                            {report?.period?.start && report?.period?.end && (
                                <span className="ml-4">
                                    Period: {moment(report.period.start).format("MMM DD, YYYY")} - {moment(report.period.end).format("MMM DD, YYYY")}
                                </span>
                            )}
                        </p>
                    </div>

                    <table className="w-full mt-4 text-xs">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="text-left py-2 w-[180px]"></th>
                                <th className="text-left py-2">CODE</th>
                                <th className="text-left py-2">MONTHS</th>
                                <th className="text-right py-2">REG/GROSS</th>
                                <th className="text-right py-2">SSS</th>
                                <th className="text-right py-2">PHIC</th>
                                <th className="text-right py-2">HDMF</th>
                                <th className="text-right py-2">TAXABLE<br />INCOME</th>
                                <th className="text-right py-2">TAX<br />W/ HELD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center py-8">No final payroll found for this tax refund period.</td>
                                </tr>
                            )}
                            {rows.map((row: any, index: number) => (
                                <tr key={`${row.month}-${index}`}>
                                    <td className="py-1">{index === 0 ? report?.employee?.full_name : ""}</td>
                                    <td className="py-1">{row.code ?? ""}</td>
                                    <td className="py-1">{row.month}</td>
                                    <td className="py-1 text-right">{formatNumber(row.regular_gross ?? 0)}</td>
                                    <td className="py-1 text-right">{formatNumber(row.sss ?? 0)}</td>
                                    <td className="py-1 text-right">{formatNumber(row.phic ?? 0)}</td>
                                    <td className="py-1 text-right">{formatNumber(row.hdmf ?? 0)}</td>
                                    <td className="py-1 text-right">{formatNumber(row.taxable_income ?? 0)}</td>
                                    <td className="py-1 text-right">{formatNumber(row.tax_withheld ?? 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-black font-bold">
                                <td className="py-3" colSpan={3}></td>
                                <td className="py-3 text-right">{formatNumber(totals.regular_gross ?? 0)}</td>
                                <td className="py-3 text-right">{formatNumber(totals.sss ?? 0)}</td>
                                <td className="py-3 text-right">{formatNumber(totals.phic ?? 0)}</td>
                                <td className="py-3 text-right">{formatNumber(totals.hdmf ?? 0)}</td>
                                <td className="py-3 text-right">{formatNumber(totals.taxable_income ?? 0)}</td>
                                <td className="py-3 text-right">{formatNumber(totals.tax_withheld ?? 0)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="flex justify-end mt-6 text-xs">
                        <div className="w-[280px] space-y-1">
                            <div className="flex justify-between">
                                <span>Annual Tax Due</span>
                                <span>{formatNumber(totals.annual_tax_due ?? 0)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Computed Tax Refund</span>
                                <span>{formatNumber(totals.computed_tax_refund ?? 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Stored Last Pay Tax Refund</span>
                                <span>{formatNumber(report?.last_pay?.stored_tax_refund ?? 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Difference</span>
                                <span>{formatNumber(totals.difference_from_stored_tax_refund ?? 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TaxRefundComputationModal;
