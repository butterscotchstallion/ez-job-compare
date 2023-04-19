import axios from "axios";
import URLS from "../../utils/urls";

export default function getJobs() {
    return axios.get(URLS().jobsList);
};