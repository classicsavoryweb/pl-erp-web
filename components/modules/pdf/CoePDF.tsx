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
     pageWithCompen: {
        paddingTop: 130,
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
        color:'#1E40AF',
        textDecoration:'underline'
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
        alignSelf: 'flex-end',
        textAlign: 'center',
        width:150,
    },
    paragraph: {
        fontSize: 11,
        marginBottom: 8,
        lineHeight: 1.4,
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    bold: {
        fontWeight: "bold",
        marginBottom: 0,
    },
    withCompenTitle:{
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 15,
        fontWeight: 'bold',
        fontStyle:"italic",
        textTransform: 'uppercase',
        color:'#1E40AF',
        textDecoration:'underline'
    },
    sectiontwo: {
        marginBottom: 15,
    },
    
    
});


const INDENT = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

interface CoeInterface {
    data: any;
}

const CoePDF = ({
    data
}: CoeInterface) => {
        console.log("COE PDF DATA:", data);
        return(
    <PDFViewer style={styles.fullPage}>
        <Document>

        {data.coe_format === "Normal Format" &&
         data.employment_status === "Regular" && (
            <Page size="LETTER" style={styles.page}>
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
                                    This is to certify that <Text style={styles.bold}>{data.gender === "Male" ? "Mr." : "Ms."} {data.first_name + " " + data.middle_initial + data.last_name}</Text> was formerly employed <Text style={styles.bold}>{process.env.NEXT_PUBLIC_COMPANY} </Text> 
                                    holding the position of:
                                </Text>
                            </View> 
                        </>

                    } 
                    <View style={styles.section}>
                       
                        {data.positions?.map((item: any, index: number) => (
                            <Text
                                key={index}
                                style={styles.paragraph}
                                hyphenationCallback={(word: string) => [word]}
                            >
                                <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                     {INDENT}
                                    {item.position}
                                </Text>
                                {" from "}
                                {item.date_start}
                                {" to "}
                                {item.date_end}
                            </Text>
                        ))}
                    </View>                
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
                            That the person has been cleared of any monetary accountability in any manner whatsoever with regards to his employment.
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
                                    For further verification regarding {data.gender === "Male" ? "his " : "her "}performance and other employment records, please feel free to reach us at {process.env.NEXT_PUBLIC_HR_CONTACT} or email us at {process.env.NEXT_PUBLIC_HR_EMAIL}.
                                </Text>
                            </View>
                            :
                            <View style={styles.section}>
                                <Text hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    Should you need to verify any information or do background checking, please email us at
                                    {process.env.NEXT_PUBLIC_HR_EMAIL}.
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
                <View style={styles.section}>
                    <Text style={styles.bold}>{INDENT}Given this {moment().format('Do [day of] MMMM YYYY')}</Text>
                </View>
                
                <View style={styles.signature}>
                    <Text style={{...styles.bold,borderTop: 1,}}>{process.env.NEXT_PUBLIC_SECONDARY_HR_SIGNATORY}</Text>
                    <Text style={{...styles.bold,marginTop: -5}}>{process.env.NEXT_PUBLIC_SECONDARY_HR_SIGNATORY_POSITION}</Text>
                </View>
            </Page>
         )}
          {data.coe_format === "Normal Format" &&
        ( data.employment_status === "Probationary" || data.employment_status ==="Trainee") && (
            <Page size="LETTER" style={styles.page}>
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
                                    This is to certify that <Text style={styles.bold}>{data.gender === "Male" ? "Mr." : "Ms."} {data.first_name + " " + data.middle_initial + data.last_name}</Text> has been <Text style={styles.bold}>{data.employment_status}</Text> employee with this <Text style={styles.bold}>{process.env.NEXT_PUBLIC_COMPANY}</Text> as a <Text style={styles.bold}> {data.current_position}</Text> for a period of  since <Text style={styles.bold}>{moment(data.contract[0].contract_start_date).format("MMMM DD, YYYY")}</Text> until <Text style={styles.bold}>{moment(data.contract[0].contract_end_date).format("MMMM DD, YYYY")}</Text>. Her last assignment was at <Text style={styles.bold}>{data.current_branch}</Text>.
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
                            That the subject person has been cleared of any monetary accountability in any manner whatsoever with regards to her employment
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text hyphenationCallback={(word: string) => [word]}>
                            {INDENT}
                            This certification is being issued upon the request of <Text style={styles.bold}>{data.gender === "Male" ? "Mr." : "Ms."} {data.last_name}</Text> {data.purpose === "whatever legal purpose it may serve" ? "for" : "in relation to"}{data.purpose !== "whatever legal purpose it may serve" && (data.gender === "Male" ? " his" : " her")}
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
                                    For further verification regarding {data.gender === "Male" ? "his " : "her "}performance and other employment records, please feel free to reach us at {process.env.NEXT_PUBLIC_HR_CONTACT} or email us at {process.env.NEXT_PUBLIC_HR_EMAIL}.
                                </Text>
                            </View>
                            :
                            <View style={styles.section}>
                                <Text hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    Should you need to verify any information or do background checking, please email us at
                                    {process.env.NEXT_PUBLIC_HR_EMAIL}.
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

                <View style={styles.section}>
                    <Text style={styles.bold}>{INDENT}Given this {moment().format('Do [day of] MMMM YYYY')}</Text>
                </View>
                
                <View style={styles.signature}>
                    <Text style={{...styles.bold,borderTop: 1,}}>{process.env.NEXT_PUBLIC_SECONDARY_HR_SIGNATORY}</Text>
                    <Text style={{...styles.bold,marginTop: -5}}>{process.env.NEXT_PUBLIC_SECONDARY_HR_SIGNATORY_POSITION}</Text>
                </View>
            </Page>
         )}
          {data.coe_format === "With Compensation" && (
            <Page size="LETTER" style={styles.pageWithCompen}>
                <View style={styles.section}>
                    <Text style={styles.withCompenTitle}>CERTIFICATE OF EMPLOYMENT AND COMPENSATION</Text>
                </View>

                { data.employee_status === "active" && <>

                    { data.coe_reason === "Certificate of Leave - Special"
                        ?
                        <>
                            <View style={styles.sectiontwo}>
                                <Text style={styles.paragraph} hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    This is to certify that <Text style={styles.bold}>{data.gender === "Male" ? "Mr." : "Ms."} {data.first_name + " " + data.middle_initial + data.last_name}</Text> will be on Vacation leave from {data.leave_from} to {data.leave_to+" "}
                                     for {data.gender === "Male" ? "his" : "her"} {data.purpose}.
                                </Text>
                            </View>
                        </>
                        :
                        <>
                            <View style={styles.sectiontwo}>
                                <Text style={styles.paragraph} hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    This is to certify that <Text style={styles.bold}>{data.gender === "Male" ? "Mr." : "Ms."} {data.first_name + " " + data.middle_initial + data.last_name}</Text> is an employee of <Text style={styles.bold}>{process.env.NEXT_PUBLIC_COMPANY}</Text> and presently holding a permanent appointment with the position of <Text style={styles.bold}>{data.current_position}</Text> since <Text style={styles.bold}>{data.date_of_stay}</Text>.
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
                    <View style={styles.sectiontwo}>
                        <Text hyphenationCallback={(word: string) => [word]}>
                            {INDENT}
                            Her present compensation are as follows:
                        </Text>
                    </View>
                     <View style={styles.sectiontwo}>
                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                <Text style={{ width: 180 }}>Monthly Salary{"   "}</Text>
                                <Text style={styles.bold}> P{Number(data.current_salary).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2})} /mo</Text>
                            </View>
                    </View> 
                    <View style={styles.sectiontwo}>
                        <Text hyphenationCallback={(word: string) => [word]}>
                            {INDENT}
                            Further she received the following additional renumeration other than the above during the twelve month period ended and benefits
                        </Text>
                    </View>
                   <View style={styles.sectiontwo}>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={{ width: 180 }}>13th Month Pay</Text>
                            <Text style={styles.bold}>P _______________ </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={{ width: 180 }}>Vacation Leave 10 Days</Text>
                            <Text style={styles.bold}>P _______________ </Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={{ width: 180 }}>Sick Leave 10 Days</Text>
                            <Text style={styles.bold}>P _______________ </Text>
                        </View>
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
                                    For further verification regarding {data.gender === "Male" ? "his " : "her "}performance and other employment records, please feel free to reach us at {process.env.NEXT_PUBLIC_HR_CONTACT} or email us at {process.env.NEXT_PUBLIC_HR_EMAIL}.
                                </Text>
                            </View>
                            :
                            <View style={styles.section}>
                                <Text hyphenationCallback={(word: string) => [word]}>
                                    {INDENT}
                                    Should you need to verify any information or do background checking, please email us at
                                    {process.env.NEXT_PUBLIC_HR_EMAIL}.
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

                <View style={styles.section}>
                    <Text style={styles.bold}>{INDENT}Given this {moment().format('Do [day of] MMMM YYYY')}</Text>
                </View>
                <View style={styles.signature}>
                    <Text style={{...styles.bold,borderTop: 1,}}>{process.env.NEXT_PUBLIC_SECONDARY_HR_SIGNATORY}</Text>
                    <Text style={{...styles.bold,marginTop: -5}}>{process.env.NEXT_PUBLIC_SECONDARY_HR_SIGNATORY_POSITION}</Text>
                </View>
            </Page>
         )}
         
        </Document>
    </PDFViewer>
);
}

export default CoePDF;
