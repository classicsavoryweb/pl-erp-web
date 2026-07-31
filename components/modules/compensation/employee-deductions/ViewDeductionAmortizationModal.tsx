import { getDeductionAmortizationHistory } from "@/api/compensation/employee-deductions";
import Grid from "@/components/common/Grid";
import Modal from "@/components/common/Modal";
import Table from "@/components/common/Table";
import Textfield from "@/components/common/Textfield";
import { COLUMNTYPES } from "@/constants/column";
import { formatNumber } from "@/helper/amount";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";

interface ModalInterface {
    modal: any;
    data: any;
};

const ViewDeductionAmortizationModal = ({
    modal,
    data
}: ModalInterface) => {

    const paginator = usePagination();
    const api = useApiCall();

    useAsyncEffect(() => {
        if (modal.isShowing) {
            api.setLoading(true);
            getDeductionAmortizationHistory({
                page: paginator.page,
                per_page: paginator.per_page,
                employee_number: data.employee.employee_number,
                reference_number: data.reference_doc
            }).then((resp) => {
                if (!resp.error) {
                    api.setDataSet(resp.data.data);
                    paginator.setPage(resp.current_page);
                    paginator.setPaginationData(resp.data);
                } else {
                    toast.error("Error fetching amortization history");
                }
            }).catch(() => {
                toast.error("Error encountered");
            }).finally(() => {
                api.setLoading(false);
            });
        }
    }, [modal.isShowing, paginator.reload]);

    const columnSettings = [
        {
            columnHead: "Date Deducted",
            path: "pay_date",
            columnType: COLUMNTYPES.date
        },
        {
            columnHead: "Deducted Amount",
            path: "amount",
            columnType: COLUMNTYPES.amount
        },
        {
            columnHead: "Running Balance",
            path: "new_balance",
            columnType: COLUMNTYPES.amount
        },
    ];

    return (
        <Modal
            isShowing={modal.isShowing}
            title="Amortization History"
            size="md"
            onClose={modal.onClose}
        >
            <Textfield
                label="Deduction Type"
                value={data.deduction?.description ?? ""}
                disabled
            />
            <Grid cols={2}>
                <Textfield
                    label="Original Amount"
                    value={formatNumber(data.amount ?? 0)}
                    disabled
                />
                <Textfield
                    label="Remaining Balance"
                    value={formatNumber(data.balance ?? 0)}
                    disabled
                />
            </Grid>

            <p className="mt-3">Amortization</p>
            <Table
                dataSet={api.dataSet}
                columnSettings={columnSettings}
                loading={api.loading}
                paginator={paginator}
            />
        </Modal>
    );
};

export default ViewDeductionAmortizationModal;