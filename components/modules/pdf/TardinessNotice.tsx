import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
	page: { padding: 40, fontSize: 9, lineHeight: 1.5 , textAlign: 'justify'},
	section: { marginBottom: 12 },
	header: { fontSize: 9, textAlign: 'center', marginBottom: 20 },
	title: { fontSize: 8, marginBottom: 6 },
	bold: { fontWeight: 'bold' },
	underline: { textDecoration: 'underline' },
	indent: { marginLeft: 20 },
	row: { flexDirection: 'row', marginBottom: 4 },
	positionLabel: { flexDirection: 'row', marginBottom: 4, marginTop: -6 },
	headerLabel: { width: 100 },
	flex: {flexDirection: "row", gap: 50},
	textRed: { color: "red" }

});

interface TardinessNoticeInterface {
    data: any;
}

const chunkArray = (arr: any[], size: number) => {
	const chunks = [];
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size));
	}
	return chunks;
};

const TardinessNotice = ({
  data
}: TardinessNoticeInterface) => {


	return (
		<Document>
			<Page size="LETTER" style={styles.page}>
				<View style={styles.header}>
					<Text style={styles.bold}>{process.env.NEXT_PUBLIC_COMPANY}.</Text>
					<Text style={{...styles.bold, marginTop: -3}}>HEAD OFFICE</Text>
					<Text style={{ fontSize: 8, marginTop: -3}}>{process.env.NEXT_PUBLIC_COMPANY_ADDRESS}</Text>
					{/* <Text style={{ fontSize: 8, marginTop: -4}}>{companyAddressLine2}</Text> */}
				</View>

				<View style={styles.section}>
					<View style={styles.row}>
						<Text style={styles.headerLabel}>TO:</Text>
						<Text style={styles.bold}>{data.full_name}</Text>
					</View>

					<View style={styles.positionLabel}>
						<Text style={styles.headerLabel}></Text>
						<Text>{data.position} / {data.branch}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.headerLabel}>FROM:</Text>
						<Text style={styles.bold}>HUMAN RESOURCES DEPARTMENT</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.headerLabel}>DATE:</Text>
						<Text style={styles.bold}>{data.date}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.headerLabel}>SUBJECT:</Text>
						<Text style={styles.bold}>ADMINISTRATIVE OFFENSE</Text>
					</View>
				</View>

				<View
					style={{
						marginTop: -20,
						marginBottom: 5
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

				<View style={styles.section}>
					<Text>
						It was brought to our attention that you committed a violation of the Code of Discipline particularly those under Company Productivity section 2.1.5 classified as First Degree Offense to wit:
					</Text>
				</View>
				<View style={styles.section}>
					<Text style={styles.indent}>
						2.1.5 Tardiness, arriving late for work and/or leaving workplace before dismissal time of more than sixty (60) minutes within a one (1) month period (e.g. Cut-Off Period: April 26 - May 25) including coming in after meals/coffee break. Habitual clearing of assigned working area without permission.
					</Text>
				</View>
				<View style={styles.section}>
					<Text style={{...styles.indent, fontStyle: "italic",}}>
						Pagkahuli, pagdating ng huli sa oras ng trabaho at/o pag-alis sa pinagtatrabahuan sa hindi pa tamang oras ng paglabas ng higit sa animnapung (60) minuto sa loob ng isang buwang palugit (Halimbawa ng Cut-Off Period: Abril 26 - Mayo 25) kabilang ang oras pagkatapos kumain/coffee break. Palagiang pag-alis sa destino ng walang pahintulot.
					</Text>
				</View>

				<View style={styles.section}>
					<Text>
					As per timekeeping for the cut-off period of {data.first_cut_off} and {data.second_cut_off}, our records show the following incident/s of tardiness, to wit:
					</Text>

					<View style={styles.flex}>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 3 }}>
							{data.tardiness_minutes_late &&
							chunkArray(data.tardiness_minutes_late.slice(0, 99), 9).map((group, colIdx) => (
								<View key={colIdx} style={{ paddingRight: 35 }}>
									{group.map((minutes: any, rowIdx: number) => (
										<Text
											key={rowIdx}
											style={{ ...styles.textRed, fontSize: 7, marginTop: -5 }}
										>
											{moment(minutes.late_date).format('MM/DD/YYYY')} - {minutes.late_minutes} Minutes late
										</Text>
									))}
								</View>
							))}
						</View>
					</View>
				</View>
				
				<View style={{ marginTop: -10, marginBottom: 10 }}>
					<Text style={styles.bold}>Total minutes tardy: {data.total_minutes}</Text>
				</View>
				<View style={styles.section}>
					<Text>
					{data.tardiness_sanction}
					</Text>
				</View>

				<View style={styles.section}>
					<Text>
					In view thereof, you are directed to explain in writing within Five (5) Calendar Days from receipt of this notice why no disciplinary action should be taken against you. Your failure to reply as directed constitutes a waiver of your right to rebut the said charges and we shall proceed to determine the merits of the charges against you and impose the appropriate disciplinary sanction.
					</Text>
				</View>
				
				<View style={styles.section}>
					<Text>
					Please be reminded that Administrative Offenses committed by an employee will affect his/her records when he/she is being considered for possible promotion. Repetition of the same shall merit further disciplinary action.
					</Text>
				</View>

				<View style={styles.section}>
					<Text>For your guidance and strict compliance and immediate attention.</Text>
				</View>
				
				
				<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
					<View style={{...styles.section, width:300 }}>
						<Text style={{ fontWeight: "bold" }}>Issued by:</Text>
						<Text
							style={{
								maxWidth: 200,
								fontSize: 9,
								marginTop: 4,
								paddingBottom: 1,
								borderBottom: 1
							}}
						>
						{`${process.env.NEXT_PUBLIC_HR_PREFIX} ${process.env.NEXT_PUBLIC_HR_SIGNATORY}`} 
						</Text>
						<Text>{process.env.NEXT_PUBLIC_HR_SIGNATORY_POSITION}</Text>
						<Text style={{ fontStyle: "italic", fontSize: 6 }}>
						Note: This document is computer generated. No signature is required.
						</Text>
					</View>

					<View style={{...styles.section, width:300 }}>
						<Text style={{ fontWeight: "bold" }}>Acknowledged by:</Text>
						<Text
							style={{
								paddingBottom: 1,
								borderBottom: 1,
								maxWidth: 200,
								fontSize: 9,
								marginTop: 4,
							}}
						>
						{"\u00A0".repeat(60)}
						</Text>
						<Text>Printed Name & Signature of Employee / Date</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text>Cc: 201 File</Text>
					<Text style={{...styles.bold, marginLeft: 15 }}>{data.group_head}</Text>
				</View>
			</Page>
		</Document>
	);
};

export default TardinessNotice;
