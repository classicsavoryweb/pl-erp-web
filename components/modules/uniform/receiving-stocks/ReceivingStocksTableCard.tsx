"use client";

import StockReplenishmentWorkspace from "../stock-replenishment/StockReplenishmentWorkspace";

const ReceivingStocksTableCard = () => (
    <StockReplenishmentWorkspace
        module="receiving"
        performPermission="perform_uniform_receiving_stocks"
        reviewPermission="perform_uniform_receiving_stocks_review"
        postPermission="perform_uniform_receiving_stocks_post"
    />
);

export default ReceivingStocksTableCard;
