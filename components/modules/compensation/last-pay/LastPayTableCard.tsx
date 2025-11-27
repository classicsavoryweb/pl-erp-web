"use client";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";;
import { toast } from "react-toastify";
import confirm from "@/components/common/Confirm";
import Badge from "@/components/common/Badge";
import { useFilter } from "@/hooks/use-filter";
import FilterCard from "../../cards/FilterCard";
import { getAllLastPays, postLastPay } from "@/api/compensation/last-pay";
import DropDownButtons from "@/components/common/DropDownButtons";
import { useModal } from "@/hooks/modal";
import CreateLastPayModal from "./CreateLastPayModal";
import ActionDropDown from "@/components/common/ActionDropDown";
import { useState } from "react";
import ViewLastPayModal from "./ViewLastPayModal";
import EditLastPayModal from "./EditLastPayModal";

const LastPayTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);
    const filter = useFilter();
    const [data, setData] = useState<any>({});
    const createModal = useModal();
    const viewModal = useModal();
    const editModal = useModal();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllLastPays({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching last pay");
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
    }, [paginator.reload, api.reload, filter.reload]);

    const columnSettings = [
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
                        ];
                        break;
                    case "Unposted":
                        actions = [
                            actionSettings[0],
                            actionSettings[1],
                            actionSettings[2],
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
            label: "Post",
            onClick: async (data: any) => {
                const isConfirmed = await confirm({
                    title: "Post Last Pay",
                    message: "Are you sure you want to post?"
                });

                if (isConfirmed) {
                    postLastPay(data.id)
                    .then((resp) => {
                        if (!resp.error) {
                            toast.success("Last pay posted successfully");
                            api.triggerReload();
                        } else {
                            toast.error(resp.data.message);
                        }
                    }).catch(() => {
                        toast.error("Error encountered");
                    });
                }
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
            />
        </>
    );
};

export default LastPayTableCard;