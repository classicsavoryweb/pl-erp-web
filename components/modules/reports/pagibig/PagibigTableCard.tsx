"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useFilter } from "@/hooks/use-filter";
import { getAllReportsPagibigContributions, getAllReportsPagibigLoans} from "@/api/reports/reports-pagibig";
import DropDownButtons from "@/components/common/DropDownButtons";
import MonthlyContributionModal from "./MonthlyContributionModal";
import PagibigLoansModal from "./PagibigLoansModal";

const PagibigTableCard = () => {
    
    const api = useApiCall();
    const unique_api = useApiCall();
    const exportMonthlyContributionModal = useModal();
    const exportPagibigLoansModal = useModal();
    const paginator = usePagination();
    const filter = useFilter();

    const columnSettings = [
        {
            columnHead: "Employee Number",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Pagibig ID",
            path: "employee.pagibig",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "First Cutoff Contribution",
            path: "first_cutoff_employee_contribution",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Second Cutoff Contribution",
            path: "second_cutoff_employee_contribution",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Total Contribution",
            path: "total_employee_contribution",
            columnType: COLUMNTYPES.string
        },
    ];

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllReportsPagibigContributions({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching pagibig contributions");
            } else {
                api.setDataSet(resp.data.data);
                paginator.setPage(resp.data.current_page);
                paginator.setPaginationData(resp.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            api.setLoading(false);
        });

        unique_api.setLoading(true);
        getAllReportsPagibigLoans({})
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching pagibig loans");
            } else {
                unique_api.setDataSet(resp.data.data);
            }
        })
        .catch(() => {
            toast.error("Error encountered");
        })
        .finally(() => {
            unique_api.setLoading(false);
        });
    }, [paginator.reload, api.reload, filter.reload, unique_api.reload,]);

    const actionsSettings = [
        {
            label: "Export Monthly Contribution",
            onClick: () => {
                exportMonthlyContributionModal.onOpen();
            }
        },
        {
            label: "Export Pagibig Loans",
            onClick: () => {
                exportPagibigLoansModal.onOpen();
            }
        }
    ];

    return (
        <>
            <Card>
                <div className="flex justify-end">
                    <div>
                        <DropDownButtons
                            actions={actionsSettings}
                        />
                    </div>
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <MonthlyContributionModal
                modal={exportMonthlyContributionModal}
                onSubmitCallback={api.triggerReload}
            />

            <PagibigLoansModal
                modal={exportPagibigLoansModal}
                onSubmitCallback={unique_api.triggerReload}
            />
        </>
    );
};

export default PagibigTableCard;