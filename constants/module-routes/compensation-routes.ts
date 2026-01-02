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

export const compensationRoutes: Route[] = [
    {
        name: "Compensation",
        icon: "PaymentsOutlined",
        type: "dropdown",
        permission: "view_compensation_module",
        basepath: "/compensation",
        subLinks: [
            {
                name: "Payroll List",
                pathname: "/compensation/payroll-list",
                permission: "view_compensation_payroll_list"
            },
            {
                name: "Cutoff Setup",
                pathname: "/compensation/cutoff-setup",
                permission: "view_compensation_cutoff_setup"
            },
            {
                name: "Additional Income",
                pathname: "/compensation/additional-income",
                permission: "view_compensation_additional_income",
            },
            {
                name: "Authority To Deduct",
                pathname: "/compensation/authority-to-deduct",
                permission: "view_compensation_atd",
            },
            {
                name: "Employee Deductions",
                pathname: "/compensation/employee-deductions",
                permission: "view_compensation_deductions",
            },
            {
                name: "Payroll",
                pathname: "/compensation/payroll",
                permission: "view_compensation_payroll",
            },
            {
                name: "Entries",
                pathname: "/compensation/entries",
                permission: "view_compensation_entries",
            },
            {
                name: "Converter",
                pathname: "/compensation/converter",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Details",
                        pathname: "/compensation/converter/details",
                        permission: "view_compensation_converter",
                    },
                    {
                        name: "Main",
                        pathname: "/compensation/converter/main",
                        permission: "view_compensation_converter",
                    },
                    {
                        name: "Payroll Prooflist",
                        pathname: "/compensation/converter/payroll-prooflist",
                        permission: "view_compensation_payroll_prooflist",
                    },
                ]
            },
            {
                name: "Last Pay",
                pathname: "/compensation/last-pay",
                permission: "view_compensation_last_pay",
            },
        ]
    }
];