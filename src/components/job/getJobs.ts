import axios from "axios";
import URLS from "../../utils/urls";

export default function getJobs(props?: any) {
    const url = URLS().jobsList(props);
    return axios.get(url);
};