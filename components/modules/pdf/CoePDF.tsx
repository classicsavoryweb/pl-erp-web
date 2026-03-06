import React from 'react';
import { Document, Page, Text, View, PDFViewer, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
    fullPage: {
        width: '100%',
        height: '85vh',
    },
    page: {
        paddingTop: 160,
        paddingLeft: 81,
        paddingRight: 81,
        paddingBottom: 40,
        fontSize: 10,
        lineHeight: 2,
        textAlign: 'justify'
    },
    textTitle: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 4,
    },
    positionSection: {
        marginTop: -10,
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    signature: {
        marginTop: 90,
    },
    paragraph: {
        textAlign: 'justify',
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    bold: {
        fontWeight: "bold",
    },
});


const INDENT = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

interface CoeInterface {
    data: any;
}

const CoePDF = ({
    data
}: CoeInterface) => (
    <PDFViewer style={styles.fullPage}>
        <Document>
            <Page size="LETTER" style={styles.page}>
                <View style={styles.section}>
                    <Text style={{ textAlign: 'left' }}>{moment().format('DD MMMM YYYY')}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.textTitle}>Certification</Text>
                </View>

                { data.employee_status === "active" && <>

                    { data.coe_reason === "Certificate of Leave - Special"
                        ?
                        <>
                            <View style={styles.section}>
                                <Text style={styles.paragraph} hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    This is to certify that <Text style={styles.bold}>{data.gender === "Male" ? "Mr." : "Ms."} {data.first_name + " " + data.middle_initial + data.last_name}</Text> will be on Vacation leave from {data.leave_from} to {data.leave_to+" "}
                                     for {data.gender === "Male" ? "his" : "her"} {data.purpose}.
                                </Text>
                            </View>
                        </>
                        :
                        <>
                            <View style={styles.section}>
                                <Text style={styles.paragraph} hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    This is to certify that <Text style={styles.bold}>{data.gender === "Male" ? "Mr." : "Ms."} {data.first_name + " " + data.middle_initial + data.last_name}</Text> is an employee of <Text style={styles.bold}>{process.env.NEXT_PUBLIC_COMPANY}</Text> since {data.date_of_stay}. {data.gender === "Male" ? "He" : "She"} is currently holding the position
                                    of <Text style={styles.bold}>{data.current_position}</Text>.
                                </Text>
                            </View> 
                        </>

                    }                    
                    { data.include_salary === "Yes" &&
                        <View style={styles.section}>
                            <Text hyphenationCallback={(word: string) => [word]}>
                                {INDENT}
                                {data.gender === "Male" ? "Mr." : "Ms."} {data.last_name} is receiving a monthly basic salary amounting to Pesos: {data.salary} exclusive of performance incentive.
                            </Text>
                        </View>
                    }

                    <View style={styles.section}>
                        <Text hyphenationCallback={(word: string) => [word]}>
                            {INDENT}
                            Should you need to verify any information or do background checking, please email us at
                            sfirecords@classicsavory.com.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text hyphenationCallback={(word: string) => [word]}>
                            {INDENT}
                            This certification is being issued upon the request of {data.gender === "Male" ? "Mr." : "Ms."} {data.last_name} {data.purpose === "whatever legal purpose it may serve" ? "for" : "in relation to"}{data.purpose !== "whatever legal purpose it may serve" && (data.gender === "Male" ? " his" : " her")}
                            {" " + data.purpose}.
                        </Text> 
                    </View>
                </>}

                { data.employee_status === "inactive" &&
                    <>
                        <View style={styles.section}>
                            <Text style={styles.paragraph} hyphenationCallback={(word: string) => [word]}>
                                {INDENT}
                                This is to certify that <Text style={styles.bold}>{data.gender === "Male" ? "Mr." : "Ms."} {data.first_name + " " + data.middle_initial + data.last_name}</Text> was formerly employed by <Text style={styles.bold}>{process.env.NEXT_PUBLIC_COMPANY}</Text> as {data.positions.length === 1 && <><Text style={styles.bold}>{data.current_position} from {data.date_of_stay}. </Text></>}
                            </Text>
                        </View>
                        
                        { data.positions.length > 1 &&
                            <View style={styles.positionSection}>
                                { data.positions.map((position: any, key: number) => (
                                        <Text key={key} style={styles.bold}>
                                            {INDENT}{position.position} from {position.date_start} to {position.date_end}
                                        </Text>
                                    ))
                                }
                            </View>
                        }

                        { data.include_salary === "Yes" &&
                            <View style={styles.section}>
                                <Text hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    {data.gender === "Male" ? "Mr." : "Ms."} {data.last_name} is receiving a monthly basic salary amounting to Pesos: {data.salary} exclusive of performance incentive.
                                </Text>
                            </View>
                        }

                        { (data.employment_status === "AWOL" || data.employment_status === "Terminated")
                            ?
                            <View style={styles.section}>
                                <Text hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    For further verification regarding {data.gender === "Male" ? "his " : "her "}performance and other employment records, please feel free to reach us at 09178242418 or email us at sfirecords@classicsavory.com.
                                </Text>
                            </View>
                            :
                            <View style={styles.section}>
                                <Text hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    Should you need to verify any information or do background checking, please email us at
                                    sfirecords@classicsavory.com.
                                </Text>
                            </View>
                        }

                        <View style={styles.section}>
                            <Text hyphenationCallback={(word: string) => [word]}>
                                {INDENT}
                                This certification is being issued upon the request of {data.gender === "Male" ? "Mr." : "Ms."} {data.last_name} {data.purpose === "whatever legal purpose it may serve" ? "for" : "in relation to"}{data.purpose !== "whatever legal purpose it may serve" && (data.gender === "Male" ? " his" : " her")}
                                {" " + data.purpose}.
                            </Text>
                        </View>
                    </>
                }

                <View style={styles.signature}>
                    <Text style={styles.bold}>{process.env.NEXT_PUBLIC_HR_SIGNATORY}</Text>
                    <Text>{process.env.NEXT_PUBLIC_HR_SIGNATORY_POSITION}</Text>
                </View>
            </Page>
        </Document>
    </PDFViewer>
);

export default CoePDF;
