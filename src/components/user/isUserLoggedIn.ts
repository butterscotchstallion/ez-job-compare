import axios, { AxiosResponse } from "axios";
import URLS from "../../utils/urls";
import { getToken } from "./token";

function isSessionActive() {
    return axios.get(URLS().isSessionActive);
}

export default function isLoggedIn(): Promise<string | boolean | AxiosResponse> {
    const token = getToken();
    if (token) {
        return isSessionActive();
    } else {
        return new Promise<boolean>((resolve) => {
            resolve(false);
        });
    }
}