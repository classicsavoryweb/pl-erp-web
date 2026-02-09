import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import moment from "moment";

interface LastPayComputationPDFProps {
    data: any;
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 28,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 30,
        fontSize: 9,
        lineHeight: 1.3,
    },
    bold: {
        fontWeight: "bold",
    },
    italic: {
        fontStyle: "italic",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    logo: {
        width: 150,
    },
    headerText: {
        flexGrow: 1,
        alignItems: "center",
        textAlign: "center",
    },
    headerCompany: {
        fontWeight: "bold",
        fontSize: 9,
    },
    headerTitle: {
        fontWeight: "bold",
        marginTop: 2,
    },
    infoSection: {
        marginTop: 6,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 3,
    },
    infoLabel: {
        width: 95,
        fontWeight: "bold",
    },
    infoValue: {
        flexGrow: 1,
    },
    bodyRow: {
        flexDirection: "row",
    },
    leftCol: {
        width: "52%",
        paddingRight: 12,
    },
    rightCol: {
        width: "48%",
        paddingLeft: 12,
    },
    sectionTitle: {
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 6,
    },
    sectionTitleUnderline: {
        fontWeight: "bold",
        textDecoration: "underline",
        marginBottom: 6,
    },
    payRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    payLabel: {
        width: "70%",
    },
    payValue: {
        width: "30%",
        textAlign: "right",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    doubleLine: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 3,
    },
    spacer: {
        height: 10,
    },
    subtotalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    deductionTotalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 6,
    },
    netClaimRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        alignItems: "flex-end",
    },
    note: {
        marginTop: 12,
        fontSize: 8,
    },
    signatures: {
        marginTop: 18,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signatureBlock: {
        width: "45%",
    },
    signatureLine: {
        borderBottomWidth: 1,
        marginTop: 12,
        marginBottom: 4,
    },
    signatureName: {
        fontWeight: "bold",
        textAlign: "center",
    },
    signatureTitle: {
        textAlign: "center",
        fontStyle: "italic",
        fontSize: 8,
    },
    receivedBlock: {
        marginTop: 14,
        alignItems: "center",
    },
    receivedLine: {
        width: "60%",
        borderBottomWidth: 1,
        marginTop: 10,
        marginBottom: 4,
    },
});

const formatAmount = (value: any) => {
    const amount = Number(value ?? 0);
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const buildPeriodLabels = (year: number) => {
    const labels: { label: string; start: string; end: string }[] = [];
    let current = moment(`${year - 1}-12-11`);

    for (let i = 0; i < 24; i += 1) {
        const start = current.clone();
        let end: moment.Moment;

        if (start.date() === 11) {
            end = start.clone().date(25);
            current = start.clone().date(26);
        } else {
            end = start.clone().add(1, "month").date(10);
            current = start.clone().add(1, "month").date(11);
        }

        labels.push({
            label: `${start.format("M/D")} to ${end.format("D")}`,
            start: start.format("YYYY-MM-DD"),
            end: end.format("YYYY-MM-DD"),
        });
    }

    return labels;
};

const getPayrollAmount = (payroll: any) => {
    const salary = Number(payroll?.salary ?? payroll?.net_pay ?? 0);
    const undertime = Number(payroll?.undertime_amount ?? 0);
    const tardiness = Number(payroll?.tardiness_amount ?? 0);
    return salary - undertime - tardiness;
};

const buildPayrollRows = (data: any) => {
    const year = Number(data?.year) || moment().year();
    const labels = buildPeriodLabels(year);
    const payrolls = data?.payrolls ?? [];

    const payrollMap = new Map<string, number>();
    payrolls.forEach((payroll: any) => {
        const start = payroll?.start_date ?? payroll?.startDate;
        const end = payroll?.end_date ?? payroll?.endDate;
        if (!start || !end) return;
        const label = `${moment(start).format("M/D")} to ${moment(end).format("D")}`;
        payrollMap.set(label, getPayrollAmount(payroll));
    });

    return labels.map((item) => ({
        label: item.label,
        amount: payrollMap.get(item.label) ?? 0,
    }));
};

const buildDeductionSummary = (deductions: any[]) => {
    const totals = {
        shortages: 0,
        variance: 0,
        breakages: 0,
        others: 0,
        uniform: 0,
        hi_precision: 0,
        cash_advance: 0,
        corporate_loans: 0,
        sss_loans: 0,
    };

    deductions.forEach((deduction) => {
        const description = (deduction?.deduction?.description ?? deduction?.description ?? "").toLowerCase();
        const amount = Number(deduction?.amount ?? deduction?.balance ?? 0);

        if (description.includes("shortage")) {
            totals.shortages += amount;
            return;
        }
        if (description.includes("variance")) {
            totals.variance += amount;
            return;
        }
        if (description.includes("breakage")) {
            totals.breakages += amount;
            return;
        }
        if (description.includes("uniform")) {
            totals.uniform += amount;
            return;
        }
        if (description.includes("hi-precision") || description.includes("hi precision") || description.includes("hiprecision")) {
            totals.hi_precision += amount;
            return;
        }
        if (description.includes("cash advance")) {
            totals.cash_advance += amount;
            return;
        }
        if (description.includes("corporate loan")) {
            totals.corporate_loans += amount;
            return;
        }
        if (description.includes("sss loan")) {
            totals.sss_loans += amount;
            return;
        }

        totals.others += amount;
    });

    return totals;
};

const LastPayComputationPDF = ({ data }: LastPayComputationPDFProps) => {
    const employee = data?.employee ?? {};
    const payrollRows = buildPayrollRows(data);
    const payrollTotal = payrollRows.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

    const thirteenthMonth = Number(data?.thirteenth_month ?? 0);
    const taxRefund = Number(data?.tax_refund ?? 0);
    const incentives = Number(data?.incentives ?? 0);
    const payLeave = Number(data?.sl_vl ?? 0);
    const otherIncentive = Number(data?.sales ?? 0) + Number(data?.meal_allowance ?? data?.meal ?? 0);
    const salary = Number(data?.payroll_hold ?? 0);

    const subTotal = thirteenthMonth + taxRefund + incentives + payLeave + otherIncentive + salary;

    const deductionSummary = buildDeductionSummary(data?.deductions ?? []);
    const deductionsTotal = Number(data?.total_deductions ?? (
        deductionSummary.shortages +
        deductionSummary.variance +
        deductionSummary.breakages +
        deductionSummary.others +
        deductionSummary.uniform +
        deductionSummary.hi_precision +
        deductionSummary.cash_advance +
        deductionSummary.corporate_loans +
        deductionSummary.sss_loans
    ));

    const netClaim = Number(data?.last_pay ?? (subTotal - deductionsTotal));

    const basicSalary = employee?.current_position?.salary?.basic_salary
        ?? employee?.basic_salary
        ?? data?.basic_salary
        ?? 0;
    const dailyRate = data?.daily_rate
        ?? data?.payrolls?.[0]?.daily_rate
        ?? (basicSalary ? basicSalary / 26 : 0);
    const cola = data?.cola ?? employee?.cola ?? 0;

    const preparedBy = data?.prepared_by ?? "MONICA JEAN TRIUMFANTE";
    const preparedByTitle = data?.prepared_by_title ?? "HO Staff";
    const notedBy = data?.noted_by ?? "CLARITA P. CRUZ";
    const notedByTitle = data?.noted_by_title ?? "Payroll Manager";
    const receivedBy = employee?.full_name ?? data?.employee_name ?? "";

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <View style={styles.headerRow}>
                    <Image style={styles.logo} src="/images/classic-savory.png" />
                    <View style={styles.headerText}>
                        <Text style={styles.headerCompany}>
                            {(process.env.NEXT_PUBLIC_COMPANY ?? "Savory Fastfood Incorporated").toUpperCase()}
                        </Text>
                        <Text style={styles.headerTitle}>LAST PAY COMPUTATION</Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>NAME:</Text>
                        <Text style={styles.infoValue}>{receivedBy}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>EMPLOYEE ID NO:</Text>
                        <Text style={styles.infoValue}>{employee?.employee_number ?? ""}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>DATE HIRED:</Text>
                        <Text style={styles.infoValue}>
                            {employee?.date_hired ? moment(employee.date_hired).format("MM/DD/YYYY") : ""}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>POSITION:</Text>
                        <Text style={styles.infoValue}>{employee?.current_position?.description ?? ""}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>BASIC SALARY:</Text>
                        <Text style={styles.infoValue}>{formatAmount(basicSalary)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>PER DAY:</Text>
                        <Text style={styles.infoValue}>{formatAmount(dailyRate)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>COLA:</Text>
                        <Text style={styles.infoValue}>{formatAmount(cola)}</Text>
                    </View>
                </View>

                <View style={styles.bodyRow}>
                    <View style={styles.leftCol}>
                        <Text style={styles.sectionTitle}>13TH MO. PAY COMPUTATION</Text>
                        {payrollRows.map((row, idx) => (
                            <View style={styles.payRow} key={`${row.label}-${idx}`}>
                                <Text style={styles.payLabel}>{row.label}</Text>
                                <Text style={styles.payValue}>{formatAmount(row.amount)}</Text>
                            </View>
                        ))}

                        <View style={styles.totalRow}>
                            <Text style={styles.bold}>TOTAL</Text>
                            <Text style={styles.bold}>{formatAmount(payrollTotal)}</Text>
                        </View>
                        <View style={styles.doubleLine} />
                    </View>

                    <View style={styles.rightCol}>
                        <Text style={styles.sectionTitleUnderline}>LAST PAY COMPUTATION:</Text>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>13TH MONTH PAY:</Text>
                            <Text style={styles.payValue}>{formatAmount(thirteenthMonth)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>TAX REFUND:</Text>
                            <Text style={styles.payValue}>{formatAmount(taxRefund)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>INCENTIVE:</Text>
                            <Text style={styles.payValue}>{formatAmount(incentives)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>PAYLEAVE:</Text>
                            <Text style={styles.payValue}>{formatAmount(payLeave)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>OTHER INCENTIVE:</Text>
                            <Text style={styles.payValue}>{formatAmount(otherIncentive)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>SALARY:</Text>
                            <Text style={styles.payValue}>{formatAmount(salary)}</Text>
                        </View>

                        <View style={styles.subtotalRow}>
                            <Text style={styles.bold}>SUB TOTAL AMOUNT:</Text>
                            <Text style={styles.bold}>{formatAmount(subTotal)}</Text>
                        </View>

                        <View style={styles.spacer} />
                        <Text style={styles.sectionTitleUnderline}>LESS DEDUCTIONS:</Text>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>SHORTAGES:</Text>
                            <Text style={styles.payValue}>{formatAmount(deductionSummary.shortages)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>VARIANCE:</Text>
                            <Text style={styles.payValue}>{formatAmount(deductionSummary.variance)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>BREAKAGES:</Text>
                            <Text style={styles.payValue}>{formatAmount(deductionSummary.breakages)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>OTHERS:</Text>
                            <Text style={styles.payValue}>{formatAmount(deductionSummary.others)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>UNIFORM:</Text>
                            <Text style={styles.payValue}>{formatAmount(deductionSummary.uniform)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>HI-PRECISION:</Text>
                            <Text style={styles.payValue}>{formatAmount(deductionSummary.hi_precision)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>CASH ADVANCE</Text>
                            <Text style={styles.payValue}>{formatAmount(deductionSummary.cash_advance)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>CORPORATE LOANS</Text>
                            <Text style={styles.payValue}>{formatAmount(deductionSummary.corporate_loans)}</Text>
                        </View>
                        <View style={styles.payRow}>
                            <Text style={styles.payLabel}>SSS LOANS</Text>
                            <Text style={styles.payValue}>{formatAmount(deductionSummary.sss_loans)}</Text>
                        </View>

                        <View style={styles.deductionTotalRow}>
                            <Text style={styles.bold}>{formatAmount(deductionsTotal)}</Text>
                        </View>
                        <View style={styles.doubleLine} />

                        <View style={styles.netClaimRow}>
                            <Text style={styles.bold}>NET CLAIM AMOUNT:</Text>
                            <Text style={styles.bold}>{formatAmount(netClaim)}</Text>
                        </View>
                        <View style={styles.doubleLine} />
                    </View>
                </View>

                <View style={styles.note}>
                    <Text>
                        * This is to acknowledge that I have received my full means of compensation under{" "}
                        {process.env.NEXT_PUBLIC_COMPANY ?? "Savory Fastfood Inc."}
                    </Text>
                </View>

                <View style={styles.signatures}>
                    <View style={styles.signatureBlock}>
                        <Text>Prepared by:</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureName}>{preparedBy}</Text>
                        <Text style={styles.signatureTitle}>{preparedByTitle}</Text>
                    </View>
                    <View style={styles.signatureBlock}>
                        <Text>Noted by:</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureName}>{notedBy}</Text>
                        <Text style={styles.signatureTitle}>{notedByTitle}</Text>
                    </View>
                </View>

                <View style={styles.receivedBlock}>
                    <Text>Received by:</Text>
                    <View style={styles.receivedLine} />
                    <Text style={styles.signatureName}>{receivedBy}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default LastPayComputationPDF;
