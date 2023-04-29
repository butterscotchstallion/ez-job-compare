import axios from "axios";
import URLS from "../../utils/urls";

export default function getKarma(guid: string) {
    return axios.get(URLS().karmaAPI(guid));
};