import { ITag } from "./i-tag.interface";

interface ITagsEmpoyersMap {
    [employerId: number]: ITag[]
};
interface ITagIdTagsMap {
    [tagId: number]: ITag
};

export default function getTagsEmployersMap(employersTagsList: any, tags: ITag[]): ITagsEmpoyersMap {
    const tagsEmployersMap: ITagsEmpoyersMap = {};
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