import axios from "axios";
import URLS from "../../utils/urls";

export default function getReviewsCountList(userId?: number) {
    return axios.get(URLS().reviewCountList(userId));
}