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
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                // These options are needed to round to whole numbers if that's what you want.
                minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
            });
            const jobsWithSalaryRangeFormatted = jobsWithTags.map((j: IJob) => {
                j.salaryRangeStart = formatter.format(Number(j.salaryRangeStart));
                j.salaryRangeEnd = formatter.format(Number(j.salaryRangeEnd));
                return j;
            });
            resolve(jobsWithSalaryRangeFormatted);
        }, reject);
    });
}