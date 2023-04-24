import axios from "axios";
import URLS from "../../utils/urls";

export default function getReviewsByEmployerSlug(slug: string) {
    return axios.get(URLS().reviewsAPI(slug));
};