import { IRole } from "../../views/user/i-role.interface";
import { UserRoles } from "./userRoles.enum";
import { getUser } from "./userStorage";

function hasRole(roleName: string) {
    const roles: IRole[] = getUserRoles();
    for (let r of roles) {
        if (r.name === roleName) {
            return true;
        }
    }
}

export function canPostJobs() {
    return hasRole(UserRoles.RECRUITER);
};

export function canPostReviews() {
    return hasRole(UserRoles.REVIEWER);
};

export default function getUserRoles(): IRole[] {
    let roles: IRole[] = [];
    const user = getUser();
    if (user) {
        return user.roles;
    }
    return roles;
};