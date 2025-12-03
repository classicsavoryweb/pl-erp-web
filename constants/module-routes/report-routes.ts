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

export const reportRoutes: Route[] = [
    {
        name: "Reports",
        icon: "InsertChartOutlined",
        type: "dropdown",
        permission: "view_reports_module",
        basepath: "/reports",
        subLinks: [
            {
                name: "Statutories",
                pathname: "/reports/statutories",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Pag-ibig",
                        pathname: "/reports/statutories/pagibig",
                        permission: "view_reports_pagibig"
                    },
                    {
                        name: "SSS",
                        pathname: "/reports/statutories/sss",
                        permission: "view_reports_sss"
                    },
                    {
                        name: "Philhealth",
                        pathname: "/reports/statutories/philhealth",
                        permission: "view_reports_philhealth"
                    },
                ]
            },
            {
                name: "BDO Cash Card",
                pathname: "/reports/bdo-cash-card",
                permission: "view_reports_bdo_cash_card",
            },
            {
                name: "13th Month Pay",
                pathname: "/reports/13th-month-pay",
                permission: "view_reports_13th_month_pay",
            },
            {
                name: "Pay Slip",
                pathname: "/reports/pay-slip",
                permission: "view_reports_pay_slip",
            }
        ]
    }
];