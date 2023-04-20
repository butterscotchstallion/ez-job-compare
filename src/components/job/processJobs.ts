import formatMoney from "../../utils/formatMoney";
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
export default function processJobs(jobs: IJob[], tags: ITag[]): Promise<IJob[]> {
    return new Promise((resolve, reject) => {
        getTagsJobsList().then((tagsJobsMapResponse: any) => {
            const tagsJobsMap = getTagsJobsMap(tagsJobsMapResponse.data.results, tags);
            const jobsWithTags = jobs.map((j: IJob) => {
                j.tags = tagsJobsMap[j.id] || [];
                return j;
            });
            const jobsWithSalaryRangeFormatted = jobsWithTags.map((j: IJob) => {
                j.salaryRangeStart = formatMoney(Number(j.salaryRangeStart));
                j.salaryRangeEnd = formatMoney(Number(j.salaryRangeEnd));
                return j;
            });
            resolve(jobsWithSalaryRangeFormatted);
        }, reject);
    });
}