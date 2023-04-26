import axios from "axios";
import URLS from "../../utils/urls";
import { getToken } from "../user/token";

export default function addReview(employerId: number | null, body: string) {
    const token = getToken();
    const data = {
        employerId: employerId,
        body: body
    };
    return axios.post(
        URLS().addReviewAPI,
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'x-ezjobcompare-session-token': token
            }
        }
    );
};