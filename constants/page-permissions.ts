import { adminRoutes } from "./module-routes/admin-routes";
import { hrRoutes } from "./module-routes/hr-routes";
import { transactionRoutes } from "./module-routes/transaction-routes";
import { uniformRoutes } from "./module-routes/uniform-routes";

const HR_ROUTES = hrRoutes.flatMap(route =>
    route.type === "dropdown" ? route.subLinks : []
);

const ADMIN_ROUTES = adminRoutes.flatMap(route =>
    route.type === "dropdown" ? route.subLinks : []
);

const TRANSACTION_ROUTES = transactionRoutes.flatMap(route =>
    route.type === "dropdown" ? route.subLinks : []
);

const UNIFORM_ROUTES = uniformRoutes.flatMap(route =>
    route.type === "dropdown" ? route.subLinks : []
);

export const PAGE_PERMISSION = [
    ...HR_ROUTES,
    ...ADMIN_ROUTES,
    ...TRANSACTION_ROUTES,
    ...UNIFORM_ROUTES,
    //DYNAMIC ROUTES
    {
        name: "Employee",
        pathname: "/employees/[employee-number]",
        permission: "view_employee_tracking"
    },
    {
        name: "Employee Edit",
        pathname: "/employees/edit/[employee-number]",
        permission: "perform_employee_tracking"
    },
    {
        name: "Compensation",
        pathname: "/compensation/payroll/[payroll-id]",
        permission: "view_compensation_payroll"
    },
];
