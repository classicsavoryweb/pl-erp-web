"use client";

import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useEffect, useMemo, useState } from "react";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import DropDownButtons from "@/components/common/DropDownButtons";
import {
    exportAllATDAccessTypes,
    getAllATDAccessTypes,
} from "@/api/maintenance/atd-access-type";
import CreateATDAccessTypeForm from "./CreateATDAccessTypeForm";
import EditATDAccessTypeForm from "./EditATDAccessTypeForm";
import Badge from "@/components/common/Badge";

const ATDAccessTypeTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState<any>({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllATDAccessTypes({
            page: 1,
            per_page: 1000,
            ...filter.filters,
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching ATD Access Types");
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
    }, [api.reload, filter.reload]);

    const groupedData = useMemo(() => {
        if (!Array.isArray(api.dataSet)) {
            return [];
        }

        const grouped = new Map<string | number, any>();

        api.dataSet.forEach((item) => {
            const roleId = item.role_id ?? item.role?.id ?? "unknown";
            const roleKey = roleId ?? "unknown";
            const existing = grouped.get(roleKey);

            if (!existing) {
                grouped.set(roleKey, {
                    role: item.role,
                    role_id: roleId,
                    items: [],
                    deductions: [],
                    deductionIds: [],
                    statuses: [],
                });
            }

            const entry = grouped.get(roleKey);
            entry.items.push(item);

            if (item.deduction?.description) {
                entry.deductions.push(item.deduction.description);
            }

            if (item.deduction_id || item.deduction?.id) {
                entry.deductionIds.push(item.deduction_id || item.deduction?.id);
            }

            if (item.status) {
                entry.statuses.push(item.status);
            }
        });

        return Array.from(grouped.values()).map((entry) => {
            const uniqueDeductions = Array.from(new Set(entry.deductions));
            const uniqueDeductionIds = Array.from(new Set(entry.deductionIds));
            const uniqueStatuses = Array.from(new Set(entry.statuses.map((status: string) => String(status).toLowerCase())));
            const statusLabel = uniqueStatuses.length === 1 ? entry.statuses[0] : "Mixed";

            return {
                ...entry,
                id: entry.items[0]?.id,
                deductions: uniqueDeductions,
                deduction_ids: uniqueDeductionIds,
                status: statusLabel,
            };
        });
    }, [api.dataSet]);

    const paginatedGroupedData = useMemo(() => {
        const total = groupedData.length;
        const currentPage = paginator.page;
        const perPage = paginator.per_page;
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;

        return {
            data: groupedData.slice(start, end),
            paginationData: {
                current_page: currentPage,
                last_page: Math.max(1, Math.ceil(total / perPage)),
                per_page: perPage,
                total,
                from: total === 0 ? 0 : start + 1,
                to: total === 0 ? 0 : Math.min(end, total),
            },
        };
    }, [groupedData, paginator.page, paginator.per_page]);

    const tablePaginator = useMemo(() => {
        return {
            ...paginator,
            paginationData: paginatedGroupedData.paginationData,
        };
    }, [paginator, paginatedGroupedData.paginationData]);

    useEffect(() => {
        const lastPage = paginatedGroupedData.paginationData.last_page;
        if (paginator.page > lastPage) {
            paginator.setPage(lastPage);
        } else if (paginatedGroupedData.paginationData.total === 0 && paginator.page !== 1) {
            paginator.setPage(1);
        }
    }, [paginatedGroupedData.paginationData.last_page, paginatedGroupedData.paginationData.total, paginator.page, paginator.setPage]);

    const columnSettings = [
        {
            columnHead: "Role",
            path: "",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                const roleName = row.role?.name ?? "";
                return roleName === "" ? "N/A" : roleName;
            },
        },
        {
            columnHead: "Deduction",
            path: "",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                if (!row.deductions || row.deductions.length === 0) {
                    return "N/A";
                }

                return (
                    <div className="max-h-[120px] overflow-y-auto">
                        {row.deductions.map((deduction: string, idx: number) => (
                            <Badge key={`${deduction}-${idx}`} label={deduction} />
                        ))}
                    </div>
                );
            },
        },
        {
            columnHead: "Status",
            path: "",
            columnType: COLUMNTYPES.function,
            function: (row: any) => {
                const label = row.status ?? "N/A";
                if (label === "N/A") {
                    return label;
                }

                const lowered = String(label).toLowerCase();
                const badgeStatus =
                    lowered === "inactive" ? "danger" : lowered === "mixed" ? "warning" : "success";

                return <Badge status={badgeStatus} label={label} />;
            },
        },
    ];

    const actionSettings = [
        {
            label: "Create ATD Access Type",
            onClick: () => {
                createModal.onOpen();
            },
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (row: any) => {
                const target = row.items?.[0] ?? row;
                editModal.onOpen();
                setData({
                    id: target.id,
                    deduction_ids: row.deduction_ids || [],
                    role_id: target.role_id || (target.role && target.role.id) || "",
                    role: target.role,
                    status: target.status,
                });
            },
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Role",
                        path: "role.name",
                        columnType: COLUMNTYPES.string,
                    },
                    {
                        columnHead: "Deduction",
                        path: "deduction.description",
                        columnType: COLUMNTYPES.string,
                    },
                ]}
                filterHandler={filter}
                hasExport
                api={exportAllATDAccessTypes}
                exportFileName={`ATD-ACCESS-TYPES-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="role.name"
                callBack={() => {
                    paginator.setPage(1);
                }}
                withStatus
            />

            <Card>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons actions={actionSettings} />
                </div>
                <Table
                    dataSet={paginatedGroupedData.data}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={tablePaginator}
                    withActions
                    actions={tableActions}
                />
            </Card>

            <CreateATDAccessTypeForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />

            <EditATDAccessTypeForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default ATDAccessTypeTableCard;
