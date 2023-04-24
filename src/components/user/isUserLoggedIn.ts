import axios from "axios";
import URLS from "../../utils/urls";
import { getToken } from "./token";

function isSessionActive(token: string) {
    return axios.get(URLS().isSessionActive, {
        headers: {
            "x-ezjobcompare-session-token": token
        }
    });
}

export default function isLoggedIn() {
    const token = getToken();
    
    if (token) {
        return isSessionActive(token);
    } else {
        return new Promise<boolean>((resolve) => {
            resolve(false);
        });
    }
}