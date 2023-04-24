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
    const falsePromise = new Promise((resolve) => {
        resolve(false);
    });

    if (token) {
        isSessionActive(token).then((response: any) => {
            return new Promise((resolve) => {
                resolve(response.data.results[0].active);
            });
        }, () => {
            return falsePromise;
        });
    } else {
        return falsePromise;
    }    
}