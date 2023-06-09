import getVerifiedEmployees from "../employer/getVerifiedEmployees";
import { IJob } from "../job/i-job.interface";
import { getTopKarmaUser } from "../user/getKarma";
import getUsers from "../user/getUsers";
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
        getHelpfulReviewVotes(job.employerSlug),
        getUsers(),
        getTopKarmaUser()
    ]);
};