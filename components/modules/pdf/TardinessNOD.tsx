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
    section: { marginBottom: 10 },
    header: { fontSize: 9, textAlign: 'center', marginBottom: 20 },
    title: { fontSize: 8, marginBottom: 6 },
    bold: { fontWeight: 'bold' },
    underline: { textDecoration: 'underline' },
    indent: { marginLeft: 20 },
    row: { flexDirection: 'row', marginBottom: 4 },
    positionLabel: { flexDirection: 'row', marginBottom: 4, marginTop: -6 },
    headerLabel: { width: 100 },
    flex: {flexDirection: "row", gap: 50, marginBottom: 3},
    textRed: { color: "red" }

});

interface TardinessNoticeInterface {
    data: any;
    employeeStatement?: string;
}

const chunkArray = (arr: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

const INDENT = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';

const TardinessNOD = ({
  data,
  employeeStatement
}: TardinessNoticeInterface) => {
    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.bold}>{process.env.NEXT_PUBLIC_COMPANY}.</Text>
                    <Text style={styles.bold}>DISCIPLINARY ACTION FORM</Text>
                </View>

                <View
                    style={{
                        ...styles.flex
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row", gap: 3
                        }}
                    >
                        <Text
                            style={{
                                width: 100
                            }}
                        >
                            Name of Employee:
                        </Text>

                        <Text
                            style={{
                                width: 200,
                                paddingBottom: 1,
                                borderBottom: 1
                            }}
                        >
                            {data.proper_full_name}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row", gap: 3
                        }}
                    >
                        <Text
                            style={{
                                width: 120
                            }}
                        >
                            Immediate Supervisor:
                        </Text>

                        <Text
                            style={{
                                width: 200,
                                paddingBottom: 1,
                                borderBottom: 1
                            }}
                        >
                            {data.branch_head}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        ...styles.flex
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row", gap: 3
                        }}
                    >
                        <Text
                            style={{
                                width: 100
                            }}
                        >
                            Position/ Branch:
                        </Text>

                        <Text
                            style={{
                                width: 200,
                                paddingBottom: 1,
                                borderBottom: 1,
                                fontSize: 8
                            }}
                        >
                            {data.position} / {data.branch}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row", gap: 3
                        }}
                    >
                        <Text
                            style={{
                                width: 120
                            }}
                        >
                            Date Served:
                        </Text>

                        <Text
                            style={{
                                width: 200,
                                paddingBottom: 1,
                                borderBottom: 1
                            }}
                        >
                            {String(data.date).charAt(0).toUpperCase() + String(data.date).slice(1).toLowerCase()}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        ...styles.flex
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row", gap: 3
                        }}
                    >
                        <Text
                            style={{
                                width: 100
                            }}
                        >
                            Date of Offense:
                        </Text>

                        <Text
                            style={{
                                marginLeft: -11,
                                width: 250,
                                paddingBottom: 1,
                                borderBottom: 1,
                                fontSize: 7
                            }}
                        >
                            {data.first_cut_off} and {data.second_cut_off}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row", gap: 3
                        }}
                    >
                        <Text
                            style={{
                                width: 100
                            }}
                        />
                        <Text
                            style={{
                                width: 100,
                                paddingBottom: 1,
                                fontSize: 8
                            }}
                        />
                    </View>
                </View>

                <View
                    style={styles.section}
                />

                <View style={{
                        ...styles.section,
                        fontSize: 8
                    }}
                >
                    <Text style={styles.bold}>DEGREE OF OFFENSE:</Text>
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center",
                            fontWeight: "bold"
                        }}>
                            X
                        </Text>
                        <Text>
                            1st Degree
                        </Text>
                    </View>
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center"
                        }}></Text>
                        <Text>
                            2nd Degree
                        </Text>
                    </View>
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center"
                        }}></Text>
                        <Text>
                            3rd Degree
                        </Text>
                    </View>
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center"
                        }}></Text>
                        <Text>
                            4th Degree
                        </Text>
                    </View>
                </View>

                <View style={{
                        ...styles.section,
                        fontSize: 8
                    }}
                >
                    <Text style={styles.bold}>TYPE OF OFFENSE:</Text>
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text
                            style={{
                                width: 90
                            }}
                        >
                            Conduct and Decorum
                        </Text>
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center",
                            fontWeight: "bold"
                        }}></Text>
                    </View>
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text
                            style={{
                                width: 90
                            }}
                        >
                            Company Productivity
                        </Text>
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center",
                            fontWeight: "bold"
                        }}>
                            2.1.5
                        </Text>
                    </View>
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text
                            style={{
                                width: 90
                            }}
                        >
                            Health and Safety
                        </Text>
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center"
                        }}></Text>
                    </View>
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text
                            style={{
                                width: 90
                            }}
                        >
                            Property and Security
                        </Text>
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center"
                        }}></Text>
                    </View>
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text
                            style={{
                                width: 90
                            }}
                        >
                            Repeated Violation
                        </Text>
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center"
                        }}></Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.bold}>Incident Information</Text>
                    
                    <View>
                        <Text
                            style={{
                                marginBottom: 7
                            }}
                        >
                            As per HR-GEN-076-2018 dated August 17, 2018: “Tardiness/undertime will be considered when an employee is late
                            or has gone on undertime in excess of accumulated sixty (60) minutes within one (1) month covering two (2) cut-off
                            (e.g. 26th -10th and 11th -25th of the month)“.
                        </Text>

                        <Text
                            style={{
                                marginBottom: 3
                            }}
                        >
                            As per timekeeping for the cut-off period of {data.first_cut_off} and {data.second_cut_off}, our records
                            show the following incident/s of tardiness, to wit:
                        </Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                            {data.tardiness_minutes_late &&
                            chunkArray(data.tardiness_minutes_late.slice(0, 99), 9).map((group, colIdx) => (
                                <View key={colIdx} style={{ paddingRight: 35 }}>
                                    {group.map((minutes: any, rowIdx: number) => (
                                        <Text
                                            key={rowIdx}
                                            style={{ ...styles.textRed, marginTop: -1 }}
                                        >
                                            {moment(minutes.late_date).format('MM/DD/YYYY')} - {minutes.late_minutes} Minutes late
                                        </Text>
                                    ))}
                                </View>
                            ))}
                        </View>

                        <Text style={{...styles.bold, ...styles.textRed, marginTop: 5}}>Total Tardy: {data.total_minutes} Minutes</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.bold}>Policy / Policies Violated:</Text>
                    <Text style={styles.bold}>Company Productivity</Text>
                    <Text>
                        Tardiness, arriving late for work and/or leaving workplace before dismissal time of more than sixty (60) minutes within
                        a one (1) month period (e.g. Cut-Off Period: April 26 - May 25) including coming in after meals/coffee break. Habitual
                        clearing of assigned working area without permission.
                    </Text>
                </View>
            </Page>

            <Page size="LETTER" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.bold}>Employee Statement:</Text>
                    <Text>{ employeeStatement ? employeeStatement : "N/A" }</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.bold}>Disciplinary Action:</Text>
                    <Text>Pursuant to the Code of Discipline, the violation constitutes as First Degree Offense punishable by</Text>
                
                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center",
                            fontWeight: "bold"
                        }}>
                            { data.rank && Number(data.rank) === 1 &&
                                "X"
                            }
                        </Text>
                        <Text>
                            Written Reprimand
                        </Text>
                    </View>

                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center",
                            fontWeight: "bold"
                        }}>
                            { data.rank && Number(data.rank) < 4 && Number(data.rank) > 1 &&
                                "X"
                            }
                        </Text>
                        <Text>
                            25% Performance Incentives Deduuction
                        </Text>
                    </View>

                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center",
                            fontWeight: "bold"
                        }}>
                            { data.rank && Number(data.rank) < 6 && Number(data.rank) > 3 &&
                                "X"
                            }
                        </Text>
                        <Text>
                            50% Performance Incentives Deduuction
                        </Text>
                    </View>

                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center",
                            fontWeight: "bold"
                        }}>
                            { data.rank && Number(data.rank) < 8 && Number(data.rank) > 5 &&
                                "X"
                            }
                        </Text>
                        <Text>
                            75% Performance Incentives Deduuction
                        </Text>
                    </View>

                    <View
                        style={{
                            ...styles.indent,
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginBottom: 5
                        }}
                    >
                        <Text style={{
                            paddingBottom: 1,
                            borderBottom: 1,
                            width: 50,
                            textAlign: "center",
                            fontWeight: "bold"
                        }}>
                            { data.rank && Number(data.rank) >= 8 &&
                                "X"
                            }
                        </Text>
                        <Text>
                            100% Performance Incentives Deduuction
                        </Text>
                    </View>

                    <Text>for the {data.count}.</Text>
                </View>
                
                <View
                    style={styles.section}
                >
                    <Text
                        style={{
                            fontStyle: "italic"
                        }}
                    >
                        I hereby declare that I fully understand the offense made and agree to abide to the fore mentioned corrective plan of action.
                    </Text>
                </View>

                <View
                    style={{
                        marginTop: 30,
                        marginBottom: 50
                    }}
                >
                    <Text
                        style={{
                            marginBottom: 25,
                        }}
                    >
                        Signature of Employee
                    </Text>

                    <Text
                        style={{
                            width: 200,
                            textAlign: "center",
                            borderBottom: 1,
                        }}
                    >
                        { data.gender === "Male" ? "Mr. " : "Ms. "}{data.proper_full_name} 
                    </Text>
                </View>

                <View
                    style={{
                        marginBottom: 50
                    }}
                >
                    <Text
                        style={{
                            marginBottom: 25,
                        }}
                    >
                        Served by
                    </Text>

                    <Text
                        style={{
                            width: 200,
                            textAlign: "center",
                            borderBottom: 1,
                        }}
                    >
                        
                    </Text>
                </View>

                <View
                    style={{
                        marginBottom: 50
                    }}
                >
                    <Text
                        style={{
                            marginBottom: 25,
                        }}
                    >
                        Noted by HR
                    </Text>

                    <Text
                        style={{
                            width: 200,
                            textAlign: "center",
                            borderBottom: 1,
                        }}
                    >
                        Mr. Wilhim T. Ong
                    </Text>
                    <Text style={{ fontStyle: "italic", fontSize: 7 }}>
                        Note: This document is computer generated. No signature is required.
                    </Text>
                </View>

                <View style={{
                    marginBottom: 30
                }}>
                    <Text>Cc: 201 File</Text>
                    <Text style={{ marginLeft: 15 }}>Immediate Supervisor</Text>
                </View>
                
                <View style={styles.section}>
                    <Text>{process.env.NEXT_PUBLIC_COMPANY}.</Text>
                </View>
            </Page>
        </Document>
    );
};

export default TardinessNOD;
