import axios from "axios";
import URLS from "../../utils/urls";

export function getTopKarmaUser() {
    return axios.get(URLS().topKarmaAPI);
};

export default function getKarma(guid: string) {
    return axios.get(URLS().karmaAPI(guid));
};