"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { getAllTardinessDisablers, upsertTardinessDisabler } from "@/api/tardiness-disabler";
import ActionDropDown from "@/components/common/ActionDropDown";
import Badge from "@/components/common/Badge";
import confirm from "@/components/common/Confirm";
import moment from "moment";

const TardinessDisablerTableCard = () => {
    const api = useApiCall();
    const paginator = usePagination(10);

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllTardinessDisablers({
            page: paginator.page,
            per_page: paginator.per_page,
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching tardiness disablers");
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
    }, [paginator.reload, api.reload]);


    const columnSettings = [
        {
            columnHead: "Month",
            path: "month",
            columnType: COLUMNTYPES.function,
            function: (data: any) => moment().month(data.month - 1).format("MMMM"),
        },
        {
            columnHead: "Year",
            path: "year",
            columnType: COLUMNTYPES.string,
        },
        {
            columnHead: "Status",
            path: "is_disabled",
            columnType: COLUMNTYPES.function,
            function: (data: any) => (
                <Badge
                    label={data.is_disabled ? "Disabled" : "Enabled"}
                    status={data.is_disabled ? "danger" : "success"}
                />
            ),
        },
        {
            columnHead: "Updated At",
            path: "updated_at",
            columnType: COLUMNTYPES.timestamp,
        },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
            function: (data: any) => {
                const actionLabel = data.is_disabled ? "Enable" : "Disable";
                const actions = [
                    {
                        label: actionLabel,
                        onClick: async () => {
                            const isConfirmed = await confirm({
                                title: `${actionLabel} Month`,
                                message: `Are you sure you want to ${actionLabel.toLowerCase()} ${moment().month(data.month - 1).format("MMMM")} ${data.year}?`,
                            });

                            if (isConfirmed) {
                                upsertTardinessDisabler({
                                    month: Number(data.month),
                                    year: Number(data.year),
                                    is_disabled: !data.is_disabled,
                                }).then((resp) => {
                                    if (!resp.error) {
                                        toast.success(resp.data.message);
                                        api.triggerReload();
                                    } else {
                                        toast.error(resp.data.message);
                                    }
                                }).catch(() => {
                                    toast.error("Error encountered");
                                });
                            }
                        }
                    }
                ];

                return (
                    <ActionDropDown
                        data={data}
                        actions={actions}
                    />
                );
            }
        }
    ];

    return (
        <>
            <Card>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>
        </>
    );
};

export default TardinessDisablerTableCard;
