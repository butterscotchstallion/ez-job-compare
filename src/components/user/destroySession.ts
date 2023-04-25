import { removeToken } from "./token";
import { removeUser } from "./userStorage";

export default function destroySession() {
    removeUser();
    removeToken();
};