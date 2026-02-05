import Modal from "@/components/common/Modal";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { getInitialLastPay } from "@/api/compensation/last-pay";
import { getEmployee } from "@/api/employee";
import { PDFViewer } from "@react-pdf/renderer";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import LastPayComputationPDF from "@/components/modules/pdf/LastPayComputationPDF";

interface LastPayComputationModalProps {
    modal: any;
    data: any;
}

const LastPayComputationModal = ({
    modal,
    data
}: LastPayComputationModalProps) => {
    const api = useApiCall();
    const [details, setDetails] = useState<any>({});

    useAsyncEffect(() => {
        if (!modal.isShowing) return;
        const employeeNumber = data?.employee?.employee_number;
        if (!employeeNumber) return;

        api.setLoading(true);
        Promise.all([
            getInitialLastPay(employeeNumber),
            getEmployee(employeeNumber),
        ])
            .then(([lastPayResp, employeeResp]) => {
                if (!lastPayResp.error) {
                    const employeeData = !employeeResp.error ? employeeResp.data?.employee : undefined;
                    setDetails({
                        ...lastPayResp.data,
                        employee: employeeData ?? lastPayResp.data?.employee,
                    });
                } else {
                    toast.error(lastPayResp.data?.message ?? "Error fetching last pay details");
                }

                if (employeeResp.error) {
                    toast.error(employeeResp.data?.message ?? "Error fetching employee details");
                }
            })
            .catch(() => {
                toast.error("Error encountered");
            })
            .finally(() => {
                api.setLoading(false);
            });
    }, [modal.isShowing, data?.employee?.employee_number]);

    const mergedData = useMemo(() => {
        return {
            ...details,
            ...data,
            payrolls: details?.payrolls ?? data?.payrolls ?? [],
            payroll_hold: data?.payroll_hold ?? details?.payroll_hold,
            thirteenth_month: data?.thirteenth_month ?? details?.thirteenth_month,
            incentives: data?.incentives ?? details?.incentives,
            sl_vl: data?.sl_vl ?? details?.sl_vl,
            meal_allowance: data?.meal_allowance ?? details?.meal_allowance ?? data?.meal,
            tax_refund: data?.tax_refund ?? details?.tax_refund,
            sales: data?.sales ?? details?.sales,
            total_deductions: data?.total_deductions ?? details?.total_deductions,
            last_pay: data?.last_pay ?? details?.last_pay,
            employee: details?.employee ?? data?.employee,
        };
    }, [data, details]);

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Last Pay Computation"
            onClose={() => modal.onClose()}
            size="entireScreen"
            loading={api.loading}
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
