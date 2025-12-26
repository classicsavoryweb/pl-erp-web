import React from 'react';
import { Document, Page, Text, View, PDFViewer, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import { convertToPesosAndCentavos, numberToWords } from '@/helper/amount';

const styles = StyleSheet.create({
    fullPage: {
        width: '100%',
        height: '87vh',
    },
    page: {
        paddingLeft: 35,
        paddingRight: 35,
        fontSize: 11,
        lineHeight: 1.25,
        textAlign: 'justify'
    },
    bold: {
        fontWeight: "bold"
    },
    section: {
        paddingBottom: 10
    },
    sectionCenter: {
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        paddingBottom: 20
    },
    image: {
        width: 150,
    },
    linedText: {
        textDecoration: "underline"
    },
    boldedLinedText: {
        textDecoration: "underline",
        fontWeight: "bold"
    },
    itemFlex: {
        paddingLeft: 25,
        alignItems: 'flex-start',
        width: "100%",  
        flexDirection: "row",
        gap: 5
    }
});

const INDENT = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

interface CoeInterface {
    data: any;
    withRecommendation?: boolean;
}
const EnglishPromotionPDF = ({
    data,
    withRecommendation = false
}: CoeInterface) => {

    moment.locale('en');

    return (
        <PDFViewer style={styles.fullPage}>
            <Document>
                <Page size="LETTER" style={styles.page}>
                    <View
                        style={styles.sectionCenter}
                    >   
                        <View
                            style={{
                                paddingTop: 10,
                                flexDirection: "row",
                                justifyContent: "center"
                            }}
                        >
                            <Image
                                style={styles.image}
                                src={"/images/contract-header.png"}
                            />
                        </View>
                        <Text style={{
                                ...styles.bold,
                                marginTop: -15,
                                textDecoration: "underline",
                                fontSize: 11
                            }}
                        >
                            PROMOTION CONFIRMATION FORM
                        </Text>
                    </View>
                    
                    <View
                        style={{
                            paddingVertical: 30,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    rowGap: 5
                                }}
                            >
                                <Text>Name: </Text>
                                <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.employee.proper_full_name}</Text>
                            </View>

                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    rowGap: 5,
                                    paddingTop: 5
                                }}
                            >
                                <Text>Branch: </Text>
                                <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.branch.name}</Text>
                            </View>                        
                        </View>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>This is to confirm your promotion as <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.recommended_position.description}</Text> effective {moment(data.acting_capacity.effectivity_date).format("MMMM DD, YYYY")}.</Text>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>You shall be assigned at <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.branch_assignment.name}</Text> and shall report to <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.oic.formal_full_name}.</Text> We would like to congratulate you for meeting the requirements of your new position.</Text>
                    </View>


                    <View
                        style={styles.section}
                    >
                        <Text>**If appointment is fast tracked, please state reason:_______________________________________________</Text>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>{INDENT}Recommended By:____________________________________</Text>
                    </View>
                    
                    <Text style={{paddingTop:30 , paddingBottom:40 , fontWeight: "bold"}}>Conforme:</Text>
                    
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 75,
                        }}
                    >
                        <Text>Name & Signature of Employee: <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.employee.proper_full_name}</Text></Text>
                        <Text>Date:</Text>
                    </View>
                    
                    { withRecommendation &&
                        <>
                            <Text style={{paddingBottom: 40, paddingTop: 30,fontWeight: "bold"}}>Recommended by:</Text>
                            
                            <View>
                                <Text
                                    style={{
                                        textDecoration: "underline"
                                    }}
                                >
                                    {data.recommended_by.formal_full_name}
                                </Text>
                                <Text>{data.recommended_by.current_position.description}</Text>
                            </View>
                        </>
                    }

                    <Text style={{paddingBottom: 40, paddingTop: 30, fontWeight: "bold"}}>Approved by:</Text>
                    
                    <View>
                        <Text
                            style={{
                                textDecoration: "underline"
                            }}
                        >
                            {data.approved_by.formal_full_name}
                        </Text>
                        <Text>{data.approved_by.current_position.description}</Text>
                    </View>
                </Page>

                <Page size={[612, 936]} style={styles.page}>
                    <View
                        style={styles.sectionCenter}
                    >   
                        <View
                            style={{
                                paddingTop: 10,
                                flexDirection: "row",
                                justifyContent: "center"
                            }}
                        >
                            <Image
                                style={styles.image}
                                src={"/images/contract-header.png"}
                            />
                        </View>
                        <Text style={{
                                ...styles.bold,
                                marginTop: -15,
                                textDecoration: "underline",
                                fontSize: 11
                            }}
                        >
                            SERVICE BOND AGREEMENT FOR MANAGEMENT TEAM EMPLOYEES
                        </Text>
                    </View>

                    <View
                        style={{
                            paddingVertical: 15,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                rowGap: 5
                            }}
                        >
                            <Text>Name: </Text>
                            <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.employee.proper_full_name}</Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                rowGap: 5
                            }}
                        >
                            <Text>Department: </Text>
                            <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.branch.name}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text>This is to confirm your promotion as <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.recommended_position.description}</Text> effective {moment(data.acting_capacity.effectivity_date).format("MMMM DD, YYYY")}.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text>
                            Due to my appointment to a higher position, I understand that I will be acquiring additional skills and learnings in managing my section/department, acquiring confidential information about the company, its operations, and its directors, officers, employees, clients, and improving my leadership and decision making skills through the help of the management and my superiors. In view of the foregoing, I voluntarily agree to bind myself to be employed with {process.env.NEXT_PUBLIC_COMPANY}. for a minimum period of ({data.acting_capacity.bond_year}) year from the date of my appointment as {data.acting_capacity.recommended_position.description}. For this purpose, I have agreed to put up a service bond in the amount of {convertToPesosAndCentavos(Number(data.acting_capacity.bond_amount))} (Php {Number(data.acting_capacity.bond_amount).toFixed(2)}), to cover any and all damages that Savory Fastfood, Inc. may suffer in the event that I resign before the agreed period or am terminated from employment for cause before the agreed period, as well as a result of any breach of my agreement with the company. Further, I agree that I shall not at any time, without the written consent from Savory Fastfood, Inc., either during the term of my employment or thereafter, disclose, divulge or make public any confidential information acquired by me either directly or indirectly in the course of my employment.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{
                            fontSize: 10,
                        }}>
                            “Confidential Information” shall mean any data or information that is sensitive material and not generally known to the public, including, but not limited to, information relating to development and plans, finance, operations, systems, proprietary concepts, documentation, reports, data, specifications, computer software, source code, object code, flow charts, data, databases, know-how, trade secrets, recipes, customer lists, customer relationships, customer profiles, supplier lists, supplier relationships, supplier profiles, pricing, sales estimates, business plans and internal performance results relating to the past, present or future business activities, technical information, designs, processes, procedures, formulas or improvements, and employees’ basic and personal information like full name, address, birthday, email address, and salary which the Company considers confidential and proprietary.  Confidential information shall likewise include any information about the Company’s directors, officers, suppliers, contractors, agents, customers, clients, lessors, and employees.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text>
                            Should I resign or get separated from {process.env.NEXT_PUBLIC_COMPANY}., due to the sensitive nature of my position and access to confidential information, trade secrets, recipes and business plans, I agree that I will not work or seek employment with a direct competitor or any company in the same line of business which {process.env.NEXT_PUBLIC_COMPANY}. is in for a period of five (5) years. I understand that violation of this provision will result to a breach of this agreement, entitling the company to liquidated damages in the amount equivalent to my service bond.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text>
                            I understand that since I have access to confidential information, I am considered a <Text style={styles.bold}>Confidential Employee</Text> and I enjoy a high level of trust and confidence. I understand that I will not violate the trust and confidence given to me as a <Text style={styles.bold}>Confidential Employee</Text>.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text>
                            In the event of the breach of the terms of this agreement, I undertake to pay Savory Fastfood, Inc. liquidated damages in the amount of {convertToPesosAndCentavos(Number(data.acting_capacity.bond_amount))} (Php {Number(data.acting_capacity.bond_amount).toFixed(2)}) to cover the cost of whatever damages that Savory Fastfood, Inc. may incur as a result of my breach of any provision of this Agreement, in addition to any and all damages that Savory Fastfood, Inc. may suffer, without prejudice to Savory Fastfood, Inc. availing of any other legal action or remedy that may be available to Savory Fastfood, Inc. any legal expenses that will be incurred by Savory Fastfood, Inc. will also be charged to me. I consent to allow Savory Fastfood, Inc. to offset my liability for actual and/or liquidated damages to Savory Fastfood, Inc. by applying my salaries, incentives, including my 13th month pay and other benefits that may be due to me to cover the cost of my service bond for all and any damages.  I understand that any remaining balance from my service bond and for the damages will have to be paid to Savory Fastfood, Inc. without prejudice to its availing of any other legal action or remedy that may be available to the company.
                        </Text>
                    </View>

                    <View style={{
                        paddingTop: 20,
                        paddingBottom: 40
                    }}>
                        <Text>
                            With my Understanding, Conformity and Agreement:
                        </Text>
                    </View>
                    
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 75,
                        }}
                    >
                        <Text>Name & Signature of Employee: <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.employee.proper_full_name}</Text></Text>
                        <Text>Date:</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
    
};

export default EnglishPromotionPDF;
