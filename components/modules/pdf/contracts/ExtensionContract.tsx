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
        paddingBottom: 15
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
    },
    sectionPersonalData: {
        paddingBottom: 3,
        fontSize:10
    },
    tablePersonalData: {
        paddingBottom: 3,
        paddingTop: 5,
        width: "100%",
        alignItems: "center",
    },
    childrenTable: {
        width: 475,
        borderWidth: 1,
        borderColor: "#000",
    },
    childrenTitle: {
        alignItems: "center",
        padding: 5,
        borderBottomWidth: 1,
        borderColor: "#000",
    },
    childrenRow: {
        flexDirection: "row",
        minHeight: 25,
        borderBottomWidth: 1,
        borderColor: "#000",
    },
    childrenName: {
        alignItems: "center",
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        borderColor: "#000",
        fontSize:7
    },
    childrenNameLeftIndent: {
        alignItems: "flex-start",
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        borderColor: "#000",
        fontSize:7
    },
    childrenAge: {
        flex: 1,
        padding: 5,
        alignItems: "center",
    },
    subQuestion: {
        fontSize:8
    }
});

const INDENT = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

interface CoeInterface {
    data: any;
}
const ExtensionContract = ({ data }: CoeInterface) => { 
    console.log(data);
    return (
    <PDFViewer style={styles.fullPage}>
        <Document>
            <Page
                size={[612, 800]}
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
                            paddingTop: 20,
                            alignItems: "flex-start",
                        }}
                    >
                        <Image
                            style={styles.image}
                            src="/images/contract-header.png"
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                marginLeft: 8,
                                height: 55,
                            }}
                        >
                            <View
                                style={{
                                    width: 1,
                                    backgroundColor: "#28669D",
                                    marginRight: 8,
                                }}
                            />

                            <View>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        fontWeight: "bold",
                                        color: "#28669D",
                                    }}
                                >
                                    {process.env.NEXT_PUBLIC_COMPANY}
                                </Text>

                                <Text style={{ fontSize: 8, color: "#28669D" }}>
                                    {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}
                                </Text>
                                <Text style={{ fontSize: 8, color: "#28669D" }}>
                                    {process.env.NEXT_PUBLIC_COMPANY_STREET}
                                </Text>

                                <Text style={{ fontSize: 8, color: "#28669D" }}>
                                    {process.env.NEXT_PUBLIC_COMPANY_CITY}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                    <View
                    style={styles.sectionCenter}
                >  
                    <Text  style={{...styles.boldedLinedText,paddingTop:15,}}>
                        PROBATIONARY EXTENSION
                    </Text>
                </View>
                    <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        
                    >Ako si, <Text style={styles.boldedLinedText}>{data.proper_full_name}</Text> Pilipino, nasa hustong gulang, at kasalukuyang naninirahan sa <Text style={styles.boldedLinedText}>{data.address}</Text>, ay sumasang-ayon sa mga sumusunod:</Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.itemFlex}>
                        <Text>1</Text>
                        <Text>Ako ay inalok ng kumpanya ng isang pagkakataon na i-extend ang aking paglilingkod sa Photoline Enterprises Corporation <Text style={styles.boldedLinedText}>{data.branch}</Text> Branch bilang isang Probationary employee mula <Text style={styles.boldedLinedText}>{moment(data.contract_start_date).format('MMMM DD, YYYY')}</Text> hanggang <Text style={styles.boldedLinedText}>{moment(data.contract_end_date).format('MMMM DD,YYYY')}</Text>. Ito ay sa dahilang hindi ko nakumpleto ang aking mga dapat matutunan sa nasabing kumpanya at hindi ko naipasa ang mga pamantayan ng kumpanya na ipinagbigay-alam sa akin noong ako ay tinanggap bilang probationary na empleyado ng kumpanya.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>2</Text>
                        <Text>Tinatanggap ko ang alok sa akin ng kumpanya na i-extend ang aking probationary period ng <Text style={styles.boldedLinedText}>{data.duration}</Text> buwan.  Naiintindihan ko rin na maaari ko lang tapusin ang aking extension period sa kadahilanang hindi ko tuluyang nakumpleto at nagampanan ang aking tungkulin ng naaayon sa mga pamantayan ng kumpanya at sa hindi pagsunod sa alituntunin ng kumpanya.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>3</Text>
                        <Text>Bilang isang PROBATIONARY EMPLOYEE, ako ay nangangako na pagbubutihan ang aking trabaho upang maipasa ko ang mga pamantayan ng kumpanya na ipinagbigay-alam sa akin noong ako’y tinanggap bilang probationary na empleyado nito, at susunod sa alituntunin ng Photoline Enterprises Corporation.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>4</Text>
                        <Text>Ano mang impormasyon na aking malalaman o makukuha tungkol sa operasyon ng Photoline Enterprises Corporation at tungkol sa mga empleyado, management at may-ari nito, ay tratratuhin ko bilang kumpidensiyal at ito ay hindi ko ipapaalam sa ibang tao.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>5</Text>
                        <Text>Habang ako ay isang probationary employee ng kumpanya, hindi ako magiging bahagi o lalahok sa anumang serbisyo o negosyo na may parehong kalakaran o interes na tulad ng sa kumpanya.</Text>
                    </View>({Number(data.salary_amount).toFixed(2)})
                    <View style={styles.itemFlex}>
                        <Text>6</Text>
                        <Text>Bilang isang Probationary Employee, ako ay makakatanggap pa rin ng <Text style={styles.boldedLinedText}>P{Number(data.salary_amount * 8).toFixed(2)}</Text> kada araw mula sa kumpanya.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>7</Text>
                        <Text>Naiintindihan ko na bilang Probationary Employee ay hindi ako matatawag na regular na empleyado ng kumpanya kapag ako ay hindi makapasa sa aking final evaluation sa aking mga superiors.</Text>
                    </View>
                </View>
                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        
                    >BILANG PATUNAY na aking naiintindihan ang mga sumusunod, ay aking nilagdaan ang kasunduang ito, ngayong ika ______ng ________________, Taong __________.
                    :</Text>
                </View>
                    <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingTop: 20 
                        }}
                        
                    >Para sa PHOTOLINE ENT. CORP.:
                    </Text>
                </View>
                <View
                    style={{
                        marginTop:30,
                        paddingTop:50,  
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
                        {process.env.NEXT_PUBLIC_HR_SIGNATORY?.toUpperCase()} 
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
                        {String(data.proper_full_name).toUpperCase()}
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
                        Director of Operations
                    </Text>
                    <Text
                        style={{
                            ...styles.bold,
                            width: 200,
                            textAlign: "center"
                        }}
                    >
                        Pangalan at Lagda
                    </Text>
                </View>
            </Page>
            <Page
                size={[612, 792]}
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
                            paddingTop: 20,
                            alignItems: "flex-start",
                        }}
                    >
                        <Image
                            style={styles.image}
                            src="/images/contract-header.png"
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                marginLeft: 8,
                                height: 55,
                            }}
                        >
                            <View
                                style={{
                                    width: 1,
                                    backgroundColor: "#28669D",
                                    marginRight: 8,
                                }}
                            />

                            <View>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        fontWeight: "bold",
                                        color: "#28669D",
                                    }}
                                >
                                    {process.env.NEXT_PUBLIC_COMPANY}
                                </Text>

                                <Text style={{ fontSize: 8, color: "#28669D" }}>
                                    {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}
                                </Text>
                                <Text style={{ fontSize: 8, color: "#28669D" }}>
                                    {process.env.NEXT_PUBLIC_COMPANY_STREET}
                                </Text>

                                <Text style={{ fontSize: 8, color: "#28669D" }}>
                                    {process.env.NEXT_PUBLIC_COMPANY_CITY}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                    <View
                    style={styles.sectionCenter}
                >  
                    <Text  style={{...styles.bold,paddingTop:15,}}>
                        Date Started: <Text style={styles.boldedLinedText}>{moment(data.contract_start_date).format('MMMM DD, YYYY')}</Text>
                    </Text>
                    <Text  style={{...styles.bold,paddingTop:15,}}>
                        PHOTOLINE ENTERPRISES CORPORTION HEAD OFFICE
                    </Text>
                    <Text  style={{...styles.boldedLinedText,paddingTop:15,}}>
                        APPLICATION FOR EMPLOYMENT
                    </Text>
                </View>
                <View
                    style={styles.sectionPersonalData}
                >
                    <Text
                        style={{
                            paddingBottom: 2
                        }}
                    >Position applied For:</Text>
                    <Text>First Choice:____________</Text>
                    <Text>Second Choice:____________</Text>
                </View>
                <View
                    style={{...styles.boldedLinedText,paddingTop:3}}
                >
                    <Text
                        style={{...styles.bold}}
                    >Personal Data:</Text>
                   
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                        paddingTop:3
                    }}
                >
                    <Text>
                        Name: <Text style={styles.linedText}> {data.proper_full_name} </Text>
                    </Text>

                    <Text>
                        Email Address: <Text style={styles.linedText}> {data.employee.email} </Text>
                    </Text>

                    <Text>
                        Height: <Text style={styles.linedText}> {data.employee.height} </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Present Address: <Text style={styles.linedText}> {data.employee.address} </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Provincial Address: <Text style={styles.linedText}> {data.employee.address} </Text>
                    </Text>
                    <Text>
                        Contact Number: <Text style={styles.linedText}> {data.employee.contact_number} </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Birth Date: <Text style={styles.linedText}> {data.employee.birthday} </Text>
                    </Text>
                    <Text>
                        Birthplace: <Text style={styles.linedText}> {data.employee.birthplace} </Text>
                    </Text>
                    <Text>
                        Age: <Text style={styles.linedText}> {data.employee.age} </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Citizenship: <Text>__________________</Text>
                    </Text>
                    <Text>
                        Religion: <Text>___________________</Text>
                    </Text>
                    <Text>
                        Philhealth Number: <Text style={styles.linedText}> {data.employee.philhealth} </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        SSS Number: <Text style={styles.linedText}> {data.employee.sss} </Text>
                    </Text>
                    <Text>
                        Tin Number: <Text style={styles.linedText}> {data.employee.tin} </Text>
                    </Text>
                    <Text>
                        Pag-ibig Number: <Text style={styles.linedText}> {data.employee.pagibig} </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Fathers Name: <Text> ________________ </Text>
                    </Text>
                    <Text>
                        Occupation: <Text> ________________ </Text>
                    </Text>
                    <Text>
                        Birthdate: <Text> ________________ </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Mothers Name: <Text> ________________</Text>
                    </Text>
                    <Text>
                        Occupation: <Text> ________________</Text>
                    </Text>
                    <Text>
                        Birthdate: <Text> ________________</Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Civil Status:<Text style={styles.linedText}>{data.employee.civil_status} </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Name of Spouse: <Text>________________</Text>
                    </Text>
                    <Text>
                        Occupation: <Text>________________</Text>
                    </Text>
                    <Text>
                        Number of Children: <Text>________________</Text>
                    </Text>
                </View>     
                <View
                    style={{...styles.boldedLinedText,paddingBottom:3}}
                >
                    <Text>PERSON TO NOTIFY IN CASE OF EMERGENCY</Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Name: <Text style={styles.linedText}>{data.employee.emergency_contact_name} </Text>
                    </Text>
                    <Text>
                        Relationship: <Text style={styles.linedText}>{data.employee.emergency_contact_relationship} </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text>
                        Address: <Text style={styles.linedText}>{data.employee.emergency_contact_address} </Text>
                    </Text>
                    <Text>
                        Contact No: <Text style={styles.linedText}>{data.employee.emergency_contact_number} </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={{...styles.subQuestion,paddingTop:2}}>
                        How did you know about the company/ the vacant position?:<Text> _____________________ </Text>
                    </Text>  
                </View>
                <View
                    style={styles.boldedLinedText}
                >
                    <Text
                        style={{...styles.bold,
                            paddingBottom: 2,
                            
                        }}
                    >EDUCATIONAL BACKGROUND:</Text>
                </View>
                <View style={{...styles.tablePersonalData,paddingBottom:10}}>
                    <View style={styles.childrenTable}>
                        <View style={{...styles.childrenRow,fontSize:8}}>
                            <View style={styles.childrenName}>
                                <Text></Text>
                            </View>
                            <View style={{...styles.childrenName,flex:3}}>
                                <Text>Name and Address of School</Text>
                            </View>
                            <View style={{...styles.childrenName,flex:2}}>
                                <Text>Degree Earned</Text>
                            </View>
                            <View style={{...styles.childrenName}}>
                                <Text>Years Attended</Text>
                            </View>
                        </View>

                        <View style={styles.childrenRow}>
                            <View style={styles.childrenNameLeftIndent}>
                                <Text>Elementary</Text>
                            </View>
                            <View style={{...styles.childrenName,flex:3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex:2}}>
                                <Text> </Text>
                            </View>
                            <View style={styles.childrenName}>
                                <Text> </Text>
                            </View>
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={styles.childrenNameLeftIndent}>
                                <Text>High School</Text>
                            </View>
                            <View style={{...styles.childrenName,flex:3}}>
                                <Text>{data.education.highschool} / {data.education.highschool_address}</Text>
                            </View>
                            <View style={{...styles.childrenName,flex:2}}>
                                <Text> </Text>
                            </View>
                            <View style={styles.childrenName}>
                                <Text>{data.education.highschool_date_started} - {data.education.highschool_date_graduated}</Text>
                            </View>
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={styles.childrenNameLeftIndent}>
                                <Text>College</Text>
                            </View>
                            <View style={{...styles.childrenName,flex:3}}>
                                <Text>{data.education.college} / {data.education.college_address}</Text>
                            </View>
                            <View style={{...styles.childrenName,flex:2}}>
                                <Text>{data.education.course}</Text>
                            </View>
                            <View style={styles.childrenName}>
                                <Text>{data.education.college_date_started} - {data.education.college_date_graduated}</Text>
                            </View>
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={styles.childrenNameLeftIndent}>
                                <Text>Others</Text>
                            </View>
                            <View style={{...styles.childrenName,flex:3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex:2}}>
                                <Text> </Text>
                            </View>
                            <View style={styles.childrenName}>
                                <Text> </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        Government Examination Taken: <Text> ______________ </Text>
                    </Text>
                    <Text style={styles.subQuestion}>
                        Date: <Text>____________</Text>
                    </Text>
                     <Text style={styles.subQuestion}>
                        Rating: <Text>____________</Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        Are you presently enrolled in any school?:<Text>_______________</Text>
                    </Text>
                    <Text style={styles.subQuestion}>
                        with plans to enroll:<Text>_______________</Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        marginBottom:10,
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        If so, where?:<Text >________________ </Text>
                    </Text>
                    <Text style={styles.subQuestion}>
                        Course:<Text> ________________ </Text>
                    </Text>
                     <Text style={styles.subQuestion}>
                        Class Schedule:<Text> ________________ </Text>
                    </Text>
                </View>
            </Page>
            <Page
                size={[612, 800]}
                style={{
                    ...styles.page,
                    lineHeight: 1.15,
                }}
            >
                <View
                    style={styles.boldedLinedText}
                >
                    <Text
                        style={{...styles.bold,
                            paddingBottom: 2,
                            marginTop:20,
                        }}
                    >EMPLOYMENT HISTORY</Text>
                </View>
                 <View style={styles.tablePersonalData}>
                    <View style={styles.childrenTable}>
                        <View style={{...styles.childrenRow,fontSize:7}}>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text>From</Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text>To</Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 4}}>
                                <Text>Name and Address of Employer</Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text>Position</Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text>Immediate Superior</Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text>Salary</Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text>Reason for leaving</Text>
                            </View>
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text></Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 4}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text></Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 4}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                            
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text></Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 4}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text></Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 4}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                        paddingTop:5,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        Skills:<Text> ___________________________________________________ </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        Language Spoken:<Text> ____________________________________________________ </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        Have you had any sickness requiring hospital treatment within the last five (5) years? <Text> ________________________________ </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        If yes, please state the nature of your sickness:<Text> ________________________________ </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        Have you ever been charge or convicted of a crime involving moral turpitude or dishonesty? <Text> ________________________________ </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        If so, please state the nature of charges:<Text> ________________________________ </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        Are you related to an employee of this company?<Text> ________________________________ </Text>
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.sectionPersonalData,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 30,
                    }}
                >
                    <Text style={styles.subQuestion}>
                        How soon could you start working?<Text> ________________________________ </Text>
                    </Text>
                    <Text style={styles.subQuestion}>
                        Salary desired:<Text> ________________________________ </Text>
                    </Text>
                </View>
                <View
                    style={styles.boldedLinedText}
                >
                    <Text
                        style={{...styles.bold,
                            paddingBottom: 2,
                            marginTop:3,
                        }}
                    >CHARACTER REFERENCE</Text>
                </View>
                <View
                    style={styles.sectionPersonalData}
                >
                    <Text
                        style={{
                            paddingBottom: 2,
                            marginTop:1,
                        }}
                    >Please state the name of three (3) persons who knows you for at least two (2) years and are not related to you.</Text>
                </View>
                <View style={styles.tablePersonalData}>
                    <View style={styles.childrenTable}>
                        <View style={styles.childrenRow}>
                            <View style={{...styles.childrenName,fontSize:8,flex: 1}}>
                                <Text>Name</Text>
                            </View>
                            <View style={{...styles.childrenName,fontSize:8,flex: 1}}>
                                <Text>Address</Text>
                            </View>
                            <View style={{...styles.childrenName,fontSize:8,flex: 3}}>
                                <Text>Position</Text>
                            </View>
                            <View style={{...styles.childrenName,fontSize:8,flex: 1}}>
                                <Text>Contact Number</Text>
                            </View>
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text></Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text></Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>                           
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text></Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                        </View>
                        <View style={styles.childrenRow}>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text></Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 3}}>
                                <Text> </Text>
                            </View>
                            <View style={{...styles.childrenName,flex: 1}}>
                                <Text> </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{...styles.section,paddingTop:20,fontStyle:'italic'}}
                >
                    <Text
                        style={{...styles.bold,fontSize:9}}   
                    >I hereby certify that the information furnished above are true and correct of my own personal knowledge.  I voluntarily give the company the right to verify or conduct an investigation on any of the matters stated in this application.  I acknowledge that I shall be obliged to undertake a medical examination whenever required by the company prior to employment.  Finally, I acknowledge that any false information furnished under this interview or in the course of my application shall constitute lawful cause for the termination of my employment with the company.</Text>
                </View>
                <View
                    style={{
                        marginTop:15,
                        paddingTop:25,  
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}
                >
                    <Text
                        style={{
                            ...styles.bold,
                            width: 200,
                            // borderBottom: 1,
                            paddingBottom: 1,
                            textAlign: "center"
                        }}
                    >
                        {/* {process.env.NEXT_PUBLIC_HR_SIGNATORY?.toUpperCase()}  */}
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
                        {String(data.proper_full_name).toUpperCase()}
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
                        {/* Director of Operations */}
                    </Text>
                    <Text
                        style={{
                            ...styles.bold,
                            width: 200,
                            textAlign: "center"
                        }}
                    >
                        Signature over Printed Name
                    </Text>
                </View>
            </Page>
        </Document>
    </PDFViewer>
   )
};

export default ExtensionContract;
