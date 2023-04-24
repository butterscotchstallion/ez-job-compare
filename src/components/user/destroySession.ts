import { removeToken } from "./token";
import { removeUser, setUser } from "./userStorage";

export default function destroySession() {
    removeUser();
    removeToken();
};