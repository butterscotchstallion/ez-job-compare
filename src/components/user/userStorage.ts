import IUser from "./i-user.interface";

export function setUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function removeUser() {
    localStorage.removeItem('user');
}

export function getUser(): IUser | undefined {
    const item = localStorage.getItem('user');

    if (item) {
        return JSON.parse(item);
    }
}