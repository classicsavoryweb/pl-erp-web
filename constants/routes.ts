import { adminRoutes } from "./admin-routes";
import { hrRoutes } from "./hr-routes";

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

export const routes: Route[] = [
    {
        pathname: "/",
        name: "Dashboard",
        icon: "DashboardOutlined",
        type: "link",
        permission: ""
    },
    ...hrRoutes,
    ...adminRoutes
];
