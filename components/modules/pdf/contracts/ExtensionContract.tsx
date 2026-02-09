import React from 'react';
import { Document, Page, Text, View, PDFViewer, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import { convertToPesosAndCentavos } from '@/helper/amount';

const styles = StyleSheet.create({
    fullPage: {
        width: '100%',
        height: '87vh',
    },
    page: {
        paddingLeft: 72,
        paddingRight: 72,
        fontSize: 11,
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
const ExtensionContract = ({
    data
}: CoeInterface) => (
    <PDFViewer style={styles.fullPage}>
        <Document>
            <Page
                size={[612, 936]}
                style={{
                    ...styles.page,
                    lineHeight: 1.15,
                }}
            >
                <View
                    style={styles.sectionCenter}
                >   
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center"
                        }}
                    >
                        <Image
                            style={styles.image}
                            src={"/images/contract-header.png"}
                        />
                    </View>
                    <Text
                        style={{
                            marginTop: -15
                        }}
                    >
                        EXTENSION OF PROBATIONARY CONTRACT
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            ...styles.bold,
                            paddingBottom: 10
                        
                        }}
                    >
                        I.	Position/Branch Assignment
                    </Text>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        You were initially employed as a probationary employee on {moment(data.date_hired).format('MMMM DD, YYYY')}. You were designated as {data.position} under the {process.env.NEXT_PUBLIC_COMPANY} and was assigned at Classic Savory {data.branch}. Your duties and responsibilities as {data.position} were made known to you at the time of your engagement. You agreed that you may be ordered to perform such tasks and/or be stationed/assigned to another location or department other than that your initial assignment as the exigencies of the service may require.<br/>Your position and place of appointment are continued under this Contract.
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            ...styles.bold,
                            paddingBottom: 10
                        
                        }}
                    >
                        II. Terms of Employment
                    </Text>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        We both agree to extend your probationary period for another ({data.duration}) {data.duration_type} to give you enough time to improve your performance standards based on the duties and responsibilities of your position. The extension of the probationary period gives you another chance to meet the standards of the company, which were made known to you at the time of your engagement as a probationary employee. The extension of your probationary period will start on {moment(data.contract_start_date).format('MMMM DD, YYYY')} and will end on {moment(data.contract_end_date).format('MMMM DD, YYYY')}. You agree not to engage in other services that will directly compete with those being ordered by the {process.env.NEXT_PUBLIC_COMPANY}. You likewise agree to keep all information obtained during the period of your employment either directly or indirectly, as confidential. You shall not divulge to third parties such confidential information about the company, its officers and employees. A violation of this provision shall make you liable to the company for liquidated damages in the amount of at least Php100,000.00
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            ...styles.bold,
                            paddingBottom: 10
                        
                        }}
                    >
                        III. Compensation
                    </Text>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        You shall receive the basic salary of {convertToPesosAndCentavos(data.salary_amount)} ({Number(data.salary_amount).toFixed(2)}) per hour. The cut off period is on the 10th of the month for every 15th payroll period and 25th of the month for every 30th payroll period.
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            ...styles.bold,
                            paddingBottom: 10
                        
                        }}
                    >
                        IV. Rules and Regulations
                    </Text>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        You acknowledge that the rules, regulations and policies of the company for its employees were made known to you and explained to you during your orientation as a new employee.  You acknowledge that you understand the company’s rules, regulations and policies and undertake to abide by such rules, regulations and policies.  Such rules, regulations and policies include, but are not limited to, the following:
                    </Text>
                </View>
                <View
                    style={styles.section}
                >
                    <View style={styles.itemFlex}>
                        <Text>1.</Text>
                        <Text>You shall strictly follow the company’s regular working period and follow rules in timekeeping.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>2.</Text>
                        <Text>You shall strictly follow rules on wearing of proper uniform and proper grooming.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>3.</Text>
                        <Text>You are bound to take good care of the company and customer properties. In the event of damage or loss of these properties due to fault or negligence on your part determined after proper investigation, you agree that the company will have the right to deduct the amount equivalent to the lost or damaged company and customer properties from your salary and other benefits that will or may accrue in your favor.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>4.</Text>
                        <Text>You shall perform the expected output and attitude towards work. You should at least pass the performance appraisal of your superior.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>5.</Text>
                        <Text>You shall not commit any of the just or authorized causes as provided under the Labor Code such as serious misconduct, gross and habitual negligence, fraud or willful breach of trust and criminal offense.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>6.</Text>
                        <Text>The Company may also terminate your services before the specified period of this agreement on the following situations: closure of establishment, reduction of personnel, installation of labor saving devices, serious disease, violation of the Code of Conduct, failure to submit required pre-employment requirements and failure to pass the performance appraisal, the standards of which were made known to you at the time of the execution of this agreement.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>7.</Text>
                        <Text>I understand that should I fail to follow the established procedures and policies, I will be charged for any losses that the company may suffer due to my negligence.</Text>
                    </View>
                </View>
            </Page>

            <Page size={[612, 936]} style={{    
                ...styles.page,
                paddingTop: 50,
                lineHeight: 1.15,
            }}>

                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            ...styles.bold,
                            paddingBottom: 10
                        
                        }}
                    >
                        V. Resignation
                    </Text>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        Should you wish to resign before the expiration of your term of employment, you must submit a written resignation letter with prior notice of at least 30 calendar days before its effectivity date and shall properly turnover responsibilities and accountabilities to your replacement. Should you wish to resign before the expiration of your term of employment, you must submit a written resignation letter with prior notice of at least 30 calendar days before its effectivity date and shall properly turnover responsibilities and accountabilities to your replacement.
                    </Text>

                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        Should you fail to give the an advance notice of at least 30 calendar days before the effectivity of your resignation and fail to finish your employment contract you are liable to reimburse the cost of your training in the amount of Php50,000 and additional damages due to the disruption of work caused by your sudden resignation. You agree that Savory Fast Food Inc. may apply your last salary and benefits, including your 13th month pay, to cover the training expenses and damages.
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        I hereby certify that I fully understand the condition of my employment contract.
                    </Text>
                </View>

                <View
                    style={{
                        ...styles.section,
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}
                >
                    <Text
                        style={{
                            ...styles.bold,
                            paddingBottom: 20
                        
                        }}
                    >
                        Conforme:
                    </Text>

                    <Text
                        style={{
                            ...styles.bold,
                            paddingBottom: 20
                        
                        }}
                    >
                        {process.env.NEXT_PUBLIC_COMPANY}.
                    </Text>
                </View>

                <View
                    style={{
                        paddingTop:15,
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}
                >
                    <Text
                        style={{
                            ...styles.bold,
                            width: 200,
                            borderBottom: 1,
                            paddingBottom: 1,
                            textAlign: "center"
                        }}
                    >
                        {String(data.proper_full_name).toUpperCase()}
                    </Text>

                    <Text
                        style={{
                            ...styles.bold,
                            width: 200,
                            borderBottom: 1,
                            paddingBottom: 1,
                            textAlign: "center"
                        }}
                    >
                        {process.env.NEXT_PUBLIC_HR_SIGNATORY?.toUpperCase()}
                    </Text>
                </View>

                <View
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}
                >
                    <Text
                        style={{
                            ...styles.bold,
                            width: 200,
                            textAlign: "center"
                        }}
                    >
                        Signature over Printed Name
                    </Text>

                    <Text
                        style={{
                            ...styles.bold,
                            width: 200,
                            textAlign: "center"
                        }}
                    >
                        HR Head
                    </Text>
                </View>

                <View
                    style={{
                        paddingTop: 50,
                        paddingBottom: 20,
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "row"
                    }}
                >
                    <Text
                        style={styles.bold}
                    >
                        ACKNOWLEDGEMENT
                    </Text>
                </View>
                <View
                    style={styles.section}
                >
                    <Text>
                        Republic of the Philippines
                    </Text>
                    <Text>
                        Quezon City{INDENT} {INDENT}s.s.
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text>
                        BEFORE ME, a notary public personally appeared the following persons and exhibited their respective Community Tax Certificates:
                    </Text>
                </View>

                <View
                    style={{
                        ...styles.section,
                        display: "flex",
                        justifyContent: "flex-start",
                        flexDirection: "row"

                    }}
                >
                    <Text style={{ flex: 1 }}>Name:</Text>
                    <Text style={{ flex: 1 }}>CTC Number:</Text>
                    <Text style={{ flex: 1 }}>Date:</Text>
                    <Text style={{ flex: 1 }}>Place of Issue:</Text>
                </View>
                <View
                    style={{
                        ...styles.section,
                        paddingTop: 30,
                    }}
                >
                    <Text>BOTH PARTIES acknowledged that the foregoing is their voluntary act and deed and the individuals or persons they represent.</Text>
                </View>

                <View
                    style={{
                        paddingBottom: 30
                    }}
                >
                    <Text>IN WITNESS HEREOF, I hereby affix my signature this _________ day of ___________ 2025 in _______. </Text>
                </View>

                <View>
                    <Text
                        style={{
                            paddingLeft: 320
                        }}
                    >
                        Notary Public
                    </Text>

                    <Text>
                        Doc No.
                    </Text>

                    <Text>
                        Page No.
                    </Text>

                    <Text>
                        Book No.
                    </Text>

                    <Text>
                        Series of ______
                    </Text> 
                </View>
            </Page>

            <Page size={[612, 936]} style={{    
                ...styles.page,
                paddingTop: 50,
                lineHeight: 1.5,
            }}>
                <View
                    style={styles.sectionCenter}
                >   
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center"
                        }}
                    >
                        <Image
                            style={styles.image}
                            src={"/images/contract-header.png"}
                        />
                    </View>
                    <Text
                        style={{
                            marginTop: -15
                        }}
                    >
                        EXTENSION OF PROBATIONARY CONTRACT
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text>
                        I, {data.proper_full_name}, currently a probationary employee of {process.env.NEXT_PUBLIC_COMPANY} and holding the position of {data.position}. My probationary period as {data.position} will expire on {moment(data.previous_contract_end_date).format('MMMM DD, YYYY')}. I understand and agree that I still need to improve on certain areas. I agree that my probationary period will be extended for another ({data.duration}) {data.duration_type} which will start on {moment(data.contract_start_date).format('MMMM DD, YYYY')} and will expire on {moment(data.contract_end_date).format('MMMM DD, YYYY')}. I agree that during the extension of my probationary period, I will occupy the position of {data.position}. This extension period will give me a chance to improve on my performance appraisal based on my duties and responsibilities. I agree that I need to pass my next performance appraisal. {process.env.NEXT_PUBLIC_COMPANY} will make a final decision of my employment on {moment(data.contract_end_date).format('MMMM DD, YYYY')}.
                    </Text>
                </View>

                <View
                    style={{
                        ...styles.section,
                        paddingVertical: 50
                    }}
                >
                    <Text>Conforme:</Text>
                </View>
                
                <View
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}
                >
                    <Text
                        style={{
                            width: 200,
                            borderBottom: 1,
                            paddingBottom: 1,
                            textAlign: "center"
                        }}
                    >
                        {String(data.proper_full_name).toUpperCase()}
                    </Text>

                    <Text
                        style={{
                            width: 200,
                            borderBottom: 1,
                            paddingBottom: 1,
                            textAlign: "center"
                        }}
                    ></Text>
                </View>

                <View
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}
                >
                    <Text
                        style={{
                            width: 200,
                            textAlign: "center"
                        }}
                    >
                        Signature over Printed Name
                    </Text>

                    <Text
                        style={{
                            width: 200,
                            textAlign: "center"
                        }}
                    >
                        Date
                    </Text>
                </View>
                
            </Page>
        </Document>
    </PDFViewer>
);

export default ExtensionContract;
