import { ITag } from "./i-tag.interface";

interface ITagsJobsMap {
    [employerId: number]: ITag[]
};
interface ITagIdTagsMap {
    [tagId: number]: ITag
};

/**
 * Creates a map of tags that belong to jobs
 * 
 * @param jobsTagsList 
 * @param tags 
 * @returns ITagsJobsMap
 */
export default function getTagsJobsMap(jobsTagsList: any, tags: ITag[]): ITagsJobsMap {
    const tagsJobsMap: ITagsJobsMap = {};
    const tagIdTagsMap: ITagIdTagsMap = {};

    tags.map((t: ITag) => {
        tagIdTagsMap[t.id] = t;
        return t;
    });

    jobsTagsList.map((jt: any) => {
        if (typeof tagsJobsMap[jt.jobId] === 'undefined') {
            tagsJobsMap[jt.jobId] = [];
        }
        tagsJobsMap[jt.jobId].push(tagIdTagsMap[jt.tagId]);
        return jt;
    });

    return tagsJobsMap;
}