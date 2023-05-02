import IUser from "./i-user.interface";

export function setUser(user: IUser) {
    sessionStorage.setItem('user', JSON.stringify(user));
};

export function removeUser() {
    sessionStorage.removeItem('user');
};

export function getUser(): IUser | undefined {
    const item = sessionStorage.getItem('user');

    if (item) {
        return JSON.parse(item);
    }
};

export function destroySession() {
    removeUser();
    removeToken();
};

export function setToken(token: string) {
    sessionStorage.setItem('token', token);
};

export function removeToken() {
    sessionStorage.removeItem('token');
};

export function getToken() {
    return sessionStorage.getItem('token');
};