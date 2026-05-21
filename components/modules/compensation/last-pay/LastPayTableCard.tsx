"use client";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";;
import { toast } from "react-toastify";
import Badge from "@/components/common/Badge";
import { useFilter } from "@/hooks/use-filter";
import FilterCard from "../../cards/FilterCard";
import { exportAllLastPays, getAllLastPays } from "@/api/compensation/last-pay";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useModal } from "@/hooks/modal";
import CreateLastPayModal from "./CreateLastPayModal";
import ActionDropDown from "@/components/common/ActionDropDown";
import { useState } from "react";
import moment from "moment";
import ViewLastPayModal from "./ViewLastPayModal";
import EditLastPayModal from "./EditLastPayModal";
import LastPayComputationEditModal from "./LastPayComputationEditModal";
import PostLastPayPreviewModal from "./PostLastPayPreviewModal";
import TaxRefundComputationModal from "./TaxRefundComputationModal";

const LastPayTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const filter = useFilter();
    const [data, setData] = useState<any>({});
    const createModal = useModal();
    const viewModal = useModal();
    const editModal = useModal();
    const computationModal = useModal();
    const postPreviewModal = useModal();
    const taxRefundComputationModal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllLastPays({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then(async (resp) => {
            if (resp.error) {
                toast.error("Error fetching last pay");
            } else {
                api.setDataSet(resp.data.data ?? []);
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
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
        {
            columnHead: "Date Created",
            path: "created_at",
            columnType: COLUMNTYPES.date,
        },
        {
            columnHead: "Last Pay Number",
            path: "last_pay_number",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employee Name",
            path: "employee.full_name",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Employee Number",
            path: "employee.employee_number",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Position",
            path: "employee.current_position.description",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Branch",
            path: "employee.current_branch.short_name",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Last Pay",
            path: "last_pay",
            columnType: COLUMNTYPES.amount,
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                let status: "default" | "success" | "warning" | "danger" = "default";

                switch(data.status) {
                    case "Posted": 
                        status = "success";
                        break;
                    case "Unposted":
                        status = "warning";
                        break;
                    default:
                        status = "default";
                        break;
                };

                return <Badge
                    label={data.status}
                    status={status}
                />
            }
        },
        {
            columnHead: "Action",
            path: "status",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                
                var actions: any[] = [];
                switch(data.status) {
                    case "Posted": 
                        actions = [
                            actionSettings[0],
                            actionSettings[1],
                            actionSettings[2],
                        ];
                        break;
                    case "Unposted":
                        actions = [
                            actionSettings[0],
                            actionSettings[1],
                            actionSettings[2],
                            actionSettings[3],
                            actionSettings[4],
                        ];
                        break;
                };

                return <ActionDropDown
                    actions={actions}
                    data={data}
                />
            }
        },
    ];

    const actionSettings = [
        {
            label: "View",
            onClick: (data:any) => {
                viewModal.onOpen();
                setData(data);
            }
        },
        {
            label: "Computation PDF",
            onClick: (data:any) => {
                computationModal.onOpen();
                setData(data);
            }
        },
        {
            label: "Tax Refund Computation",
            onClick: (data:any) => {
                taxRefundComputationModal.onOpen();
                setData(data);
            }
        },
        {
            label: "Post",
            onClick: (data: any) => {
                setData(data);
                postPreviewModal.onOpen();
            }
        },
        {
            label: "Edit",
            onClick: (data:any) => {
                editModal.onOpen();
                setData(data);
            }
        },
    ];

    const actions = [
        {
            label: "Create Record",
            onClick: () => {
                createModal.onOpen();
            }
        }
    ]

    return (
        <>
            <FilterCard
                filterHandler={filter}
                columnSettings={[
                    {
                        columnHead: "Employee Name",
                        path: "employee.full_name",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Employee Number",
                        path: "employee.employee_number",
                        columnType: COLUMNTYPES.string,
                    },
                ]}
                defaultColumnSelected="employee.full_name"
                hasExport
                api={exportAllLastPays}
                exportFileName={`LAST-PAY-${moment().format("YYYY-MM-DD")}.xls`}
                withBranch
                withStatus
                statusOption={[
                    {
                        label: "Posted",
                        value: "Posted"
                    },
                    {
                        label: "Unposted",
                        value: "Unposted"
                    }
                ]}
                callBack={() => {
                    paginator.setPage(1);
                }}
            />

            <Card>
                <div className="flex justify-end">
                    <div>
                        <DropDownButtons
                            actions={actions}
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

            <CreateLastPayModal
                modal={createModal}
                callBack={() => {
                    api.triggerReload();
                }}
            />

            <ViewLastPayModal
                modal={viewModal}
                data={data}
            />

            <EditLastPayModal
                modal={editModal}
                data={data}
                onUpdated={() => {
                    api.triggerReload();
                }}
            />

            <LastPayComputationEditModal
                modal={computationModal}
                data={data}
            />

            <PostLastPayPreviewModal
                modal={postPreviewModal}
                data={data}
                onPosted={() => {
                    api.triggerReload();
                }}
            />

            <TaxRefundComputationModal
                modal={taxRefundComputationModal}
                data={data}
            />
        </>
    );
};

export default LastPayTableCard;
