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
const TagalogPromotionPDF = ({
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
                            KUMPIRMASYON NG PAGKAKATAAS NG POSISYON
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
                                <Text>Sangay: </Text>
                                <Text style={{ textDecoration: "underline" }}>{data.branch.name}</Text>
                            </View>                        
                        </View>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>Ito ay para ikumpirma ang pagkakataas ng iyong posisyon bilang <Text style={{ textDecoration: "underline" }}>{data.recommended_position.description}</Text> epektibo ng {moment(data.end_date).format("MMMM DD, YYYY")}.</Text>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>Ikaw ay itinilaga sa sangay ng <Text style={{ textDecoration: "underline" }}>{data.branch_assignment.name}</Text> at dapat mag-ulat kay <Text style={{ textDecoration: "underline" }}>{data.oic.formal_full_name}.</Text> Nais ka naming batiin sa pagtugon sa mga kinakailangan ng iyong bagong posisyon.</Text>
                    </View>


                    <View
                        style={styles.section}
                    >
                        <Text>**Kung ang pagkakataas ng iyong posisyon ay napabilis,</Text>
                        <Text>Ito ay dahil sa:_______________________________________________</Text>
                    </View>

                    <View
                        style={styles.section}
                    >
                        <Text>{INDENT}Inirekomenda ni:____________________________________</Text>
                    </View>
                    
                    <Text style={{paddingTop:30 , paddingBottom:40 , fontWeight: "bold"}}>Ang aking Pag-unawa at Pagsang-ayon:</Text>
                    
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 75,
                        }}
                    >
                        <Text>Pangalan at Lagda ng Empleyado: <Text style={{ textDecoration: "underline" }}>{data.employee.proper_full_name}</Text></Text>
                        <Text>Petsa ng Paglagda:</Text>
                    </View>

                    <Text style={{paddingBottom: 40, paddingTop: 30, fontWeight: "bold"}}>Approved by:</Text>
                    
                    <View>
                        <Text
                            style={{
                                textDecoration: "underline"
                            }}
                        >
                            {data.branch.group_head.formal_full_name}
                        </Text>
                        <Text>{data.branch.group_head.current_position.description}</Text>
                    </View>
                </Page>

                <Page size={[612, 936]} style={styles.page}>
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
                            SERVICE BOND AGREEMENT PARA SA MGA MANAGEMENT TEAM
                        </Text>
                    </View>

                    <View
                        style={{
                            paddingBottom: 15,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
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
                            <Text>Sangay: </Text>
                            <Text style={{ textDecoration: "underline" }}>{data.branch.name}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text>Ito ay para kumpirmahin ang pagkakataas ng aking posisyon bilang <Text style={{ textDecoration: "underline" }}>{data.recommended_position.description}</Text> simula {moment(data.effectivity_date).format("MMMM DD, YYYY")}.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text>
                            Dahil sa pagkakatalaga sa mas mataas na posisyon, naiintindihan ko na magkakaroon ako ng karagdagang mga kasanayan at mga natutunan sa pamamahala ng isang restaurant, karagdagang impormasyon tungkol sa kumpanya, mga operasyon nito, at mga direktor, opisyal, empleyado, kliyente, at mahahasa ang aking kakayahan sa pamumuno at mga kasanayan sa paggawa ng desisyon sa tulong ng pamamahala at ng aking mga nakatataas. Dahil sa mga nabanggit, boluntaryo akong sumasang-ayon na ibigkis ang aking sarili na maging empleyado ng Savory Fastfood Inc. ng hindi bababa sa ({data.bond_year}) taon mula sa petsa ng aking pagkakatalaga bilang {data.recommended_position.description}. Para sa layuning ito, sumang-ayon akong maisailalim sa service bond sa halagang {convertToPesosAndCentavos(Number(data.bond_amount))} (Php {Number(data.bond_amount).toFixed(2)}), upang masakop ang anuman at lahat ng pinsala na maaaring maranasan ng Savory Fastfood, Inc. sakaling magbitiw ako bago ang napagkasunduang panahon o tinanggal ako sa trabaho nang may dahilan. bago ang napagkasunduang panahon, gayundin bilang resulta ng anumang paglabag sa aking kasunduan sa kumpanya. Dagdag pa, sumasang-ayon ako na hindi ko sa anumang oras, nang walang nakasulat na pahintulot mula sa Savory Fastfood, Inc., alinman sa panahon ng aking pagtatrabaho o pagkatapos noon, na ibunyag o isapubliko ang anumang kumpidensyal na impormasyong nakuha ko direkta man o hindi direkta sa aking pagtatrabaho.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{
                            fontSize: 10,
                        }}>
                            Ang "Kumpidensyal na Impormasyon" ay nangangahulugang anumang data o impormasyon na sensitibong materyal at hindi karaniwang alam ng publiko, kabilang ang, ngunit hindi limitado sa, impormasyong may kaugnayan sa pagpapaunlad at mga plano, pananalapi, mga operasyon, mga sistema, mga konsepto ng pagmamay-ari, dokumentasyon, mga ulat, data , mga detalye, software ng computer, source code, object code, flow chart, data, database, kaalaman, trade secret, recipe, listahan ng customer, relasyon sa customer, profile ng customer, listahan ng supplier, relasyon ng supplier, profile ng supplier, pagpepresyo, pagtatantya ng benta , mga plano sa negosyo at mga resulta ng panloob na pagganap na nauugnay sa nakaraan, kasalukuyan o hinaharap na mga aktibidad sa negosyo, teknikal na impormasyon, disenyo, proseso, pamamaraan, formula o pagpapahusay, at pangunahing at personal na impormasyon ng mga empleyado tulad ng buong pangalan, address, kaarawan, email address, at suweldo na itinuturing ng Kumpanya na kumpidensyal at pagmamay-ari. Kasama rin sa kumpidensyal na impormasyon ang anumang impormasyon tungkol sa mga direktor, opisyal, supplier, kontratista, ahente, customer, kliyente, nagpapaupa, at empleyado ng Kumpanya.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text>
                            Kung ako ay magbitiw o humiwalay sa Savory Fastfood Inc., dahil sa sensitibong katangian ng aking posisyon at pag-access sa kumpidensyal na impormasyon, mga lihim ng kalakalan, mga recipe at mga plano sa negosyo, sumasang-ayon ako na hindi ako magtatrabaho o maghahanap ng trabaho sa isang direktang kakumpitensya o anumang kumpanya sa parehong linya ng negosyo ng Savory Fastfood Inc sa loob ng limang (5) taon. Nauunawaan ko na ang paglabag sa probisyong ito ay magreresulta sa isang paglabag sa kasunduang ito, na nagbibigay ng karapatan sa kumpanya sa mga liquidated na pinsala sa halagang katumbas ng aking service bond.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text>
                            Naiintindihan ko na dahil mayroon akong access sa kumpidensyal na impormasyon, ako ay itinuturing na isang Kumpidensyal na Empleyado at tinatamasa ko ang mataas na antas ng tiwala at kumpiyansa. Naiintindihan ko na hindi ko lalabagin ang tiwala at kumpiyansa na ibinigay sa akin bilang isang Kumpidensyal na Empleyado.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text>
                            Kung sakaling lumabag sa mga tuntunin ng kasunduang ito, nangangako akong babayaran ang mga ng liquidated at/o aktwal na pinsala sa halagang {convertToPesosAndCentavos(Number(data.bond_amount))} (Php {Number(data.bond_amount).toFixed(2)}) upang mabayaran ang halaga ng anumang pinsalang maaaring makuha ng Savory Fastfood, Inc. na natamo bilang resulta ng aking paglabag sa anumang probisyon ng Kasunduang ito, bilang karagdagan sa anuman at lahat ng pinsala na maaaring maranasan ng Savory Fastfood, Inc., nang walang pagkiling sa Savory Fastfood, Inc. na gumagamit ng anumang iba pang legal na aksyon o remedyo na maaaring available sa Savory Fastfood, Inc. anumang mga legal na gastos na gagawin ng Savory Fastfood, Inc. ay sisingilin din sa akin. Ako ay pumapayag na payagan ang Savory Fastfood, Inc. na i-offset ang aking pananagutan para sa aktwal at/o liquidated na mga pinsala sa Savory Fastfood, Inc. sa pamamagitan ng paglalapat ng aking mga suweldo, mga insentibo, kabilang ang aking 13th month pay at iba pang mga benepisyo na maaaring kailanganin ko upang masakop ang halaga ng aking service bond para sa lahat at anumang pinsala. Nauunawaan ko na ang anumang natitirang balanse mula sa aking bono sa serbisyo at para sa mga pinsala ay kailangang bayaran sa Savory Fastfood, Inc. nang walang pagkiling sa paggamit nito ng anumang iba pang legal na aksyon o remedyo na maaaring available sa kumpanya.
                        </Text>
                    </View>

                    <View style={{
                        paddingBottom: 15
                    }}>
                        <Text>
                            Ang aking pag-unawa at pagsang-ayon:
                        </Text>
                    </View>
                    
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 75,
                        }}
                    >
                        <Text>Pangalan at Lagda ng Empleyado: <Text style={{ textDecoration: "underline" }}>{data.employee.proper_full_name}</Text></Text>
                        <Text>Petsa ng Paglagda:</Text>
                    </View>
                </Page>

            </Document>
        </PDFViewer>
    );
    
};

export default TagalogPromotionPDF;
