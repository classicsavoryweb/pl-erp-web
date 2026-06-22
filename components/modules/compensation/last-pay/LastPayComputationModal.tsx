import Modal from "@/components/common/Modal";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getLastPay } from "@/api/compensation/last-pay";
import { getEmployee } from "@/api/employee";
import { PDFViewer } from "@react-pdf/renderer";
import { toast } from "react-toastify";
import { useContext, useMemo, useState } from "react";
import LastPayComputationPDF from "@/components/modules/pdf/LastPayComputationPDF";
import { AuthContext } from "@/context/AuthProvider";

interface LastPayComputationModalProps {
    modal: any;
    data?: any;
    previewData?: any;
    skipFetch?: boolean;
}

const LastPayComputationModal = ({
    modal,
    data,
    previewData,
    skipFetch = false,
}: LastPayComputationModalProps) => {
    const api = useApiCall();
    const [details, setDetails] = useState<any>({});
    const [preparedByEmployee, setPreparedByEmployee] = useState<any>(null);
    const { userDetails } = useContext(AuthContext);

    const isPreviewOnly = Boolean(skipFetch && previewData);

    useAsyncEffect(() => {
        if (!modal.isShowing) return;

        if (isPreviewOnly) {
            api.setLoading(false);
            setDetails(previewData ?? {});
            setPreparedByEmployee(null);
            return;
        }

        const employeeNumber = data?.employee?.employee_number;
        const preparerEmployeeNumber = userDetails?.employee_number;
        if (!employeeNumber) return;

        api.setLoading(true);
        Promise.all([
            getLastPay(employeeNumber),
            getEmployee(employeeNumber),
            preparerEmployeeNumber && preparerEmployeeNumber !== employeeNumber
                ? getEmployee(preparerEmployeeNumber)
                : Promise.resolve(null),
        ])
            .then(([lastPayResp, employeeResp, preparerResp]) => {
                if (!lastPayResp.error) {
                    const employeeData = !employeeResp.error ? employeeResp.data?.employee : undefined;
                    setDetails({
                        ...lastPayResp.data,
                        employee: employeeData ?? lastPayResp.data?.employee,
                    });

                    if (preparerEmployeeNumber === employeeNumber) {
                        setPreparedByEmployee(employeeData ?? null);
                    }
                } else {
                    toast.error(lastPayResp.data?.message ?? "Error fetching last pay details");
                }

                if (employeeResp.error) {
                    toast.error(employeeResp.data?.message ?? "Error fetching employee details");
                }

                if (preparerResp && !preparerResp.error) {
                    setPreparedByEmployee(preparerResp.data?.employee ?? null);
                }
            })
            .catch(() => {
                toast.error("Error encountered");
            })
            .finally(() => {
                api.setLoading(false);
            });
    }, [modal.isShowing, data?.employee?.employee_number, userDetails?.employee_number, isPreviewOnly, previewData]);

    const preparedBy = useMemo(() => {
        if (userDetails?.proper_full_name) return userDetails.proper_full_name;
        if (userDetails?.full_name) return userDetails.full_name;
        const parts = [userDetails?.first_name, userDetails?.middle_name, userDetails?.last_name].filter(Boolean);
        return parts.join(" ");
    }, [userDetails]);

    const preparedByTitle = useMemo(() => {
        return (
            userDetails?.position
            ?? preparedByEmployee?.current_position?.description
            ?? userDetails?.current_position?.description
            ?? ""
        );
    }, [preparedByEmployee, userDetails]);

    const mergedData = useMemo(() => {
        if (isPreviewOnly) {
            const base = previewData ?? {};
            return {
                ...base,
                prepared_by: base?.prepared_by ?? preparedBy,
                prepared_by_title: base?.prepared_by_title ?? preparedByTitle,
            };
        }

        return {
            ...details,
            ...data,
            payrolls: details?.payrolls ?? data?.payrolls ?? [],
            payroll_hold: data?.payroll_hold ?? details?.payroll_hold,
            thirteenth_month: data?.thirteenth_month ?? details?.thirteenth_month,
            incentives: data?.incentives ?? details?.incentives,
            sl_vl: details?.sl_vl ?? data?.sl_vl,
            meal_allowance: details?.meal_allowance ?? data?.meal_allowance ?? details?.meal ?? data?.meal,
            tax_refund: data?.tax_refund ?? details?.tax_refund,
            sales: details?.sales ?? data?.sales,
            total_deductions: data?.total_deductions ?? details?.total_deductions,
            last_pay: data?.last_pay ?? details?.last_pay,
            employee: details?.employee ?? data?.employee,
            prepared_by: preparedBy || data?.prepared_by || details?.prepared_by,
            prepared_by_title: preparedByTitle || data?.prepared_by_title || details?.prepared_by_title,
        };
    }, [isPreviewOnly, previewData, details, data, preparedBy, preparedByTitle]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Last Pay Computation"
            onClose={() => modal.onClose()}
            size="entireScreen"
            loading={api.loading && !isPreviewOnly}
        >
            <PDFViewer className="w-full h-[85vh]">
                <LastPayComputationPDF
                    data={mergedData}
                />
            </PDFViewer>
        </Modal>
    );
};

export default LastPayComputationModal;
