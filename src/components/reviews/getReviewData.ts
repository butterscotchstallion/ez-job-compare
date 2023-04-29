import getVerifiedEmployees from "../employer/getVerifiedEmployees";
import { IJob } from "../job/i-job.interface";
import getHelpfulReviewVotes from "./getHelpfulReviewVotes";
import getReviewsByEmployerSlug from "./getReviewsByEmployerSlug";

/**
 * Retrieves all the necessary data
 * for reviews!
 */
export default function getReviewData(job: IJob) {
    return Promise.all([
        getReviewsByEmployerSlug(job.employerSlug),
        getVerifiedEmployees(job.employerSlug),
        getHelpfulReviewVotes(job.employerSlug)
    ]);
};