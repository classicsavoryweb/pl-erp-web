"use client";

import { getEmployeeRequirements, updateOrCreateEmployeeRequirements } from "@/api/employee";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Grid from "@/components/common/Grid";
import TableLoader from "@/components/common/TableLoader";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const EmployeeRequirementsList = () => {
    const params = useParams();
    const employeeNumber = params["employee-number"];
    const api = useApiCall();

    const handler = useFormik({
        initialValues: {
            birth_certificate: "No",
            marriage_certificate: "No",
            birth_certificate_dependents: "No",
            sss: "No",
            check_1902: "No",
            check_1905: "No",
            philhealth: "No",
            pagibig: "No",
            tin: "No",
            picture2x2: "No",
            check_diploma: "No",
            tor: "No",
            cot: "No",
            coe: "No",
            nbi: "No",
            drug_test: "No",
            clinical_microscopy: "No",
            chest_xray: "No",
            occupational_permit: "No",
        },
        onSubmit: (values, {setSubmitting}) => {
            setSubmitting(true);
            updateOrCreateEmployeeRequirements(String(employeeNumber), values)
            .then((resp) => {
                if (!resp.error) {
                    toast.success(resp.data.message);
                } else {
                    toast.error(resp.data.message);
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                setSubmitting(false);
            });
        }
    });

    useAsyncEffect(() => {
        api.setLoading(true);

        getEmployeeRequirements(String(employeeNumber))
        .then((resp) => {
            if (!resp.error && resp.data.requirements) {
                handler.setValues(resp.data.requirements);
            } else {
                toast.error(resp.data.message);
            }
        }).catch(() => {
            toast.error("Error encountered");
        }).finally(() => {
            api.setLoading(false);
        });
    }, []);
    return (
        <>
            { api.loading ?
                <TableLoader/>
                :
                <>
                    <form onSubmit={handler.handleSubmit}>
                        <Grid cols={2}>
                            <Checkbox
                                label="Birth Certificate"
                                checked={handler.values.birth_certificate === "Yes"}
                                value="birth_certificate"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Marriage Certificate"
                                checked={handler.values.marriage_certificate === "Yes"}
                                value="marriage_certificate"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="SSS"
                                checked={handler.values.sss === "Yes"}
                                value="sss"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Birth Certificate of Dependents"
                                checked={handler.values.birth_certificate_dependents === "Yes"}
                                value="birth_certificate_dependents"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="1902"
                                checked={handler.values.check_1902 === "Yes"}
                                value="check_1902"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="1905"
                                checked={handler.values.check_1905 === "Yes"}
                                value="check_1905"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Philhealth"
                                checked={handler.values.philhealth === "Yes"}
                                value="philhealth"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Pagibig"
                                checked={handler.values.pagibig === "Yes"}
                                value="pagibig"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="TIN"
                                checked={handler.values.tin === "Yes"}
                                value="tin"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="2x2 Picture"
                                checked={handler.values.picture2x2 === "Yes"}
                                value="picture2x2"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Diploma"
                                checked={handler.values.check_diploma === "Yes"}
                                value="check_diploma"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Transcript of Records"
                                checked={handler.values.tor === "Yes"}
                                value="tor"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Certificate of Transfer"
                                checked={handler.values.cot === "Yes"}
                                value="cot"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Certificate of Employment"
                                checked={handler.values.coe === "Yes"}
                                value="coe"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="NBI"
                                checked={handler.values.nbi === "Yes"}
                                value="nbi"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Drug Test"
                                checked={handler.values.drug_test === "Yes"}
                                value="drug_test"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Clinical Microscopy"
                                checked={handler.values.clinical_microscopy === "Yes"}
                                value="clinical_microscopy"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Chest Xray"
                                checked={handler.values.chest_xray === "Yes"}
                                value="chest_xray"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                            <Checkbox
                                label="Occupational Permit"
                                checked={handler.values.occupational_permit === "Yes"}
                                value="occupational_permit"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (e.target.checked) {
                                        handler.setFieldValue(value, "Yes");
                                    } else {
                                        handler.setFieldValue(value, "No");
                                    }
                                }}
                            />
                        </Grid>

                        <div className="flex justify-end">
                            <div>
                                <Button
                                    loading={handler.isSubmitting}
                                    onClick={() => {}}
                                    type="submit"
                                    label="Save"
                                />
                            </div>
                        </div>
                    </form>
                </>
            }
        </>
    );
};

export default EmployeeRequirementsList;