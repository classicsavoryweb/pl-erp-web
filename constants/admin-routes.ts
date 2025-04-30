
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

export const adminRoutes: Route[] = [
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
            {
                name: "Activity Logs",
                pathname: "/administrators/activity-logs",
                permission: "can_view_activity_logs"
            },
        ]
    },
];