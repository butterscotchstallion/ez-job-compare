import axios from "axios";
import URLS from "../../utils/urls";

export default function getJobs(props?: any) {
    const searchQuery = props && props.searchQuery ? props.searchQuery : '';
    const url = URLS().jobsList(searchQuery);
    return axios.get(url);
};