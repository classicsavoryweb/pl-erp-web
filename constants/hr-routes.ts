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

export const hrRoutes: Route[] = [
    {
        name: "Maintenance",
        icon: "EngineeringOutlined",
        type: "dropdown",
        permission: "can_view_maintenance_module",
        basepath: "/maintenance",
        subLinks: [
            {
                name: "Branches",
                pathname: "/maintenance/branches",
                permission: "can_view_branches"
            },
            {
                name: "Positions",
                pathname: "/maintenance/positions",
                permission: "can_view_positions"
            },
            {
                name: "Stations",
                pathname: "/maintenance/stations",
                permission: "can_view_stations",
                break: true
            },
            {
                name: "Employee Status",
                pathname: "/maintenance/employee-status",
                permission: "can_view_employee_status"
            },
            {
                name: "Agencies",
                pathname: "/maintenance/agencies",
                permission: "can_view_agencies"
            },
            {
                name: "Offenses",
                pathname: "/maintenance/offenses",
                permission: "can_view_offenses",
                break: true
            },
            {
                name: "Training Titles",
                pathname: "/maintenance/training-titles",
                permission: "can_view_training_titles",
                break: true
            },
            {
                name: "Diagnosis",
                pathname: "/maintenance/diagnosis",
                permission: "can_view_diagnosis",
                break: true
            },
            {
                name: "Rate per Group",
                pathname: "/maintenance/rate-per-group",
                permission: "can_view_rate_per_group"
            },
            {
                name: "Salary Positions",
                pathname: "/maintenance/salary-positions",
                permission: "can_view_salary_positions"
            },
            {
                name: "Bank Account Types",
                pathname: "/maintenance/bank-account-types",
                permission: "can_view_salary_positions"
            },
        ]
    },
    {
        name: "Employees",
        icon: "PeopleAltOutlined",
        type: "dropdown",
        permission: "can_view_employees_module",
        basepath: "/employees",
        subLinks: [
            {
                name: "Employee Tracking",
                pathname: "/employees/employee-tracking",
                permission: "can_view_employee_tracking"
            },
            {
                name: "Add Employee",
                pathname: "/employees/add-employee",
                permission: ""
            },
        ]
    },
];