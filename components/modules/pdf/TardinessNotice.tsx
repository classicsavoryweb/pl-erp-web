import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 8, lineHeight: 1.5 },
  section: { marginBottom: 12 },
  header: { fontSize: 8, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 8, marginBottom: 6 },
  bold: { fontWeight: 'bold' },
  underline: { textDecoration: 'underline' },
  indent: { marginLeft: 20 },
  row: { flexDirection: 'row', marginBottom: 4 },
});


interface TardinessNoticeInterface {
    data: any;
}

const TardinessNotice = ({
  data
}: TardinessNoticeInterface) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text>SAVORY FASTFOOD INC. HEAD OFFICE</Text>
        <Text>84 Sto. Domingo St. Quezon City</Text>
      </View>

      <View style={styles.section}>
        <Text>TO: MANALANG, MHEG KYLIE BISDA</Text>
        <Text>SHIFT MANAGER / ROBINSONS ERMITA</Text>
        <Text>FROM: HUMAN RESOURCES DEPARTMENT</Text>
        <Text>DATE: MAY 14, 2025</Text>
        <Text>SUBJECT: ADMINISTRATIVE OFFENSE</Text>
      </View>

      <View style={styles.section}>
        <Text>
          It was brought to our attention that you committed a violation of the Code of Discipline particularly those under Company Productivity section 2.1.5 classified as First Degree Offense to wit:
        </Text>
        <Text style={styles.indent}>
          2.1.5 Tardiness, arriving late for work and/or leaving workplace before dismissal time of more than sixty (60) minutes within a one (1) month period (e.g. Cut-Off Period: April 26 - May 25) including coming in after meals/coffee break. Habitual clearing of assigned working area without permission.
        </Text>
        <Text style={styles.indent}>
          Pagkahuli, pagdating ng huli sa oras ng trabaho at/o pag-alis sa pinagtatrabahuan sa hindi pa tamang oras ng paglabas ng higit sa animnapung (60) minuto sa loob ng isang buwang palugit (Halimbawa ng Cut-Off Period: Abril 26 - Mayo 25) kabilang ang oras pagkatapos kumain/coffee break. Palagiang pag-alis sa destino ng walang pahintulot.
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          As per timekeeping for the cut-off period of March 26, 2025 - April 10, 2025 and April 11, 2025 - April 25, 2025, our records show the following incident/s of tardiness, to wit:
        </Text>
        <Text style={styles.indent}>
          03/26/2025 - 5 Minutes late{'\n'}
          03/27/2025 - 1 Minute late{'\n'}
          03/29/2025 - 4 Minutes late{'\n'}
          03/31/2025 - 18 Minutes late{'\n'}
          04/01/2025 - 3 Minutes late{'\n'}
          04/02/2025 - 18 Minutes late{'\n'}
          04/03/2025 - 3 Minutes late{'\n'}
          04/06/2025 - 4 Minutes late{'\n'}
          04/08/2025 - 7 Minutes late{'\n'}
          04/11/2025 - 6 Minutes late{'\n'}
          04/12/2025 - 8 Minutes late{'\n'}
          04/13/2025 - 4 Minutes late{'\n'}
          04/14/2025 - 7 Minutes late{'\n'}
          04/16/2025 - 12 Minutes late{'\n'}
          04/21/2025 - 7 Minutes late{'\n'}
          04/22/2025 - 9 Minutes late{'\n'}
          04/23/2025 - 4 Minutes late
        </Text>
        <Text>Total minutes tardy: 120</Text>
      </View>

      <View style={styles.section}>
        <Text>
          Pursuant to the Code of Discipline, this may constitute a possible violation under First Degree Offense punishable by 50% Performance Incentives Deduction on the Fourth Offense.
        </Text>
        <Text>
          In view thereof, you are directed to explain in writing within Five (5) Calendar Days from receipt of this notice why no disciplinary action should be taken against you. Your failure to reply as directed constitutes a waiver of your right to rebut the said charges and we shall proceed to determine the merits of the charges against you and impose the appropriate disciplinary sanction.
        </Text>
        <Text>
          Please be reminded that Administrative Offenses committed by an employee will affect his/her records when he/she is being considered for possible promotion. Repetition of the same shall merit further disciplinary action.
        </Text>
        <Text>For your guidance and strict compliance and immediate attention.</Text>
      </View>

      <View style={styles.section}>
        <Text>Issued by:</Text>
        <Text>Mr. Wilhim T. Ong</Text>
        <Text>Head of Human Resources</Text>
        <Text style={{ fontStyle: 'italic' }}>Note: This document is computer generated. No signature is required.</Text>
      </View>

      <View style={styles.section}>
        <Text>Acknowledged by:</Text>
        <Text>_______________________________</Text>
        <Text>Printed Name & Signature of Employee / Date</Text>
        <Text>Cc: 201 File</Text>
        <Text>JOVELLE B. GONZALES</Text>
      </View>
    </Page>
  </Document>
);

export default TardinessNotice;
