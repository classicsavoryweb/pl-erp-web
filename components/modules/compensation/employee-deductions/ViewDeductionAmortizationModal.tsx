import { getDeductionAmortizationHistory , exportDeductionsAmortization} from "@/api/compensation/employee-deductions";
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
import Button from "@/components/common/Button";
interface ModalInterface {
    modal: any;
    data: any;
};

const ViewDeductionAmortizationModal = ({
    modal,
    data
}: ModalInterface) => {

    const paginator = usePagination(20);
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
            <Grid cols={5}>
                <div className={paginator.paginationData?.total ?? 0 > 0 ? "col-span-4" : "col-span-5"}>
                    <Textfield
                        label="Deduction Type"
                        value={data.deduction?.description ?? ""}
                        disabled
                    />
                </div>
                    {(paginator.paginationData?.total ?? 0) > 0 && (
                    <div className="col-span-1 pt-3">
                        <Button
                            label="Export"
                            type="button"
                            onClick={async () => {
                                try {
                                    const response = await exportDeductionsAmortization({
                                        employee_number: data.employee.employee_number,
                                        reference_number: data.reference_doc,
                                    });
                                    const blob = new Blob(
                                        [response.data],
                                        {
                                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                        }
                                    );
                                    const url = window.URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = `AMORTIZATION-HISTORY-${data.reference_doc}.xlsx`;

                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                    window.URL.revokeObjectURL(url);
                                } catch (error) {
                                    toast.error("Error exporting amortization history");
                                }
                            }}
                            variant="success"
                            isIcon
                            iconType="export"
                        /> 
                    </div>
                )}
            </Grid>
            <Grid cols={4}>
                <div className="col-span-2">
                    <Textfield
                        label="Original Amount"
                        value={formatNumber(data.amount ?? 0)}
                        disabled
                    />
                </div>
                <div className="col-span-2">
                    <Textfield
                        label="Remaining Balance"
                        value={formatNumber(data.balance ?? 0)}
                        disabled
                    />
                </div>
                
            </Grid>

            <div className="mt-3 flex justify-between items-center">
                <p>Amortization</p>
                <p>{paginator.paginationData?.total ?? 0} Cutoffs Paid</p>
            </div>

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