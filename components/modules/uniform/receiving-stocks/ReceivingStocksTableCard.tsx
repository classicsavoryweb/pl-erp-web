"use client";

import StockReplenishmentWorkspace from "../stock-replenishment/StockReplenishmentWorkspace";

const ReceivingStocksTableCard = () => (
    <StockReplenishmentWorkspace
        module="receiving"
        performPermission="perform_uniform_receiving_stocks"
    />
);

export default ReceivingStocksTableCard;
