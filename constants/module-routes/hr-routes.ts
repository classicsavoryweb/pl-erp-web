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

export const hrRoutes: Route[] = [
    {
        name: "Employees",
        icon: "PeopleAltOutlined",
        type: "dropdown",
        permission: "view_employees_module",
        basepath: "/employees",
        subLinks: [
            {
                name: "Employee Tracking",
                pathname: "/employees/employee-tracking",
                permission: "view_employee_tracking"
            },
            {
                name: "Add Employee",
                pathname: "/employees/add-employee",
                permission: "perform_employee_tracking"
            },
            {
                name: "Acting Capacity",
                pathname: "/employees/acting-capacity",
                permission: "view_acting_capacity"
            },
        ]
    },
    {
        name: "All Records",
        icon: "FolderCopyOutlined",
        type: "dropdown",
        permission: "view_all_records_module",
        basepath: "/all-records",
        subLinks: [
            {
                name: "Employment Status Report",
                pathname: "/all-records/employment-status",
                permission: "view_all_records_employment_status",
            },
            {
                name: "Tardiness",
                pathname: "/all-records/tardiness",
                permission: "view_all_records_tardiness",
            },
            {
                name: "COE Requests",
                pathname: "/all-records/coe-requests",
                permission: "view_all_records_coe_requests",
            },
            {
                name: "Employee Offenses",
                pathname: "/all-records/employee-offenses",
                permission: "view_all_records_offenses"
            },
            {
                name: "Vaccination",
                pathname: "/all-records/vaccination",
                permission: "view_all_records_vaccination"
            },
            // {
            //     name: "Health and Safety",
            //     pathname: "/all-records/health-and-safety",
            //     permission: "view_reports_health_and_safety"
            // },
        ]
    },
];