import React from 'react';
import { Document, Page, Text, View, PDFViewer, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import _ from 'lodash';
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Tahoma',
  fonts: [
    { src: '/fonts/Tahoma.ttf', fontWeight: 'normal' },
    { src: '/fonts/Tahoma-Bold.ttf', fontWeight: 'bold' },
  ],
}); 


const styles = StyleSheet.create({
    fullPage: {
        width: '100%',
        height: '87vh',
    },
    page: {
        paddingTop: 50,
        paddingLeft: 30,
        paddingRight: 30,
        fontSize: 8.5, 
        lineHeight: 1.25,
        textAlign: 'justify',
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
        paddingBottom: 20,
    },
    image: {
        width: 150,
    },
    linedText: {
        textDecoration: "underline",
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
        gap: 5,
    },
    table: {
        width: "auto",
        marginVertical: 10,
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        width: "33.33%",
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        textAlign: "center",
        fontWeight: 'bold',
    },
    tableCol: {
        width: "33.33%",
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        textAlign: "center",
    },
    tahoma: {
        fontFamily: 'Tahoma',
    }, 
    tahomaBold: {
        fontFamily: 'Tahoma',
        fontWeight: 'bold',
    },

});

const INDENT = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

interface CoeInterface {
    reports: any[];
}
const EmploymentStatusReportPDF = ({
    reports
}: CoeInterface) => (
    <PDFViewer style={styles.fullPage}>
        <Document>

            { reports && reports.map((data, idx) => 
                <Page size="A4" style={styles.page} key={idx}>
                <View
                    style={styles.sectionCenter}
                >   
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center"
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 15.5, 
                            }}
                        >
                            {process.env.NEXT_PUBLIC_COMPANY}
                        </Text>
                    </View>
                    <Text
                        style={{
                            marginTop: 10,
                            fontSize: 9.5 
                        }}
                    >
                        {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}
                    </Text>
                    <Text
                        style={{
                            marginTop: 1,
                            fontSize: 9.5 
                        }}
                    >
                        {process.env.NEXT_PUBLIC_COMPANY_CONTACT}
                    </Text>
                     <Text
                        style={{
                            marginTop: 1,
                            fontSize: 9.5 
                        }}
                    >
                        {process.env.NEXT_PUBLIC_HR_EMAIL}
                    </Text>
                    <Text style={{
                        ...styles.tahomaBold, 
                        paddingTop: 15,
                        fontSize: 11.5, 
                    }}>
                        Employment Status Report
                    </Text>
                </View>
            <View style={styles.tahoma}>
                <View
                    style={{
                        paddingTop: 20,
                        display: "flex",
                        flexDirection: "row",
                        gap: 20
                    }}
                >
                    <Text
                        style={{
                            width: 40,
                            fontSize: 8.5 
                        }}
                    >
                        TO
                    </Text>
                    <Text>
                        :
                    </Text>
                    <View>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 8.5,
                            }}
                        >
                            {data.branch_oic.formal_full_name} 
                        </Text>
                        <Text
                            style={{
                                fontSize: 8.5 
                            }} 
                        >
                            {data.branch_oic.current_position.description}/ {data.branch.name} 
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        paddingTop: 20,
                        display: "flex",
                        flexDirection: "row",
                        gap: 20
                    }}
                >
                    <Text
                        style={{
                            width: 40,
                            fontSize: 8.5 
                        }}
                    >
                        FROM
                    </Text>
                    <Text>
                        :
                    </Text>
                    <View>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 8.5 
                            }}
                        >
                            {`${process.env.NEXT_PUBLIC_HR_PREFIX} ${process.env.NEXT_PUBLIC_HR_SIGNATORY}`}               
                        </Text>
                         <Text
                            style={{
                                fontSize: 8.5 
                            }} 
                        >
                            {process.env.NEXT_PUBLIC_HR_SIGNATORY_POSITION}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        paddingTop: 20,
                        display: "flex",
                        flexDirection: "row",
                        gap: 20
                    }}
                >
                    <Text
                        style={{
                            width: 40,
                            fontSize: 8.5 
                        }}
                    >
                        DATE
                    </Text>
                    <Text>
                        :
                    </Text>
                    <View>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 8.5 
                            }}
                        >
                            {moment(data.date).format('MMMM DD, YYYY')}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        paddingTop: 20,
                        display: "flex",
                        flexDirection: "row",
                        gap: 20
                    }}
                >
                    <Text
                        style={{
                            width: 40,
                            fontSize: 8.5 
                        }}
                    >
                        SUBJECT
                    </Text>
                    <Text>
                        :
                    </Text>
                    <View>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 8.5 
                            }}
                        >
                            Employment Status Report ({data.month + " " + data.year})
                        </Text>
                    </View>
                </View>


                <View
                    style={{
                        marginTop: 0,
                        marginBottom: 20
                    }}
                >
                    <Text
                        style={{
                            width: "100%",
                            borderBottom: 1
                        }}
                    >
                        {"\u00A0".repeat(60)}	
                    </Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text>The probationary contract of the employee which is currently assigned in your handled branch is due to expire. Please consider labor cost, manpower scheduling, branches scheduled for closure and your future manpower requirements when you review the employee’s status:</Text>
                    <View
                        style={{
                            paddingTop: 10,
                            display: "flex",
                            flexDirection: "row",
                            gap: 0
                        }}
                    >
                        <Text>Names colored in: </Text>
                        <View>
                            <Text><Text style={{fontWeight: "bold"}}>Black</Text> - Probationary period was not yet extended for 5 months.</Text>
                            <Text><Text style={{fontWeight: "bold", color: "blue"}}>Blue</Text> - Probationary period has been extended already for 5 months, with total of 10 months.</Text>
                        </View>
                    </View>
                </View>
                    
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}><Text style={styles.bold}>Name</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.bold}>Position</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.bold}>Date Hired</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.bold}>Date End</Text></View>
                        <View style={styles.tableColHeader}><Text style={styles.bold}>Employment Status</Text></View>
                    </View>
                    { data.data && data.data.map((employee: any, idx: number ) => {
                        let color = employee.contracts.length > 1 ? "blue" : "black";

                        return (
                            <View style={styles.tableRow} key={idx}>
                                <View style={styles.tableCol}>
                                    <Text style={{ color: color }} hyphenationCallback={(word: string) => [word]} >{employee.full_name}</Text>
                                </View>
                                <View style={styles.tableCol}><Text>{employee.current_position.description}</Text></View>
                                <View style={styles.tableCol}><Text>{moment(employee.latest_contract.contract_start_date).format('MM/DD/YYYY')}</Text></View> 
                                <View style={styles.tableCol}><Text>{moment(employee.latest_contract.contract_end_date).format('MM/DD/YYYY')}</Text></View> 
                                <View style={styles.tableCol}><Text hyphenationCallback={(word: string) => [word]}>{employee.latest_contract.remarks}</Text></View>
                            </View>
                        );
                    })
                    }
                </View>

                <View
                    style={{
                        ...styles.section,
                        paddingTop: 20
                    }}
                >
                    <Text>Please be informed that all information stated herein are <Text style={styles.bold}>private and confidential.</Text></Text>
                </View>

                <View
                    style={styles.section}
                >
                    <Text>Should you have any questions, please feel free to call Human Resources Department.</Text>
                </View>
                <View
                    style={styles.section}
                >
                    <Text>Thank you,</Text>
                </View>

                <View
                    style={{
                        paddingTop: 30,
                    }}
                >
                    <Text style={{
                        ...styles.bold,
                        paddingBottom: 30
                    }}>
                        Recommended by:
                    </Text>
                    <Text
                        style={{
                            fontWeight: "bold"
                        }}
                    >
                        {data.recommended_by.formal_full_name}
                    </Text>
                    <Text>
                        {data.recommended_by.current_position.description}
                    </Text>
                </View>

                <View
                    style={{
                        paddingTop: 30,

                    }}
                >
                    <Text style={{
                        ...styles.bold,
                        paddingBottom: 30
                    }}>
                        Noted by:
                    </Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            gap: 20
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontWeight: "bold"
                                }}
                            >
                                {data.noted_by.formal_full_name}
                            </Text>
                            <Text>
                                {data.noted_by.current_position.description}
                            </Text>
                        </View>

                        { data.noted_by_1 &&
                            <>
                                <Text
                                    style={{
                                        fontWeight: "bold"
                                    }}
                                >
                                    /
                                </Text>
                                <View>
                                    <Text
                                        style={{
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {data.noted_by_1.formal_full_name}
                                    </Text>
                                    <Text>
                                        {data.noted_by_1.current_position.description}
                                    </Text>
                                </View>
                            </>
                        }
                    </View>
                 </View>
              </View>
            </Page>
            )}
        </Document>
    </PDFViewer>
);

export default EmploymentStatusReportPDF;
