import { UserRoles } from "./userRoles.enum";
import { getUser } from "./userStorage";

export function canPostJobs(roles: string[]) {
    return roles.indexOf(UserRoles.RECRUITER) !== -1;
};

export function canPostReviews(roles: string[]) {
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