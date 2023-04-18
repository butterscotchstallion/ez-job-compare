import { ITag } from "./i-tag.interface";

interface ITagsEmployersMap {
    [employerId: number]: ITag[]
};
interface ITagIdTagsMap {
    [tagId: number]: ITag
};

/**
 * Creates a map of tags that belong to employers
 * 
 * @param employersTagsList 
 * @param tags 
 * @returns ITagsEmployersMap
 */
export default function getTagsEmployersMap(employersTagsList: any, tags: ITag[]): ITagsEmployersMap {
    const tagsEmployersMap: ITagsEmployersMap = {};
    const tagIdTagsMap: ITagIdTagsMap = {};

    tags.map((t: ITag) => {
        tagIdTagsMap[t.id] = t;
        return t;
    });

    employersTagsList.map((et: any) => {
        if (typeof tagsEmployersMap[et.employerId] === 'undefined') {
            tagsEmployersMap[et.employerId] = [];
        }
        tagsEmployersMap[et.employerId].push(tagIdTagsMap[et.tagId]);
        return et;
    });

    return tagsEmployersMap;
}