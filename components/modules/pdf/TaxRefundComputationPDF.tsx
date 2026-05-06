import React from "react";
import { Document, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment from "moment";

interface TaxRefundComputationPDFProps {
    data: any;
}

const formatAmount = (value: any) => {
    const amount = Number(value ?? 0);

    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const styles = StyleSheet.create({
    fullPage: {
        width: "100%",
        height: "85vh",
    },
    page: {
        paddingTop: 28,
        paddingLeft: 34,
        paddingRight: 34,
        paddingBottom: 28,
        fontSize: 8,
        color: "#000000",
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    company: {
        fontSize: 14,
        fontWeight: "bold",
    },
    title: {
        fontSize: 9,
        fontWeight: "bold",
        marginTop: 2,
    },
    printedDate: {
        fontSize: 8,
        fontWeight: "bold",
    },
    employee: {
        marginTop: 42,
        marginBottom: 12,
    },
    employeeName: {
        fontSize: 8,
        fontWeight: "bold",
    },
    employeeDetails: {
        fontSize: 8,
        marginTop: 3,
    },
    table: {
        width: "100%",
    },
    row: {
        flexDirection: "row",
        minHeight: 16,
        alignItems: "center",
    },
    headerRow: {
        borderBottomWidth: 1.5,
        borderBottomColor: "#000000",
        borderBottomStyle: "solid",
        minHeight: 24,
    },
    footerRow: {
        borderTopWidth: 1.5,
        borderTopColor: "#000000",
        borderTopStyle: "solid",
        marginTop: 6,
        paddingTop: 6,
        fontWeight: "bold",
    },
    cellEmployee: {
        width: "18%",
        paddingRight: 4,
    },
    cellCode: {
        width: "10%",
        paddingRight: 4,
    },
    cellMonth: {
        width: "11%",
        paddingRight: 4,
    },
    cellAmount: {
        width: "10.16%",
        textAlign: "right",
    },
    tableHeaderText: {
        fontWeight: "bold",
    },
    empty: {
        textAlign: "center",
        paddingTop: 24,
        paddingBottom: 24,
    },
    summary: {
        marginTop: 18,
        marginLeft: "auto",
        width: 210,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    summaryBold: {
        fontWeight: "bold",
    },
});

const TaxRefundComputationPDF = ({ data }: TaxRefundComputationPDFProps) => {
    const rows = data?.rows ?? [];
    const totals = data?.totals ?? {};

    return (
        <PDFViewer style={styles.fullPage}>
            <Document>
                <Page size="LETTER" orientation="landscape" style={styles.page}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.company}>SAVORY FASTFOOD INC.</Text>
                            <Text style={styles.title}>TAX REFUND COMPUTATION REPORT</Text>
                        </View>
                        <Text style={styles.printedDate}>
                            DATE PRINTED : {data?.date_printed ?? moment().format("MM/DD/YYYY")}
                        </Text>
                    </View>

                    <View style={styles.employee}>
                        <Text style={styles.employeeName}>{data?.employee?.full_name}</Text>
                        <Text style={styles.employeeDetails}>
                            {data?.employee?.employee_number}
                            {data?.period?.start && data?.period?.end
                                ? `    Period: ${moment(data.period.start).format("MMM DD, YYYY")} - ${moment(data.period.end).format("MMM DD, YYYY")}`
                                : ""}
                        </Text>
                    </View>

                    <View style={styles.table}>
                        <View style={[styles.row, styles.headerRow]}>
                            <Text style={[styles.cellEmployee, styles.tableHeaderText]}></Text>
                            <Text style={[styles.cellCode, styles.tableHeaderText]}>CODE</Text>
                            <Text style={[styles.cellMonth, styles.tableHeaderText]}>MONTHS</Text>
                            <Text style={[styles.cellAmount, styles.tableHeaderText]}>REG/GROSS</Text>
                            <Text style={[styles.cellAmount, styles.tableHeaderText]}>SSS</Text>
                            <Text style={[styles.cellAmount, styles.tableHeaderText]}>PHIC</Text>
                            <Text style={[styles.cellAmount, styles.tableHeaderText]}>HDMF</Text>
                            <Text style={[styles.cellAmount, styles.tableHeaderText]}>TAXABLE{"\n"}INCOME</Text>
                            <Text style={[styles.cellAmount, styles.tableHeaderText]}>TAX{"\n"}W/ HELD</Text>
                        </View>

                        {rows.length === 0 && (
                            <Text style={styles.empty}>No final payroll found for this tax refund period.</Text>
                        )}

                        {rows.map((row: any, index: number) => (
                            <View style={styles.row} key={`${row.month}-${index}`}>
                                <Text style={styles.cellEmployee}>{index === 0 ? data?.employee?.full_name : ""}</Text>
                                <Text style={styles.cellCode}>{row.code ?? ""}</Text>
                                <Text style={styles.cellMonth}>{row.month}</Text>
                                <Text style={styles.cellAmount}>{formatAmount(row.regular_gross)}</Text>
                                <Text style={styles.cellAmount}>{formatAmount(row.sss)}</Text>
                                <Text style={styles.cellAmount}>{formatAmount(row.phic)}</Text>
                                <Text style={styles.cellAmount}>{formatAmount(row.hdmf)}</Text>
                                <Text style={styles.cellAmount}>{formatAmount(row.taxable_income)}</Text>
                                <Text style={styles.cellAmount}>{formatAmount(row.tax_withheld)}</Text>
                            </View>
                        ))}

                        <View style={[styles.row, styles.footerRow]}>
                            <Text style={styles.cellEmployee}></Text>
                            <Text style={styles.cellCode}></Text>
                            <Text style={styles.cellMonth}></Text>
                            <Text style={styles.cellAmount}>{formatAmount(totals.regular_gross)}</Text>
                            <Text style={styles.cellAmount}>{formatAmount(totals.sss)}</Text>
                            <Text style={styles.cellAmount}>{formatAmount(totals.phic)}</Text>
                            <Text style={styles.cellAmount}>{formatAmount(totals.hdmf)}</Text>
                            <Text style={styles.cellAmount}>{formatAmount(totals.taxable_income)}</Text>
                            <Text style={styles.cellAmount}>{formatAmount(totals.tax_withheld)}</Text>
                        </View>
                    </View>

                    <View style={styles.summary}>
                        <View style={styles.summaryRow}>
                            <Text>Annual Tax Due</Text>
                            <Text>{formatAmount(totals.annual_tax_due)}</Text>
                        </View>
                        <View style={[styles.summaryRow, styles.summaryBold]}>
                            <Text>Computed Tax Refund</Text>
                            <Text>{formatAmount(totals.computed_tax_refund)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text>Stored Last Pay Tax Refund</Text>
                            <Text>{formatAmount(data?.last_pay?.stored_tax_refund)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text>Difference</Text>
                            <Text>{formatAmount(totals.difference_from_stored_tax_refund)}</Text>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default TaxRefundComputationPDF;
