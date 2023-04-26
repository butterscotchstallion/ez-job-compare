import { UserRoles } from "./userRoles.enum";
import { getUser } from "./userStorage";

export function canPostJobs() {
    const roles = getUserRoles();
    return roles.indexOf(UserRoles.RECRUITER) !== -1;
};

export function canPostReviews() {
    const roles = getUserRoles();
    return roles.indexOf(UserRoles.REVIEWER) !== -1;
};

export default function getUserRoles(): string[] {
    let roles: string[] = [];
    const user = getUser();

    if (user) {
        return user.roles;
    }

    return roles;
};