import axios from "axios";
import URLS from "../../utils/urls";

export default function addReview(employerId: number | null, body: string) {
    const data = {
        employerId: employerId,
        body: body
    };
    return axios.post(
        URLS().addReviewAPI,
        data
    );
};