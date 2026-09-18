"use client";

import { exportAllUniformItems, getAllUniformItems } from "@/api/uniform/item-masterlist";
import ActionDropDown from "@/components/common/ActionDropDown";
import Card from "@/components/common/Card";
import DropDownButtons from "@/components/common/DropDownButtons";
import Table from "@/components/common/Table";
import FilterCard from "@/components/modules/cards/FilterCard";
import { COLUMNTYPES } from "@/constants/column";
import { useApiCall } from "@/hooks/api-call";
import { useAsyncEffect } from "@/hooks/async-effect";
import { useFilter } from "@/hooks/use-filter";
import { useModal } from "@/hooks/modal";
import usePagination from "@/hooks/pagination";
import moment from "moment";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import UniformItemForm from "./UniformItemForm";
import { AuthContext } from "@/context/AuthProvider";

const UniformItemMasterlistTableCard = () => {
    const api = useApiCall();
    const createModal = useModal();
    const editModal = useModal();
    const viewModal = useModal();
    const paginator = usePagination(100);
    const filter = useFilter();
    const [data, setData] = useState<any>({});
    const { permissions } = useContext(AuthContext);
    const canCreate = permissions.includes("perform_uniform_item_masterlist_create");
    const canEdit = permissions.includes("perform_uniform_item_masterlist_edit");
    const canExport = permissions.includes("perform_uniform_item_masterlist_export");

    useAsyncEffect(() => {
        api.setLoading(true);
        getAllUniformItems({
            page: paginator.page,
            per_page: paginator.per_page,
            ...filter.filters,
        })
            .then((resp) => {
                if (resp.error) {
                    toast.error("Error fetching uniform items");
                } else {
                    api.setDataSet(resp.data.data);
                    paginator.setPage(resp.data.current_page);
                    paginator.setPaginationData(resp.data);
                }
            })
            .catch(() => toast.error("Error encountered"))
            .finally(() => api.setLoading(false));
    }, [paginator.reload, api.reload, filter.reload]);

    const tableActions = (item: any) => [
        {
            label: "View",
            onClick: () => {
                setData(item);
                viewModal.onOpen();
            },
        },
        ...(canEdit
            ? [{
                label: "Edit",
                onClick: () => {
                    setData(item);
                    editModal.onOpen();
                },
            }]
            : []),
    ];

    const columnSettings = [
        { columnHead: "#", path: "row_number", columnType: COLUMNTYPES.string },
        { columnHead: "Item Code", path: "item_no", columnType: COLUMNTYPES.string },
        { columnHead: "Description", path: "description", columnType: COLUMNTYPES.string },
        { columnHead: "Size", path: "size.description", columnType: COLUMNTYPES.string },
        { columnHead: "Gender", path: "gender.description", columnType: COLUMNTYPES.string },
        { columnHead: "Standard Price", path: "standard_unit_price", columnType: COLUMNTYPES.amount },
        { columnHead: "Stock on Hand", path: "stock_on_hand", columnType: COLUMNTYPES.amount },
        { columnHead: "Status", path: "status", columnType: COLUMNTYPES.status },
        {
            columnHead: "Free Uniform",
            path: "free_uniform",
            columnType: COLUMNTYPES.function,
            function: (item: any) => item.free_uniform ? "Yes" : "No",
        },
        {
            columnHead: "Made to Order",
            path: "made_to_order",
            columnType: COLUMNTYPES.function,
            function: (item: any) => item.made_to_order ? "Yes" : "No",
        },
        {
            columnHead: "Action",
            path: "id",
            columnType: COLUMNTYPES.function,
            function: (item: any) => <ActionDropDown data={item} actions={tableActions(item)} />,
        },
    ];

    const dataSetWithIndex = (api.dataSet ?? []).map((item: any, index: number) => ({
        ...item,
        row_number: (paginator.paginationData?.from ?? 1) + index,
    }));

    return (
        <>
            <FilterCard
                columnSettings={[
                    { columnHead: "Item Code", path: "item_no", columnType: COLUMNTYPES.string },
                    { columnHead: "Description", path: "description", columnType: COLUMNTYPES.string },
                ]}
                filterHandler={filter}
                hasExport
                exportPermission="perform_uniform_item_masterlist_export"
                api={exportAllUniformItems}
                exportFileName={`UNIFORM-ITEM-MASTERLIST-${moment().format("YYYY-MM-DD")}.xls`}
                defaultColumnSelected="description"
                callBack={() => paginator.setPage(1)}
                withStatus
                statusOption={[
                    {
                        label: "Active",
                        value: "active"
                    },
                    {
                        label: "Inactive",
                        value: "inactive"
                    },
                  
                ]}
                isExpanded
            />
            <Card>
                {canCreate && (
                    <div className="flex justify-end gap-x-3">
                        <DropDownButtons
                            actions={[
                                {
                                    label: "Create uniform item",
                                    onClick: createModal.onOpen,
                                },
                            ]}
                        />
                    </div>
                )}
                <Table
                    dataSet={dataSetWithIndex}
                    columnSettings={columnSettings}
                    loading={api.loading}
                    paginator={paginator}
                />
            </Card>

            <UniformItemForm
                modal={createModal}
                mode="create"
                onSubmitCallback={api.triggerReload}
            />
            <UniformItemForm
                modal={editModal}
                mode="edit"
                formValue={data}
                onSubmitCallback={api.triggerReload}
            />
            <UniformItemForm
                modal={viewModal}
                mode="view"
                formValue={data}
                onSubmitCallback={api.triggerReload}
            />
        </>
    );
};

export default UniformItemMasterlistTableCard;
