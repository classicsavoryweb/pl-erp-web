import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import confirm from "@/components/common/Confirm";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
    getBir1601C,
    updateBir1601C,
    finalizeBir1601C,
    exportBir1601CReport,
    generateBir1601C,
} from "@/api/reports/reports-bir-1601c";

interface ModalInterface {
    modal: any;
    id: any;
    onSubmitCallback: () => void;
}

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const amount = (value: any) =>
    Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const AmountRow = ({
    label,
    name,
    value,
    onChange,
    disabled = true,
}: {
    label: string;
    name?: string;
    value: any;
    onChange?: (e: any) => void;
    disabled?: boolean;
}) => (
    <div className="flex justify-between items-center gap-x-3 py-[3px]">
        <span className="text-sm">{label} :</span>
        {disabled ? (
            <div className="w-[150px] h-[30px] flex items-center justify-end px-2 rounded-md bg-gray-100 border-2 border-slate-200 text-sm dark:bg-neutral-800 dark:border-neutral-700">
                {amount(value)}
            </div>
        ) : (
            <input
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                className="w-[150px] h-[30px] text-right rounded-md border-2 border-slate-300 focus:border-slate-400 focus:outline-none px-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"
            />
        )}
    </div>
);

const cellInput = (extra?: string) =>
    `w-full h-[32px] rounded-md border-2 border-slate-300 focus:border-slate-400 focus:outline-none px-2 text-sm dark:bg-neutral-900 dark:border-neutral-700 ${extra ?? ""}`;

const ViewBir1601CModal = ({
    modal,
    id,
    onSubmitCallback
}: ModalInterface
) => {
    const [record, setRecord] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [recomputing, setRecomputing] = useState(false);

    const isFinal = record?.status === "final";

    const formHandler = useFormik({
        initialValues: {
            total_compensation: "0",
            statutory_minimum_wage: "0",
            holiday_pay_ot_ndf: "0",
            thirteenth_month_pay: "0",
            de_minimis_benefits: "0",
            ee_contributions: "0",
            other_non_taxable_compensation: "0",
            total_taxable_compensation: "0",
            taxable_compensation_not_subject_to_wtax: "0",
            net_taxable_compensation: "0",
            total_taxes_withheld: "0",
            add_less_adjustment: "0",
            total_remittance: "0",
            tax_still_due: "0",
            total_amount_due: "0",
            previous_month_1_period: "",
            previous_month_1_date_paid: "",
            previous_month_1_bank: "",
            previous_month_1_ror_number: "",
            previous_month_1_tax_paid: "0",
            previous_month_1_tax_due: "0",
            previous_month_2_period: "",
            previous_month_2_date_paid: "",
            previous_month_2_bank: "",
            previous_month_2_ror_number: "",
            previous_month_2_tax_paid: "0",
            previous_month_2_tax_due: "0",
            previous_month_3_period: "",
            previous_month_3_date_paid: "",
            previous_month_3_bank: "",
            previous_month_3_ror_number: "",
            previous_month_3_tax_paid: "0",
            previous_month_3_tax_due: "0",
            remarks: "",
        },
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            updateBir1601C(id, values)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Saved.");
                        setRecord(resp.data);
                        onSubmitCallback();
                    } else {
                        toast.error(resp.data?.message ?? "Error encountered");
                    }
                })
                .catch(() => {
                    toast.error("Error encountered");
                })
                .finally(() => {
                    setSubmitting(false);
                });
        }
    });

    const totalNonTaxable = Number(formHandler.values.statutory_minimum_wage ?? 0)
        + Number(formHandler.values.holiday_pay_ot_ndf ?? 0)
        + Number(formHandler.values.thirteenth_month_pay ?? 0)
        + Number(formHandler.values.de_minimis_benefits ?? 0)
        + Number(formHandler.values.ee_contributions ?? 0)
        + Number(formHandler.values.other_non_taxable_compensation ?? 0);

    const applyRecord = (data: any) => {
        setRecord(data);
        formHandler.setValues({
            total_compensation: String(data.total_compensation ?? 0),
            statutory_minimum_wage: String(data.statutory_minimum_wage ?? 0),
            holiday_pay_ot_ndf: String(data.holiday_pay_ot_ndf ?? 0),
            thirteenth_month_pay: String(data.thirteenth_month_pay ?? 0),
            de_minimis_benefits: String(data.de_minimis_benefits ?? 0),
            ee_contributions: String(data.ee_contributions ?? 0),
            other_non_taxable_compensation: String(data.other_non_taxable_compensation ?? 0),
            total_taxable_compensation: String(data.total_taxable_compensation ?? 0),
            taxable_compensation_not_subject_to_wtax: String(data.taxable_compensation_not_subject_to_wtax ?? 0),
            net_taxable_compensation: String(data.net_taxable_compensation ?? 0),
            total_taxes_withheld: String(data.total_taxes_withheld ?? 0),
            add_less_adjustment: String(data.add_less_adjustment ?? 0),
            total_remittance: String(data.total_remittance ?? 0),
            tax_still_due: String(data.tax_still_due ?? 0),
            total_amount_due: String(data.total_amount_due ?? 0),
            previous_month_1_period: data.previous_month_1_period ?? "",
            previous_month_1_date_paid: data.previous_month_1_date_paid ?? "",
            previous_month_1_bank: data.previous_month_1_bank ?? "",
            previous_month_1_ror_number: data.previous_month_1_ror_number ?? "",
            previous_month_1_tax_paid: String(data.previous_month_1_tax_paid ?? 0),
            previous_month_1_tax_due: String(data.previous_month_1_tax_due ?? 0),
            previous_month_2_period: data.previous_month_2_period ?? "",
            previous_month_2_date_paid: data.previous_month_2_date_paid ?? "",
            previous_month_2_bank: data.previous_month_2_bank ?? "",
            previous_month_2_ror_number: data.previous_month_2_ror_number ?? "",
            previous_month_2_tax_paid: String(data.previous_month_2_tax_paid ?? 0),
            previous_month_2_tax_due: String(data.previous_month_2_tax_due ?? 0),
            previous_month_3_period: data.previous_month_3_period ?? "",
            previous_month_3_date_paid: data.previous_month_3_date_paid ?? "",
            previous_month_3_bank: data.previous_month_3_bank ?? "",
            previous_month_3_ror_number: data.previous_month_3_ror_number ?? "",
            previous_month_3_tax_paid: String(data.previous_month_3_tax_paid ?? 0),
            previous_month_3_tax_due: String(data.previous_month_3_tax_due ?? 0),
            remarks: data.remarks ?? "",
        });
    };

    useEffect(() => {
        if (modal.isShowing && id) {
            setLoading(true);
            getBir1601C(id)
                .then((resp) => {
                    if (!resp.error) {
                        applyRecord(resp.data);
                    } else {
                        toast.error("Error fetching 1601-C record");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modal.isShowing, id]);

    const handleRecompute = async () => {
        const isConfirmed = await confirm({
            title: "Auto Compute",
            message: "This recomputes Section A from payroll data for this period. Manual entries are kept. Continue?"
        });

        if (!isConfirmed) return;

        setRecomputing(true);
        generateBir1601C({ year: record.year, month: record.month })
            .then((resp) => {
                if (!resp.error) {
                    toast.success("Recomputed.");
                    applyRecord(resp.data);
                    onSubmitCallback();
                } else {
                    toast.error(resp.data?.message ?? "Error encountered");
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => setRecomputing(false));
    };

    const handleFinalize = async () => {
        const isConfirmed = await confirm({
            title: "Finalize 1601-C",
            message: "Finalizing locks this period from further edits. Are you sure?"
        });

        if (isConfirmed) {
            finalizeBir1601C(id)
                .then((resp) => {
                    if (!resp.error) {
                        toast.success("Finalized.");
                        setRecord(resp.data);
                        onSubmitCallback();
                    } else {
                        toast.error(resp.data?.message ?? "Error encountered");
                    }
                })
                .catch(() => toast.error("Error encountered"));
        }
    };

    const handleExport = async () => {
        try {
            const response: any = await exportBir1601CReport(id);
            const blob = response?.data instanceof Blob ? response.data : new Blob([response]);

            if (blob.type && !blob.type.includes("pdf")) {
                const text = await blob.text();
                try {
                    const parsed = JSON.parse(text);
                    toast.error(parsed?.data?.message ?? parsed?.message ?? "Error encountered");
                } catch {
                    toast.error("Invalid file response");
                }
                return;
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `BIR-1601C-${record?.year}-${String(record?.month).padStart(2, "0")}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch {
            toast.error("Error encountered");
        }
    };

    const previousMonthRow = (n: 1 | 2 | 3) => (
        <tr key={n}>
            <td className="p-1">
                <input
                    type="text"
                    name={`previous_month_${n}_period`}
                    placeholder="MM/YYYY"
                    value={(formHandler.values as any)[`previous_month_${n}_period`]}
                    onChange={formHandler.handleChange}
                    disabled={isFinal}
                    className={cellInput()}
                />
            </td>
            <td className="p-1">
                <input
                    type="date"
                    name={`previous_month_${n}_date_paid`}
                    value={(formHandler.values as any)[`previous_month_${n}_date_paid`]}
                    onChange={formHandler.handleChange}
                    disabled={isFinal}
                    className={cellInput()}
                />
            </td>
            <td className="p-1">
                <input
                    type="text"
                    name={`previous_month_${n}_bank`}
                    value={(formHandler.values as any)[`previous_month_${n}_bank`]}
                    onChange={formHandler.handleChange}
                    disabled={isFinal}
                    maxLength={5}
                    className={cellInput()}
                />
            </td>
            <td className="p-1">
                <input
                    type="text"
                    name={`previous_month_${n}_ror_number`}
                    value={(formHandler.values as any)[`previous_month_${n}_ror_number`]}
                    onChange={formHandler.handleChange}
                    disabled={isFinal}
                    maxLength={6}
                    className={cellInput()}
                />
            </td>
            <td className="p-1">
                <input
                    type="number"
                    name={`previous_month_${n}_tax_paid`}
                    value={(formHandler.values as any)[`previous_month_${n}_tax_paid`]}
                    onChange={formHandler.handleChange}
                    disabled={isFinal}
                    className={cellInput("text-right")}
                />
            </td>
        </tr>
    );

    const sectionBRow = (n: 1 | 2 | 3) => {
        const taxPaid = Number((formHandler.values as any)[`previous_month_${n}_tax_paid`] ?? 0);
        const taxDue = Number((formHandler.values as any)[`previous_month_${n}_tax_due`] ?? 0);
        const adjustment = taxPaid - taxDue;

        return (
            <tr key={n}>
                <td className="p-1">
                    <input
                        type="number"
                        name={`previous_month_${n}_tax_due`}
                        value={(formHandler.values as any)[`previous_month_${n}_tax_due`]}
                        onChange={formHandler.handleChange}
                        disabled={isFinal}
                        className={cellInput("text-right")}
                    />
                </td>
                <td className="p-1">
                    <div className="w-full h-[32px] flex items-center justify-end px-2 rounded-md bg-gray-100 border-2 border-slate-200 text-sm dark:bg-neutral-800 dark:border-neutral-700">
                        {amount(adjustment)}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Report ( 1601-C )"
            onClose={() => {
                modal.onClose();
                setRecord(null);
            }}
            loading={loading}
            size="entireScreen"
        >
            {record && (
                <form onSubmit={formHandler.handleSubmit}>
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-x-4">
                            <span className="text-sm">Month : <strong>{monthNames[record.month - 1]}</strong></span>
                            <span className="text-sm">Year : <strong>{record.year}</strong></span>
                            <Badge
                                status={isFinal ? "success" : "warning"}
                                label={isFinal ? "FINAL" : "DRAFT"}
                            />
                        </div>
                    </div>

                    <div className="flex gap-x-4 items-start">
                        {/* Part II — amounts */}
                        <div className="flex-none w-[480px] border-2 border-slate-200 dark:border-neutral-700 rounded-md p-3">
                            <p className="font-semibold mb-2">Part II</p>
                            <AmountRow
                                label="Total Amount of Compensation"
                                name="total_compensation"
                                value={formHandler.values.total_compensation}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Statutory Minimum Wage (MWEs)"
                                name="statutory_minimum_wage"
                                value={formHandler.values.statutory_minimum_wage}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Holiday Pay, OT, NDF (Min. Wage)"
                                name="holiday_pay_ot_ndf"
                                value={formHandler.values.holiday_pay_ot_ndf}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="13th Month Pay and Other Benefits"
                                name="thirteenth_month_pay"
                                value={formHandler.values.thirteenth_month_pay}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="De Minimis Benefits"
                                name="de_minimis_benefits"
                                value={formHandler.values.de_minimis_benefits}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="SSS, GSIS, PHIC, HDMF Contributions EE"
                                name="ee_contributions"
                                value={formHandler.values.ee_contributions}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Other Non-Taxable Compensation"
                                name="other_non_taxable_compensation"
                                value={formHandler.values.other_non_taxable_compensation}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow label="Total Non-Taxable Compensation" value={totalNonTaxable} />
                            <AmountRow
                                label="Total Taxable Compensation"
                                name="total_taxable_compensation"
                                value={formHandler.values.total_taxable_compensation}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Less : Taxable Compe Not Subject to W/Tax"
                                name="taxable_compensation_not_subject_to_wtax"
                                value={formHandler.values.taxable_compensation_not_subject_to_wtax}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Net Taxable Compensation"
                                name="net_taxable_compensation"
                                value={formHandler.values.net_taxable_compensation}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Total Taxes Withheld"
                                name="total_taxes_withheld"
                                value={formHandler.values.total_taxes_withheld}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Add/Less Adjustment"
                                name="add_less_adjustment"
                                value={formHandler.values.add_less_adjustment}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Taxes Withheld for Remittance"
                                name="total_remittance"
                                value={formHandler.values.total_remittance}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Tax Still Due/(Overremittance)"
                                name="tax_still_due"
                                value={formHandler.values.tax_still_due}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                            <AmountRow
                                label="Total Amount Still Due/(Overremittance)"
                                name="total_amount_due"
                                value={formHandler.values.total_amount_due}
                                onChange={formHandler.handleChange}
                                disabled={isFinal}
                            />
                        </div>

                        {/* Section A + B */}
                        <div className="flex-1">
                            <div className="border-2 border-slate-200 dark:border-neutral-700 rounded-md p-3 mb-3">
                                <p className="font-semibold mb-2">Section A</p>
                                <table className="w-full text-sm table-fixed">
                                    <colgroup>
                                        <col className="w-[16%]" />
                                        <col className="w-[20%]" />
                                        <col className="w-[22%]" />
                                        <col className="w-[18%]" />
                                        <col className="w-[24%]" />
                                    </colgroup>
                                    <thead>
                                        <tr className="text-left align-bottom">
                                            <th className="p-1 font-normal">Previous Month(s)<br/>(MM/YYYY)</th>
                                            <th className="p-1 font-normal">Date Paid<br/>(MM/DD/YYYY)</th>
                                            <th className="p-1 font-normal">Bank Validation/<br/>ROR No.</th>
                                            <th className="p-1 font-normal">Number</th>
                                            <th className="p-1 font-normal">Tax Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previousMonthRow(1)}
                                        {previousMonthRow(2)}
                                        {previousMonthRow(3)}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border-2 border-slate-200 dark:border-neutral-700 rounded-md p-3">
                                <p className="font-semibold mb-2">Section B</p>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="p-1 font-normal">Should be Tax Due for the Month</th>
                                            <th className="p-1 font-normal">Adjustments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sectionBRow(1)}
                                        {sectionBRow(2)}
                                        {sectionBRow(3)}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-end mt-4">
                        <div className="flex items-center gap-x-2">
                            {!isFinal && (
                                <>
                                    <div className="w-[120px]">
                                        <Button
                                            label="Auto Compute"
                                            variant="secondary"
                                            loading={recomputing}
                                            onClick={handleRecompute}
                                        />
                                    </div>
                                    <div className="w-[120px]">
                                        <Button
                                            type="submit"
                                            label="Save"
                                            loading={formHandler.isSubmitting}
                                            onClick={() => {}}
                                        />
                                    </div>
                                    <div className="w-[120px]">
                                        <Button
                                            label="Finalize"
                                            onClick={handleFinalize}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="w-[120px]">
                                <Button
                                    label="Print"
                                    variant="secondary"
                                    onClick={handleExport}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default ViewBir1601CModal;
