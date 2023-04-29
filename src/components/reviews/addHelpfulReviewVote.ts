import axios from "axios";
import URLS from "../../utils/urls";
import { IReview } from "./i-review.interface";

export default function addHelpfulReviewVote(review: IReview) {
    const data = {
        reviewId: review.id
    };
    return axios.post(
        URLS().helpfulReviewVotesAPI(review.employerSlug),
        data
    );
};