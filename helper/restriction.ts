import Cookies from 'js-cookie';

interface RestrictionInterface{
    permissions: string[];
    type: "BRANCH" | "EMPLOYEE";
    employeeNumber: string;
    branchId: string | number;
};

export const canEditRestrictedRecords = (
    permissions: RestrictionInterface["permissions"],
    type: RestrictionInterface['type'],
    employeeNumber: RestrictionInterface['employeeNumber'],
    branchId: RestrictionInterface['branchId']
): boolean => {
    const rawEmployeeDetails = Cookies.get('employeeDetails');
    const employeeDetails = JSON.parse(rawEmployeeDetails ?? "");

    if (permissions.includes("by_pass_edit_restrictions")) {
        return true;
    }

    if (type === "EMPLOYEE") {
        if (employeeNumber == employeeDetails.employee_number) {
            return false;
        }
    } else {
        if (Number(branchId) === Number(employeeDetails.branch_id)) {
            return false;
        }
    }

    return true;
};