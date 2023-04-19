import axios from "axios";
import URLS from "../../utils/urls";

export default function getTagsEmployersList() {
    return axios.get(URLS().tagsJobs);
};