import React from 'react';
import { Document, Page, Text, View, PDFViewer, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import { translateToTagalog } from '@/helper/word';

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
const TagalogACFPDF = ({
    data
}: CoeInterface) => {

    moment.locale('fil');

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
                            <Text>Pangalan: </Text>
                            <Text style={{ textDecoration: "underline" }}>{data.employee.proper_full_name}</Text>
                        </View>

                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                rowGap: 5
                            }}
                        >
                            <Text>Kasalukuyang Posisyon: </Text>
                            <Text style={{ textDecoration: "underline" }}>{data.current_position.description}</Text>
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
                            <Text>Sangay: </Text>
                            <Text style={{ textDecoration: "underline" }}>{data.branch.name}</Text>
                        </View>

                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                rowGap: 5
                            }}
                        >
                            <Text>Inirerekomendang Position: </Text>
                            <Text style={{ textDecoration: "underline" }}>{data.recommended_position.description}</Text>
                        </View>                        
                    </View>
                </View>

                <View
                    style={styles.section}
                >
                    <Text>Ito ay para ikumpirma ang iyong pagkakatalaga bilang <Text style={{ textDecoration: "underline" }}>{data.recommended_position.description}</Text> na sa loob ng <Text style={{ textDecoration: "underline" }}>{translateToTagalog(data.period)}</Text>, epektibo ng {moment(data.start_date).format("MMMM DD, YYYY")}.</Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text>Ikaw ay itinilaga sa sangay ng <Text style={{ textDecoration: "underline" }}>{data.branch_assignment.name}</Text> at dapat mag-ulat kay <Text style={{ textDecoration: "underline" }}>{data.oic.formal_full_name}</Text>.</Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text>Sa panahon ng iyong Acting Capacity Appointment, dapat mong gawin ang lahat ng mga tungkulin at pananagutan ng posisyon na initalaga sa iyo.</Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text>Sa pagkakatanon na mabibigo mong makamit ang mga pamantayan ng pagganap sa nasabing posisyon, ang mga tagapamahala ay may karapatang ibalik ka sa dati mong posiyon. Ikaw ay aabisuhan tungkol sa pagsusuri sa iyo bago o pagkatapos ng iyong Acting Capacity Appointment.</Text>
                </View>
                
                <Text style={{paddingTop:30 , paddingBottom:40 , fontWeight: "bold"}}>Ang aking Pag-unawa at Pagsang-ayon:</Text>
                
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 75,
                    }}
                >
                    <Text>Pangalan at Lagda ng Empleyado</Text>
                    <Text>Petsa ng Paglagda:</Text>
                </View>

                <Text style={{paddingBottom: 40, paddingTop: 30, fontWeight: "bold"}}>Approved by:</Text>
                
                <View>
                    <Text
                        style={{
                            textDecoration: "underline"
                        }}
                    >
                        Ms. Jennifer Joyce T. Blanco
                    </Text>
                    <Text>Product Development and</Text>
                    <Text>Food Quality Head</Text>
                </View>
            </Page>
        </Document>
    </PDFViewer>
    );
};

export default TagalogACFPDF;
