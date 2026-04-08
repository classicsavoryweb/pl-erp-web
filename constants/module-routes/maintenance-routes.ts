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

export const maintenanceRoutes: Route[] = [
    {
        name: "Maintenance",
        icon: "EngineeringOutlined",
        type: "dropdown",
        permission: "view_maintenance_module",
        basepath: "/maintenance",
        subLinks: [
            {
                name: "Organization",
                pathname: "/maintenance/organization",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Branches",
                        pathname: "/maintenance/organization/branches",
                        permission: "view_branches"
                    },
                    {
                        name: "Regions",
                        pathname: "/maintenance/organization/regions",
                        permission: "view_region"
                    },
                    {
                        name: "Positions",
                        pathname: "/maintenance/organization/positions",
                        permission: "view_positions"
                    },
                    {
                        name: "Stations",
                        pathname: "/maintenance/organization/stations",
                        permission: "view_stations",
                    },
                    {
                        name: "Agencies",
                        pathname: "/maintenance/organization/agencies",
                        permission: "view_agencies"
                    },
                ]
            },
            {
                name: "Employee",
                pathname: "/maintenance/employee",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Employee Status",
                        pathname: "/maintenance/employee/employee-status",
                        permission: "view_employee_status"
                    },
                    {
                        name: "Offenses",
                        pathname: "/maintenance/employee/offenses",
                        permission: "view_offenses",
                    },
                    {
                        name: "Training Titles",
                        pathname: "/maintenance/employee/training-titles",
                        permission: "view_training_titles",
                    },
                    {
                        name: "Vaccine Brand",
                        pathname: "/maintenance/employee/vaccine-brand",
                        permission: "view_vaccine_brand",
                    },
                    {
                        name: "Diagnosis",
                        pathname: "/maintenance/employee/diagnosis",
                        permission: "view_diagnosis",
                    },
                    {
                        name: "Bank Account Types",
                        pathname: "/maintenance/employee/bank-account-types",
                        permission: "view_salary_positions"
                    },
                    {
                        name: "COE Reasons",
                        pathname: "/maintenance/employee/coe-reasons",
                        permission: "view_coe_reasons"
                    },
                    {
                        name: "Acting Capacity Reasons",
                        pathname: "/maintenance/employee/acting-capacity-reasons",
                        permission: "view_acting_capacity_reasons"
                    },
                ]
            },
            {
                name: "Sanctions",
                pathname: "/maintenance/sanctions",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Disciplinary",
                        pathname: "/maintenance/sanctions/disciplinary",
                        permission: "view_sanctions"
                    },
                    {
                        name: "Tardiness",
                        pathname: "/maintenance/sanctions/tardiness-sanctions",
                        permission: "view_tardiness_sanctions",
                        break: true
                    },
                ]
            },
            {
                name: "Salaries",
                pathname: "/maintenance/salaries",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Rate per Group",
                        pathname: "/maintenance/salaries/rate-per-group",
                        permission: "view_rate_per_group"
                    },
                    {
                        name: "Salary Positions",
                        pathname: "/maintenance/salaries/salary-positions",
                        permission: "view_salary_positions"
                    },
                ]
            },
            {
                name: "Timekeeping",
                pathname: "/maintenance/timekeeping",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Schedule Type",
                        pathname: "/maintenance/timekeeping/schedule-type",
                        permission: "view_schedule_type"
                    },
                    {
                        name: "Adjustment Types",
                        pathname: "/maintenance/timekeeping/adjustment-types",
                        permission: "view_adjustment_types"
                    },
                    {
                        name: "Schedule Masterlist",
                        pathname: "/maintenance/timekeeping/schedule-masterlist",
                        permission: "view_schedule_masterlist"
                    },
                    {
                        name: "Holidays",
                        pathname: "/maintenance/timekeeping/holidays",
                        permission: "view_holidays",
                    },
                ]
            },
            {
                name: "Statutories",
                pathname: "/maintenance/statutories",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Philhealth",
                        pathname: "/maintenance/statutories/philhealth",
                        permission: "view_philhealth",
                    },
                    {
                        name: "SSS",
                        pathname: "/maintenance/statutories/sss",
                        permission: "view_sss",
                    },
                    {
                        name: "Pagibig",
                        pathname: "/maintenance/statutories/pagibig",
                        permission: "view_pagibig",
                    },
                ]
            },
            {
                name: "Tax",
                pathname: "/maintenance/tax",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Monthly Table",
                        pathname: "/maintenance/tax/monthly-tax-table",
                        permission: "view_tax",
                    },
                    {
                        name: "Annual Table",
                        pathname: "/maintenance/tax/annual-tax-table",
                        permission: "view_tax",
                    },
                ]
            },
            {
                name: "Incentives",
                pathname: "/maintenance/incentives",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Management",
                        pathname: "/maintenance/incentives/incentives-management",
                        permission: "view_incentives_management",
                    },
                    {
                        name: "Rank and File",
                        pathname: "/maintenance/incentives/incentives-bracket",
                        permission: "view_incentives_bracket",
                    },
                    {
                        name: "Per Employee",
                        pathname: "/maintenance/incentives/incentives-per-employee",
                        permission: "view_incentives_per_employee",
                    },
                    {
                        name: "Positions",
                        pathname: "/maintenance/incentives/incentives-position",
                        permission: "view_incentives_position"
                    }
                ]
            },
            {
                name: "Payroll",
                pathname: "/maintenance/payroll",
                permission: "",
                isDropDown: true,
                subLinks: [
                    {
                        name: "Terms",
                        pathname: "/maintenance/payroll/terms",
                        permission: "view_terms",
                    },
                    {
                        name: "Last Pay Setup",
                        pathname: "/maintenance/payroll/last-pay-setup",
                        permission: "view_last_pay_setup",
                    },
                    {
                        name: "Contributions and Tax",
                        pathname: "/maintenance/payroll/contributions-and-tax",
                        permission: "view_contributions_and_tax",
                    },
                    {
                        name: "Deductions",
                        pathname: "/maintenance/payroll/deductions",
                        permission: "view_deductions",
                    },
                    {
                        name: "Additional Income",
                        pathname: "/maintenance/payroll/additional-income",
                        permission: "view_additional_income",
                    },
                    {
                        name: "Period Definition",
                        pathname: "/maintenance/payroll/period-definition",
                        permission: "view_period_definition",
                    },
                    {
                        name: "CSHub Transaction Type",
                        pathname: "/maintenance/payroll/cshub-transaction-type",
                        permission: "view_cshub_transaction_type",
                    },
                    {
                        name: "ATD Access Type",
                        pathname: "/maintenance/payroll/atd-access-type",
                        permission: "view_atd_access_type",
                    },
                ]
            },
        ]
    }
];
