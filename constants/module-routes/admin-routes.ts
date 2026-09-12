
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

export const adminRoutes: Route[] = [
    {
        name: "Administrators",
        icon: "AdminPanelSettingsOutlined",
        type: "dropdown",
        permission: "view_administrators_module",
        basepath: "/administrator",
        subLinks: [
            {
                name: "Users",
                pathname: "/administrators/users",
                permission: "view_users"
            },
            {
                name: "Roles and Permissions",
                pathname: "/administrators/roles-and-permissions",
                permission: "view_roles_and_permissions"
            },
            {
                name: "Tardiness Disabler",
                pathname: "/administrators/tardiness-disabler",
                permission: "view_tardiness_disabler"
            },
            {
                name: "Schedule Timekeeping",
                pathname: "/administrators/schedule-timekeeping",
                permission: "view_scheduled_timekeeping"
            },
            {
                name: "Activity Logs",
                pathname: "/administrators/activity-logs",
                permission: "view_activity_logs"
            },
            {
                name: "Database Backups",
                pathname: "/administrators/database-backups",
                permission: "view_database_backups"
            },
        ]
    },
];