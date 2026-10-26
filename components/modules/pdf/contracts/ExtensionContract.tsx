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
        </Document>
    </PDFViewer>
   )
};

export default ExtensionContract;
