import axios from "axios";
import URLS from "../../utils/urls";

export default function login(username: string, password: string) {
    return axios.post(URLS().login, {
        username: username,
        password: password
    });
}