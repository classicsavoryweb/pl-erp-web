interface SubLink {
    name: string;
    pathname: string;
    permission: string;
    break?: boolean;
}

interface BaseRoute {
    name: string;
    icon: string;
    type: "link" | "dropdown";
    permission: string;
}

interface LinkRoute extends BaseRoute {
    type: "link";
    pathname: string;
}

export interface DropdownRoute extends BaseRoute {
    basepath: string;
    type: "dropdown";
    subLinks: SubLink[];
}

export type Route = LinkRoute | DropdownRoute;

export const transactionRoutes: Route[] = [
    {
        name: "Transactions",
        icon: "ArticleOutlined",
        type: "dropdown",
        permission: "view_transactions_module",
        basepath: "/transactions",
        subLinks: [
            {
                name: "Schedule Time",
                pathname: "/transactions/schedule-time",
                permission: "view_transactions_schedule_time"
            },
            {
                name: "Actual Time",
                pathname: "/transactions/actual-time",
                permission: "view_transactions_actual_time"
            },
        ]
    }
];