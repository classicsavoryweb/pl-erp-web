import React from 'react';
import { Document, Page, Text, View, PDFViewer, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import { convertToPesosAndCentavos, numberToWords } from '@/helper/amount';
import { env } from 'process';

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
const FirstContract = ({ data }: CoeInterface) => { 
    return (
    <PDFViewer style={styles.fullPage}>
        <Document>
            <Page
                size={[612, 700]}
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
                        KASUNDUAN
                    </Text>
                </View>
                 <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        
                    >AKO si, <Text style={styles.boldedLinedText}>{data.proper_full_name}</Text> Pilipino, nasa hustong gulang, at kasalukuyang naninirahan sa <Text style={styles.boldedLinedText}>{data.address}</Text>, ay sumasang-ayon sa mga sumusunod:</Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.itemFlex}>
                        <Text>1</Text>
                        <Text>Ako ay maglilingkod sa Photoline Enterprises Corporation <Text style={styles.boldedLinedText}>{data.branch}</Text> Branch bilang isang probationary employee mula <Text style={styles.boldedLinedText}>{moment(data.contract_start_date).format('MMMM DD, YYYY')}</Text> hanggang <Text style={styles.boldedLinedText}>{moment(data.contract_end_date).format('MMMM DD, YYYY')}</Text> o sa loob ng <Text style={styles.boldedLinedText}>{data.duration} Buwan</Text>.  Ang mga pamantayan ng kumpanya na dapat kong ipasa upang maging regular na empleyado ay ipinagbigay-alam sa akin sa araw na ako ay naging probationary na empleyado. Naiintindihan ko na  maaari akong matanggal ng mas maaga pa sa ating kasunduan sa kadahilanang  hindi naging maganda ang aking performance sa trabaho labag sa mga pamantayan na ipinagbigay-alam sa akin ng kumpanya o ang hindi pagsunod sa alituntunin ng kumpanya.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>2</Text>
                        <Text>Bilang isang Probationary Employee, ako ay tutupad sa mga alituntunin ng Photoline Enterprises Corporation na ipinaliwanag at ipinagbigay-alam sa akin sa araw na ako ay tinanggap bilang Probationary Employee.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>3</Text>
                        <Text>Ano mang impormasyon na aking malalaman o makukuha tungkol sa operasyon ng Photoline Enterprises Corporation at tungkol sa mga empleyado, management at may-ari nito, ay tratratuhin ko bilang kumpidensiyal at ito ay hindi ko ipapaalam sa ibang tao.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>4</Text>
                        <Text>Habang ako ay isang probationary employee ng kumpanya, hindi ako magiging bahagi o lalahok sa anumang serbisyo o negosyo na may parehong kalakaran o interes na tulad ng sa kumpanya.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>5</Text>
                        <Text>Bilang isang Probationary Employee, ako ay makakatanggap ng <Text style={styles.boldedLinedText}>P({Number(data.salary_amount * 8).toFixed(2)})</Text> kada araw mula sa kumpanya.</Text>
                    </View>({Number(data.salary_amount).toFixed(2)})
                    <View style={styles.itemFlex}>
                        <Text>6</Text>
                        <Text>Naiintindihan ko na bilang isang Probationary Employee ay hindi ako matatawag na regular na empleyado ng kumpanya kapag ako ay hindi makapasa sa aking evaluation sa aking mga superiors.</Text>
                    </View>
                </View>
                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        
                    >BILANG KATUNAYAN, ang aking lagda ay nasasaad sa kasunduan na ito ng ika _____
                    ng ____________, 20__ , Quezon City.
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
                size={[612, 700]}
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
                        PAGPAPATUNAY NG PAG-SANG-AYON
                    </Text>
                </View>
                 <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        
                    >AKO si, <Text style={styles.boldedLinedText}>{data.proper_full_name}</Text> Pilipino, nasa hustong gulang, at kasalukuyang naninirahan sa <Text style={styles.boldedLinedText}>{data.address}</Text>, ay sumasang-ayon sa mga sumusunod:</Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.itemFlex}>
                        <Text>1</Text>
                        <Text>Ako ay kusang loob na pumayag na maging Probationary Employee ng Photoline Enterprises Corporation sa loob ng <Text style={styles.boldedLinedText}>{data.duration} Buwan</Text>.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>2</Text>
                        <Text>Bilang Probationary Employee, ako ay susunod sa mga legal na patakaran at alituntunin ng kumpanya at pipilitin kong ipasa ang mga pamantayan ng kumpanya para maging isang regular na empleyado na ipinagbigay-alam sa akin sa araw na ako ay tinanggap bilang empleyado.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>3</Text>
                        <Text>Ako ay kusang loob na pumayag na bawasan ng dalawang (2) beses sa aking suweldo ng tig isang libo at limang daang piso (P 1,500.00), habang ako ay nasa kumpanya upang ipambayad sa anumang bayaran na aking masisira o maiiwan kung ako ay ma terminate sa kumpanya o matapos ang aking kontrata. At kung sakaling wala man akong bayaran sa kumpanya ay makukuha ko ang tatlong libong piso (P 3,000.00), pagkalipas ng tatlong (3) buwan na aking pagkawala sa kumpanya.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>4</Text>
                        <Text>Ang anumang impormasyon na aking malalaman tungkol sa kumpanya, sa mga empleyado, opisyal at may-ari nito, at sa mga proseso na ginagamit nito sa negosyo ay hindi ko ipapaalam sa ibang tao.</Text>
                    </View>
                    <View style={styles.itemFlex}>
                        <Text>5</Text>
                        <Text>Ang kasundun na ito ay aking nabasa, naintindihan at kusang loob na nilagdaan.</Text>
                    </View>({Number(data.salary_amount).toFixed(2)})
                </View>
                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        
                    >BILANG KATUNAYAN, ang aking lagda ay nasasaad sa kasunduan na ito ng ika _____
                    ng ____________, 20__ , Quezon City.
                    :</Text>
                </View>
                <View
                    style={{
                        marginTop:65,
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
                        Pangalan at Lagda
                    </Text>
                </View>
            </Page>
            <Page
                size={[612, 700]}
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
                <View style={styles.section}>
                     <Text
                        style={{...styles.boldedLinedText,
                                paddingTop:15,
                            }}
                    >
                        Karagdagang Kasunduan sa Employment Contract
                    </Text>
                </View>
                <View
                    style={styles.section}
                >
                    <Text>
                        Petsa:
                    </Text>
                </View>
                <View
                    style={styles.section}
                >
                    <Text>
                        Ito ay karagdagang kasunduan sa pagitan nina:
                    </Text>
                </View>
                <View
                    style={styles.section}
                >
                    <Text>
                        Employer: <Text style={styles.boldedLinedText}>{process.env.NEXT_PUBLIC_COMPANY}</Text>
                    </Text>
                </View>
                <View
                    style={styles.section}
                >
                    <Text>
                        Empleyado:<Text style={styles.boldedLinedText}>{data.proper_full_name}</Text>
                    </Text>
                </View>
                  <View
                    style={{...styles.section,paddingTop:20}}
                >
                    <Text style={styles.boldedLinedText}>
                        Probisyon sa Liquidated Damages:
                    </Text>
                </View>
                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        
                    >Kung ang Empleyado ay magbitiw o umalis sa trabaho bago ang itinakdang pagtatapos ng kontrata nang walang sapat na dahilan o hindi alinsunod sa Labor Code, siya ay sumasang-ayon na magbayad ng liquidated damages na katumbas ng isang buwang sahod <Text style={styles.boldedLinedText}>P{Number((data.salary_amount * 8) * 26).toLocaleString("en-US",{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</Text> bilang danyos sa Employer.</Text>
                </View>
                 <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10
                        }}
                        
                    >Inaatasan ng empleyado ang employer na ibawas sa huling sahod at anumang benepisyo ang nasabing liquidated damages ng wala ng pangangailangan ng demand letter o anumang pagdedemanda.</Text>
                </View>
                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            paddingBottom: 10,
                            paddingTop:50,
                        }}
                        
                    >Pinagtibay at Nilagdaan ng mga Panig:
                    </Text>
                </View>
                <View
                    style={{
                        marginTop:65,
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
        </Document>
    </PDFViewer>
    )
};

export default FirstContract;
