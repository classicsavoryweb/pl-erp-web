"use client";

import StockReplenishmentWorkspace from "../stock-replenishment/StockReplenishmentWorkspace";

const ReplenishmentRequestTableCard = () => (
    <StockReplenishmentWorkspace
        module="requests"
        performPermission="perform_uniform_replenishment_request"
    />
);

export default ReplenishmentRequestTableCard;
