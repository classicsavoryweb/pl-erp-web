import { adminRoutes } from "./admin-routes";
import { hrRoutes } from "./hr-routes";

const HR_ROUTES = hrRoutes.flatMap(route =>
    route.type === "dropdown" ? route.subLinks : []
);

const ADMIN_ROUTES = adminRoutes.flatMap(route =>
    route.type === "dropdown" ? route.subLinks : []
);

export const PAGE_PERMISSION = [
    ...HR_ROUTES,
    ...ADMIN_ROUTES,
    //DYNAMIC ROUTES
    {
        name: "Employee",
        pathname: "/employees/[employee-number]",
        permission: "can_view_employee_tracking"
    },
    {
        name: "Employee Edit",
        pathname: "/employees/edit/[employee-number]",
        permission: "can_perform_employee_tracking"
    },
];