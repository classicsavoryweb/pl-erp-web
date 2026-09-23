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
                name: "Pay Slip",
                pathname: "/reports/pay-slip",
                permission: "view_reports_pay_slip",
            },
            {
                name: "Employees",
                pathname: "/reports/employees",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "BDO Cash Card",
                        pathname: "/reports/employees/bdo-cash-card",
                        permission: "view_reports_bdo_cash_card",
                    },
                    {
                        name: "Bank Account History",
                        pathname: "/reports/employees/bank-account-history",
                        permission: "perform_reports_bank_account_history"
                    }
                ]
            },
            {
                name: "Timekeeping",
                pathname: "/reports/timekeeping",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Summary List",
                        pathname: "/reports/timekeeping/summary-list",
                        permission: "view_reports_timekeeping_summary_report"
                    },
                    {
                        name: "Prooflist",
                        pathname: "/reports/timekeeping/proof-list",
                        permission: "view_reports_timekeeping_summary_report"
                    }
                ]
            },
            {
                name: "Payroll",
                pathname: "/reports/payroll",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Statutory",
                        pathname: "/reports/payroll/statutory",
                        permission: ""
                    },
                    {
                        name: "Deductions",
                        pathname: "/reports/payroll/deductions",
                        permission: "view_reports_deductions"
                    },
                    {
                        name: "13th Month Pay",
                        pathname: "/reports/payroll/13th-month-pay",
                        permission: "view_reports_13th_month_pay",
                    },
                    {
                        name: "BIR 1601-C",
                        pathname: "/reports/payroll/bir-1601c",
                        permission: "view_reports_bir_1601c",
                    },
                    {
                        name: "BIR 2316",
                        pathname: "/reports/payroll/bir-2316",
                        permission: "view_reports_bir_2316",
                    },
                ]
            },
        ]
    }
];
