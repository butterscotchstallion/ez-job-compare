import axios from "axios";
import URLS from "../../utils/urls";

export default function getJobCount() {
    return axios.get(URLS().jobCount);
};