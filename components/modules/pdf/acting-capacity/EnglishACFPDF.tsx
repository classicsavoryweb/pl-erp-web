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
        paddingLeft: 50,
        paddingRight: 50,
        fontSize: 11,
        lineHeight: 1.25,
        textAlign: 'justify'
    },
    bold: {
        fontWeight: "bold"
    },
    section: {
        paddingBottom: 10,
        flexDirection: 'row'
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
                        style={{...styles.sectionCenter,paddingBottom:40}}
                    >   
                        <View
                            style={{
                                paddingTop: 30,
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
                                marginTop: 20,
                                textDecoration: "underline",
                                fontSize: 14
                            }}
                        >
                            Photoline Enterprises Corporation
                        </Text>
                        <Text style={{
                                ...styles.bold,
                                marginTop: 8,
                                fontSize: 11
                            }}
                        >
                            Head Office
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'column' }}>
                        <View style={{...styles.section,paddingBottom:20}}>
                            <Text style={{width:100}}>Date: </Text>
                            <Text>{moment().format('MMMM DD, YYYY')}</Text>
                        </View>
                        <View style={{...styles.section,paddingBottom:20}}>
                            <Text style={{width:100}}>To: </Text>
                            <Text>{data.acting_capacity?.employee?.proper_full_name}</Text>
                        </View>
                        <View style={{...styles.section,paddingBottom:20}}>
                            <Text style={{width:100}}>From: </Text>
                            <Text>{process.env.NEXT_PUBLIC_SECONDARY_HR_SIGNATORY}</Text>
                        </View>
                        <View style={{...styles.section,paddingBottom:30}}>
                            <Text style={{width:100}}>RE:</Text>
                            <Text>NEW APPOINTMENT</Text>
                        </View>
                    </View>
                    <View style={{...styles.section}}>
                        <Text style={{
                            textAlign: 'justify',
                            textIndent: 30,
                            lineHeight: 1,
                            marginBottom: 15,
                        }}>
                        {INDENT}
                        {/* As a result of the favorable of your most recent performance evaluation as <Text>{data.acting_capacity?.current_position?.description}</Text>, we are pleased to announce your new appointment as <Text>{data.acting_capacity?.recommended_position?.description}</Text> of the Cavite Areas in R4A effective on <Text>{moment(data.acting_capacity?.start_date).format("MMMM DD, YYYY")}</Text>.     */}
                         As a result of the favorable of your most recent performance evaluation as <Text>{data.acting_capacity?.current_position?.description}</Text>, we are pleased to announce your new appointment as <Text>{data.acting_capacity?.recommended_position?.description}</Text>, effective on <Text>{moment(data.acting_capacity?.start_date).format("MMMM DD, YYYY")}</Text>.    
                        </Text>
                    </View>
                    <View style={{...styles.section,paddingBottom:50,marginBottom:50}}>
                        <Text style={{
                            textAlign: 'justify',
                            textIndent: 30,
                            lineHeight: 1,
                            marginBottom: 15,
                        }}>
                            {INDENT}
                            In view of this new appointment, we trust that you shall continue to abide by company policies, rules and regulations.	You are likewise expected to fulfill duties assigned to you, follow instructions of your superior, exercise discretion in connection with any information you may acquire by reason of your new appointment and maintain confidentiality thereof until after your employment with us.     
                        </Text>
                    </View>
                     <View style={{...styles.section,paddingBottom:50,marginBottom:15}}>
                        <Text>
                            Noted:   
                        </Text>
                    </View>    
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{...styles.bold, flexDirection: 'row', paddingBottom: 5,textAlign:'center' }}>
                            <Text style={{ flex: 1,borderBottom:1,marginHorizontal:15 }}>{data.acting_capacity?.employee?.proper_full_name}</Text>
                            <Text style={{ flex: 1,borderBottom:1,marginHorizontal:15  }}>{data.approved_by?.formal_full_name}</Text>
                            <Text style={{ flex: 1,borderBottom:1,marginHorizontal:15 }}>{process.env.NEXT_PUBLIC_HR_SIGNATORY}</Text>
                        </View>
                        <View style={{...styles.bold, flexDirection: 'row', paddingBottom: 3,textAlign:'center'}}>
                            <Text style={{ flex: 1 }}>Signature over Printed Name</Text>
                            <Text style={{ flex: 1 }}>{data.approved_by?.current_position?.description}</Text>
                            <Text style={{ flex: 1 }}>{process.env.NEXT_PUBLIC_SECONDARY_HR_SIGNATORY_POSITION}</Text>
                        </View>
                    </View>

                </Page>
            </Document>
        </PDFViewer>
    );
    
};

export default EnglishACFPDF;
