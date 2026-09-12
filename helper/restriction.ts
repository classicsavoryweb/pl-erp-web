import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

interface RestrictionInterface{
    permissions: string[];
    type: "BRANCH" | "EMPLOYEE";
    employeeNumber: string;
    branchId: string | number;
    module: "EMPLOYEES" | "TIME_KEEPING" | "PAYROLL";
};

const MODULE_PERMISSIONS = {
    EMPLOYEES: "by_pass_edit_restrictions_employees",
    TIME_KEEPING: "by_pass_edit_restrictions_time_keeping",
    PAYROLL: "by_pass_edit_restrictions_payroll"
};

export const canEditRestrictedRecords = (
    permissions: RestrictionInterface["permissions"],
    module: RestrictionInterface['module'],
    type: RestrictionInterface['type'],
    employeeNumber: RestrictionInterface['employeeNumber'],
    branchId: RestrictionInterface['branchId'],
): boolean => {
    const rawEmployeeDetails = Cookies.get('employeeDetails');
    const employeeDetails = JSON.parse(rawEmployeeDetails ?? "");

    if (permissions.includes(MODULE_PERMISSIONS[module])) {
        return true;
    }

    if (type === "EMPLOYEE") {
        if (employeeNumber == employeeDetails.employee_number) {
            toast.error("You are restricted from editing your own records");
            return false;
        }
    } else {
        if (Number(branchId) === Number(employeeDetails.branch_id)) {
            toast.error("You are restricted from editing your department's records");
            return false;
        }
    }

    return true;
};