"use client";

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

const fmt = (v: any) =>
    Number(v ?? 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        paddingLeft: 36,
        paddingRight: 36,
        paddingBottom: 30,
        fontSize: 8,
    },
    slip: {
        flex: 1,
        paddingVertical: 8,
    },
    logo: {
        width: 150,
        marginBottom: 3,
    },
    formTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 8,
    },
    infoGrid: {
        flexDirection: "row",
        marginBottom: 8,
    },
    infoCol: {
        flex: 1,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    infoLabel: {
        width: 70,
    },
    infoColon: {
        width: 8,
    },
    infoValue: {
        flex: 1,
    },
    boxRow: {
        flexDirection: "row",
        marginBottom: 10,
    },
    boxLeft: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#000",
    },
    boxHead: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        paddingVertical: 3,
        textAlign: "center",
    },
    boxBody: {
        paddingHorizontal: 6,
        paddingVertical: 6,
        minHeight: 45,
        textAlign: "center",
    },
    sigRow: {
        flexDirection: "row",
        marginBottom: 6,
    },
    sigBlock: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        paddingRight: 12,
    },
    sigLabel: {
        marginRight: 6,
    },
    sigNameBox: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        textAlign: "center",
        paddingBottom: 1,
    },
    separator: {
        borderTopWidth: 1,
        borderTopColor: "#aaa",
        borderTopStyle: "dashed",
        marginVertical: 14,
    },
});

const Slip = ({ issuance, custodianName }: { issuance: any; custodianName: string }) => {
    const requestedBy = issuance?.requested_by
        ? `${issuance.requested_by.last_name}, ${issuance.requested_by.first_name}`.toUpperCase()
        : String(issuance?.requested_by_name ?? "").replace("—", "").trim().toUpperCase();

    const approvedBy = issuance?.approved_by
        ? `${issuance.approved_by.last_name}, ${issuance.approved_by.first_name}`.toUpperCase()
        : String(issuance?.approved_by_name ?? "").replace("—", "").trim().toUpperCase();

    const receivedBy = issuance?.received_by
        ? `${issuance.received_by.last_name}, ${issuance.received_by.first_name}`.toUpperCase()
        : String(issuance?.received_by_name ?? "").replace("—", "").trim().toUpperCase();

    const branchName = issuance?.branch?.name ?? issuance?.branch_name ?? "";

    return (
        <View style={styles.slip}>
            <Image style={styles.logo} src="/images/classic-savory.png" />
            <Text style={styles.formTitle}>CASH ISSUANCE FORM</Text>

            <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>CI Number</Text>
                        <Text style={styles.infoColon}>:</Text>
                        <Text style={styles.infoValue}>{issuance?.pcv_number ?? ""}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Amount</Text>
                        <Text style={styles.infoColon}>:</Text>
                        <Text style={styles.infoValue}>{fmt(issuance?.amount)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Branch</Text>
                        <Text style={styles.infoColon}>:</Text>
                        <Text style={styles.infoValue}>{branchName}</Text>
                    </View>
                </View>
                <View style={styles.infoCol}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Issuance Date</Text>
                        <Text style={styles.infoColon}>:</Text>
                        <Text style={styles.infoValue}>
                            {issuance?.date ? moment(issuance.date).format("MM/DD/YYYY") : ""}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Requested By</Text>
                        <Text style={styles.infoColon}>:</Text>
                        <Text style={styles.infoValue}>{requestedBy}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Approved By</Text>
                        <Text style={styles.infoColon}>:</Text>
                        <Text style={styles.infoValue}>{approvedBy}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.boxRow}>
                <View style={[styles.boxLeft, { marginRight: 0 }]}>
                    <View style={styles.boxHead}><Text>Detailed Purpose</Text></View>
                    <View style={styles.boxBody}><Text>{issuance?.detailed_purpose ?? ""}</Text></View>
                </View>
            </View>

            <View style={styles.sigRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 10 }}>
                        <Text style={styles.sigLabel}>Received Date:</Text>
                        <View style={styles.sigNameBox}><Text> </Text></View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                        <Text style={styles.sigLabel}>Received By:</Text>
                        <View style={styles.sigNameBox}><Text>{receivedBy}</Text></View>
                    </View>
                </View>
                <View style={{ flex: 1 }} />
            </View>
        </View>
    );
};

interface CashIssuancePDFProps {
    issuance: any;
    custodianName: string;
}

const CashIssuancePDF = ({ issuance, custodianName }: CashIssuancePDFProps) => {
    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <Slip issuance={issuance} custodianName={custodianName} />
                <View style={styles.separator} />
                <Slip issuance={issuance} custodianName={custodianName} />
            </Page>
        </Document>
    );
};

export default CashIssuancePDF;
