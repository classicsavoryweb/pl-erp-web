"use client";

import StockReplenishmentWorkspace from "../stock-replenishment/StockReplenishmentWorkspace";

const ReplenishmentRequestTableCard = () => (
    <StockReplenishmentWorkspace
        module="requests"
        performPermission="perform_uniform_replenishment_request"
        createPermission="perform_uniform_replenishment_request_create"
        exportPermission="perform_uniform_replenishment_request_export"
        cancelPermission="perform_uniform_replenishment_request_cancel"
        closePermission="perform_uniform_replenishment_request_close"
        replaceSupplierPermission="perform_uniform_replenishment_request_replace_supplier"
        reviewPermission="perform_uniform_replenishment_request_review"
        postPermission="perform_uniform_replenishment_request_post"
    />
);

export default ReplenishmentRequestTableCard;
