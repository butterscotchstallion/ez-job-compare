import axios from "axios";
import URLS from "../../utils/urls";
import { getToken } from "../user/token";
import { IReview } from "./i-review.interface";

export default function addHelpfulReviewVote(review: IReview) {
    const token = getToken();
    const data = {
        reviewId: review.id
    };
    return axios.post(
        URLS().helpfulReviewVotesAPI(review.employerSlug),
        data, 
        {
            headers: {
                'Content-Type': 'application/json',
                'x-ezjobcompare-session-token': token
            }
        }
    );
};