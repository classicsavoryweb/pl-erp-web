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

export const maintenanceRoutes: Route[] = [
    {
        name: "Maintenance",
        icon: "EngineeringOutlined",
        type: "dropdown",
        permission: "view_maintenance_module",
        basepath: "/maintenance",
        subLinks: [
            {
                name: "Branches",
                pathname: "/maintenance/branches",
                permission: "view_branches"
            },
            {
                name: "Positions",
                pathname: "/maintenance/positions",
                permission: "view_positions"
            },
            {
                name: "Stations",
                pathname: "/maintenance/stations",
                permission: "view_stations",
                break: true
            },
            {
                name: "Employee Status",
                pathname: "/maintenance/employee-status",
                permission: "view_employee_status"
            },
            {
                name: "Agencies",
                pathname: "/maintenance/agencies",
                permission: "view_agencies"
            },
            {
                name: "Offenses",
                pathname: "/maintenance/offenses",
                permission: "view_offenses",
                break: true
            },
            {
                name: "Training Titles",
                pathname: "/maintenance/training-titles",
                permission: "view_training_titles",
            },
            {
                name: "Vaccine Brand",
                pathname: "/maintenance/vaccine-brand",
                permission: "view_vaccine_brand",
            },
            {
                name: "Diagnosis",
                pathname: "/maintenance/diagnosis",
                permission: "view_diagnosis",
                break: true
            },
            {
                name: "Rate per Group",
                pathname: "/maintenance/rate-per-group",
                permission: "view_rate_per_group"
            },
            {
                name: "Salary Positions",
                pathname: "/maintenance/salary-positions",
                permission: "view_salary_positions"
            },
            {
                name: "Bank Account Types",
                pathname: "/maintenance/bank-account-types",
                permission: "view_salary_positions"
            },
            {
                name: "COE Reasons",
                pathname: "/maintenance/coe-reasons",
                permission: "view_coe_reasons"
            },
            {
                name: "Acting Capacity Reasons",
                pathname: "/maintenance/acting-capacity-reasons",
                permission: "view_acting_capacity_reasons"
            },
            {
                name: "Sanctions",
                pathname: "/maintenance/sanctions",
                permission: "view_sanctions"
            },
            {
                name: "Schedule Type",
                pathname: "/maintenance/schedule-type",
                permission: "view_schedule_type"
            },
            {
                name: "Schedule Masterlist",
                pathname: "/maintenance/schedule-masterlist",
                permission: "view_schedule_masterlist"
            },
            {
                name: "Holidays",
                pathname: "/maintenance/holidays",
                permission: "view_holidays",
                break: true
            },
            {
                name: "Philhealth",
                pathname: "/maintenance/philhealth",
                permission: "view_philhealth",
            },
            {
                name: "SSS",
                pathname: "/maintenance/sss",
                permission: "view_sss",
            },
            {
                name: "Pagibig",
                pathname: "/maintenance/pagibig",
                permission: "view_pagibig",
            },
            {
                name: "Tax",
                pathname: "/maintenance/tax",
                permission: "view_tax",
            },
            {
                name: "Deductions",
                pathname: "/maintenance/deductions",
                permission: "view_deductions",
            },
            {
                name: "Additional Income",
                pathname: "/maintenance/additional-income",
                permission: "view_additional_income",
            },
            {
                name: "Period Definition",
                pathname: "/maintenance/period-definition",
                permission: "view_period_definition",
            },
        ]
    }
];