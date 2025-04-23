interface SubLink {
    name: string;
    pathname: string;
    permission: string;
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

export const routes: Route[] = [
    {
        pathname: "/",
        name: "Dashboard",
        icon: "DashboardOutlined",
        type: "link",
        permission: ""
    },
    {
        name: "Administrators",
        icon: "AdminPanelSettingsOutlined",
        type: "dropdown",
        permission: "can_view_administrators_module",
        basepath: "/administrator",
        subLinks: [
            {
                name: "Roles and Permissions",
                pathname: "/administrators/roles-and-permissions",
                permission: "can_view_roles_and_permissions"
            }
        ]
    },
    {
        name: "Maintenance",
        icon: "EngineeringOutlined",
        type: "dropdown",
        permission: "can_view_administrators_module",
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
            }
        ]
    },
    {
        name: "Employees",
        icon: "EngineeringOutlined",
        type: "dropdown",
        permission: "can_view_employees_module",
        basepath: "/maintenance",
        subLinks: [
            {
                name: "Employee Tracking",
                pathname: "/",
                permission: "can_view_branches"
            },
            {
                name: "Positions",
                pathname: "/",
                permission: "can_view_positions"
            }
        ]
    },
];
