interface SubLink {
    name: string;
    pathname: string;
    permission: string;
    break?: boolean;
    isDropDown?: boolean;
    subLinks?: SubLink[];
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

export const pettyCashRoutes: Route[] = [
    {
        name: "Petty Cash",
        icon: "AccountBalanceWalletOutlined",
        type: "dropdown",
        permission: "is_petty_cash_custodian",
        basepath: "/petty-cash",
        subLinks: [
            {
                name: "Department Fund",
                pathname: "/petty-cash/department-fund",
                permission: "is_petty_cash_custodian",
            },
            {
                name: "Cash Issuance",
                pathname: "/petty-cash/cash-issuance",
                permission: "is_petty_cash_custodian",
            },
            {
                name: "Replenishment",
                pathname: "/petty-cash/replenishment",
                permission: "is_petty_cash_custodian",
            },
            {
                name: "For Audit",
                pathname: "/petty-cash/for-audit",
                permission: "view_pettycash_audit_module",
            },
        ],
    },
];
