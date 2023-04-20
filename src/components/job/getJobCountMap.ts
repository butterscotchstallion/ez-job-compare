/**
 * Creates a map of employers to the number of
 * jobs they have listed.
 * @returns 
 */
import getJobCount from "./getJobCount";

interface IJobCountMap {
    [employerId: number]: number;
};
interface IJobMapListItem {
    employerName: string;
    employerId: number;
    jobCount: number;
}

export default function getJobCountMap(): Promise<IJobCountMap> {
    return new Promise((resolve, reject) => {
        getJobCount().then((response: any) => {
            const jobMap: IJobCountMap = {};
            const jobMapList = response.data.results;

            jobMapList.map((item: IJobMapListItem) => {
                return jobMap[item.employerId] = item.jobCount;
            });
            
            resolve(jobMap);
        }, reject);
    });
}