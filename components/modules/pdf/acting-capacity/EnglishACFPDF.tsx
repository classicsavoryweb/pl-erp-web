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
}
const EnglishACFPDF = ({
    data
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
                            ACTING CAPACITY APPOINTMENT
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
                                    rowGap: 5
                                }}
                            >
                                <Text>Current Position: </Text>
                                <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.current_position.description}</Text>
                            </View>                        
                        </View>

                        <View>
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

                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    rowGap: 5
                                }}
                            >
                                <Text>Recommended Position: </Text>
                                <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.recommended_position.description}</Text>
                            </View>                        
                        </View>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>This is to confirm your appointment as <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.recommended_position.description}</Text> in an acting capacity of not less than <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.period}</Text>, effective {moment(data.acting_capacity.start_date).format("MMMM DD, YYYY")}.</Text>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>You shall be assigned at <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.branch_assignment.name}</Text> and shall report to <Text style={{ textDecoration: "underline" }}>{data.acting_capacity.oic.formal_full_name}</Text>.</Text>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>During your Acting Capacity Appointment, you shall comply all the duties and responsibilities of your assigned position.</Text>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>It is expressly understood that should you fail to meet the set performance standards, management reserves the right to revert you to your previous position. In any case, you shall be notified of your performance appraisal and status before or upon the completion of your Acting Capacity Appointment.</Text>
                    </View>
                    
                    <Text style={{paddingTop:30 , paddingBottom:40 , fontWeight: "bold"}}>Conforme:</Text>
                    
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 75,
                        }}
                    >
                        <Text>Name & Signature of Employee</Text>
                        <Text>Date:</Text>
                    </View>
                    { data.with_recommendation &&
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
            </Document>
        </PDFViewer>
    );
    
};

export default EnglishACFPDF;
