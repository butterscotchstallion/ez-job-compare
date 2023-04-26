import formatMoney from "../../utils/formatMoney";
import getReviewCountMap, { IReviewCountList } from "../reviews/getReviewCountMap";
import getTagsJobsList from "../tag/getTagsJobsList";
import getTagsJobsMap from "../tag/getTagsJobsMap";
import { ITag } from "../tag/i-tag.interface";
import { IJob } from "./i-job.interface";

/**
 * Adds tags to each job entry and formats salary range
 * @param jobs 
 * @param tags 
 * @returns Promise<IJob[]>
 */
export default function processJobs(jobs: IJob[], tags: ITag[], reviewCountList: IReviewCountList[]): Promise<IJob[]> {
    return new Promise((resolve, reject) => {
        getTagsJobsList().then((tagsJobsMapResponse: any) => {
            const tagsJobsMap = getTagsJobsMap(tagsJobsMapResponse.data.results, tags);
            const jobsWithTags = jobs.map((j: IJob) => {
                j.tags = tagsJobsMap[j.id] || [];
                return j;
            });
            const jobsWithSalaryRangeFormatted = jobsWithTags.map((j: IJob) => {
                j.salaryRangeStartFormatted = formatMoney(Number(j.salaryRangeStart));
                j.salaryRangeEndFormatted = formatMoney(Number(j.salaryRangeEnd));
                return j;
            });
            const jobsWithReviewCounts = jobsWithSalaryRangeFormatted.map((j: IJob) => {
                const reviewCountMap = getReviewCountMap(reviewCountList);
                j.reviewCount = reviewCountMap[j.employerId] || 0;
                return j;
            });
            resolve(jobsWithReviewCounts);
        }, reject);
    });
}