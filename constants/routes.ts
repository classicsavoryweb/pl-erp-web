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

    //maintenance module
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
                permission: ""
            },
            {
                name: "Positions",
                pathname: "/maintenance/positions",
                permission: ""
            },
            {
                name: "Stations",
                pathname: "/maintenance/stations",
                permission: ""
            },
            {
                name: "Employee Status",
                pathname: "/maintenance/employee-status",
                permission: ""
            },
        ]
    },

    //administrator module
    {
        name: "Administrators",
        icon: "AdminPanelSettingsOutlined",
        type: "dropdown",
        permission: "can_view_administrators_module",
        basepath: "/administrator",
        subLinks: [
            {
                name: "Users",
                pathname: "/administrators/users",
                permission: "can_view_users"
            },
            {
                name: "Roles and Permissions",
                pathname: "/administrators/roles-and-permissions",
                permission: "can_view_roles_and_permissions"
            },
        ]
    },
];
