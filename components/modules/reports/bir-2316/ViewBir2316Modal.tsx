import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
    getBir2316,
    getBir2316Signatory,
    exportBir2316Report,
} from "@/api/reports/reports-bir-2316";

const DEFAULT_SIGNATORY_NAME = "IRENE ANNE N. TING";

interface ModalInterface {
    modal: any;
    id: any;
    onSubmitCallback: () => void;
}

const scheduleLabels: Record<string, string> = {
    schedule_1: "Schedule 1 (Taxable)",
    schedule_2: "Schedule 2 (Non-Taxable)",
};

const amount = (value: any) =>
    Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const AmountRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between items-center gap-x-3 py-[3px]">
        <span className="text-sm">{label} :</span>
        <div className="w-[150px] h-[30px] flex items-center justify-end px-2 rounded-md bg-gray-100 border-2 border-slate-200 text-sm dark:bg-neutral-800 dark:border-neutral-700">
            {amount(value)}
        </div>
    </div>
);

const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between items-center gap-x-3 py-[3px]">
        <span className="text-sm">{label} :</span>
        <div className="flex-1 max-w-[260px] h-[30px] flex items-center px-2 rounded-md bg-gray-100 border-2 border-slate-200 text-sm truncate dark:bg-neutral-800 dark:border-neutral-700">
            {value || "-"}
        </div>
    </div>
);

const ViewBir2316Modal = ({
    modal,
    id,
    onSubmitCallback
}: ModalInterface
) => {
    const [record, setRecord] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [exportingSigned, setExportingSigned] = useState(false);
    const [exportingUnsigned, setExportingUnsigned] = useState(false);
    const [signatoryName, setSignatoryName] = useState(DEFAULT_SIGNATORY_NAME);

    useEffect(() => {
        if (modal.isShowing && id) {
            setLoading(true);
            getBir2316(id)
                .then((resp) => {
                    if (!resp.error) {
                        setRecord(resp.data);
                    } else {
                        toast.error("Error fetching 2316 record");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });

            getBir2316Signatory().then((resp) => {
                if (!resp.error && resp.data?.signatory_name) {
                    setSignatoryName(resp.data.signatory_name);
                }
            });
        }

    }, [modal.isShowing, id]);

    const handleExport = async (withSignature: boolean) => {
        const setExporting = withSignature ? setExportingSigned : setExportingUnsigned;
        setExporting(true);
        try {
            const response: any = await exportBir2316Report(id, withSignature, signatoryName);
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
            a.download = `BIR-2316-${record?.year}-${record?.tin ?? record?.employee_id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch {
            toast.error("Error encountered");
        } finally {
            setExporting(false);
        }
    };

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Report ( 2316 )"
            onClose={() => {
                modal.onClose();
                setRecord(null);
            }}
            loading={loading}
            size="entireScreen"
        >
            {record && (
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-x-4">
                            <span className="text-sm">
                                Employee : <strong>{record.last_name}, {record.first_name} {record.middle_name ?? ""}</strong>
                            </span>
                            <span className="text-sm">Year : <strong>{record.year}</strong></span>
                            <Badge
                                status="success"
                                label={scheduleLabels[record.schedule_type] ?? record.schedule_type}
                            />
                            {record.is_mwe && (
                                <Badge status="warning" label="MWE" />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-1 w-full flex flex-col gap-4">
                            <div className="border-2 border-slate-200 dark:border-neutral-700 rounded-md p-3">
                                <p className="font-semibold mb-2">Part I - Employee Information</p>
                                <InfoRow label="TIN" value={record.tin} />
                                <InfoRow label="RDO Code" value={record.rdo_code} />
                                <InfoRow label="Registered Address" value={record.registered_address} />
                                <InfoRow label="Date of Birth" value={record.date_of_birth} />
                                <InfoRow label="Contact Number" value={record.contact_number} />
                                <AmountRow label="SMW Rate per Day" value={record.smw_rate_per_day} />
                                <AmountRow label="SMW Rate per Month" value={record.smw_rate_per_month} />
                            </div>

                            <div className="border-2 border-slate-200 dark:border-neutral-700 rounded-md p-3">
                                <p className="font-semibold mb-2">Part III - Employer Information (Previous)</p>
                                <InfoRow label="TIN" value={record.previous_employer_tin} />
                                <InfoRow label="Employer's Name" value={record.previous_employer_name} />
                                <InfoRow label="Registered Address" value={record.previous_employer_address} />
                            </div>

                            <div className="border-2 border-slate-200 dark:border-neutral-700 rounded-md p-3">
                                <p className="font-semibold mb-2">Part IVA - Summary</p>
                                <AmountRow label="Gross Compensation Income from Present Employer" value={record.gross_compensation} />
                                <AmountRow label="Less: Total Non-Taxable/Exempt Compensation Income" value={record.less_non_taxable} />
                                <AmountRow label="Taxable Compensation Income from Present Employer" value={record.taxable_comp_present} />
                                <AmountRow label="Add: Taxable Compensation Income from Previous Employer" value={record.previous_employer_taxable_income} />
                                <AmountRow label="Gross Taxable Compensation Income" value={record.gross_taxable_comp} />
                                <AmountRow label="Tax Due" value={record.tax_due} />
                                <AmountRow label="Amount of Taxes Withheld (Present Employer)" value={record.taxes_withheld_present} />
                                <AmountRow label="Amount of Taxes Withheld (Previous Employer)" value={record.previous_employer_tax_withheld} />
                                <AmountRow label="5% Tax Credit (PERA Act of 2008)" value={record.five_percent_tax_credit} />
                                <AmountRow label="Total Taxes Withheld" value={record.total_taxes_withheld} />
                            </div>
                        </div>

                        <div className="flex-1 w-full flex flex-col gap-4">
                            <div className="border-2 border-slate-200 dark:border-neutral-700 rounded-md p-3">
                                <p className="font-semibold mb-2">A. Non-Taxable/Exempt Compensation Income</p>
                                <AmountRow label="Basic Salary (SMW)" value={record.basic_salary_mwe} />
                                <AmountRow label="Holiday Pay (MWE)" value={record.holiday_pay_mwe} />
                                <AmountRow label="Overtime Pay (MWE)" value={record.overtime_pay_mwe} />
                                <AmountRow label="Night Shift Differential (MWE)" value={record.night_shift_diff_mwe} />
                                <AmountRow label="Hazard Pay (MWE)" value={record.hazard_pay_mwe} />
                                <AmountRow label="13th Month Pay & Other Benefits (max 90,000)" value={record.thirteenth_month_pay} />
                                <AmountRow label="De Minimis Benefits" value={record.de_minimis_benefits} />
                                <AmountRow label="SSS, GSIS, PHIC, HDMF (EE share)" value={record.sss_gsis_phic_hdmf_ee} />
                                <AmountRow label="Salaries and Other Forms of Compensation" value={record.salaries_other_nontax} />
                                <AmountRow label="Total Non-Taxable/Exempt Compensation" value={record.total_non_taxable} />
                            </div>

                            <div className="border-2 border-slate-200 dark:border-neutral-700 rounded-md p-3">
                                <p className="font-semibold mb-2">B. Taxable Compensation Income Regular</p>
                                <AmountRow label="Basic Salary" value={record.basic_salary_taxable} />
                                <AmountRow label="Representation" value={record.representation} />
                                <AmountRow label="Transportation" value={record.transportation} />
                                <AmountRow label="Cost of Living Allowance (COLA)" value={record.cola} />
                                <AmountRow label="Fixed Housing Allowance" value={record.fixed_housing} />
                                <AmountRow label="Others 44A" value={record.others_taxable_a} />
                                <AmountRow label="Others 44B" value={record.others_taxable_b} />
                                <AmountRow label="Commission" value={record.commission} />
                                <AmountRow label="Profit Sharing" value={record.profit_sharing} />
                                <AmountRow label="Fees Including Director's Fees" value={record.fees} />
                                <AmountRow label="Taxable 13th Month Benefits" value={record.taxable_13th_month_excess} />
                                <AmountRow label="Hazard Pay" value={record.hazard_pay_taxable} />
                                <AmountRow label="Overtime Pay" value={record.overtime_pay_taxable} />
                                <AmountRow label="Others 51A" value={record.others_51a} />
                                <AmountRow label="Others 51B" value={record.others_51b} />
                                <AmountRow label="Total Taxable Compensation Income" value={record.total_taxable_regular} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-end mt-4 gap-x-2">
                        <div className="w-[280px]">
                            <label className="text-sm">Present Employer / Authorized Agent (Printed Name)</label>
                            <input
                                type="text"
                                value={signatoryName}
                                onChange={(e) => setSignatoryName(e.target.value)}
                                className="w-full h-[32px] rounded-md border-2 border-slate-300 focus:border-slate-400 focus:outline-none px-2 text-sm dark:bg-neutral-900 dark:border-neutral-700"
                            />
                        </div>
                        <div className="w-[160px]">
                            <Button
                                label="Print (Unsigned)"
                                variant="secondary"
                                loading={exportingUnsigned}
                                onClick={() => handleExport(false)}
                            />
                        </div>
                        <div className="w-[160px]">
                            <Button
                                label="Print (Signed)"
                                loading={exportingSigned}
                                onClick={() => handleExport(true)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ViewBir2316Modal;
