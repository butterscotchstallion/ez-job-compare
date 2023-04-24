import axios from "axios";
import URLS from "../../utils/urls";

export default function getReviewsCountList() {
    return axios.get(URLS().reviewCountList);
}