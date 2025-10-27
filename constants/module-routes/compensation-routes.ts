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
                isDropDown: true,
                subLinks: [
                    {
                        name: "To Post",
                        pathname: "/compensation/entries/to-post",
                        permission: "view_compensation_entries",
                    },
                    {
                        name: "Posted",
                        pathname: "/compensation/entries/posted",
                        permission: "view_compensation_entries",
                    },
                ]
            },
            {
                name: "Converter",
                pathname: "/compensation/converter",
                permission: "view_compensation_converter",
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
                ]
            },
        ]
    }
];