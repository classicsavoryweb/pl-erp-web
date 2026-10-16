"use client";

import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import usePagination from "@/hooks/pagination";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/modal";
import { useState } from "react";
import Badge from "@/components/common/Badge";
import { exportAllOffenses, getAllOffenses } from "@/api/offenses";
import CreateOffenseForm from "./CreateOffenseForm";
import EditOffenseForm from "./EditOffenseForm";
import FilterCard from "../../cards/FilterCard";
import { useFilter } from "@/hooks/use-filter";
import moment from "moment";
import DropDownButtons from "@/components/common/DropDownButtons";

const OffensesTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const [data, setData] = useState({});
    const paginator = usePagination();
    const filter = useFilter();

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllOffenses({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters
        })
        .then((resp) => {
            if (resp.error) {
                toast.error("Error fetching offenses");
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
            columnHead: "Category",
            path: "category",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Sub Category",
            path: "subcategory",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Description",
            path: "description",
            columnType: COLUMNTYPES.string
        },
        {
            columnHead: "Status",
            path: "status",
            columnType: COLUMNTYPES.status,
        }
    ];

    const actionSettings = [
        {
            label: "Create new offense",
            onClick: () => {
                createModal.onOpen();
            }
        },
    ];

    const tableActions = [
        {
            label: "Edit",
            onClick: (data: any) => {
                editModal.onOpen();
                setData({
                    id: data.id,
                    category: data.category,
                    subcategory: data.subcategory,
                    description: data.description,
                    status: data.status
                });
            }
        },
    ];

    return (
        <>
            <FilterCard
                columnSettings={[
                    {
                        columnHead: "Category",
                        path: "category",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Sub Category",
                        path: "subcategory",
                        columnType: COLUMNTYPES.string
                    },
                    {
                        columnHead: "Description",
                        path: "description",
                        columnType: COLUMNTYPES.string
                    },
                ]}
                filterHandler={filter}
                withStatus
                hasExport
                api={exportAllOffenses}
                exportFileName={`OFFENSES-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="description"
                callBack={() => {
                    paginator.setPage(1);
                }}
            />
            <Card>
                <p className="text-blue-950 dark:text-red-500 font-semibold">Offenses</p>
                <div className="flex justify-end gap-x-3">
                    <DropDownButtons
                        actions={actionSettings}
                    />
                </div>
                <Table
                    dataSet={api.dataSet}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                    withActions
                    actions={tableActions}
                />
            </Card>
            <CreateOffenseForm
                modal={createModal}
                onSubmitCallback={api.triggerReload}
            />
            <EditOffenseForm
                modal={editModal}
                onSubmitCallback={api.triggerReload}
                formValue={data}
            />
        </>
    );
};

export default OffensesTableCard;