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

export const compensationRoutes: Route[] = [
    {
        name: "Compensation",
        icon: "PaymentsOutlined",
        type: "dropdown",
        permission: "view_compensation_module",
        basepath: "/compensation",
        subLinks: [
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
        ]
    }
];