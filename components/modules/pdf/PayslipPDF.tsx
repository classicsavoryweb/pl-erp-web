import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

interface PayslipPDFProps {
    payrolls: any[];
}

const styles = StyleSheet.create({
    page: {
        padding: 16,
        fontSize: 7,
        fontFamily: "Helvetica",
        color: "#111",
    },
    card: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 6,
        height: 242,
    },
    cardSpacing: {
        marginBottom: 8,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    headerTitle: {
        fontWeight: "bold",
        fontSize: 8,
    },
    headerPage: {
        fontSize: 7,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    infoText: {
        fontSize: 7,
    },
    bodyRow: {
        flexDirection: "row",
        marginTop: 4,
    },
    leftTable: {
        width: "62%",
        borderWidth: 1,
        borderColor: "#000",
        padding: 3,
        marginRight: 6,
    },
    rightTable: {
        width: "38%",
        borderWidth: 1,
        borderColor: "#000",
        padding: 3,
    },
    tableHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#000",
        paddingBottom: 2,
        marginBottom: 2,
        fontWeight: "bold",
    },
    groupCell: {
        width: 100,
        fontWeight: "bold",
    },
    descCell: {
        flex: 1,
    },
    inputCell: {
        width: 40,
        textAlign: "right",
    },
    amountCell: {
        width: 58,
        textAlign: "right",
    },
    tableRow: {
        flexDirection: "row",
        marginBottom: 1,
    },
    sectionDivider: {
        borderTopWidth: 1,
        borderColor: "#000",
        marginTop: 2,
        marginBottom: 2,
    },
    rightRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    rightLabel: {
        width: "70%",
    },
    rightValue: {
        width: "30%",
        textAlign: "right",
    },
    rightDivider: {
        borderTopWidth: 1,
        borderColor: "#000",
        marginVertical: 4,
    },
    rightTotalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    rightNetRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
        fontWeight: "bold",
    },
    receivedRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    receivedLabel: {
        width: 70,
    },
    receivedLine: {
        borderBottomWidth: 1,
        borderColor: "#000",
        flex: 1,
        marginLeft: 4,
    },
});

const formatAmount = (value: any) => {
    const amount = Number(value ?? 0);
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatNumber = (value: any) => {
    const amount = Number(value ?? 0);
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const parseDeductions = (value: any) => {
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }
    return [];
};

const chunkArray = (arr: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

const buildWorkingRows = (payroll: any, summary: any) => {
    const totalOvertimeHours =
        Number(summary?.regular_overtime ?? 0) +
        Number(summary?.legal_holiday_overtime ?? 0) +
        Number(summary?.special_holiday_overtime ?? 0) +
        Number(summary?.night_differential_overtime ?? 0) +
        Number(summary?.cancelled_off ?? 0) +
        Number(summary?.cancelled_off_overtime ?? 0);

    const totalOvertimePay =
        Number(payroll?.overtime_amount ?? 0) +
        Number(payroll?.legal_holiday_overtime_amount ?? 0) +
        Number(payroll?.special_holiday_overtime_amount ?? 0) +
        Number(payroll?.night_differential_overtime_amount ?? 0) +
        Number(payroll?.cancelled_off ?? 0) +
        Number(payroll?.cancelled_off_overtime_amount ?? 0);

    return [
        {
            group: "Total Days-In",
            label: "Regular Days",
            input: summary?.regular_days ?? 0,
            salary: payroll?.salary ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "Cancelled Off",
            input: summary?.cancelled_off ?? 0,
            salary: payroll?.cancelled_off ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "Special Hol (Hrs)",
            input: summary?.special_holiday ?? 0,
            salary: payroll?.special_holiday_amount ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "Legal Hol (Hrs)",
            input: summary?.legal_holiday ?? 0,
            salary: payroll?.legal_holiday_amount ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "Regular Overtime",
            input: Number(summary?.regular_overtime ?? 0),
            salary: payroll?.overtime_amount ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "Cancelled Off OT (Hrs)",
            input: summary?.cancelled_off_overtime ?? 0,
            salary: payroll?.cancelled_off_overtime_amount ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "Special OT (Hrs)",
            input: summary?.special_holiday_overtime ?? 0,
            salary: payroll?.special_holiday_overtime_amount ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "Legal OT (Hrs)",
            input: summary?.legal_holiday_overtime ?? 0,
            salary: payroll?.legal_holiday_overtime_amount ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "Night Diff (Hrs)",
            input: summary?.night_differential ?? 0,
            salary: payroll?.night_differential_amount ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "NDOT (Hrs)",
            input: summary?.night_differential_overtime ?? 0,
            salary: payroll?.night_differential_overtime_amount ?? 0,
        },
        {
            group: "Additional Working Time",
            label: "Total Overtime (Hrs)",
            input: totalOvertimeHours,
            salary: totalOvertimePay,
        },
        {
            group: "Reduction in Working Time",
            label: "Tardy (Hrs)",
            input: summary?.tardiness ?? 0,
            salary: payroll?.tardiness_amount ?? 0,
        },
        {
            group: "Reduction in Working Time",
            label: "Undertime",
            input: summary?.undertime ?? 0,
            salary: payroll?.undertime_amount ?? 0,
        },
        {
            group: "Additional Income",
            label: "TAXABLE",
            input: "",
            salary: payroll?.taxable_adjustment ?? 0,
        },
        {
            group: "Additional Income",
            label: "NON-TAXABLE",
            input: "",
            salary: payroll?.non_taxable_adjustment ?? 0,
        },
    ];
};

const PayslipPDF = ({ payrolls }: PayslipPDFProps) => {
    const pages = chunkArray(payrolls ?? [], 3);

    return (
        <Document>
            {pages.map((group, pageIndex) => (
                <Page size="LETTER" style={styles.page} key={`payslip-page-${pageIndex}`}>
                    {group.map((payroll: any, index: number) => {
                        const employee = payroll?.employee ?? {};
                        const summary = payroll?.timekeeping_summary ?? {};

                        const branchName = payroll?.timekeeping_branch?.name ?? employee?.current_branch?.name ?? "";
                        const employeeName =
                            employee?.full_name
                                ? String(employee.full_name).toUpperCase()
                                : `${employee?.last_name ?? ""}, ${employee?.first_name ?? ""} ${employee?.middle_name ?? ""}`
                                    .trim()
                                    .toUpperCase();

                        const periodStart = payroll?.start_date
                            ? moment(payroll.start_date).format("MM/DD/YYYY")
                            : "";
                        const periodEnd = payroll?.end_date
                            ? moment(payroll.end_date).format("MM/DD/YYYY")
                            : "";
                        const periodLabel = periodStart && periodEnd ? `${periodStart} to ${periodEnd}` : "";

                        const branchCompany = payroll?.timekeeping_branch?.company ?? employee?.current_branch?.company ?? "";
                        const companyRaw = `${branchCompany} ${process.env.NEXT_PUBLIC_COMPANY ?? ""}`.toUpperCase();
                        const companyName = companyRaw.includes("SFI") || companyRaw.includes("SAVORY")
                            ? "Savory Fast Food Inc."
                            : "Tony Ting Food Concepts, Inc.";

                        const rows = buildWorkingRows(payroll, summary);
                        const deductions = parseDeductions(payroll?.deductions);
                        const otherTotal =
                            Number(payroll?.total_deductions ?? 0) + Number(payroll?.manual_deductions ?? 0);
                        const totalDeductions =
                            Number(payroll?.employee_sss ?? 0) +
                            Number(payroll?.employee_philhealth ?? 0) +
                            Number(payroll?.employee_pagibig ?? 0) +
                            Number(payroll?.withholding_tax ?? 0) +
                            otherTotal;
                        const grossPay = Number(payroll?.gross_pay ?? 0);
                        const adjustmentTotal =
                            Number(payroll?.taxable_adjustment ?? 0) + Number(payroll?.non_taxable_adjustment ?? 0);

                        let currentGroup = "";

                        return (
                            <View
                                key={`payslip-${pageIndex}-${index}`}
                                style={[styles.card, ...(index < group.length - 1 ? [styles.cardSpacing] : [])]}
                            >
                                <View style={styles.headerRow}>
                                    <Text style={styles.headerTitle}>{companyName} - PAY SLIP - History</Text>
                                    <Text style={styles.headerPage}>{pageIndex + 1}</Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoText}>For the Pay Period {periodLabel}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoText}>Employee : {employeeName}</Text>
                                    <Text style={styles.infoText}>Department / Branch : {branchName}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoText}>Temp Branch : {branchName}</Text>
                                </View>

                                <View style={styles.bodyRow}>
                                    <View style={styles.leftTable}>
                                        <View style={styles.tableHeaderRow}>
                                            <Text style={styles.groupCell}></Text>
                                            <Text style={styles.descCell}></Text>
                                            <Text style={styles.inputCell}>INPUT</Text>
                                            <Text style={styles.amountCell}>SALARY</Text>
                                        </View>

                                        {rows.map((row, rowIndex) => {
                                            const showGroup = row.group !== currentGroup;
                                            currentGroup = row.group;
                                            return (
                                                <View style={styles.tableRow} key={`${row.group}-${row.label}-${rowIndex}`}>
                                                    <Text style={styles.groupCell}>{showGroup ? row.group : ""}</Text>
                                                    <Text style={styles.descCell}>{row.label}</Text>
                                                    <Text style={styles.inputCell}>
                                                        {row.input === "" ? "" : formatNumber(row.input)}
                                                    </Text>
                                                    <Text style={styles.amountCell}>{formatAmount(row.salary)}</Text>
                                                </View>
                                            );
                                        })}

                                        <View style={styles.sectionDivider} />
                                        <View style={styles.tableRow}>
                                            <Text style={styles.groupCell}></Text>
                                            <Text style={styles.descCell}>TOTAL</Text>
                                            <Text style={styles.inputCell}></Text>
                                            <Text style={styles.amountCell}>{formatAmount(adjustmentTotal)}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.groupCell}></Text>
                                            <Text style={styles.descCell}>Adjustments</Text>
                                            <Text style={styles.inputCell}></Text>
                                            <Text style={styles.amountCell}>{formatAmount(0)}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.groupCell}></Text>
                                            <Text style={styles.descCell}>COLA</Text>
                                            <Text style={styles.inputCell}></Text>
                                            <Text style={styles.amountCell}>{formatAmount(0)}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.groupCell}></Text>
                                            <Text style={styles.descCell}>GROSSPAY</Text>
                                            <Text style={styles.inputCell}></Text>
                                            <Text style={styles.amountCell}>{formatAmount(grossPay)}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.rightTable}>
                                        <View style={styles.rightRow}>
                                            <Text style={styles.rightLabel}>SSS</Text>
                                            <Text style={styles.rightValue}>{formatAmount(payroll?.employee_sss ?? 0)}</Text>
                                        </View>
                                        <View style={styles.rightRow}>
                                            <Text style={styles.rightLabel}>PhilHealth</Text>
                                            <Text style={styles.rightValue}>{formatAmount(payroll?.employee_philhealth ?? 0)}</Text>
                                        </View>
                                        <View style={styles.rightRow}>
                                            <Text style={styles.rightLabel}>Pagibig</Text>
                                            <Text style={styles.rightValue}>{formatAmount(payroll?.employee_pagibig ?? 0)}</Text>
                                        </View>
                                        <View style={styles.rightRow}>
                                            <Text style={styles.rightLabel}>Withholding Tax</Text>
                                            <Text style={styles.rightValue}>{formatAmount(payroll?.withholding_tax ?? 0)}</Text>
                                        </View>

                                        <View style={styles.rightDivider} />

                                        <View style={styles.rightRow}>
                                            <Text style={styles.rightLabel}>Others</Text>
                                            <Text style={styles.rightValue}>{formatAmount(otherTotal)}</Text>
                                        </View>
                                        <View style={styles.rightRow}>
                                            <Text style={styles.rightLabel}>Deductions Total</Text>
                                            <Text style={styles.rightValue}>{formatAmount(otherTotal)}</Text>
                                        </View>

                                        <View style={styles.rightDivider} />

                                        <View style={styles.rightTotalRow}>
                                            <Text style={styles.rightLabel}>TOTAL DEDUCTION</Text>
                                            <Text style={styles.rightValue}>{formatAmount(totalDeductions)}</Text>
                                        </View>
                                        <View style={styles.rightNetRow}>
                                            <Text style={styles.rightLabel}>NETPAY</Text>
                                            <Text style={styles.rightValue}>{formatAmount(payroll?.net_pay ?? 0)}</Text>
                                        </View>

                                        <View style={styles.receivedRow}>
                                            <Text style={styles.receivedLabel}>RECEIVED BY :</Text>
                                            <View style={styles.receivedLine} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </Page>
            ))}
        </Document>
    );
};

export default PayslipPDF;
