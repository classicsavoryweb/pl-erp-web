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
        paddingLeft: 72,
        paddingRight: 72,
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
        display: "flex",
        width: "100%",  
        flexDirection: "row",
        gap: 5
    }
});

const INDENT = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

interface CoeInterface {
    data: any;
}
const FirstContract = ({
    data
}: CoeInterface) => (
    <PDFViewer style={styles.fullPage}>
        <Document>
            <Page size={[612, 936]} style={styles.page}>
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
                        # 84 Sto. Domingo Street, Brgy. Sto. Domingo, Quezon City
                    </Text>
                    <Text style={styles.bold}>EMPLOYMENT CONTRACT</Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text
                        style={styles.linedText}
                    >
                        {data.proper_full_name}
                    </Text>

                    <Text
                        style={styles.linedText}
                    >
                        {data.address}
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text
                        style={styles.linedText}
                    >
                        Dear {data.gender ? "Mr. " : "Ms. "}{String(data.last_name).charAt(0).toUpperCase() + String(data.last_name).slice(1).toLowerCase()}:
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
                        We shall employ you as <Text style={styles.boldedLinedText}>{data.position}</Text> and shall be assigned at <Text style={styles.boldedLinedText}>{data.branch}</Text> branch. Your duties and responsibilities as <Text style={styles.boldedLinedText}>{data.position}</Text> were made known to you at the time of your engagement. You agreed that you may be ordered to perform such tasks and/or be stationed/assigned to another location/department other than that enumerated above as the exigencies of the service may require.
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
                        II.	Terms of Employment
                    </Text>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        We shall employ you as a probationary employee for the period of <Text style={styles.boldedLinedText}>{data.duration} Months</Text> starting on <Text style={styles.boldedLinedText}>{moment(data.contract_start_date).format('MMMM DD, YYYY')}</Text> and ending <Text style={styles.boldedLinedText}>{moment(data.contract_end_date).format('MMMM DD, YYYY')}</Text>. 
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
                        You shall receive the basic salary of <Text style={styles.boldedLinedText}>{convertToPesosAndCentavos(data.salary_amount)} ({Number(data.salary_amount).toFixed(2)})</Text> per hour. The cut-off period is on the 10th of the month for every 15th payroll period and 25th of the month for every 30th payroll period. 
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
                    <View style={styles.itemFlex}>
                        <Text>8.</Text>
                        <Text>All company documents (eg: Notice to Explain, Payslip, etc.) sent to your provided personal email will be considered received by you. It is your responsibility to provide an updated and active email address to the HR Department.</Text>
                    </View>
                </View>
            </Page>

            <Page size={[612, 936]} style={{    
                ...styles.page,
                paddingTop: 50
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
                            ...styles.bold,
                            paddingBottom: 10
                        
                        }}
                    >
                        VI. Confidentiality
                    </Text>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        During the effectivity of this contract, you agree to keep all confidential information either directly or indirectly, as confidential including all proprietary information, trade secrets, and any other sensitive information obtained during the period of your employment. You shall not divulge to third parties such confidential information about the company, its officers and employees. This obligation remains in perpetuity and includes refraining from disclosing or using such information for any purpose other than the benefit of Savory Fastfood Inc.
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
                        VII. Non-Competition
                    </Text>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        During the employment period and after the termination of employment for a period of two (2) years following your departure with Savory Fast Food Inc., you shall not:
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <View style={styles.itemFlex}>
                        <Text>1.</Text>
                        <Text>Directly or indirectly put up a business or join any business that competes with Savory Fast Food Inc. and its affiliated entities, whether such business be a start-up or established/operating already.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>2.</Text>
                        <Text>Engage in other activities that may cause conflict with Savory Fast Food Inc. interest during the term of employment, including copying the menu items and/or recipes of Savory and/or its affiliates.</Text>
                    </View>
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
                        VIII. Non-Solicitation
                    </Text>
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        In the event of resignation or termination of employment, you must not for a period of five (5) years following your departure, to initiate contact with the employee of Savory Fastfood Inc.,in order to solicit or induce any employee of the Savory Fastfood Inc.to terminate an employment relationship with Savory Fastfood Inc. to accept employment with you or any business or company that you may be connected with or discuss with any employees on any other matters regarding their employment with and operations of Savory Fastfood Inc.
                    </Text>

                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                    >
                        A violation of the provision on Confidentiality, Non-Competition and/or Non-Solicitation will make you liable for liquidated damages in the amount of Php 100,000.00 plus any and all additional damages that Savory and/or its affiliates may suffer.
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
                        SAVORY FASTFOOD INC.
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
                        WILHIM T. ONG
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
            </Page>
            
            <Page size={[612, 936]} style={{    
                ...styles.page,
                paddingTop: 50
            }}>
                <View
                    style={{
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
        </Document>
    </PDFViewer>
);

export default FirstContract;
